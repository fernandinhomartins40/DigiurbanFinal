'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Camera,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  Download,
  Filter,
  Search,
  Calendar,
  Users,
  Wrench,
  FileImage,
  Navigation,
  Archive
} from 'lucide-react'
import { useAdminAuth } from '@/hooks/useAdminAuth'

interface ProblemaFoto {
  id: string
  protocolo: string
  categoria: string
  subcategoria: string
  descricao: string
  endereco: string
  bairro: string
  coordenadas: { lat: number; lng: number }
  fotos: string[]
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente'
  status: 'aberto' | 'em_analise' | 'em_execucao' | 'concluido' | 'cancelado'
  cidadao: {
    nome: string
    telefone: string
    email: string
  }
  equipe_responsavel?: string
  data_abertura: string
  data_previsao?: string
  data_conclusao?: string
  observacoes_internas: string[]
  historico_status: Array<{
    status: string
    data: string
    responsavel: string
    observacao: string
  }>
}

export default function ProblemasComFoto() {
  const { user, hasPermission } = useAdminAuth()
  const [problemas, setProblemas] = useState<ProblemaFoto[]>([
    {
      id: '1',
      protocolo: 'SF2024001',
      categoria: 'Infraestrutura',
      subcategoria: 'Buraco na Rua',
      descricao: 'Buraco grande na Rua das Flores esquina com Av. Central causando transtornos ao trânsito',
      endereco: 'Rua das Flores, 123',
      bairro: 'Centro',
      coordenadas: { lat: -15.7942, lng: -47.8822 },
      fotos: ['foto1.jpg', 'foto2.jpg'],
      prioridade: 'alta',
      status: 'em_execucao',
      cidadao: {
        nome: 'João Silva',
        telefone: '(61) 99999-9999',
        email: 'joao@email.com'
      },
      equipe_responsavel: 'Equipe Asfalto A',
      data_abertura: '2024-01-15',
      data_previsao: '2024-01-22',
      observacoes_internas: ['Verificado in loco', 'Material solicitado'],
      historico_status: [
        { status: 'aberto', data: '2024-01-15', responsavel: 'Sistema', observacao: 'Protocolo criado automaticamente' },
        { status: 'em_analise', data: '2024-01-16', responsavel: 'Maria Santos', observacao: 'Encaminhado para vistoria' },
        { status: 'em_execucao', data: '2024-01-18', responsavel: 'João Menezes', observacao: 'Equipe designada e material separado' }
      ]
    },
    {
      id: '2',
      protocolo: 'SF2024002',
      categoria: 'Iluminação',
      subcategoria: 'Poste Quebrado',
      descricao: 'Poste de iluminação danificado após vendaval, deixando quarteirão no escuro',
      endereco: 'Av. Principal, 456',
      bairro: 'Vila Nova',
      coordenadas: { lat: -15.8042, lng: -47.8922 },
      fotos: ['foto3.jpg'],
      prioridade: 'urgente',
      status: 'aberto',
      cidadao: {
        nome: 'Ana Costa',
        telefone: '(61) 88888-8888',
        email: 'ana@email.com'
      },
      data_abertura: '2024-01-20',
      observacoes_internas: [],
      historico_status: [
        { status: 'aberto', data: '2024-01-20', responsavel: 'Sistema', observacao: 'Protocolo criado automaticamente' }
      ]
    }
  ])

  const [filtros, setFiltros] = useState({
    categoria: '',
    status: '',
    prioridade: '',
    bairro: '',
    equipe: ''
  })

  const [busca, setBusca] = useState('')
  const [problema, setProblema] = useState<ProblemaFoto | null>(null)
  const [modoEdicao, setModoEdicao] = useState(false)

  const categorias = [
    'Infraestrutura',
    'Iluminação',
    'Limpeza',
    'Sinalização',
    'Áreas Verdes',
    'Drenagem',
    'Calçadas',
    'Outros'
  ]

  const subcategorias = {
    'Infraestrutura': ['Buraco na Rua', 'Asfalto Danificado', 'Meio-Fio Quebrado', 'Rachadura'],
    'Iluminação': ['Poste Quebrado', 'Lâmpada Queimada', 'Fiação Exposta', 'Falta de Iluminação'],
    'Limpeza': ['Lixo Acumulado', 'Entulho', 'Terreno Baldio Sujo', 'Esgoto Aberto'],
    'Sinalização': ['Placa Danificada', 'Falta Sinalização', 'Semáforo Quebrado', 'Faixa Apagada'],
    'Áreas Verdes': ['Árvore Caída', 'Poda Necessária', 'Praça Abandonada', 'Jardim Danificado'],
    'Drenagem': ['Bueiro Entupido', 'Alagamento', 'Vazamento', 'Erosão'],
    'Calçadas': ['Buraco', 'Desnível', 'Piso Solto', 'Obstáculo'],
    'Outros': ['Vandalismo', 'Problema Estrutural', 'Acessibilidade', 'Diversos']
  }

  const equipes = [
    'Equipe Asfalto A',
    'Equipe Asfalto B',
    'Equipe Elétrica',
    'Equipe Limpeza',
    'Equipe Sinalização',
    'Equipe Jardinagem',
    'Equipe Emergência'
  ]

  const bairros = ['Centro', 'Vila Nova', 'Jardins', 'Industrial', 'Residencial']

  const getStatusColor = (status: string) => {
    const colors = {
      aberto: 'bg-red-100 text-red-800',
      em_analise: 'bg-yellow-100 text-yellow-800',
      em_execucao: 'bg-blue-100 text-blue-800',
      concluido: 'bg-green-100 text-green-800',
      cancelado: 'bg-gray-100 text-gray-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getPrioridadeColor = (prioridade: string) => {
    const colors = {
      baixa: 'bg-green-100 text-green-800',
      media: 'bg-yellow-100 text-yellow-800',
      alta: 'bg-orange-100 text-orange-800',
      urgente: 'bg-red-100 text-red-800'
    }
    return colors[prioridade as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const problemasFiltrados = problemas.filter(p => {
    const matchBusca = p.protocolo.toLowerCase().includes(busca.toLowerCase()) ||
                      p.descricao.toLowerCase().includes(busca.toLowerCase()) ||
                      p.endereco.toLowerCase().includes(busca.toLowerCase()) ||
                      p.cidadao.nome.toLowerCase().includes(busca.toLowerCase())

    const matchCategoria = !filtros.categoria || p.categoria === filtros.categoria
    const matchStatus = !filtros.status || p.status === filtros.status
    const matchPrioridade = !filtros.prioridade || p.prioridade === filtros.prioridade
    const matchBairro = !filtros.bairro || p.bairro === filtros.bairro
    const matchEquipe = !filtros.equipe || p.equipe_responsavel === filtros.equipe

    return matchBusca && matchCategoria && matchStatus && matchPrioridade && matchBairro && matchEquipe
  })

  const stats = {
    total: problemas.length,
    abertos: problemas.filter(p => p.status === 'aberto').length,
    em_execucao: problemas.filter(p => p.status === 'em_execucao').length,
    concluidos: problemas.filter(p => p.status === 'concluido').length,
    urgentes: problemas.filter(p => p.prioridade === 'urgente').length
  }

  const salvarProblema = () => {
    if (problema) {
      if (problema.id) {
        setProblemas(problemas.map(p => p.id === problema.id ? problema : p))
      } else {
        const novoProblema = {
          ...problema,
          id: Date.now().toString(),
          protocolo: `SF${new Date().getFullYear()}${String(problemas.length + 1).padStart(3, '0')}`,
          data_abertura: new Date().toISOString().split('T')[0],
          historico_status: [{
            status: problema.status,
            data: new Date().toISOString().split('T')[0],
            responsavel: user?.nome || 'Sistema',
            observacao: 'Protocolo criado'
          }]
        }
        setProblemas([...problemas, novoProblema])
      }
      setProblema(null)
      setModoEdicao(false)
    }
  }

  const adicionarObservacao = (id: string, observacao: string) => {
    setProblemas(problemas.map(p =>
      p.id === id
        ? { ...p, observacoes_internas: [...p.observacoes_internas, observacao] }
        : p
    ))
  }

  const atualizarStatus = (id: string, novoStatus: string, observacao: string) => {
    setProblemas(problemas.map(p =>
      p.id === id
        ? {
            ...p,
            status: novoStatus as any,
            historico_status: [...p.historico_status, {
              status: novoStatus,
              data: new Date().toISOString().split('T')[0],
              responsavel: user?.nome || 'Sistema',
              observacao
            }],
            ...(novoStatus === 'concluido' && { data_conclusao: new Date().toISOString().split('T')[0] })
          }
        : p
    ))
  }

  const gerarServicosAutomaticos = () => {
    return [
      {
        nome: "Relatório de Problema Urbano com Foto",
        descricao: "Reporte problemas de infraestrutura urbana anexando fotos para análise técnica",
        categoria: "Serviços Urbanos",
        prazo: "5 dias úteis",
        documentos: ["Foto do problema", "Localização exata"],
        digital: true,
        gratuito: true
      },
      {
        nome: "Acompanhamento de Protocolo Urbano",
        descricao: "Consulte o andamento do seu protocolo de problema urbano em tempo real",
        categoria: "Consultas",
        prazo: "Imediato",
        documentos: ["Número do protocolo"],
        digital: true,
        gratuito: true
      },
      {
        nome: "Solicitação de Vistoria Técnica",
        descricao: "Solicite vistoria técnica especializada para problemas de infraestrutura",
        categoria: "Vistorias",
        prazo: "3 dias úteis",
        documentos: ["Fotos", "Descrição detalhada", "Endereço"],
        digital: true,
        gratuito: true
      }
    ]
  }

  if (!['admin', 'secretario', 'coordenador', 'tecnico'].some(permission => hasPermission(permission))) {
    return <div className="p-6">Acesso negado. Você não tem permissão para acessar esta página.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Problemas com Foto</h1>
          <p className="text-muted-foreground mt-2">
            Sistema de gestão de problemas urbanos reportados pelos cidadãos com evidências fotográficas
          </p>
        </div>
        <Button onClick={() => {
          setProblema({
            id: '',
            protocolo: '',
            categoria: '',
            subcategoria: '',
            descricao: '',
            endereco: '',
            bairro: '',
            coordenadas: { lat: 0, lng: 0 },
            fotos: [],
            prioridade: 'media',
            status: 'aberto',
            cidadao: { nome: '', telefone: '', email: '' },
            data_abertura: '',
            observacoes_internas: [],
            historico_status: []
          })
          setModoEdicao(true)
        }}>
          <Camera className="h-4 w-4 mr-2" />
          Novo Protocolo
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Protocolos</CardTitle>
            <FileImage className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Todos os registros</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abertos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.abertos}</div>
            <p className="text-xs text-muted-foreground">Aguardando análise</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Execução</CardTitle>
            <Wrench className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.em_execucao}</div>
            <p className="text-xs text-muted-foreground">Sendo resolvidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.concluidos}</div>
            <p className="text-xs text-muted-foreground">Problemas resolvidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.urgentes}</div>
            <p className="text-xs text-muted-foreground">Alta prioridade</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros e Busca
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por protocolo, descrição, endereço ou cidadão..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full"
              />
            </div>
            <Button variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Select value={filtros.categoria} onValueChange={(value) => setFiltros({...filtros, categoria: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {categorias.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filtros.status} onValueChange={(value) => setFiltros({...filtros, status: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="aberto">Aberto</SelectItem>
                <SelectItem value="em_analise">Em Análise</SelectItem>
                <SelectItem value="em_execucao">Em Execução</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtros.prioridade} onValueChange={(value) => setFiltros({...filtros, prioridade: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="urgente">Urgente</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtros.bairro} onValueChange={(value) => setFiltros({...filtros, bairro: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Bairro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                {bairros.map(bairro => (
                  <SelectItem key={bairro} value={bairro}>{bairro}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filtros.equipe} onValueChange={(value) => setFiltros({...filtros, equipe: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Equipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {equipes.map(equipe => (
                  <SelectItem key={equipe} value={equipe}>{equipe}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileImage className="h-5 w-5" />
              Protocolos de Problemas ({problemasFiltrados.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {problemasFiltrados.map((p) => (
                <div key={p.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{p.protocolo}</h4>
                      <p className="text-sm text-muted-foreground">{p.categoria} - {p.subcategoria}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(p.status)}>
                        {p.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={getPrioridadeColor(p.prioridade)}>
                        {p.prioridade}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm mb-2">{p.descricao}</p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {p.endereco}, {p.bairro}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {p.data_abertura}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Camera className="h-3 w-3" />
                    {p.fotos.length} foto(s)
                    <Users className="h-3 w-3 ml-2" />
                    {p.cidadao.nome}
                  </div>

                  {p.equipe_responsavel && (
                    <p className="text-sm text-blue-600">Equipe: {p.equipe_responsavel}</p>
                  )}

                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setProblema(p)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Ver
                    </Button>
                    {['admin', 'secretario', 'coordenador'].some(permission => hasPermission(permission)) && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setProblema(p)
                          setModoEdicao(true)
                        }}
                      >
                        Editar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Serviços Gerados Automaticamente
            </CardTitle>
            <CardDescription>
              Serviços criados automaticamente para o catálogo público
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {gerarServicosAutomaticos().map((servico, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <h4 className="font-semibold text-sm">{servico.nome}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{servico.descricao}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    <Badge variant="outline">{servico.categoria}</Badge>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {servico.prazo}
                    </span>
                    {servico.digital && <Badge className="bg-green-100 text-green-800">Digital</Badge>}
                    {servico.gratuito && <Badge className="bg-blue-100 text-blue-800">Gratuito</Badge>}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Integração Bidirecional</span>
                <Badge className="bg-purple-100 text-purple-800">
                  <Archive className="h-3 w-3 mr-1" />
                  Auto-Sync
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Novos tipos de problemas geram automaticamente novos serviços no catálogo público
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {problema && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {modoEdicao ? 'Editar Protocolo' : 'Detalhes do Protocolo'}
              {problema.protocolo && ` - ${problema.protocolo}`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {modoEdicao ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Categoria</label>
                  <Select value={problema.categoria} onValueChange={(value) => setProblema({...problema, categoria: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Subcategoria</label>
                  <Select value={problema.subcategoria} onValueChange={(value) => setProblema({...problema, subcategoria: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {problema.categoria && subcategorias[problema.categoria as keyof typeof subcategorias]?.map(sub => (
                        <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Descrição</label>
                  <Input
                    value={problema.descricao}
                    onChange={(e) => setProblema({...problema, descricao: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Endereço</label>
                  <Input
                    value={problema.endereco}
                    onChange={(e) => setProblema({...problema, endereco: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Bairro</label>
                  <Select value={problema.bairro} onValueChange={(value) => setProblema({...problema, bairro: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {bairros.map(bairro => (
                        <SelectItem key={bairro} value={bairro}>{bairro}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Prioridade</label>
                  <Select value={problema.prioridade} onValueChange={(value) => setProblema({...problema, prioridade: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select value={problema.status} onValueChange={(value) => setProblema({...problema, status: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aberto">Aberto</SelectItem>
                      <SelectItem value="em_analise">Em Análise</SelectItem>
                      <SelectItem value="em_execucao">Em Execução</SelectItem>
                      <SelectItem value="concluido">Concluído</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Equipe Responsável</label>
                  <Select value={problema.equipe_responsavel || ''} onValueChange={(value) => setProblema({...problema, equipe_responsavel: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar equipe" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipes.map(equipe => (
                        <SelectItem key={equipe} value={equipe}>{equipe}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2 flex gap-2">
                  <Button onClick={salvarProblema}>Salvar</Button>
                  <Button variant="outline" onClick={() => {
                    setProblema(null)
                    setModoEdicao(false)
                  }}>
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-2">Informações do Problema</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Categoria:</strong> {problema.categoria} - {problema.subcategoria}</p>
                      <p><strong>Descrição:</strong> {problema.descricao}</p>
                      <p><strong>Endereço:</strong> {problema.endereco}, {problema.bairro}</p>
                      <p><strong>Prioridade:</strong> <Badge className={getPrioridadeColor(problema.prioridade)}>{problema.prioridade}</Badge></p>
                      <p><strong>Status:</strong> <Badge className={getStatusColor(problema.status)}>{problema.status.replace('_', ' ')}</Badge></p>
                      {problema.equipe_responsavel && <p><strong>Equipe:</strong> {problema.equipe_responsavel}</p>}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Informações do Cidadão</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Nome:</strong> {problema.cidadao.nome}</p>
                      <p><strong>Telefone:</strong> {problema.cidadao.telefone}</p>
                      <p><strong>Email:</strong> {problema.cidadao.email}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Histórico de Status</h4>
                  <div className="space-y-2">
                    {problema.historico_status.map((hist, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(hist.status)}>{hist.status.replace('_', ' ')}</Badge>
                          <span className="text-sm text-muted-foreground">{hist.data}</span>
                          <span className="text-sm font-medium">{hist.responsavel}</span>
                        </div>
                        <p className="text-sm mt-1">{hist.observacao}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {problema.observacoes_internas.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Observações Internas</h4>
                    <div className="space-y-1">
                      {problema.observacoes_internas.map((obs, index) => (
                        <p key={index} className="text-sm border-l-2 border-gray-200 pl-2">{obs}</p>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  {['admin', 'secretario', 'coordenador'].some(permission => hasPermission(permission)) && (
                    <Button onClick={() => setModoEdicao(true)}>
                      Editar
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setProblema(null)}>
                    Fechar
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Relatório
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}