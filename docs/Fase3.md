# FASE 3 - Portal do Cidadão

## Objetivo
Implementar portal público para cidadãos com catálogo de serviços, sistema de protocolos e composição familiar.

## Estrutura do Portal
### Rotas Principais
- `/cidadao/` - Dashboard do cidadão
- `/cidadao/servicos/` - Catálogo de serviços
- `/cidadao/protocolos/` - Meus protocolos
- `/cidadao/familia/` - Composição familiar
- `/cidadao/perfil/` - Dados pessoais
- `/cidadao/auth/` - Login/Cadastro

### Identificação de Tenant
- **Subdomain**: contagem.digiurban.com → tenant "contagem"
- **Context Provider**: TenantContext global
- **Branding**: Logo, cores e nome da prefeitura por tenant

## Dashboard do Cidadão
### Componentes Principais
- **Protocolos Ativos**: Cards com status em tempo real
- **Serviços Recentes**: Últimos utilizados
- **Atalhos Rápidos**: Serviços mais procurados
- **Notificações**: Alertas de mudança de estado
- **Resumo Familiar**: Membros e protocolos familiares

## Catálogo de Serviços
### Geração Automática por Secretaria
Conforme modelo de negócios - cada página especializada gera serviços:

**Saúde** (10 serviços):
- Agendamento de Consulta
- Solicitação de Medicamento
- Encaminhamento TFD
- Transporte de Paciente

**Educação** (8 serviços):
- Nova Matrícula
- Transferência Escolar
- Transporte Escolar
- Merenda Especial

**Assistência Social** (8 serviços):
- Cesta Básica Emergencial
- Auxílio Vulnerabilidade
- Visita Domiciliar

**Demais**: Cultura, Segurança, Planejamento, etc.

### Estrutura de Serviço
- Nome claro e direto
- Descrição detalhada
- Documentos obrigatórios
- Prazo médio de conclusão
- Secretaria responsável
- Requisitos para solicitar

## Sistema de Protocolos (Core)
### Estados do Protocolo
1. **VINCULADO** - Criado e direcionado ao setor
2. **PROGRESSO** - Em análise/processamento
3. **ATUALIZAÇÃO** - Necessita ação do cidadão
4. **CONCLUÍDO** - Finalizado com sucesso
5. **PENDÊNCIA** - Aguardando documentos

### Funcionalidades
- **Criação**: A partir de serviço selecionado
- **Upload**: Documentos obrigatórios/opcionais
- **Timeline**: Histórico completo com timestamps
- **Chat**: Comunicação com setor responsável
- **Notificações**: Email/SMS/Push automáticas
- **Avaliação**: Feedback pós-conclusão

## Composição Familiar
### Estrutura Familiar
- **Responsável**: Cidadão principal (criador da conta)
- **Cônjuge**: Dados do parceiro(a)
- **Filhos**: Dependentes menores
- **Dependentes**: Outros familiares
- **Vínculos**: Relacionamentos automatizados

### Funcionalidades Transversais
- **Protocolos Familiares**: Solicitar para qualquer membro
- **Histórico Consolidado**: Todos atendimentos da família
- **Programas Automáticos**: Qualificação para benefícios
- **Notificações Centralizadas**: Responsável recebe tudo

## Models Database
### Citizen
```prisma
model Citizen {
  id        String    @id @default(cuid())
  tenantId  String
  cpf       String
  name      String
  email     String
  phone     String?
  address   Json?
  isActive  Boolean   @default(true)
  
  protocols Protocol[]
  familyMain FamilyComposition[] @relation("FamilyHead")
  familyMember FamilyComposition[] @relation("FamilyMember")
  
  @@unique([tenantId, cpf])
}
```

### FamilyComposition
```prisma
model FamilyComposition {
  id           String  @id @default(cuid())
  tenantId     String
  headId       String  // Responsável
  memberId     String  // Membro
  relationship String  // cônjuge, filho, pai
  isDependent  Boolean @default(false)
  
  @@unique([tenantId, headId, memberId])
}
```

### Protocol (Core)
```prisma
model Protocol {
  id           String         @id @default(cuid())
  tenantId     String
  citizenId    String
  serviceId    String
  departmentId String
  number       String         // Número protocolo
  status       ProtocolStatus @default(VINCULADO)
  documents    Json?          // Docs anexados
  assignedTo   String?        // Funcionário responsável
  createdAt    DateTime       @default(now())
  concludedAt  DateTime?
  
  history      ProtocolHistory[]
  evaluations  ProtocolEvaluation[]
  
  @@unique([tenantId, number])
}
```

## APIs Backend
### Autenticação Cidadão
- **POST /api/auth/citizen/login** - Login CPF/email
- **POST /api/auth/citizen/register** - Cadastro inicial
- **GET /api/auth/citizen/me** - Dados do logado

### Serviços
- **GET /api/services** - Serviços ativos do tenant
- **GET /api/services/categories** - Categorias
- **GET /api/services/:id** - Detalhes serviço

### Protocolos
- **GET /api/protocols** - Meus protocolos
- **POST /api/protocols** - Criar protocolo
- **GET /api/protocols/:id** - Detalhes
- **POST /api/protocols/:id/documents** - Upload docs
- **POST /api/protocols/:id/comments** - Chat

### Família
- **GET /api/family** - Composição familiar
- **POST /api/family/members** - Adicionar membro
- **GET /api/family/protocols** - Protocolos familiares

## Componentes Frontend
### Layout
- **CitizenLayout** - Layout base responsivo
- **TenantHeader** - Header com branding da prefeitura
- **Navigation** - Menu lateral colapsível

### Serviços
- **ServiceCard** - Card com info principais
- **ServiceGrid** - Grid responsivo
- **CategoryFilter** - Filtro por categoria
- **SearchService** - Busca inteligente

### Protocolos
- **ProtocolCard** - Resumo do protocolo
- **ProtocolTimeline** - Timeline de estados
- **DocumentUpload** - Upload com validação
- **ProtocolChat** - Chat com setor

### Família
- **FamilyTree** - Visualização da composição
- **AddMemberForm** - Formulário adicionar
- **FamilyProtocols** - Protocolos consolidados

## Sistema de Notificações
### Tipos
- **Email** - Confirmações e mudanças importantes
- **Push** - Notificações web em tempo real
- **In-app** - Dentro da aplicação

### Triggers
- Protocolo criado/alterado
- Documento solicitado
- Protocolo concluído
- Lembretes de prazo

## Upload de Documentos
### Configuração
- **Tipos**: PDF, JPG, PNG (máx 5MB)
- **Validação**: Tamanho, tipo, malware scan
- **Storage**: `/uploads/tenants/[id]/protocols/[id]/`
- **CDN**: nginx com cache

## Segurança
### Autenticação
- **JWT**: Expiração 24h com refresh
- **Rate Limiting**: Proteção ataques
- **CAPTCHA**: Formulários críticos

### Autorização
- **Tenant Isolation**: Dados isolados por prefeitura
- **Personal Data**: Apenas próprios dados
- **Family Access**: Responsável acessa familiares

## Critérios de Sucesso
1. Portal responsivo funcionando
2. Catálogo serviços dinâmico
3. Sistema protocolos operacional
4. Composição familiar integrada
5. Upload documentos seguro
6. Notificações automáticas
7. Multi-tenancy por subdomínio
8. Isolamento dados por tenant