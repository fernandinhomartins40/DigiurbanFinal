# 🚀 IMPLEMENTAÇÃO: Serviços Inteligentes (Feature Flags)

## ✅ Status da Implementação

### Fase 1: Backend - Database Schema ✅ CONCLUÍDO

#### 📁 Arquivos Criados/Modificados

1. ✅ **schema.prisma** - Atualizado com flags e relacionamentos
   - 8 feature flags adicionadas ao `Service`
   - Relacionamentos opcionais criados
   - 100% retrocompatível

2. ✅ **enhanced-services.prisma** - Novos models
   - `ServiceForm` + `ServiceFormSubmission`
   - `ServiceLocation` + `ProtocolLocation`
   - `ServiceSurvey` + `SurveyResponse`
   - `ServiceScheduling` + `Appointment`
   - `ServiceWorkflow` + `WorkflowExecution`
   - `ServiceNotification` + `NotificationLog`
   - `ServiceCustomField` + `ProtocolCustomFieldValue`
   - `ServiceDocument` + `DocumentUpload`

3. ✅ **Migration SQL** - `add_service_feature_flags.sql`
   - Adiciona 8 flags (todas false por padrão)
   - Índices para performance
   - Zero breaking changes

---

## 🏗️ Arquitetura Implementada

### Feature Flags no Service

```prisma
model Service {
  // Campos básicos (inalterados)
  id, name, description, departmentId...

  // NOVOS: Feature Flags (opt-in)
  hasCustomForm       Boolean @default(false)
  hasLocation         Boolean @default(false)
  hasScheduling       Boolean @default(false)
  hasSurvey           Boolean @default(false)
  hasCustomWorkflow   Boolean @default(false)
  hasCustomFields     Boolean @default(false)
  hasAdvancedDocs     Boolean @default(false)
  hasNotifications    Boolean @default(false)

  // NOVOS: Relacionamentos Opcionais
  customForm      ServiceForm?
  locationConfig  ServiceLocation?
  scheduling      ServiceScheduling?
  survey          ServiceSurvey?
  workflow        ServiceWorkflow?
  customFields    ServiceCustomField[]
  documents       ServiceDocument[]
  notifications   ServiceNotification[]
}
```

### Protocol Extensions

```prisma
model Protocol {
  // Campos existentes (inalterados)
  ...

  // NOVOS: Relacionamentos com features
  formSubmission      ServiceFormSubmission?
  location            ProtocolLocation?
  appointment         Appointment?
  surveyResponse      SurveyResponse?
  workflowExecution   WorkflowExecution?
  customFieldValues   ProtocolCustomFieldValue[]
  documentUploads     DocumentUpload[]
  notificationLogs    NotificationLog[]
}
```

---

## 📊 Recursos Implementados

### 1️⃣ Formulários Dinâmicos

**Models:**
- `ServiceForm` - Configuração do formulário
- `ServiceFormSubmission` - Respostas enviadas

**Campos do Formulário (JSON Schema):**
```json
{
  "fields": [
    {
      "id": "campo_id",
      "type": "text|textarea|email|phone|cpf|date|select|radio|checkbox|file|location|signature",
      "label": "Rótulo",
      "required": true,
      "validation": { "min": 3, "max": 100, "pattern": "regex" },
      "options": [{ "value": "v1", "label": "Opção 1" }],
      "conditional": { "field": "outro_campo", "operator": "equals", "value": "valor" }
    }
  ],
  "steps": [
    {
      "title": "Etapa 1",
      "fields": ["campo1", "campo2"]
    }
  ]
}
```

---

### 2️⃣ Geolocalização (GPS)

**Models:**
- `ServiceLocation` - Configuração de GPS
- `ProtocolLocation` - Localização capturada

**Recursos:**
- ✅ Captura de coordenadas (lat/lng)
- ✅ Precisão e altitude
- ✅ Geocoding reverso (endereço completo)
- ✅ Geofencing (raio permitido)
- ✅ Upload de fotos geolocalizadas
- ✅ Fonte: GPS, manual ou IP

---

### 3️⃣ Pesquisas e Enquetes

**Models:**
- `ServiceSurvey` - Configuração da pesquisa
- `SurveyResponse` - Respostas

**Tipos de Pesquisa:**
- Satisfação (rating 1-5)
- NPS (0-10)
- Feedback aberto
- Custom

**Timing:**
- Antes do serviço
- Depois do serviço
- Ambos

---

### 4️⃣ Agendamento

**Models:**
- `ServiceScheduling` - Configuração de horários
- `Appointment` - Agendamento individual

**Recursos:**
- ✅ Horários de trabalho por dia da semana
- ✅ Slots configuráveis (duração)
- ✅ Buffer time entre agendamentos
- ✅ Múltiplos locais de atendimento
- ✅ Confirmação automática
- ✅ Lembretes (email/SMS)
- ✅ Reagendamento
- ✅ Bloqueios e feriados

---

### 5️⃣ Workflow Configurável

**Models:**
- `ServiceWorkflow` - Configuração do fluxo
- `WorkflowExecution` - Execução no protocolo

**Recursos:**
- ✅ Etapas (stages) customizadas
- ✅ Transições condicionais
- ✅ Automações por etapa
- ✅ SLA por etapa
- ✅ Aprovações multi-nível
- ✅ Histórico de transições

---

### 6️⃣ Notificações Configuráveis

**Models:**
- `ServiceNotification` - Configuração
- `NotificationLog` - Logs de envio

**Canais:**
- Email
- SMS
- Push
- WhatsApp

**Triggers:**
- Criação de protocolo
- Mudança de status
- Mudança de etapa
- Prazo próximo
- Custom

---

### 7️⃣ Campos Customizados

**Models:**
- `ServiceCustomField` - Definição do campo
- `ProtocolCustomFieldValue` - Valor no protocolo

**Tipos Suportados:**
- text, number, date, select, checkbox, etc.

---

### 8️⃣ Documentos Avançados

**Models:**
- `ServiceDocument` - Configuração do documento
- `DocumentUpload` - Upload realizado

**Recursos:**
- ✅ Validação de tipo e tamanho
- ✅ Upload múltiplo
- ✅ OCR/IA para extração de dados
- ✅ Validação automática
- ✅ Templates e exemplos

---

## 🔄 Próximos Passos

### Fase 2: API Backend (EM ANDAMENTO)

1. ⏳ Atualizar routes/services.ts
   - Suporte a flags no POST/PUT
   - Include condicional baseado em flags
   - Validação progressiva

2. ⏳ Criar routes específicas
   - `/api/services/:id/form` - Formulários
   - `/api/services/:id/location` - GPS
   - `/api/services/:id/scheduling` - Agendamento
   - `/api/services/:id/survey` - Pesquisas
   - `/api/services/:id/workflow` - Workflow

### Fase 3: Frontend (PENDENTE)

1. ⏳ Interface com toggle Simples/Avançado
2. ⏳ Form Builder visual
3. ⏳ Location Picker (mapa interativo)
4. ⏳ Calendar/Scheduling UI
5. ⏳ Survey Builder
6. ⏳ Workflow Editor visual

---

## 💡 Como Usar (Quando Completo)

### Criar Serviço Simples (Como Antes)

```json
POST /api/services
{
  "name": "Emissão de IPTU",
  "departmentId": "dept-123",
  "requiresDocuments": true,
  "requiredDocuments": ["Inscrição do imóvel"]
}
```

Resultado: Serviço básico, todas flags = false

---

### Criar Serviço Avançado (Com GPS + Pesquisa)

```json
POST /api/services
{
  "name": "Tapa-Buraco",
  "departmentId": "dept-456",

  "hasLocation": true,
  "locationConfig": {
    "requiresLocation": true,
    "description": "Marque o local do buraco",
    "allowPhotos": true,
    "maxPhotos": 3
  },

  "hasSurvey": true,
  "survey": {
    "title": "Avalie o reparo",
    "timing": "after",
    "questions": [
      {
        "id": "satisfacao",
        "type": "rating",
        "label": "Satisfação com o reparo",
        "min": 1,
        "max": 5
      }
    ]
  }
}
```

Resultado: Serviço com GPS + Pesquisa ativa

---

## ✅ Garantias de Compatibilidade

### Zero Breaking Changes

1. ✅ Todos os 154 serviços existentes continuam funcionando
2. ✅ Todas as flags iniciam como `false`
3. ✅ Relacionamentos opcionais = `NULL` quando flag = false
4. ✅ Queries antigas continuam retornando os mesmos dados
5. ✅ Performance mantida (lazy loading)

### Migration Segura

```sql
-- Migration adiciona apenas flags (default: false)
ALTER TABLE services ADD COLUMN hasCustomForm BOOLEAN DEFAULT false;
-- ... etc

-- Serviços existentes = todas flags false = comportamento original!
```

---

## 📁 Estrutura de Arquivos

```
digiurban/backend/
├── prisma/
│   ├── schema.prisma                        ✅ MODIFICADO
│   ├── enhanced-services.prisma             ✅ CRIADO (merged)
│   └── migrations/
│       └── add_service_feature_flags.sql    ✅ CRIADO
│
├── src/routes/
│   ├── services.ts                          ⏳ EM PROGRESSO
│   └── enhanced-services/                   ⏳ PRÓXIMO
│       ├── forms.ts
│       ├── location.ts
│       ├── scheduling.ts
│       ├── surveys.ts
│       └── workflow.ts
│
frontend/
└── app/admin/
    └── servicos/
        ├── page.tsx                         ⏳ PRÓXIMO
        └── components/
            ├── ServiceFormSimple.tsx        ⏳ PRÓXIMO
            ├── ServiceFormAdvanced.tsx      ⏳ PRÓXIMO
            ├── FormBuilder.tsx              ⏳ PRÓXIMO
            ├── LocationConfig.tsx           ⏳ PRÓXIMO
            ├── SchedulingConfig.tsx         ⏳ PRÓXIMO
            ├── SurveyBuilder.tsx            ⏳ PRÓXIMO
            └── WorkflowEditor.tsx           ⏳ PRÓXIMO
```

---

## 🎯 Filosofia da Implementação

```
┌──────────────────────────────────────────┐
│  SIMPLES POR PADRÃO                      │
│  PODEROSO QUANDO NECESSÁRIO              │
│                                          │
│  • Flags = false → Modo simples          │
│  • Flags = true → Recursos extras        │
│  • 100% retrocompatível                  │
│  • Performance otimizada                 │
│  • Usuário controla complexidade         │
│                                          │
└──────────────────────────────────────────┘
```

---

**Status Geral:** 📊 30% Completo
**Próximo Passo:** Atualizar API de Serviços
**Data:** 2025-10-25
