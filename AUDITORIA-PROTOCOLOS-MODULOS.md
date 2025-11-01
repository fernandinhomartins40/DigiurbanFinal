# 🔍 AUDITORIA COMPLETA: SISTEMA DE PROTOCOLOS E MÓDULOS

**Data:** 31/10/2025
**Sistema:** DigiUrban - Plataforma de Gestão Municipal
**Escopo:** Análise completa do sistema de protocolos, módulos e gestão de serviços

---

## 📋 SUMÁRIO EXECUTIVO

### Situação Atual
O sistema atual possui uma estrutura básica de protocolos (ProtocolSimplified) integrada com módulos específicos de cada secretaria, mas **carece de funcionalidades críticas** para gestão completa do ciclo de vida de solicitações cidadãs.

### Problemas Identificados
1. **Falta de sistema de interações/comentários** entre servidor e cidadão
2. **Ausência de gestão de pendências** (documentos faltantes, informações adicionais)
3. **Solicitação de documentos não implementada**
4. **Sistema de notificações básico** (sem rastreamento de leitura no protocolo)
5. **Workflow genérico** que não atende especificidades de cada módulo
6. **Ausência de SLA e prazos automáticos**
7. **Histórico limitado** (apenas mudanças de status, sem contexto rico)
8. **Interface admin básica** (apenas: ver, atribuir, mudar status)

---

## 🏗️ ARQUITETURA ATUAL

### Modelo de Dados

#### ProtocolSimplified (Núcleo)
```prisma
model ProtocolSimplified {
  id          String         @id @default(cuid())
  number      String         @unique          // #2025-000001
  title       String                          // Título do serviço
  description String?                         // Descrição inicial
  status      ProtocolStatus @default(VINCULADO)
  priority    Int            @default(3)

  // Relacionamentos
  citizenId    String
  serviceId    String
  departmentId String
  tenantId     String

  // Dados capturados
  customData Json?              // Formulário do serviço
  moduleType String?            // Ex: CADASTRO_PRODUTOR

  // Geolocalização
  latitude  Float?
  longitude Float?
  address   String?

  // Documentos (LIMITADO)
  documents   Json?              // ⚠️ Apenas metadados
  attachments String?            // ⚠️ Sem gestão

  // Gestão
  assignedUserId String?
  createdById    String?

  // Timestamps
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  dueDate     DateTime?           // ⚠️ Manual, sem automação
  concludedAt DateTime?

  // Histórico (LIMITADO)
  history     ProtocolHistorySimplified[]     // ⚠️ Apenas status
  evaluations ProtocolEvaluationSimplified[]
}
```

#### ProtocolHistorySimplified (Histórico Atual)
```prisma
model ProtocolHistorySimplified {
  id         String   @id
  action     String              // ⚠️ Texto livre, sem enum
  comment    String?             // ⚠️ Opcional
  oldStatus  String?
  newStatus  String?
  metadata   Json?               // ⚠️ Sem estrutura definida
  timestamp  DateTime
  userId     String?
}
```

#### Status Disponíveis
```prisma
enum ProtocolStatus {
  VINCULADO     // Protocolo vinculado a entidade do módulo
  PROGRESSO     // Em andamento
  ATUALIZACAO   // Aguardando atualização
  CONCLUIDO     // Finalizado
  PENDENCIA     // Com pendência
  CANCELADO     // Cancelado
}
```

### Fluxo Atual

```
CIDADÃO                    BACKEND                    MÓDULO
   |                          |                          |
   |--Solicita Serviço------->|                          |
   |                          |                          |
   |                          |--Cria Protocolo--------->|
   |                          |                          |
   |                          |--Cria Entidade Módulo--->|
   |                          |                          |
   |                          |<-Status: VINCULADO-------|
   |                          |                          |
   |<--Protocolo #2025-000001-|                          |
   |                          |                          |
   |                          |                          |
   [LACUNA: SEM INTERAÇÕES]   |                          |
   [LACUNA: SEM DOCUMENTOS]   |                          |
   [LACUNA: SEM PENDÊNCIAS]   |                          |
   |                          |                          |
```

---

## ❌ FUNCIONALIDADES FALTANTES

### 1. Sistema de Interações (CRÍTICO)
**Ausente:** Comunicação bidirecional entre servidor e cidadão

**O que falta:**
- Comentários no protocolo
- Perguntas do servidor ao cidadão
- Respostas do cidadão
- Thread de conversação
- Marcação de mensagens como lidas/não lidas
- Notificações em tempo real

**Impacto:** Servidores não conseguem solicitar informações adicionais sem contato externo (telefone, WhatsApp)

### 2. Gestão de Documentos (CRÍTICO)
**Atual:** Campo `documents` em JSON sem estrutura

**O que falta:**
- Lista de documentos requeridos por serviço
- Status de cada documento (pendente, enviado, aprovado, rejeitado)
- Upload de múltiplos arquivos
- Versionamento de documentos
- Validação de documentos pelo servidor
- Solicitação de correções
- Histórico de submissões

**Impacto:** Impossível gerenciar documentação de forma estruturada

### 3. Sistema de Pendências (CRÍTICO)
**Ausente:** Gestão formal de pendências

**O que falta:**
- Criação de pendências pelo servidor
- Tipos de pendência (documento, informação, correção, validação)
- Prazo para resolução de pendência
- Status da pendência (aberta, resolvida, expirada)
- Notificação automática ao cidadão
- Bloqueio de progresso até resolução

**Impacto:** Protocolos ficam "travados" sem clareza do motivo

### 4. Workflow Específico por Módulo (IMPORTANTE)
**Atual:** Workflow genérico para todos os serviços

**O que falta:**
- Etapas específicas por tipo de módulo
- Regras de transição de status por módulo
- Ações obrigatórias em cada etapa
- Validações específicas
- Aprovações em múltiplas camadas

**Exemplo:**
```
CADASTRO_PRODUTOR:
  1. Solicitado → Análise Documental
  2. Análise Documental → Vistoria de Propriedade
  3. Vistoria → Análise Técnica
  4. Análise Técnica → Aprovação Final
  5. Aprovação Final → Ativo

LICENCA_AMBIENTAL:
  1. Solicitado → Análise Preliminar
  2. Análise Preliminar → Estudo de Impacto
  3. Estudo de Impacto → Audiência Pública
  4. Audiência Pública → Parecer Técnico
  5. Parecer Técnico → Decisão Final
```

### 5. SLA e Prazos Automáticos (IMPORTANTE)
**Atual:** Campo `dueDate` manual, sem automação

**O que falta:**
- SLA por tipo de serviço
- Cálculo automático de prazos
- Contagem de dias úteis
- Pausas de prazo (aguardando cidadão)
- Alertas de prazo próximo
- Relatórios de cumprimento de SLA
- Escalações automáticas

**Impacto:** Sem controle de tempo de atendimento

### 6. Histórico Rico (IMPORTANTE)
**Atual:** Apenas mudanças de status

**O que falta:**
- Registro de todas as ações
- Contexto de cada ação (quem, quando, por quê)
- Anexos relacionados à ação
- Campos alterados (diff)
- IP e dispositivo
- Tempo gasto em cada etapa
- Auditoria completa

### 7. Interface de Gerenciamento (IMPORTANTE)
**Atual:** Visualização básica + atribuir + mudar status

**O que falta:**
- **Timeline visual** do protocolo
- **Aba de interações** (mensagens)
- **Aba de documentos** (upload, download, validação)
- **Aba de pendências** (criar, resolver)
- **Aba de histórico** (auditoria completa)
- **Painel de decisão** (aprovar/rejeitar com justificativa)
- **Formulário de vistoria/inspeção**
- **Upload de laudos técnicos**
- **Assinatura digital**
- **Impressão de relatórios**

### 8. Notificações Inteligentes (MÉDIO)
**Atual:** Sistema básico de notificações

**O que falta:**
- Notificação por email com link direto
- Notificação por SMS
- Notificação push (PWA)
- Agrupamento de notificações
- Preferências de notificação por cidadão
- Resumo diário/semanal
- Notificações de prazo

### 9. Relatórios e Analytics (MÉDIO)
**Falta:**
- Tempo médio de atendimento por serviço
- Taxa de aprovação/rejeição
- Gargalos no processo
- Servidores mais produtivos
- Serviços mais solicitados
- Mapa de calor de solicitações
- Satisfação por departamento

---

## 🎯 REQUISITOS POR TIPO DE MÓDULO

### Módulos de CADASTRO (Ex: Produtor Rural)
**Workflow:**
1. Solicitado → Análise Documental
2. Análise Documental → Vistoria (se necessário)
3. Vistoria → Aprovação/Rejeição
4. Aprovação → Ativo no Sistema

**Documentos típicos:**
- RG/CPF
- Comprovante de residência
- Comprovante de propriedade/posse
- Declaração específica

**Interações típicas:**
- Solicitação de documentos faltantes
- Agendamento de vistoria
- Informação de aprovação
- Orientações de uso do sistema

### Módulos de LICENCIAMENTO (Ex: Licença Ambiental)
**Workflow:**
1. Solicitado → Análise de Viabilidade
2. Análise → Solicitação de Estudos
3. Estudos → Análise Técnica
4. Análise → Parecer Jurídico
5. Parecer → Audiência Pública (se necessário)
6. Decisão Final → Emissão ou Negação

**Documentos típicos:**
- Projeto técnico
- Estudos de impacto
- ART/RRT
- Laudos técnicos

**Interações típicas:**
- Solicitação de esclarecimentos técnicos
- Agendamento de vistoria
- Notificação de irregularidades
- Solicitação de correções

### Módulos de ATENDIMENTO (Ex: Saúde)
**Workflow:**
1. Solicitado → Triagem
2. Triagem → Agendamento
3. Agendamento → Atendimento
4. Atendimento → Encaminhamento/Conclusão

**Documentos típicos:**
- Cartão SUS
- Encaminhamentos médicos
- Exames anteriores

**Interações típicas:**
- Confirmação de agendamento
- Lembretes de consulta
- Orientações pós-atendimento

### Módulos de RECLAMAÇÃO (Ex: Obras Públicas)
**Workflow:**
1. Recebido → Análise de Competência
2. Análise → Vistoria Local
3. Vistoria → Planejamento de Intervenção
4. Planejamento → Execução
5. Execução → Verificação
6. Verificação → Conclusão

**Documentos típicos:**
- Fotos do problema
- Vídeos
- Localização precisa

**Interações típicas:**
- Atualização de status
- Previsão de atendimento
- Notificação de conclusão
- Solicitação de avaliação

---

## 🚀 PROPOSTA DE SOLUÇÃO

### FASE 1: FUNDAÇÃO (4-6 semanas)

#### 1.1 Novo Modelo de Dados

```prisma
// ========================================
// INTERAÇÕES
// ========================================
model ProtocolInteraction {
  id         String   @id @default(cuid())
  protocolId String
  type       InteractionType  // MESSAGE, DOCUMENT_REQUEST, PENDING_CREATED, etc

  // Autor
  authorType String            // CITIZEN, SERVER, SYSTEM
  authorId   String?
  authorName String

  // Conteúdo
  message    String?
  metadata   Json?             // Dados estruturados específicos do tipo

  // Visibilidade
  isInternal Boolean @default(false)  // Visível só para servidores
  isRead     Boolean @default(false)
  readAt     DateTime?

  // Anexos
  attachments Json?

  createdAt  DateTime @default(now())

  protocol   ProtocolSimplified @relation(fields: [protocolId], references: [id])

  @@index([protocolId, createdAt])
}

enum InteractionType {
  MESSAGE                 // Mensagem simples
  DOCUMENT_REQUEST       // Solicitação de documento
  DOCUMENT_UPLOAD        // Upload de documento
  PENDING_CREATED        // Pendência criada
  PENDING_RESOLVED       // Pendência resolvida
  STATUS_CHANGED         // Status alterado
  ASSIGNED               // Protocolo atribuído
  INSPECTION_SCHEDULED   // Vistoria agendada
  INSPECTION_COMPLETED   // Vistoria concluída
  APPROVAL              // Aprovação
  REJECTION             // Rejeição
  CANCELLATION          // Cancelamento
  NOTE                  // Nota interna
}

// ========================================
// DOCUMENTOS
// ========================================
model ProtocolDocument {
  id          String   @id @default(cuid())
  protocolId  String

  // Tipo de documento
  documentType String          // RG, CPF, COMPROVANTE_RESIDENCIA, etc
  isRequired   Boolean

  // Status do documento
  status       DocumentStatus @default(PENDING)

  // Arquivo
  fileName     String?
  fileUrl      String?
  fileSize     Int?
  mimeType     String?

  // Validação
  uploadedAt   DateTime?
  uploadedBy   String?         // citizenId
  validatedAt  DateTime?
  validatedBy  String?         // userId
  rejectedAt   DateTime?
  rejectionReason String?

  // Versionamento
  version      Int @default(1)
  previousDocId String?

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  protocol     ProtocolSimplified @relation(fields: [protocolId], references: [id])

  @@index([protocolId, documentType])
}

enum DocumentStatus {
  PENDING       // Aguardando upload
  UPLOADED      // Enviado pelo cidadão
  UNDER_REVIEW  // Em análise
  APPROVED      // Aprovado
  REJECTED      // Rejeitado
  EXPIRED       // Expirado
}

// ========================================
// PENDÊNCIAS
// ========================================
model ProtocolPending {
  id          String   @id @default(cuid())
  protocolId  String

  // Tipo e descrição
  type        PendingType
  title       String
  description String

  // Prazo
  dueDate     DateTime?

  // Status
  status      PendingStatus @default(OPEN)
  resolvedAt  DateTime?
  resolvedBy  String?
  resolution  String?

  // Bloqueio
  blocksProgress Boolean @default(true)

  // Metadados
  metadata    Json?

  // Criação
  createdBy   String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  protocol    ProtocolSimplified @relation(fields: [protocolId], references: [id])

  @@index([protocolId, status])
}

enum PendingType {
  DOCUMENT          // Documento faltante
  INFORMATION       // Informação adicional
  CORRECTION        // Correção necessária
  VALIDATION        // Validação pendente
  PAYMENT           // Pagamento pendente
  INSPECTION        // Vistoria pendente
  APPROVAL          // Aprovação pendente
  OTHER             // Outro
}

enum PendingStatus {
  OPEN              // Aberta
  IN_PROGRESS       // Em resolução
  RESOLVED          // Resolvida
  EXPIRED           // Expirada
  CANCELLED         // Cancelada
}

// ========================================
// WORKFLOW ESPECÍFICO
// ========================================
model ModuleWorkflow {
  id          String   @id @default(cuid())
  moduleType  String   @unique
  name        String
  description String?

  // Etapas
  stages      Json     // Array de etapas estruturadas

  // SLA
  defaultSLA  Int?     // Dias

  // Regras
  rules       Json?    // Regras de transição

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model ProtocolStage {
  id          String   @id @default(cuid())
  protocolId  String

  // Etapa
  stageName   String
  stageOrder  Int

  // Status
  status      StageStatus @default(PENDING)

  // Timestamps
  startedAt   DateTime?
  completedAt DateTime?
  dueDate     DateTime?

  // Responsável
  assignedTo  String?
  completedBy String?

  // Resultado
  result      String?
  notes       String?
  metadata    Json?

  protocol    ProtocolSimplified @relation(fields: [protocolId], references: [id])

  @@index([protocolId, stageOrder])
}

enum StageStatus {
  PENDING       // Aguardando
  IN_PROGRESS   // Em andamento
  COMPLETED     // Concluída
  SKIPPED       // Pulada
  FAILED        // Falhou
}

// ========================================
// SLA E PRAZOS
// ========================================
model ProtocolSLA {
  id              String   @id @default(cuid())
  protocolId      String   @unique

  // Prazos
  startDate       DateTime
  expectedEndDate DateTime
  actualEndDate   DateTime?

  // Pausa (ex: aguardando cidadão)
  isPaused        Boolean @default(false)
  pausedAt        DateTime?
  pausedReason    String?
  totalPausedDays Int @default(0)

  // Status
  isOverdue       Boolean @default(false)
  daysOverdue     Int @default(0)

  // Cálculo
  workingDays     Int      // Dias úteis
  calendarDays    Int      // Dias corridos

  updatedAt       DateTime @updatedAt

  protocol        ProtocolSimplified @relation(fields: [protocolId], references: [id])
}
```

#### 1.2 Endpoints de API

```typescript
// ========================================
// INTERAÇÕES
// ========================================
POST   /api/protocols/:id/interactions
GET    /api/protocols/:id/interactions
PATCH  /api/protocols/:id/interactions/:interactionId/read

// ========================================
// DOCUMENTOS
// ========================================
GET    /api/protocols/:id/documents
POST   /api/protocols/:id/documents/upload
GET    /api/protocols/:id/documents/:docId/download
PATCH  /api/protocols/:id/documents/:docId/validate
PATCH  /api/protocols/:id/documents/:docId/reject
DELETE /api/protocols/:id/documents/:docId

// ========================================
// PENDÊNCIAS
// ========================================
GET    /api/protocols/:id/pendings
POST   /api/protocols/:id/pendings
PATCH  /api/protocols/:id/pendings/:pendingId/resolve
PATCH  /api/protocols/:id/pendings/:pendingId/cancel

// ========================================
// WORKFLOW
// ========================================
GET    /api/protocols/:id/stages
PATCH  /api/protocols/:id/stages/:stageId/complete
PATCH  /api/protocols/:id/stages/:stageId/fail

// ========================================
// SLA
// ========================================
GET    /api/protocols/:id/sla
POST   /api/protocols/:id/sla/pause
POST   /api/protocols/:id/sla/resume
```

### FASE 2: INTERFACE (3-4 semanas)

#### 2.1 Nova Tela de Gerenciamento de Protocolo

**Layout sugerido:**

```
┌─────────────────────────────────────────────────────────────┐
│ PROTOCOLO #2025-000001                        [⚙️ Ações ▼]  │
│ Cadastro de Produtor Rural                                  │
│                                                              │
│ 🟡 Em Análise Documental   👤 João Silva   ⏰ 3 dias       │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                              │
│ [📊 Resumo] [💬 Interações] [📄 Documentos] [⚠️ Pendências]│
│ [📋 Histórico] [✅ Decisão]                                 │
│                                                              │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ 💬 INTERAÇÕES                              [+ Nova]    │  │
│ │                                                        │  │
│ │ ┌─────────────────────────────────────────────────┐  │  │
│ │ │ 👤 João Silva (Servidor)      Hoje às 14:30     │  │  │
│ │ │                                                   │  │  │
│ │ │ Prezado Luiz, verificamos que falta o          │  │  │
│ │ │ comprovante de propriedade. Por favor, envie   │  │  │
│ │ │ o documento na aba "Documentos".               │  │  │
│ │ │                                                   │  │  │
│ │ │ [💬 Responder]                                  │  │  │
│ │ └─────────────────────────────────────────────────┘  │  │
│ │                                                        │  │
│ │ ┌─────────────────────────────────────────────────┐  │  │
│ │ │ 👨 Luiz Fernando (Cidadão)    Hoje às 10:15    │  │  │
│ │ │                                                   │  │  │
│ │ │ Bom dia! Gostaria de saber o andamento         │  │  │
│ │ │ da minha solicitação.                          │  │  │
│ │ └─────────────────────────────────────────────────┘  │  │
│ └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

#### 2.2 Aba de Documentos

```
┌───────────────────────────────────────────────────────────┐
│ 📄 DOCUMENTOS REQUERIDOS                                  │
│                                                            │
│ ✅ RG/CPF                    [Ver] [Baixar]      Aprovado │
│    • Enviado em 25/10/2025                                │
│    • Validado por João Silva em 26/10/2025               │
│                                                            │
│ ⚠️ Comprovante de Residência [Upload]          Pendente  │
│    • Aguardando envio                                     │
│    • Prazo: 30/10/2025                                    │
│    [📎 Solicitar ao Cidadão]                              │
│                                                            │
│ ❌ Comprovante de Propriedade [Ver] [Baixar]  Rejeitado  │
│    • Enviado em 27/10/2025                                │
│    • Rejeitado: Documento ilegível                        │
│    • Prazo para reenvio: 02/11/2025                       │
│    [📎 Solicitar Correção]                                │
│                                                            │
│ ⏳ Declaração de Atividade   [Upload]      Aguardando    │
│    • Enviado em 28/10/2025                                │
│    • Em análise por Maria Santos                          │
│    [✅ Aprovar] [❌ Rejeitar]                             │
└───────────────────────────────────────────────────────────┘
```

#### 2.3 Aba de Pendências

```
┌───────────────────────────────────────────────────────────┐
│ ⚠️ PENDÊNCIAS ATIVAS (2)                  [+ Nova Pendência]│
│                                                            │
│ 🔴 URGENTE - Documento Faltante                           │
│    Comprovante de residência não enviado                  │
│    Prazo: 30/10/2025 (2 dias)                            │
│    Bloqueia progresso: Sim                                │
│    [Ver Detalhes] [Resolver] [Cancelar]                  │
│                                                            │
│ 🟡 Informação Adicional                                   │
│    Necessário informar área total da propriedade          │
│    Prazo: 05/11/2025 (8 dias)                            │
│    Bloqueia progresso: Não                                │
│    [Ver Detalhes] [Resolver] [Cancelar]                  │
│                                                            │
│ ✅ RESOLVIDAS (1)                                         │
│    ✓ Correção de dados cadastrais - Resolvida em 25/10   │
└───────────────────────────────────────────────────────────┘
```

### FASE 3: WORKFLOWS ESPECÍFICOS (4-6 semanas)

#### 3.1 Configuração de Workflows

**Interface de configuração por módulo:**

```yaml
CADASTRO_PRODUTOR:
  stages:
    - name: "Análise Documental"
      order: 1
      sla_days: 3
      required_documents:
        - RG_CPF
        - COMPROVANTE_RESIDENCIA
        - COMPROVANTE_PROPRIEDADE
      required_actions:
        - validate_documents
      can_skip: false

    - name: "Vistoria de Propriedade"
      order: 2
      sla_days: 7
      required_actions:
        - schedule_inspection
        - complete_inspection
        - upload_inspection_report
      can_skip: true  # Se propriedade já conhecida
      skip_condition: "property_already_registered"

    - name: "Análise Técnica"
      order: 3
      sla_days: 5
      required_actions:
        - technical_review
        - approve_or_reject
      can_skip: false

    - name: "Cadastro no Sistema"
      order: 4
      sla_days: 2
      required_actions:
        - activate_producer
        - generate_certificate
        - notify_citizen
      can_skip: false
```

### FASE 4: RELATÓRIOS E ANALYTICS (2-3 semanas)

**Dashboards:**
1. Tempo médio por tipo de serviço
2. Gargalos no processo
3. Taxa de aprovação/rejeição
4. Cumprimento de SLA
5. Produtividade por servidor
6. Satisfação do cidadão

---

## 📊 PRIORIZAÇÃO RECOMENDADA

### 🔴 URGENTE (Implementar imediatamente)
1. **Sistema de Interações** - Comunicação básica
2. **Gestão de Documentos** - Upload e validação
3. **Pendências** - Criação e resolução

### 🟡 IMPORTANTE (Próximos 2 meses)
4. **Workflows Específicos** - Por módulo
5. **SLA e Prazos** - Automação
6. **Interface Melhorada** - Abas e painéis

### 🟢 DESEJÁVEL (Próximos 6 meses)
7. **Relatórios Avançados**
8. **Assinatura Digital**
9. **Integração com outros sistemas**

---

## 💰 ESTIMATIVA DE ESFORÇO

| Fase | Componente | Esforço | Prioridade |
|------|-----------|---------|------------|
| 1 | Modelo de Dados (Schema) | 3 dias | 🔴 |
| 1 | Endpoints API - Interações | 4 dias | 🔴 |
| 1 | Endpoints API - Documentos | 5 dias | 🔴 |
| 1 | Endpoints API - Pendências | 3 dias | 🔴 |
| 2 | Interface - Aba Interações | 5 dias | 🔴 |
| 2 | Interface - Aba Documentos | 5 dias | 🔴 |
| 2 | Interface - Aba Pendências | 4 dias | 🔴 |
| 3 | Workflows - Configuração | 5 dias | 🟡 |
| 3 | Workflows - Implementação | 10 dias | 🟡 |
| 4 | Relatórios e Analytics | 8 dias | 🟢 |

**Total Fase Crítica (1+2):** ~30 dias úteis (~6 semanas)
**Total Completo:** ~52 dias úteis (~10-12 semanas)

---

## 🎯 RECOMENDAÇÃO FINAL

**Abordagem Sugerida:**

1. **Sprint 1-2 (2 semanas):** Implementar modelo de dados + API básica
2. **Sprint 3-4 (2 semanas):** Interface de interações e documentos
3. **Sprint 5-6 (2 semanas):** Sistema de pendências completo
4. **Sprint 7-10 (4 semanas):** Workflows específicos por módulo
5. **Sprint 11-12 (2 semanas):** Relatórios e refinamentos

**Entrega Mínima Viável (MVP):** Sprints 1-6 (6 semanas)
**Produto Completo:** Sprints 1-12 (12 semanas)

---

## 📝 PRÓXIMOS PASSOS

1. ✅ **Aprovação da proposta** pela equipe
2. ⏳ **Priorização detalhada** das funcionalidades
3. ⏳ **Criação de tasks** no sistema de gerenciamento
4. ⏳ **Início da implementação** do MVP
5. ⏳ **Testes com usuários reais** em ambiente de homologação

---

**Documento preparado por:** Claude (Assistente IA)
**Revisão necessária por:** Equipe técnica e Product Owner
**Data de validade:** 60 dias
