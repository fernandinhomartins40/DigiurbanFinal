# 🚀 PROPOSTA: Serviços Inteligentes e Completos - DigiUrban

## 📊 Análise da Estrutura Atual

### ✅ O Que Já Temos (Implementado)

```typescript
// Model Service Atual
model Service {
  id                String
  name              String
  description       String?
  category          String?
  departmentId      String

  // Configurações Básicas
  requiresDocuments Boolean
  requiredDocuments Json?         // ["RG", "CPF", "Comprovante"]
  estimatedDays     Int?
  priority          Int
  requirements      Json?
  icon              String?
  color             String?
  isActive          Boolean

  // Relacionamentos
  protocols         Protocol[]
  specializedPages  SpecializedPage[]
}
```

### ⚠️ Limitações Atuais

1. **Sem Formulários Dinâmicos** - Lista estática de documentos
2. **Sem Geolocalização** - Não captura pontos GPS
3. **Sem Workflow Configurável** - Fluxo fixo
4. **Sem Campos Customizados** - Apenas campos pré-definidos
5. **Sem Pesquisas/Enquetes** - Feedback limitado
6. **Sem Agendamento** - Não suporta horários
7. **Sem Notificações Configuráveis** - Sistema fixo

---

## 🎯 PROPOSTA DE EXPANSÃO

### 1️⃣ **Formulários Dinâmicos (Form Builder)**

#### 📝 Schema Proposto

```prisma
// Novo model: ServiceForm (Formulário do Serviço)
model ServiceForm {
  id          String   @id @default(cuid())
  serviceId   String   @unique
  service     Service  @relation(fields: [serviceId], references: [id])

  // Configuração do Formulário
  title       String
  description String?
  isActive    Boolean  @default(true)
  isRequired  Boolean  @default(false)

  // Campos do Formulário (JSON Schema)
  fields      Json     // Array de field definitions
  validation  Json?    // Regras de validação
  conditional Json?    // Lógica condicional (if/then)

  // Multi-step Support
  steps       Json?    // Formulário multi-etapas

  // Metadata
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relacionamentos
  submissions ServiceFormSubmission[]
}

// Respostas dos Formulários
model ServiceFormSubmission {
  id          String   @id @default(cuid())
  formId      String
  form        ServiceForm @relation(fields: [formId], references: [id])

  protocolId  String
  protocol    Protocol @relation(fields: [protocolId], references: [id])

  // Dados Enviados
  data        Json     // Resposta completa do formulário
  metadata    Json?    // IP, user agent, timestamp detalhado

  // Status
  isComplete  Boolean  @default(false)
  submittedAt DateTime @default(now())
}
```

#### 🎨 Exemplo de Estrutura de Campo

```json
{
  "fields": [
    {
      "id": "nome_paciente",
      "type": "text",
      "label": "Nome Completo do Paciente",
      "placeholder": "Digite o nome completo",
      "required": true,
      "validation": {
        "minLength": 3,
        "maxLength": 100,
        "pattern": "^[a-zA-ZÀ-ÿ\\s]+$"
      }
    },
    {
      "id": "tipo_consulta",
      "type": "select",
      "label": "Tipo de Consulta",
      "required": true,
      "options": [
        { "value": "clinica_geral", "label": "Clínica Geral" },
        { "value": "pediatria", "label": "Pediatria" },
        { "value": "ginecologia", "label": "Ginecologia" }
      ]
    },
    {
      "id": "sintomas",
      "type": "textarea",
      "label": "Descreva os Sintomas",
      "rows": 5,
      "maxLength": 500
    },
    {
      "id": "tem_alergia",
      "type": "checkbox",
      "label": "Possui alguma alergia medicamentosa?"
    },
    {
      "id": "alergias",
      "type": "text",
      "label": "Quais alergias?",
      "conditional": {
        "field": "tem_alergia",
        "operator": "equals",
        "value": true
      }
    },
    {
      "id": "anexos",
      "type": "file",
      "label": "Anexar Exames (PDF ou imagem)",
      "accept": ".pdf,.jpg,.png",
      "multiple": true,
      "maxSize": 5242880  // 5MB
    }
  ]
}
```

#### 💡 Tipos de Campos Suportados

```
✅ text          - Texto simples
✅ textarea      - Texto longo
✅ email         - Email validado
✅ phone         - Telefone formatado
✅ cpf           - CPF com validação
✅ cnpj          - CNPJ com validação
✅ date          - Seletor de data
✅ time          - Seletor de hora
✅ datetime      - Data e hora
✅ number        - Número
✅ select        - Dropdown
✅ radio         - Radio buttons
✅ checkbox      - Checkboxes
✅ file          - Upload de arquivo
✅ multiselect   - Seleção múltipla
✅ rating        - Avaliação (estrelas)
✅ slider        - Slider numérico
✅ location      - GPS (ver seção 2)
✅ signature     - Assinatura digital
✅ divider       - Divisor visual
✅ heading       - Título de seção
✅ html          - HTML customizado
```

---

### 2️⃣ **Geolocalização (GPS)**

#### 📍 Schema Proposto

```prisma
// Localização Associada ao Serviço
model ServiceLocation {
  id          String   @id @default(cuid())
  serviceId   String
  service     Service  @relation(fields: [serviceId], references: [id])

  // Configuração de Geolocalização
  requiresLocation Boolean @default(false)
  locationType     String  // "required", "optional", "auto"

  // Configurações de Validação
  allowedRadius    Float?  // Raio em metros (geofencing)
  centerLat        Float?  // Centro da área permitida
  centerLng        Float?  // Centro da área permitida

  // Metadata
  description      String? // "Marque o local do buraco na rua"
  placeholder      String? // Texto de ajuda

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Localização Capturada no Protocolo
model ProtocolLocation {
  id          String   @id @default(cuid())
  protocolId  String
  protocol    Protocol @relation(fields: [protocolId], references: [id])

  // Dados de Geolocalização
  latitude    Float
  longitude   Float
  accuracy    Float?   // Precisão em metros
  altitude    Float?
  heading     Float?   // Direção (0-360)
  speed       Float?

  // Endereço Reverso (Geocoding)
  address     Json?    // Endereço completo obtido via API

  // Metadata de Captura
  capturedAt  DateTime @default(now())
  source      String   @default("gps") // "gps", "manual", "ip"
  deviceInfo  Json?    // Info do dispositivo

  // Fotos no Local
  photos      Json?    // Array de URLs de fotos
}
```

#### 🗺️ Casos de Uso

```yaml
# Exemplo 1: Buraco na Rua (Serviços Públicos)
serviceLocation:
  requiresLocation: true
  locationType: "required"
  description: "Marque o local exato do buraco na rua"
  allowedRadius: null  # Aceita qualquer localização

# Exemplo 2: Poda de Árvore (Meio Ambiente)
serviceLocation:
  requiresLocation: true
  locationType: "required"
  description: "Marque a localização da árvore"
  allowedRadius: 50000  # 50km do centro da cidade
  centerLat: -23.5505
  centerLng: -46.6333

# Exemplo 3: Agendamento de Consulta (Saúde)
serviceLocation:
  requiresLocation: false
  locationType: "optional"
  description: "Localização para transporte se necessário"
```

---

### 3️⃣ **Pesquisas e Enquetes**

#### 📊 Schema Proposto

```prisma
// Pesquisa/Enquete Vinculada ao Serviço
model ServiceSurvey {
  id            String   @id @default(cuid())
  serviceId     String
  service       Service  @relation(fields: [serviceId], references: [id])

  // Configuração da Pesquisa
  title         String
  description   String?
  type          String   // "satisfaction", "feedback", "evaluation"

  // Quando Exibir
  timing        String   // "before", "after", "both"
  isRequired    Boolean  @default(false)

  // Perguntas (JSON Schema)
  questions     Json

  // Status
  isActive      Boolean  @default(true)

  // Metadata
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relacionamentos
  responses     SurveyResponse[]
}

// Respostas das Pesquisas
model SurveyResponse {
  id          String   @id @default(cuid())
  surveyId    String
  survey      ServiceSurvey @relation(fields: [surveyId], references: [id])

  protocolId  String?
  protocol    Protocol? @relation(fields: [protocolId], references: [id])

  citizenId   String?
  citizen     Citizen?  @relation(fields: [citizenId], references: [id])

  // Dados da Resposta
  answers     Json
  rating      Float?    // Nota geral (0-5)

  // Metadata
  submittedAt DateTime @default(now())
  isAnonymous Boolean  @default(false)
}
```

#### 📋 Exemplo de Pesquisa de Satisfação

```json
{
  "title": "Avalie o Atendimento Recebido",
  "type": "satisfaction",
  "timing": "after",
  "questions": [
    {
      "id": "satisfacao_geral",
      "type": "rating",
      "label": "Como você avalia o atendimento recebido?",
      "required": true,
      "min": 1,
      "max": 5,
      "labels": {
        "1": "Muito Insatisfeito",
        "5": "Muito Satisfeito"
      }
    },
    {
      "id": "tempo_espera",
      "type": "select",
      "label": "Como foi o tempo de espera?",
      "options": [
        { "value": "rapido", "label": "Rápido (até 5 dias)" },
        { "value": "adequado", "label": "Adequado (5-10 dias)" },
        { "value": "lento", "label": "Lento (mais de 10 dias)" }
      ]
    },
    {
      "id": "sugestoes",
      "type": "textarea",
      "label": "Sugestões de Melhoria",
      "placeholder": "Como podemos melhorar este serviço?"
    }
  ]
}
```

---

### 4️⃣ **Agendamento e Horários**

#### 🗓️ Schema Proposto

```prisma
// Configuração de Agendamento do Serviço
model ServiceScheduling {
  id            String   @id @default(cuid())
  serviceId     String   @unique
  service       Service  @relation(fields: [serviceId], references: [id])

  // Configuração
  allowScheduling Boolean @default(false)
  type            String  // "appointment", "time_slot", "date_only"

  // Horários Disponíveis
  workingHours    Json    // { "monday": ["08:00-12:00", "14:00-18:00"] }
  blockouts       Json?   // Feriados, férias, bloqueios

  // Configurações de Agendamento
  slotDuration    Int?    // Duração do slot em minutos
  bufferTime      Int?    // Tempo entre agendamentos
  maxPerDay       Int?    // Máximo de agendamentos/dia
  advanceBooking  Int?    // Quantos dias antes pode agendar

  // Locais de Atendimento
  locations       Json?   // Array de locais disponíveis

  // Metadata
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relacionamentos
  appointments    Appointment[]
}

// Agendamento Individual
model Appointment {
  id              String   @id @default(cuid())
  schedulingId    String
  scheduling      ServiceScheduling @relation(fields: [schedulingId], references: [id])

  protocolId      String   @unique
  protocol        Protocol @relation(fields: [protocolId], references: [id])

  // Data e Hora
  scheduledDate   DateTime
  scheduledTime   String   // "09:00"
  duration        Int      // Minutos

  // Local
  location        Json?

  // Status
  status          String   @default("scheduled") // scheduled, confirmed, cancelled, completed

  // Confirmação
  confirmedAt     DateTime?
  reminderSent    Boolean  @default(false)

  // Metadata
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([scheduledDate, scheduledTime])
}
```

---

### 5️⃣ **Workflow Configurável**

#### 🔄 Schema Proposto

```prisma
// Workflow do Serviço
model ServiceWorkflow {
  id          String   @id @default(cuid())
  serviceId   String   @unique
  service     Service  @relation(fields: [serviceId], references: [id])

  // Configuração do Workflow
  name        String
  description String?

  // Etapas (Stages)
  stages      Json     // Array de stages ordenados
  transitions Json     // Regras de transição entre stages

  // Automações
  automations Json?    // Ações automáticas por stage
  notifications Json?  // Configuração de notificações

  // SLA (Service Level Agreement)
  sla         Json?    // Tempo máximo por stage

  // Metadata
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### 🔄 Exemplo de Workflow

```json
{
  "name": "Alvará de Construção",
  "stages": [
    {
      "id": "submitted",
      "name": "Protocolo Aberto",
      "description": "Aguardando análise inicial",
      "sla": { "hours": 24 },
      "actions": ["upload_documents", "edit_form"]
    },
    {
      "id": "analysis",
      "name": "Em Análise Técnica",
      "description": "Documentação sendo analisada",
      "sla": { "days": 5 },
      "assignTo": "ENGINEER",
      "actions": ["request_documents", "reject", "approve"]
    },
    {
      "id": "field_inspection",
      "name": "Vistoria Agendada",
      "description": "Aguardando vistoria no local",
      "sla": { "days": 10 },
      "requiresLocation": true,
      "actions": ["schedule_visit", "complete_inspection"]
    },
    {
      "id": "approved",
      "name": "Aprovado",
      "description": "Alvará emitido",
      "automation": {
        "generateDocument": "alvara_template",
        "sendEmail": true,
        "sendSMS": true
      }
    },
    {
      "id": "rejected",
      "name": "Rejeitado",
      "description": "Solicitação negada",
      "requiresJustification": true
    }
  ],
  "transitions": {
    "submitted": ["analysis", "rejected"],
    "analysis": ["field_inspection", "approved", "rejected", "submitted"],
    "field_inspection": ["approved", "rejected", "analysis"]
  }
}
```

---

### 6️⃣ **Notificações Configuráveis**

#### 📧 Schema Proposto

```prisma
// Configuração de Notificações do Serviço
model ServiceNotification {
  id          String   @id @default(cuid())
  serviceId   String
  service     Service  @relation(fields: [serviceId], references: [id])

  // Tipo de Notificação
  type        String   // "email", "sms", "push", "whatsapp"
  trigger     String   // "created", "updated", "completed", "stage_change"

  // Condições
  conditions  Json?    // Quando enviar

  // Destinatários
  recipients  Json     // "citizen", "admin", "department", "custom"

  // Template
  template    Json     // Título, corpo, variáveis

  // Status
  isActive    Boolean  @default(true)

  // Metadata
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

### 7️⃣ **Campos Customizados (Metadata)**

#### 📝 Schema Proposto

```prisma
// Campos Customizados do Serviço
model ServiceCustomField {
  id          String   @id @default(cuid())
  serviceId   String
  service     Service  @relation(fields: [serviceId], references: [id])

  // Definição do Campo
  key         String   // "numero_processo", "codigo_lote"
  label       String   // "Número do Processo"
  type        String   // "text", "number", "date", "select"

  // Configuração
  required    Boolean  @default(false)
  validation  Json?
  options     Json?    // Para select/radio
  defaultValue String?

  // Ordem e Visibilidade
  order       Int      @default(0)
  isVisible   Boolean  @default(true)

  // Metadata
  createdAt   DateTime @default(now())

  @@unique([serviceId, key])
}

// Valores dos Campos Customizados
model ProtocolCustomFieldValue {
  id          String   @id @default(cuid())
  protocolId  String
  protocol    Protocol @relation(fields: [protocolId], references: [id])

  fieldId     String
  field       ServiceCustomField @relation(fields: [fieldId], references: [id])

  // Valor
  value       Json     // Flexível para diferentes tipos

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([protocolId, fieldId])
}
```

---

### 8️⃣ **Documentos e Anexos Avançados**

#### 📎 Schema Proposto

```prisma
// Configuração de Documentos do Serviço
model ServiceDocument {
  id            String   @id @default(cuid())
  serviceId     String
  service       Service  @relation(fields: [serviceId], references: [id])

  // Definição do Documento
  name          String   // "RG", "Comprovante de Residência"
  description   String?

  // Configuração
  required      Boolean  @default(true)
  multiple      Boolean  @default(false) // Permite múltiplos arquivos

  // Validação de Arquivo
  acceptedTypes Json     // [".pdf", ".jpg", ".png"]
  maxSize       Int      // Bytes
  minFiles      Int?     @default(1)
  maxFiles      Int?     @default(1)

  // Validação Automática (OCR/IA)
  validateWithAI Boolean @default(false)
  extractData    Json?   // Campos a extrair via OCR

  // Ordem
  order         Int      @default(0)

  // Metadata
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

---

## 🎨 Interface de Criação de Serviço COMPLETA

### 📋 Nova Estrutura do Formulário

```typescript
interface EnhancedServiceForm {
  // Básico (já existe)
  name: string
  description: string
  category: string
  departmentId: string
  priority: number
  estimatedDays: number
  icon: string
  color: string

  // NOVO: Formulário Dinâmico
  hasCustomForm: boolean
  customForm?: {
    title: string
    fields: FormField[]
    steps?: FormStep[]
    validation?: ValidationRule[]
  }

  // NOVO: Geolocalização
  requiresLocation: boolean
  locationConfig?: {
    type: 'required' | 'optional' | 'auto'
    description: string
    geofencing?: {
      centerLat: number
      centerLng: number
      radius: number
    }
  }

  // NOVO: Pesquisa
  hasSurvey: boolean
  survey?: {
    title: string
    timing: 'before' | 'after' | 'both'
    questions: SurveyQuestion[]
  }

  // NOVO: Agendamento
  allowsScheduling: boolean
  scheduling?: {
    type: 'appointment' | 'time_slot' | 'date_only'
    workingHours: WorkingHours
    slotDuration: number
    maxPerDay: number
  }

  // NOVO: Workflow
  hasCustomWorkflow: boolean
  workflow?: {
    stages: WorkflowStage[]
    transitions: WorkflowTransition[]
    automations: Automation[]
  }

  // NOVO: Notificações
  notifications: NotificationConfig[]

  // NOVO: Campos Customizados
  customFields: CustomField[]

  // NOVO: Documentos Avançados
  documents: DocumentConfig[]
}
```

---

## 📊 Comparativo: Antes x Depois

| Recurso | Antes | Depois |
|---------|-------|--------|
| **Campos** | 11 campos fixos | Ilimitados + customizados |
| **Documentos** | Lista estática | Upload configurável + IA |
| **Localização** | ❌ Não | ✅ GPS + Geocoding |
| **Formulários** | ❌ Não | ✅ Form Builder completo |
| **Pesquisas** | ❌ Não | ✅ Antes/Depois do serviço |
| **Agendamento** | ❌ Não | ✅ Slots + Horários |
| **Workflow** | ❌ Fixo | ✅ 100% Configurável |
| **Notificações** | ❌ Fixas | ✅ Configuráveis por evento |
| **Validação** | ❌ Básica | ✅ IA + OCR + Regras |

---

## 🚀 Exemplos de Uso Real

### Exemplo 1: "Tapa-Buraco"

```yaml
Serviço: Solicitação de Tapa-Buraco

Formulário Customizado:
  - Tipo de via: [Rua, Avenida, Estrada]
  - Tamanho aproximado: [Pequeno, Médio, Grande]
  - Foto do buraco: [Upload obrigatório]

Geolocalização:
  - Obrigatória: Sim
  - Descrição: "Marque o local exato do buraco"
  - Permitir fotos: Sim (até 3)

Workflow:
  1. Protocolo Aberto → Notifica equipe
  2. Em Análise → Técnico avalia gravidade
  3. Agendado → Cidadão recebe data prevista
  4. Em Execução → Equipe em campo
  5. Concluído → Pesquisa de satisfação

Notificações:
  - Criação: SMS para cidadão
  - Agendamento: Email + SMS com data
  - Conclusão: Push notification + Pesquisa
```

### Exemplo 2: "Agendamento de Consulta Médica"

```yaml
Serviço: Agendamento de Consulta

Formulário Dinâmico:
  - Tipo de consulta: [Clínica Geral, Pediatria, etc]
  - Sintomas: [Textarea]
  - Medicamentos em uso: [Textarea]
  - Tem convênio: [Sim/Não]
  - Nome da mãe: [Texto - obrigatório]

Agendamento:
  - Horários: Seg-Sex 08:00-18:00
  - Duração: 30 minutos
  - Máximo/dia: 20 consultas
  - Locais: [UBS Centro, UBS Bairro X]

Documentos:
  - Cartão SUS: [PDF/Foto - obrigatório]
  - Exames anteriores: [PDF - opcional, múltiplos]

Pesquisa (Após):
  - Satisfação com atendimento
  - Tempo de espera
  - Qualidade do tratamento
```

### Exemplo 3: "Inscrição em Programa Social"

```yaml
Serviço: Inscrição no Bolsa Família

Formulário Multi-etapas:
  Etapa 1 - Dados Pessoais:
    - Nome completo
    - CPF
    - Data de nascimento

  Etapa 2 - Composição Familiar:
    - Quantas pessoas moram na casa?
    - Dados de cada membro

  Etapa 3 - Renda:
    - Renda familiar total
    - Comprovantes de renda

  Etapa 4 - Documentos:
    - RG de todos
    - Comprovante de residência
    - Conta de luz

Validação IA:
  - Extrai CPF do RG automaticamente
  - Valida endereço no comprovante
  - Cruza dados com CadÚnico

Workflow Complexo:
  1. Submetido → Validação automática
  2. Pendente → Falta documento X
  3. Completo → Análise socioassistente
  4. Visita Agendada → GPS obrigatório
  5. Aprovado/Negado → Justificativa
```

---

## 🛠️ Implementação Sugerida

### Fase 1: Fundação (2-3 semanas)
- ✅ Criar novos models no Prisma
- ✅ Migração de banco de dados
- ✅ APIs CRUD para cada novo model

### Fase 2: Form Builder (3-4 semanas)
- ✅ Interface drag-and-drop de campos
- ✅ Editor JSON avançado
- ✅ Preview em tempo real
- ✅ Biblioteca de templates

### Fase 3: GPS e Mapas (2 semanas)
- ✅ Integração Google Maps / OpenStreetMap
- ✅ Geocoding reverso
- ✅ Upload de fotos no local
- ✅ Geofencing

### Fase 4: Agendamento (2-3 semanas)
- ✅ Calendário interativo
- ✅ Gestão de slots
- ✅ Confirmações automáticas
- ✅ Lembretes por SMS/Email

### Fase 5: Workflow Engine (3-4 semanas)
- ✅ Editor visual de workflow
- ✅ Motor de transições
- ✅ Automações por stage
- ✅ Dashboard de acompanhamento

### Fase 6: Pesquisas e Analytics (2 semanas)
- ✅ Criador de pesquisas
- ✅ Dashboard de resultados
- ✅ Análise de satisfação
- ✅ Relatórios automáticos

---

## 💰 Benefícios da Implementação

### Para o Município:
✅ **Flexibilidade Total** - Criar qualquer tipo de serviço sem código
✅ **Dados Estruturados** - Formulários validados e organizados
✅ **Geolocalização** - Mapear problemas urbanos com precisão
✅ **Eficiência** - Workflows automáticos economizam tempo
✅ **Feedback** - Pesquisas melhoram continuamente os serviços
✅ **Agendamento** - Reduz filas e otimiza recursos

### Para o Cidadão:
✅ **Experiência Melhor** - Formulários intuitivos
✅ **Transparência** - Acompanha cada etapa
✅ **Conveniência** - Agenda pelo celular
✅ **Participação** - Voz ativa via pesquisas
✅ **Rapidez** - Processos automatizados

---

## 📝 Próximos Passos

1. **Aprovar Proposta** - Validar escopo e prioridades
2. **Definir MVP** - Quais recursos implementar primeiro
3. **Criar Protótipo** - Interface do Form Builder
4. **Desenvolver Backend** - Novos models e APIs
5. **Integrar Frontend** - Componentes reutilizáveis
6. **Testar com Casos Reais** - Validar com municípios piloto

---

**Sistema:** DigiUrban 2.0 - Serviços Inteligentes
**Proposta por:** Análise Técnica
**Data:** Outubro 2025
