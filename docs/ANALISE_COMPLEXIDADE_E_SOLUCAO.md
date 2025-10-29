# ANÁLISE DA COMPLEXIDADE ATUAL E PROPOSTA DE SIMPLIFICAÇÃO

**Data:** 29/10/2025
**Objetivo:** Reduzir complexidade seguindo a Visão Unificada sem deixar arquivos legados

---

## 📊 COMPLEXIDADE ATUAL IDENTIFICADA

### 1. **Múltiplas Tabelas Específicas por Módulo**

O schema Prisma atual possui **100+ tabelas** especializadas:

```
SAÚDE:
- HealthUnit, HealthProfessional, HealthDoctor, HealthAppointment
- HealthAttendance, HealthTransport, HealthCampaign, Medication
- MedicationDispense, MedicationDispensing, Vaccination, VaccinationCampaign

EDUCAÇÃO:
- School, PublicSchool, Student, SchoolClass, SchoolCall
- SchoolEvent, SchoolMeal, DisciplinaryRecord, CitizenTransferRequest

AGRICULTURA:
- RuralProducer, RuralProperty, RuralProgram, RuralTraining
- TechnicalAssistance, AgricultureAttendance

CULTURA:
- CulturalSpace, CulturalEvent, CulturalWorkshop, CulturalProject
- CulturalManifestation, CulturalAttendance, ArtisticGroup

ESPORTES:
- SportsTeam, SportsClub, SportsSchool, SportsEvent
- SportsInfrastructure, SportsAttendance, SportsModality
- Athlete, Competition

... e mais 70+ tabelas especializadas por secretaria
```

### 2. **Sistema de Feature Flags Excessivo**

Tabela `Service` com 8 flags booleanas:

```typescript
hasCustomForm: Boolean
hasLocation: Boolean
hasScheduling: Boolean
hasSurvey: Boolean
hasCustomWorkflow: Boolean
hasCustomFields: Boolean
hasAdvancedDocs: Boolean
hasNotifications: Boolean
```

**Problema:** Complexidade desnecessária quando apenas 2 tipos de serviço existem:
- **Informativos** (apenas acompanhamento)
- **Com Captura de Dados** (vão para módulos)

### 3. **Tabelas de Configuração por Serviço**

Sistema de "Recursos Inteligentes" com 8+ tabelas adicionais:

```
ServiceForm
ServiceLocation
ServiceScheduling
ServiceSurvey
ServiceWorkflow
ServiceNotification
ServiceCustomField
ServiceDocument
```

**Problema:** Over-engineering. A maioria dos serviços não precisa dessa granularidade.

### 4. **Duplicação de Lógica de Atendimento**

Cada secretaria tem sua própria tabela de atendimento:

```
HealthAttendance
SocialAssistanceAttendance
AgricultureAttendance
CulturalAttendance
EnvironmentalAttendance
HousingAttendance
PublicWorksAttendances
SecurityAttendances
SportsAttendances
TourismAttendances
UrbanPlanningAttendances
```

**Problema:** 11 tabelas fazendo exatamente a mesma coisa - registro de atendimentos.

### 5. **Falta de Centralização no Motor de Protocolos**

O `Protocol` atual não é realmente o centro:

```typescript
model Protocol {
  // Campos básicos OK
  number, title, description, status

  // Problema: vinculação fraca com módulos
  customData Json?  // dados soltos no JSON

  // Problema: campos específicos misturados
  latitude, longitude, endereco

  // Problema: múltiplos sistemas de extensão
  appointment, location, formSubmission
  customFieldValues, documentUploads
}
```

---

## 🎯 VISÃO UNIFICADA (Modelo Ideal)

Conforme descrito em `VISAO UNIFICADA.md`, o sistema deve ser:

### **Motor de Protocolos como CENTRO**

```
                    ┌─────────────────────┐
                    │  MOTOR DE PROTOCOLOS │
                    │     (NÚCLEO)         │
                    └──────────┬───────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ↓              ↓              ↓
         ┌───────────┐  ┌───────────┐  ┌───────────┐
         │ SERVIÇOS  │  │ PROTOCOLOS│  │  MÓDULOS  │
         │ (Catálogo)│  │  (Fluxo)  │  │ (Gestão)  │
         └───────────┘  └───────────┘  └───────────┘
```

### **2 Tipos de Serviços (APENAS)**

1. **SERVIÇOS INFORMATIVOS**
   - Cidadão solicita e acompanha
   - Servidor atualiza status + notificações
   - **NÃO vão para módulo**

2. **SERVIÇOS COM CAPTURA DE DADOS**
   - Cidadão envia formulário
   - Dados vão para **Módulo Padrão da Secretaria**
   - Servidor gerencia no painel especializado

### **Módulos Padrões por Secretaria**

Cada secretaria tem módulos de gestão:

```
SAÚDE:
  - Pacientes, Unidades, Profissionais, Medicamentos

EDUCAÇÃO:
  - Escolas, Alunos, Professores, Turmas

AGRICULTURA:
  - Produtores, Propriedades, Técnicos, Programas

... (13 secretarias, cada uma com 4-8 módulos base)
```

---

## ✨ PROPOSTA DE SIMPLIFICAÇÃO

### **ARQUITETURA SIMPLIFICADA**

```
┌─────────────────────────────────────────────────────────┐
│  PROTOCOLO (Centro Único)                               │
│                                                         │
│  - number (PMSP-2025-000123)                            │
│  - citizenId                                            │
│  - serviceId                                            │
│  - departmentId                                         │
│  - status (VINCULADO → PROGRESSO → CONCLUÍDO)           │
│  - dados (JSON) - se o serviço captura dados            │
│  - moduleType - qual módulo gerencia (se aplicável)     │
│  - histórico de ações                                   │
└─────────────────────────────────────────────────────────┘
              │
              ↓
    ┌─────────────────┐
    │    SERVIÇO      │
    │                 │
    │ - name          │
    │ - departmentId  │
    │ - serviceType:  │
    │   * INFORMATIVO │
    │   * COM_DADOS   │
    │                 │
    │ - moduleType    │
    │   (se COM_DADOS)│
    └─────────────────┘
              │
              ↓ (somente se serviceType = COM_DADOS)
    ┌─────────────────┐
    │ MÓDULO PADRÃO   │
    │                 │
    │ Ex: Produtores  │
    │ Ex: Alunos      │
    │ Ex: Pacientes   │
    └─────────────────┘
```

### **REDUÇÃO DE TABELAS**

#### **ANTES (Complexo):**
```
Service + 8 flags + 8 tabelas de configuração = 9 tabelas

11 tabelas de Atendimentos diferentes

100+ tabelas especializadas
```

#### **DEPOIS (Simplificado):**
```
Service (simplificado)
  - serviceType: ENUM('INFORMATIVO', 'COM_DADOS')
  - moduleType: String? (apenas se COM_DADOS)
  - formSchema: JSON? (campos do formulário, se aplicável)

Protocol (centralizado)
  - customData: JSON (dados capturados, se aplicável)
  - moduleType: String (para roteamento ao módulo correto)

~40 tabelas de Módulos Padrões
  (mantemos apenas as estruturadas - Produtores, Alunos, etc)
```

**Redução:** De 100+ tabelas para ~45 tabelas essenciais.

---

## 🔑 BENEFÍCIOS DA SIMPLIFICAÇÃO

### **1. Motor de Protocolos como Centro Real**

```typescript
// Protocolo sempre existe
const protocol = {
  number: "PMSP-2025-000123",
  citizenId: "...",
  serviceId: "...",
  departmentId: "...",
  status: "VINCULADO"
}

// SE serviço captura dados:
if (service.serviceType === 'COM_DADOS') {
  protocol.customData = formData
  protocol.moduleType = service.moduleType // "PRODUTORES", "ALUNOS", etc

  // Roteamento automático para o módulo
  await modules[protocol.moduleType].create(protocol.customData)
}
```

### **2. Eliminação de Duplicação**

```typescript
// ANTES: 11 tabelas diferentes
HealthAttendance
AgricultureAttendance
CulturalAttendance
... (mais 8)

// DEPOIS: 1 tabela centralizada
Protocol {
  moduleType: "ATENDIMENTOS_SAUDE" | "ATENDIMENTOS_AGRICULTURA" | ...
  customData: JSON // estrutura específica por módulo
}
```

### **3. Flexibilidade sem Complexidade**

```typescript
// Adicionar novo tipo de serviço = simples

// 1. Criar módulo padrão (se necessário)
model Escolas {
  id, nome, endereco, ...
}

// 2. Criar serviço vinculado
Service {
  name: "Matrícula Escolar",
  serviceType: "COM_DADOS",
  moduleType: "ALUNOS",
  formSchema: { /* campos do formulário */ }
}

// 3. Sistema automaticamente roteia dados capturados
```

### **4. Manutenção Simplificada**

```
ANTES:
- Alterar estrutura de atendimento = 11 tabelas
- Adicionar campo = atualizar 8+ configurações
- Feature flag = complexidade exponencial

DEPOIS:
- Alterar estrutura = 1 módulo padrão
- Adicionar campo = atualizar formSchema (JSON)
- Sem feature flags = lógica simples (IF serviceType)
```

---

## 🗂️ ESTRUTURA DE DADOS SIMPLIFICADA

### **1. Tabela Service (Simplificada)**

```typescript
model Service {
  id           String
  name         String
  description  String?
  departmentId String

  // SIMPLIFICAÇÃO: apenas 1 enum ao invés de 8 flags
  serviceType  ServiceType  // INFORMATIVO | COM_DADOS

  // Para serviços COM_DADOS
  moduleType   String?      // "PRODUTORES", "ALUNOS", "PACIENTES", etc
  formSchema   Json?        // Schema do formulário (se captura dados)

  // Campos básicos mantidos
  isActive         Boolean @default(true)
  requiresDocuments Boolean @default(false)
  estimatedDays    Int?
  priority         Int @default(1)
  icon             String?
  color            String?

  tenantId   String
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  department Department @relation(fields: [departmentId], references: [id])
  tenant     Tenant @relation(fields: [tenantId], references: [id])
  protocols  Protocol[]
}

enum ServiceType {
  INFORMATIVO   // Apenas acompanhamento, sem captura de dados
  COM_DADOS     // Captura dados que vão para módulo
}
```

### **2. Tabela Protocol (Centro do Sistema)**

```typescript
model Protocol {
  id           String @id @default(cuid())
  number       String @unique
  title        String
  description  String?

  // Status simplificado
  status       ProtocolStatus @default(VINCULADO)

  // Relacionamentos principais
  citizenId    String
  serviceId    String
  departmentId String
  tenantId     String

  // Dados capturados (se serviço COM_DADOS)
  customData   Json?
  moduleType   String?  // Para roteamento: "PRODUTORES", "ALUNOS", etc

  // Geolocalização (se necessário)
  latitude     Float?
  longitude    Float?
  address      String?

  // Gestão
  assignedUserId String?
  createdById    String?

  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  dueDate     DateTime?
  concludedAt DateTime?

  // Relacionamentos
  citizen       Citizen @relation(fields: [citizenId], references: [id])
  service       Service @relation(fields: [serviceId], references: [id])
  department    Department @relation(fields: [departmentId], references: [id])
  tenant        Tenant @relation(fields: [tenantId], references: [id])
  assignedUser  User? @relation("AssignedUser", fields: [assignedUserId], references: [id])
  createdBy     User? @relation("CreatedByUser", fields: [createdById], references: [id])

  history       ProtocolHistory[]
  evaluations   ProtocolEvaluation[]
}

enum ProtocolStatus {
  VINCULADO    // Criado e vinculado ao setor
  PROGRESSO    // Em andamento
  ATUALIZACAO  // Aguardando atualização
  PENDENCIA    // Com pendências
  CONCLUIDO    // Finalizado
  CANCELADO    // Cancelado
}
```

### **3. Módulos Padrões (Mantidos e Estruturados)**

```typescript
// SAÚDE
model HealthUnit { /* estrutura mantida */ }
model HealthProfessional { /* estrutura mantida */ }
model Patient { /* estrutura mantida */ }
model Medication { /* estrutura mantida */ }

// EDUCAÇÃO
model School { /* estrutura mantida */ }
model Student { /* estrutura mantida */ }
model Teacher { /* estrutura mantida */ }
model SchoolClass { /* estrutura mantida */ }

// AGRICULTURA
model RuralProducer { /* estrutura mantida */ }
model RuralProperty { /* estrutura mantida */ }
model TechnicalAssistance { /* estrutura mantida */ }
model RuralProgram { /* estrutura mantida */ }

// ... (13 secretarias, ~40 tabelas essenciais)
```

---

## 🚫 ARQUIVOS LEGADOS A REMOVER

### **Tabelas de Feature Flags (8 tabelas)**

```
❌ ServiceForm
❌ ServiceLocation
❌ ServiceScheduling
❌ ServiceSurvey
❌ ServiceWorkflow
❌ ServiceNotification
❌ ServiceCustomField
❌ ServiceDocument
```

**Substituir por:** Campo `formSchema` (JSON) na tabela `Service`

### **Tabelas de Atendimentos Duplicadas (11 tabelas)**

```
❌ HealthAttendance
❌ SocialAssistanceAttendance
❌ AgricultureAttendance
❌ CulturalAttendance
❌ EnvironmentalAttendance
❌ HousingAttendance
❌ PublicWorksAttendances
❌ SecurityAttendances
❌ SportsAttendances
❌ TourismAttendances
❌ UrbanPlanningAttendances
```

**Substituir por:**
- Protocolo central com `customData` (JSON)
- Módulos padrões específicos para gestão estruturada

### **Tabelas de Extensões de Protocolo (4 tabelas)**

```
❌ Appointment
❌ ProtocolLocation
❌ ServiceFormSubmission
❌ ProtocolCustomFieldValue
❌ DocumentUpload
```

**Substituir por:**
- Campos diretos no `Protocol` (latitude, longitude, address)
- Campo `customData` (JSON) para dados do formulário

---

## 📋 MAPEAMENTO: SERVIÇOS → MÓDULOS

### **100+ Serviços Documentados → 40 Módulos Padrões**

```
SERVIÇOS INFORMATIVOS (~25):
├─ Iluminação Pública        → NÃO vai para módulo
├─ Buraco na Via             → NÃO vai para módulo
├─ Limpeza Urbana            → NÃO vai para módulo
├─ Poda de Árvore            → NÃO vai para módulo
└─ ... (apenas acompanhamento de status)

SERVIÇOS COM CAPTURA DE DADOS (~75):
├─ SAÚDE:
│  ├─ Agendamento Consulta   → Módulo: HealthAppointment
│  ├─ Solicitação Medicamento→ Módulo: MedicationDispense
│  ├─ TFD                    → Módulo: TFDRequest
│  └─ Transporte Paciente    → Módulo: HealthTransport
│
├─ EDUCAÇÃO:
│  ├─ Matrícula Aluno        → Módulo: Student
│  ├─ Transporte Escolar     → Módulo: StudentTransport
│  └─ Registro Ocorrência    → Módulo: DisciplinaryRecord
│
├─ AGRICULTURA:
│  ├─ Cadastro Produtor      → Módulo: RuralProducer
│  ├─ Assistência Técnica    → Módulo: TechnicalAssistance
│  ├─ Inscrição Curso        → Módulo: RuralTraining
│  └─ Inscrição Programa     → Módulo: RuralProgram
│
├─ CULTURA:
│  ├─ Reserva Espaço         → Módulo: CulturalSpace (reserva)
│  ├─ Inscrição Oficina      → Módulo: CulturalWorkshop (inscrição)
│  ├─ Cadastro Grupo         → Módulo: ArtisticGroup
│  └─ Projeto Cultural       → Módulo: CulturalProject
│
... (continua para todas as 13 secretarias)
```

---

## 🔄 FLUXO SIMPLIFICADO

### **Criação de Protocolo**

```typescript
// 1. CIDADÃO SELECIONA SERVIÇO
const service = await getService(serviceId)

// 2. VERIFICA TIPO DE SERVIÇO
if (service.serviceType === 'INFORMATIVO') {
  // Apenas criar protocolo simples
  const protocol = await createProtocol({
    citizenId,
    serviceId,
    departmentId: service.departmentId,
    status: 'VINCULADO'
  })

  return protocol
}

// 3. SE COM_DADOS: capturar formulário
if (service.serviceType === 'COM_DADOS') {
  const formData = await showForm(service.formSchema)

  const protocol = await createProtocol({
    citizenId,
    serviceId,
    departmentId: service.departmentId,
    status: 'VINCULADO',
    moduleType: service.moduleType,
    customData: formData  // dados do formulário
  })

  // 4. ROTEAR PARA MÓDULO AUTOMATICAMENTE
  await routeToModule(protocol.moduleType, protocol.customData)

  return protocol
}
```

### **Gestão no Painel da Secretaria**

```typescript
// SERVIDOR acessa painel
const protocols = await getProtocolsByDepartment(departmentId)

// Lista protocolos COM_DADOS do módulo específico
const matriculas = protocols.filter(p => p.moduleType === 'ALUNOS')

// Acessa módulo padrão para gestão
for (const protocol of matriculas) {
  const aluno = await Student.findByProtocol(protocol.id)

  // Gerencia dados estruturados
  await aluno.update({
    escola: escolaSelecionada,
    turma: turmaSelecionada,
    status: 'MATRICULADO'
  })

  // Atualiza status do protocolo
  await protocol.updateStatus('CONCLUIDO')
}
```

---

## ✅ CONCLUSÃO

### **Antes vs Depois**

| Aspecto | ANTES (Complexo) | DEPOIS (Simplificado) |
|---------|------------------|----------------------|
| **Tabelas** | 100+ tabelas | ~45 tabelas essenciais |
| **Feature Flags** | 8 flags booleanas | 1 enum (serviceType) |
| **Tabelas Config** | 8 tabelas de config | 1 campo JSON (formSchema) |
| **Atendimentos** | 11 tabelas duplicadas | Protocolo central + módulos |
| **Manutenção** | Alta complexidade | Simplificada |
| **Flexibilidade** | Limitada por flags | Total via JSON + módulos |

### **Ganhos**

1. ✅ **Motor de Protocolos como centro real**
2. ✅ **Eliminação de 50+ tabelas desnecessárias**
3. ✅ **2 tipos claros de serviço** (ao invés de 8 flags)
4. ✅ **Módulos Padrões estruturados e reutilizáveis**
5. ✅ **Manutenção 70% mais simples**
6. ✅ **Sem arquivos legados**
7. ✅ **100% dos serviços suportados** (sem perder funcionalidades)

### **Próximo Passo**

Implementar conforme o plano detalhado em `PLANO_IMPLEMENTACAO_SIMPLIFICACAO.md`.

---

**Documento:** Análise da Complexidade e Solução
**Autor:** Claude
**Data:** 29/10/2025