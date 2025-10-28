# 📘 Documentação Completa - Piloto Agricultura

## 🎯 Objetivo do Documento

Este documento registra **TODO** o processo de implementação do Piloto Agricultura, incluindo:
- Arquitetura implementada
- Erros cometidos e suas correções
- Checklist de validação de schemas
- Guia para replicação em outras secretarias
- Boas práticas aprendidas

---

## 📋 Índice

1. [Visão Geral da Arquitetura](#1-visão-geral-da-arquitetura)
2. [Estrutura de Arquivos Implementados](#2-estrutura-de-arquivos-implementados)
3. [Erros Cometidos e Correções](#3-erros-cometidos-e-correções)
4. [Checklist de Validação Obrigatório](#4-checklist-de-validação-obrigatório)
5. [Guia de Replicação Passo a Passo](#5-guia-de-replicação-passo-a-passo)
6. [Detalhamento dos Componentes](#6-detalhamento-dos-componentes)
7. [Fluxo de Dados Completo](#7-fluxo-de-dados-completo)
8. [Boas Práticas](#8-boas-práticas)

---

## 1. Visão Geral da Arquitetura

### 1.1 Arquitetura Implementada (100%)

```
┌─────────────────────────────────────────────────────────────┐
│                    PILOTO AGRICULTURA                        │
│                  Arquitetura Completa 100%                   │
└─────────────────────────────────────────────────────────────┘

Frontend:
  ┌─────────────────────────────────────────────────────────┐
  │ Page: /admin/secretarias/agricultura/page.tsx           │
  │   - Consome dados dinâmicos via hooks                   │
  │   - Renderiza serviços com badge "Motor" quando tem     │
  │     moduleType configurado                               │
  │   - Quick actions funcionais                             │
  └─────────────────────────────────────────────────────────┘
                         ↓
  ┌─────────────────────────────────────────────────────────┐
  │ Modal: NewProtocolModal.tsx (507 linhas)                │
  │   - Wizard de 3 passos: Service → Citizen → Form        │
  │   - Busca template dinamicamente baseado no serviço      │
  │   - Valida cada etapa antes de avançar                   │
  └─────────────────────────────────────────────────────────┘
                         ↓
  ┌─────────────────────────────────────────────────────────┐
  │ Component: DynamicServiceForm.tsx (233 linhas)           │
  │   - Renderiza formulário dinâmico de FormField[]         │
  │   - Suporta 8 tipos de campo                             │
  │   - Validação por campo                                   │
  └─────────────────────────────────────────────────────────┘
                         ↓
  ┌─────────────────────────────────────────────────────────┐
  │ Hooks: useAgricultureServices + useAgricultureStats      │
  │   - React Query com cache                                │
  │   - Auto-refresh (stats: 5min)                           │
  └─────────────────────────────────────────────────────────┘
                         ↓
                    API REQUEST
                         ↓
Backend:
  ┌─────────────────────────────────────────────────────────┐
  │ Route: POST /api/admin/secretarias/agricultura/protocols│
  │   - Valida dados recebidos                               │
  │   - Busca Service com moduleEntity                       │
  │   - Gera número de protocolo único                       │
  └─────────────────────────────────────────────────────────┘
                         ↓
  ┌─────────────────────────────────────────────────────────┐
  │ Transaction Prisma: Cria Protocol + Entidade             │
  │   1. Cria Protocol (customData, title, description)      │
  │   2. Executa Module Handler baseado em moduleEntity:     │
  │      - TechnicalAssistance                               │
  │      - SeedDistribution                                  │
  │      - SoilAnalysis                                      │
  │      - FarmerMarketRegistration                          │
  │   3. Vincula Protocol.number à entidade especializada    │
  └─────────────────────────────────────────────────────────┘
                         ↓
  ┌─────────────────────────────────────────────────────────┐
  │ Seeds: agriculture-templates.ts                          │
  │   - 4 ServiceTemplates completos                         │
  │   - formSchema com 8+ campos cada                        │
  │   - fieldMapping configurado                             │
  │   - moduleType: 'agriculture'                            │
  │   - moduleEntity: nome da entidade Prisma                │
  └─────────────────────────────────────────────────────────┘
                         ↓
                   DATABASE (Prisma)
  ┌─────────────────────────────────────────────────────────┐
  │ Models Utilizados:                                       │
  │   - Protocol (customData: Json, title, description)      │
  │   - Service (moduleType, moduleEntity, templateId)       │
  │   - ServiceTemplate (formSchema, fieldMapping)           │
  │   - TechnicalAssistance (protocol unique)                │
  │   - SeedDistribution (protocol, items: Json)             │
  │   - SoilAnalysis (protocol, propertyArea)                │
  │   - FarmerMarketRegistration (protocol, products: Json)  │
  └─────────────────────────────────────────────────────────┘
```

### 1.2 Conceitos-Chave

**Module Handler**: Sistema que vincula Service → Entidade Especializada
- `moduleType`: Tipo do módulo (ex: 'agriculture', 'health', 'education')
- `moduleEntity`: Nome exato da entidade Prisma (ex: 'TechnicalAssistance')
- Execução condicional baseada em `service.moduleEntity`

**ServiceTemplate**: Template com schema de formulário
- `formSchema`: Define campos do formulário dinamicamente
- `fieldMapping`: Mapeia campos do form → campos da entidade
- Versionamento suportado

**Dynamic Form**: Formulário gerado em runtime
- Baseado em `FormField[]` do template
- Suporta: text, number, email, date, select, textarea, multiselect, checkbox
- Validação client-side

**Protocol Engine**: Sistema de protocolos
- Protocol número único gerado automaticamente
- `customData`: Dados do formulário (Json)
- `title` e `description`: Obrigatórios
- Status tracking completo

---

## 2. Estrutura de Arquivos Implementados

### 2.1 Backend

```
digiurban/backend/
├── src/
│   ├── routes/
│   │   └── secretarias-agricultura.ts ⭐ PRINCIPAL
│   │       ├── GET /stats (estatísticas em tempo real)
│   │       └── POST /protocols (criação de protocolo + entidade)
│   └── seeds/
│       └── agriculture-templates.ts ⭐ TEMPLATES
│           ├── AGR_ASSISTENCIA_TECNICA_001
│           ├── AGR_SEMENTES_001
│           ├── AGR_ANALISE_SOLO_001
│           └── AGR_FEIRA_PRODUTOR_001
└── prisma/
    └── schema.prisma (modelos utilizados)
        ├── Protocol
        ├── Service
        ├── ServiceTemplate
        ├── TechnicalAssistance
        ├── SeedDistribution
        ├── SoilAnalysis
        └── FarmerMarketRegistration
```

### 2.2 Frontend

```
digiurban/frontend/
├── app/
│   └── admin/
│       └── secretarias/
│           └── agricultura/
│               ├── layout.tsx (simplificado - apenas children)
│               └── page.tsx ⭐ PÁGINA PRINCIPAL (374 linhas)
├── components/
│   └── admin/
│       ├── NewProtocolModal.tsx ⭐ MODAL (507 linhas)
│       └── DynamicServiceForm.tsx ⭐ FORM (233 linhas)
├── hooks/
│   └── api/
│       └── agriculture/
│           ├── useAgricultureServices.ts
│           └── useAgricultureStats.ts
└── components/
    └── ui/
        └── skeleton.tsx (componente de loading)
```

---

## 3. Erros Cometidos e Correções

### ⚠️ ERRO 1: Uso de `UserRole.OPERATOR` (inexistente)

**Arquivo**: `secretarias-agricultura.ts`
**Linha**: Endpoint GET /stats

**Erro**:
```typescript
router.get('/stats', requireMinRole(UserRole.OPERATOR), async (req, res) => {
  // UserRole.OPERATOR NÃO EXISTE no enum
});
```

**Causa Raiz**:
- Não consultei o schema Prisma antes de usar o enum
- Assumi que OPERATOR existia baseado em lógica de negócio

**Correção**:
```typescript
router.get('/stats', requireMinRole(UserRole.USER), async (req, res) => {
  // UserRole.USER é o valor correto do enum
});
```

**Aprendizado**:
✅ **SEMPRE** consultar `schema.prisma` para valores de enum
✅ Usar `Grep` ou `Read` no schema antes de usar enums
✅ Nunca assumir valores de enum

---

### ⚠️ ERRO 2: Status de Protocol com valores inválidos

**Arquivo**: `secretarias-agricultura.ts`
**Linha**: Endpoint GET /stats

**Erro**:
```typescript
const pending = await prisma.protocol.count({
  where: {
    status: 'pending' // String literal inválida
  }
});
```

**Causa Raiz**:
- Usei strings literais ('pending', 'approved', 'rejected')
- Schema Prisma usa enum ProtocolStatus com valores diferentes

**Correção**:
```typescript
const pending = await prisma.protocol.count({
  where: {
    status: ProtocolStatus.VINCULADO // Enum correto
  }
});
```

**Valores corretos do enum ProtocolStatus**:
- `VINCULADO`
- `PENDENCIA`
- `CONCLUIDO`
- `CANCELADO`

**Aprendizado**:
✅ Verificar TODOS os valores de enum no schema
✅ Importar enums do Prisma Client
✅ Nunca usar string literals para status

---

### ⚠️ ERRO 3: Campo `data` no Protocol (não existe)

**Arquivo**: `secretarias-agricultura.ts`
**Linha**: POST /protocols - criação de Protocol

**Erro**:
```typescript
const protocol = await tx.protocol.create({
  data: {
    number: protocolNumber,
    data: formData, // Campo 'data' NÃO EXISTE
    // ...
  }
});
```

**Causa Raiz**:
- Não li o modelo Protocol no schema.prisma
- Assumi que campo de dados Json seria chamado `data`

**Schema Real**:
```prisma
model Protocol {
  customData   Json?      // Campo correto para dados customizados
  title        String     // Obrigatório
  description  String?    // Opcional mas recomendado
  // ...
}
```

**Correção**:
```typescript
const protocol = await tx.protocol.create({
  data: {
    number: protocolNumber,
    title: service.name,                                    // ADICIONADO
    description: formData.description || service.description || '', // ADICIONADO
    customData: formData,                                   // CORRIGIDO
    // ...
  }
});
```

**Aprendizado**:
✅ LER o modelo completo antes de criar registros
✅ Verificar campos obrigatórios (title é required)
✅ `customData` é o nome correto para dados Json customizados

---

### ⚠️ ERRO 4: Campos inexistentes em SeedDistribution

**Arquivo**: `secretarias-agricultura.ts`
**Linha**: POST /protocols - criação de SeedDistribution

**Erro**:
```typescript
const distribution = await tx.seedDistribution.create({
  data: {
    seedType: formData.seedType,             // ❌ NÃO EXISTE
    requestedAmount: parseFloat(formData.requestedAmount), // ❌ NÃO EXISTE
    plantingArea: parseFloat(formData.plantingArea),       // ❌ NÃO EXISTE
    requestDate: new Date(),                 // ❌ NÃO EXISTE
  }
});
```

**Schema Real**:
```prisma
model SeedDistribution {
  producerName     String
  producerCpf      String
  producerPhone    String
  propertyLocation String
  propertyArea     Float?
  requestType      String   // "seeds", "seedlings", "both"
  items            Json     // Array [{type, species, quantity}]
  purpose          String   // "commercial", "subsistence", "agroforestry"
  status           String   @default("pending")
  // NÃO TEM: requestDate
}
```

**Correção**:
```typescript
const distribution = await tx.seedDistribution.create({
  data: {
    tenantId,
    protocol: protocol.number,
    serviceId: service.id,
    source: 'service',
    producerName: formData.producerName,
    producerCpf: formData.producerCpf,
    producerPhone: formData.producerPhone,
    propertyLocation: formData.propertyLocation || 'Não informado',
    propertyArea: formData.propertyArea ? parseFloat(formData.propertyArea) : null,
    requestType: formData.requestType || 'seeds',     // ✅ CORRETO
    items: formData.items || [],                       // ✅ CORRETO (Json)
    purpose: formData.purpose || 'subsistence',        // ✅ CORRETO
    status: 'pending',
    // ✅ SEM requestDate
  }
});
```

**Aprendizado**:
✅ Ler **TODOS** os campos do modelo antes de usar
✅ `items` é Json, não campos individuais
✅ Campos de data não existem em todos os modelos
✅ Usar valores padrão para campos opcionais

---

### ⚠️ ERRO 5: Campo `sampleArea` em SoilAnalysis (não existe)

**Arquivo**: `secretarias-agricultura.ts`
**Linha**: POST /protocols - criação de SoilAnalysis

**Erro**:
```typescript
const analysis = await tx.soilAnalysis.create({
  data: {
    sampleArea: parseFloat(formData.sampleArea),  // ❌ Campo errado
    intendedCrop: formData.intendedCrop,          // ❌ Nome errado
    requestDate: new Date(),                       // ❌ NÃO EXISTE
  }
});
```

**Schema Real**:
```prisma
model SoilAnalysis {
  producerName  String
  producerCpf   String
  producerPhone String        // ⚠️ OBRIGATÓRIO (estava faltando)
  propertyLocation String
  propertyArea     Float?     // ✅ Nome correto (não sampleArea)
  analysisType    String      // "basic", "complete", "specific"
  purpose         String      // ⚠️ OBRIGATÓRIO (estava faltando)
  cropIntended    String?     // ✅ Nome correto (não intendedCrop)
  status          String      @default("pending")
  // NÃO TEM: requestDate
}
```

**Correção**:
```typescript
const analysis = await tx.soilAnalysis.create({
  data: {
    tenantId,
    protocol: protocol.number,
    serviceId: service.id,
    source: 'service',
    producerName: formData.producerName,
    producerCpf: formData.producerCpf,
    producerPhone: formData.producerPhone || 'Não informado',  // ✅ ADICIONADO
    propertyLocation: formData.propertyLocation || 'Não informado',
    propertyArea: formData.propertyArea ? parseFloat(formData.propertyArea) : null, // ✅ CORRIGIDO
    analysisType: formData.analysisType || 'basic',
    purpose: formData.purpose || 'Análise de solo',            // ✅ ADICIONADO
    cropIntended: formData.cropIntended || null,               // ✅ CORRIGIDO
    status: 'pending',
    // ✅ SEM requestDate
  }
});
```

**Aprendizado**:
✅ Nome dos campos: `propertyArea` não `sampleArea`
✅ Nome dos campos: `cropIntended` não `intendedCrop`
✅ Campos obrigatórios: `producerPhone` e `purpose`
✅ Sempre verificar campos required vs optional

---

### ⚠️ ERRO 6: Campos errados em FarmerMarketRegistration

**Arquivo**: `secretarias-agricultura.ts`
**Linha**: POST /protocols - criação de FarmerMarketRegistration

**Erro**:
```typescript
const registration = await tx.farmerMarketRegistration.create({
  data: {
    productTypes: formData.productTypes,      // ❌ Nome errado (é 'products')
    standSize: formData.standSize,            // ❌ NÃO EXISTE
    preferredDay: formData.preferredDay,      // ❌ NÃO EXISTE
    status: 'active',                         // ❌ Status inicial errado
    registrationDate: new Date(),             // ❌ NÃO EXISTE
  }
});
```

**Schema Real**:
```prisma
model FarmerMarketRegistration {
  producerName     String
  producerCpf      String
  producerPhone    String
  producerEmail    String?
  propertyLocation String
  propertyArea     Float?
  products         Json      // ✅ Array de produtos (não productTypes)
  productionType   String    // "organic", "conventional", "agroecological"
  hasOrganicCert   Boolean   @default(false)
  certificationId  String?
  status           String    @default("pending")  // ✅ Inicia como "pending"
  registrationNumber String? @unique
  needsStall       Boolean   @default(false)
  stallPreference  String?
  documents        Json?
  // NÃO TEM: standSize, preferredDay, registrationDate
}
```

**Correção**:
```typescript
const registration = await tx.farmerMarketRegistration.create({
  data: {
    tenantId,
    protocol: protocol.number,
    serviceId: service.id,
    source: 'service',
    producerName: formData.producerName,
    producerCpf: formData.producerCpf,
    producerPhone: formData.producerPhone,
    producerEmail: formData.producerEmail || null,                 // ✅ ADICIONADO
    propertyLocation: formData.propertyLocation || 'Não informado',// ✅ ADICIONADO
    propertyArea: formData.propertyArea ? parseFloat(formData.propertyArea) : null, // ✅ ADICIONADO
    products: formData.products || [],                             // ✅ CORRIGIDO
    productionType: formData.productionType || 'conventional',     // ✅ ADICIONADO
    hasOrganicCert: formData.hasOrganicCert || false,              // ✅ ADICIONADO
    needsStall: formData.needsStall || false,                      // ✅ ADICIONADO
    stallPreference: formData.stallPreference || null,             // ✅ ADICIONADO
    status: 'pending',                                             // ✅ CORRIGIDO
    // ✅ SEM registrationDate
  }
});
```

**Aprendizado**:
✅ Nome correto: `products` (Json) não `productTypes`
✅ Status inicial: `'pending'` não `'active'`
✅ Campos obrigatórios de propriedade: `propertyLocation`, `propertyArea`
✅ Flags booleanas: `hasOrganicCert`, `needsStall`
✅ Não existe campo de data automático

---

### ⚠️ ERRO 7: Não validar quantidade de campos `_sum`

**Arquivo**: `secretarias-agricultura.ts`
**Linha**: GET /stats - agregação de SeedDistribution

**Erro**:
```typescript
const seedStats = await prisma.seedDistribution.aggregate({
  _sum: {
    quantity: true  // ❌ Campo 'quantity' não existe
  }
});
```

**Causa Raiz**:
- Assumi que teria campo `quantity` direto
- Schema usa Json `items` com array de quantidades

**Correção**:
```typescript
const seedStats = await prisma.seedDistribution.aggregate({
  _count: {
    id: true  // ✅ Apenas conta registros
  }
});
// Quantidades estão dentro de items (Json),
// não há campo quantity direto para somar
```

**Aprendizado**:
✅ Verificar estrutura de campos Json antes de agregar
✅ Nem todos os dados podem ser agregados diretamente
✅ Usar `_count` quando `_sum` não for aplicável

---

## 4. Checklist de Validação Obrigatório

### ✅ CHECKLIST PRÉ-IMPLEMENTAÇÃO

Use este checklist **ANTES** de começar a implementar qualquer módulo:

#### 1. Análise do Schema Prisma

```bash
# Localizar os modelos relevantes
grep -n "model NomeDoModelo" prisma/schema.prisma

# Ler o modelo completo (substituir LINHA_INICIAL)
# Exemplo: se grep retornou linha 2946, ler 100 linhas a partir daí
```

**Para cada modelo especializado, verificar**:

- [ ] Lista completa de campos (nome + tipo)
- [ ] Campos obrigatórios vs opcionais (String vs String?)
- [ ] Campos Json (estrutura interna documentada?)
- [ ] Campos de data (quais existem? formato?)
- [ ] Valores default (status, booleanos, etc)
- [ ] Campos unique (@unique, @@unique)
- [ ] Relações (fields, references)

**Exemplo de verificação**:
```prisma
model SeedDistribution {
  id               String   @id @default(cuid())
  tenantId         String   // ✅ Obrigatório
  producerName     String   // ✅ Obrigatório
  producerCpf      String   // ✅ Obrigatório
  producerPhone    String   // ✅ Obrigatório
  propertyLocation String   // ✅ Obrigatório
  propertyArea     Float?   // ⚠️ OPCIONAL
  requestType      String   // ✅ Obrigatório - valores: "seeds", "seedlings", "both"
  items            Json     // ✅ Obrigatório - Array [{type, species, quantity}]
  purpose          String   // ✅ Obrigatório - valores: "commercial", "subsistence", "agroforestry"
  status           String   @default("pending") // ✅ Default "pending"
  protocol         String?  // ⚠️ OPCIONAL (será preenchido)
  serviceId        String?  // ⚠️ OPCIONAL
  source           String   @default("manual") // ✅ Default "manual"
  createdAt        DateTime @default(now()) // ✅ Auto
  updatedAt        DateTime @updatedAt // ✅ Auto
}
```

#### 2. Verificação de Enums

```bash
# Buscar todos os enums do sistema
grep -n "enum " prisma/schema.prisma
```

**Para cada enum usado, verificar**:

- [ ] Nome exato do enum
- [ ] Todos os valores possíveis
- [ ] Importação no código TypeScript

**Exemplo**:
```prisma
enum UserRole {
  ADMIN
  USER
  SUPER_ADMIN
}
// ❌ NÃO EXISTE: OPERATOR
```

#### 3. Análise do Model Protocol

**SEMPRE verificar**:

- [ ] `customData` (não `data`)
- [ ] `title` é obrigatório
- [ ] `description` é opcional
- [ ] Campo `number` (string, não numérico)
- [ ] Status usa enum ProtocolStatus

```prisma
model Protocol {
  id            String         @id @default(cuid())
  number        String         @unique  // ✅ String, não Int
  title         String         // ✅ OBRIGATÓRIO
  description   String?        // ⚠️ OPCIONAL
  customData    Json?          // ✅ Dados customizados (não 'data')
  status        ProtocolStatus @default(VINCULADO)
  // ...
}
```

#### 4. Planejamento de Templates

Antes de criar `ServiceTemplate`, documentar:

- [ ] Nome do template (CODE)
- [ ] moduleType correto
- [ ] moduleEntity (nome EXATO da entidade Prisma)
- [ ] Lista completa de campos do formulário
- [ ] Tipos de cada campo
- [ ] Validações (required, min, max, pattern)
- [ ] Mapeamento formField → prismaField

**Exemplo de documentação**:
```typescript
// Template: AGR_SEMENTES_001
// moduleEntity: 'SeedDistribution'
//
// Mapeamento:
// - producerName (form) → producerName (prisma) ✅
// - producerCpf (form) → producerCpf (prisma) ✅
// - producerPhone (form) → producerPhone (prisma) ✅
// - propertyLocation (form) → propertyLocation (prisma) ✅
// - propertyArea (form) → propertyArea (prisma) ✅
// - requestType (form) → requestType (prisma) ✅
// - items (form) → items (prisma) ✅ [Json]
// - purpose (form) → purpose (prisma) ✅
```

#### 5. Validação de Rotas Backend

- [ ] Enum UserRole correto no middleware
- [ ] Transaction Prisma para operações múltiplas
- [ ] Try-catch com rollback automático
- [ ] Validação de campos obrigatórios
- [ ] Geração de número de protocolo
- [ ] Verificação de `service.moduleEntity` antes de usar
- [ ] Mapeamento correto de todos os campos
- [ ] Retorno consistente (success, data, message)

---

### ✅ CHECKLIST PÓS-IMPLEMENTAÇÃO

Após implementar, validar:

#### 1. Compilação TypeScript

```bash
cd digiurban/backend
npx tsc --noEmit

cd digiurban/frontend
npx tsc --noEmit
```

- [ ] Zero erros de TypeScript no backend
- [ ] Zero erros de TypeScript no frontend (arquivos do módulo)

#### 2. Validação de Dados

- [ ] Todos os campos obrigatórios têm valores
- [ ] Campos opcionais têm fallback (`|| null`, `|| 'default'`)
- [ ] Campos numéricos usam `parseFloat()` ou `parseInt()`
- [ ] Campos Json são arrays/objects válidos
- [ ] Status iniciais corretos

#### 3. Testes Manuais

- [ ] Criar protocolo pelo frontend
- [ ] Verificar criação no banco (Protocol + Entidade)
- [ ] Validar vínculo (Protocol.number === Entidade.protocol)
- [ ] Testar estatísticas (GET /stats)
- [ ] Verificar renderização de badges "Motor"

---

## 5. Guia de Replicação Passo a Passo

### FASE 1: ANÁLISE (1-2 horas)

#### Passo 1.1: Identificar Modelos Prisma

```bash
# Exemplo para Saúde
cd digiurban/backend
grep -n "model.*Health" prisma/schema.prisma
grep -n "model.*Medical" prisma/schema.prisma
grep -n "model.*Vaccination" prisma/schema.prisma
```

Documentar:
- Nome exato de cada modelo
- Linha no schema.prisma
- Propósito do modelo

#### Passo 1.2: Ler Cada Modelo Completamente

Para **CADA** modelo identificado:

```typescript
// Template de análise
/**
 * MODEL: [Nome]
 * LINHA: [Número]
 *
 * CAMPOS OBRIGATÓRIOS:
 * - campo1: tipo (obrigatório porque não tem ?)
 * - campo2: tipo
 *
 * CAMPOS OPCIONAIS:
 * - campo3?: tipo (opcional - tem ?)
 * - campo4?: tipo
 *
 * CAMPOS JSON:
 * - campoJson: Json (estrutura: [{...}])
 *
 * CAMPOS DATA:
 * - createdAt: DateTime @default(now())
 * - updatedAt: DateTime @updatedAt
 * - campoData?: DateTime (opcional)
 *
 * DEFAULTS:
 * - status: String @default("pending")
 * - isActive: Boolean @default(true)
 *
 * RELACIONAMENTOS:
 * - protocol: String? (FK para Protocol)
 * - serviceId: String?
 *
 * OBSERVAÇÕES:
 * - [Qualquer peculiaridade]
 */
```

#### Passo 1.3: Documentar Enums

```bash
grep -A 10 "enum UserRole" prisma/schema.prisma
grep -A 10 "enum ProtocolStatus" prisma/schema.prisma
# Adicionar outros enums conforme necessário
```

Criar tabela:
```markdown
| Enum | Valores |
|------|---------|
| UserRole | ADMIN, USER, SUPER_ADMIN |
| ProtocolStatus | VINCULADO, PENDENCIA, CONCLUIDO, CANCELADO |
```

---

### FASE 2: BACKEND (3-4 horas)

#### Passo 2.1: Criar Arquivo de Templates

**Arquivo**: `digiurban/backend/src/seeds/[secretaria]-templates.ts`

Estrutura base:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const [SECRETARIA]Templates = [
  {
    code: '[SECRETARIA]_[SERVICO]_001',
    name: 'Nome do Serviço',
    description: 'Descrição completa',
    category: 'NOME_CATEGORIA',

    // ⚠️ CRÍTICO: Nome EXATO do modelo Prisma
    moduleType: '[secretaria]',
    moduleEntity: 'NomeExatoDoModeloPrisma',

    // Schema do formulário
    formSchema: {
      fields: [
        {
          name: 'campo1',
          label: 'Campo 1',
          type: 'text', // text, number, email, date, select, textarea, multiselect, checkbox
          required: true,
          placeholder: 'Digite...',
          validation: {
            minLength: 3,
            maxLength: 100,
          },
        },
        {
          name: 'campo2',
          label: 'Campo 2',
          type: 'select',
          required: true,
          options: [
            { value: 'opcao1', label: 'Opção 1' },
            { value: 'opcao2', label: 'Opção 2' },
          ],
        },
        // ... mais campos
      ],
    },

    // ⚠️ CRÍTICO: Mapear form → prisma EXATAMENTE
    fieldMapping: {
      campo1: 'campo1', // formField: prismaField
      campo2: 'campo2',
    },

    // Campos com valores padrão
    defaultFields: {
      status: 'pending',
      source: 'service',
    },

    isActive: true,
    estimatedTime: 30,
    requiredDocuments: [],
  },
  // ... mais templates
];

export async function seed[Secretaria]Templates() {
  for (const template of [SECRETARIA]Templates) {
    await prisma.serviceTemplate.upsert({
      where: { code: template.code },
      update: template,
      create: template,
    });
  }
  console.log(`✅ ${[SECRETARIA]Templates.length} templates de [Secretaria] criados`);
}
```

**Validação do Template**:
- [ ] `moduleEntity` é nome EXATO do modelo Prisma
- [ ] Todos os campos obrigatórios do Prisma estão no formSchema OU defaultFields
- [ ] fieldMapping está completo
- [ ] Tipos de campo são válidos

#### Passo 2.2: Criar Rota da Secretaria

**Arquivo**: `digiurban/backend/src/routes/secretarias-[nome].ts`

```typescript
import { Router } from 'express';
import { PrismaClient, UserRole, ProtocolStatus } from '@prisma/client';
import { requireMinRole } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// ========== ENDPOINT DE ESTATÍSTICAS ==========
router.get('/stats', requireMinRole(UserRole.USER), async (req, res) => {
  try {
    const { tenantId } = req.user!;

    // ⚠️ Usar ProtocolStatus enum correto
    const totalProtocols = await prisma.protocol.count({
      where: {
        tenantId,
        department: { code: 'NOME_SECRETARIA' },
      },
    });

    const pending = await prisma.protocol.count({
      where: {
        tenantId,
        department: { code: 'NOME_SECRETARIA' },
        status: ProtocolStatus.VINCULADO, // ✅ Enum correto
      },
    });

    // Estatísticas das entidades especializadas
    const entidade1Stats = await prisma.entidade1.aggregate({
      where: { tenantId },
      _count: { id: true },
    });

    // ⚠️ NÃO usar _sum em campos Json ou inexistentes

    return res.json({
      success: true,
      data: {
        totalProtocols,
        pending,
        entidade1Count: entidade1Stats._count?.id || 0,
        // ... mais stats
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar estatísticas',
      error: error.message,
    });
  }
});

// ========== ENDPOINT DE CRIAÇÃO DE PROTOCOLO ==========
router.post('/protocols', requireMinRole(UserRole.USER), async (req, res) => {
  try {
    const { serviceId, citizenData, formData } = req.body;
    const { userId, tenantId } = req.user!;

    // 1. Buscar serviço
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { department: true },
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Serviço não encontrado',
      });
    }

    // 2. Buscar ou criar cidadão
    let citizen = await prisma.citizen.findFirst({
      where: {
        tenantId,
        cpf: citizenData.cpf,
      },
    });

    if (!citizen) {
      citizen = await prisma.citizen.create({
        data: {
          tenantId,
          name: citizenData.name,
          cpf: citizenData.cpf,
          email: citizenData.email,
          phone: citizenData.phone,
          // ... outros campos
        },
      });
    }

    // 3. Gerar número de protocolo
    const year = new Date().getFullYear();
    const lastProtocol = await prisma.protocol.findFirst({
      where: {
        tenantId,
        number: { startsWith: `${year}` },
      },
      orderBy: { createdAt: 'desc' },
    });

    const lastNumber = lastProtocol
      ? parseInt(lastProtocol.number.split('/')[0])
      : 0;
    const protocolNumber = `${String(lastNumber + 1).padStart(6, '0')}/${year}`;

    // 4. Transaction: Protocol + Entidade
    const result = await prisma.$transaction(async (tx) => {
      // 4.1 Criar Protocol
      // ⚠️ ATENÇÃO: customData, title, description
      const protocol = await tx.protocol.create({
        data: {
          number: protocolNumber,
          title: service.name,                                    // ✅ OBRIGATÓRIO
          description: formData.description || service.description || '', // ✅ RECOMENDADO
          serviceId: service.id,
          citizenId: citizen.id,
          tenantId,
          departmentId: service.departmentId,
          status: ProtocolStatus.VINCULADO,                       // ✅ Enum correto
          customData: formData,                                   // ✅ Nome correto
          createdById: userId,
        },
      });

      // 4.2 Executar Module Handler
      let entityId: string | undefined;
      let entityType: string | undefined;

      if (service.moduleEntity) {
        // ⚠️ CRÍTICO: Validar TODOS os campos antes de criar

        if (service.moduleEntity === 'NomeEntidade1') {
          const entidade = await tx.nomeEntidade1.create({
            data: {
              tenantId,
              protocol: protocol.number,
              serviceId: service.id,
              source: 'service',

              // ✅ Mapear TODOS os campos obrigatórios
              campoObrigatorio1: formData.campoObrigatorio1,
              campoObrigatorio2: formData.campoObrigatorio2,

              // ✅ Campos opcionais com fallback
              campoOpcional1: formData.campoOpcional1 || null,
              campoOpcional2: formData.campoOpcional2 || 'default',

              // ✅ Campos numéricos
              campoNumerico: formData.campoNumerico
                ? parseFloat(formData.campoNumerico)
                : null,

              // ✅ Campos Json
              campoJson: formData.campoJson || [],

              // ✅ Status inicial correto
              status: 'pending',

              // ❌ NÃO adicionar campos que não existem no schema
              // requestDate: new Date(), // SE NÃO EXISTIR NO SCHEMA
            },
          });
          entityId = entidade.id;
          entityType = 'NomeEntidade1';
        }
        // ... outros else if para outras entidades
      }

      return {
        protocol,
        entityId,
        entityType,
      };
    });

    return res.status(201).json({
      success: true,
      data: result,
      message: 'Protocolo criado com sucesso',
    });

  } catch (error: any) {
    console.error('Erro ao criar protocolo:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao criar protocolo',
      error: error.message,
    });
  }
});

export default router;
```

**Checklist da Rota**:
- [ ] UserRole correto no middleware
- [ ] Enums importados do @prisma/client
- [ ] Transaction para múltiplas operações
- [ ] Protocol com customData, title, description
- [ ] Validação de service.moduleEntity
- [ ] Todos os campos obrigatórios preenchidos
- [ ] Campos opcionais com fallback
- [ ] Campos numéricos convertidos
- [ ] SEM campos inexistentes
- [ ] Try-catch completo
- [ ] Retorno consistente

#### Passo 2.3: Registrar Rota no app.ts

```typescript
// digiurban/backend/src/app.ts

import secretaria[Nome]Routes from './routes/secretarias-[nome]';

// ... no bloco de rotas
app.use('/api/admin/secretarias/[nome]', secretaria[Nome]Routes);
```

---

### FASE 3: FRONTEND (4-5 horas)

#### Passo 3.1: Criar Hooks de API

**Arquivo**: `digiurban/frontend/hooks/api/[secretaria]/use[Secretaria]Services.ts`

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function use[Secretaria]Services() {
  return useQuery({
    queryKey: ['[secretaria]-services'],
    queryFn: async () => {
      const response = await api.get('/services', {
        params: { departmentCode: 'NOME_SECRETARIA' },
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}
```

**Arquivo**: `digiurban/frontend/hooks/api/[secretaria]/use[Secretaria]Stats.ts`

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function use[Secretaria]Stats() {
  return useQuery({
    queryKey: ['[secretaria]-stats'],
    queryFn: async () => {
      const response = await api.get('/admin/secretarias/[nome]/stats');
      return response.data;
    },
    refetchInterval: 5 * 60 * 1000, // Auto-refresh a cada 5 minutos
  });
}
```

#### Passo 3.2: Simplificar Layout

**Arquivo**: `digiurban/frontend/app/admin/secretarias/[nome]/layout.tsx`

```typescript
export default function [Secretaria]Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
```

#### Passo 3.3: Criar Página Principal

**Arquivo**: `digiurban/frontend/app/admin/secretarias/[nome]/page.tsx`

Estrutura base (adaptar conforme necessário):

```typescript
'use client';

import { useState } from 'react';
import { use[Secretaria]Services } from '@/hooks/api/[secretaria]/use[Secretaria]Services';
import { use[Secretaria]Stats } from '@/hooks/api/[secretaria]/use[Secretaria]Stats';
import { NewProtocolModal } from '@/components/admin/NewProtocolModal';
import { Skeleton } from '@/components/ui/skeleton';

export default function [Secretaria]Page() {
  const [showNewProtocolModal, setShowNewProtocolModal] = useState(false);
  const { data: servicesData, isLoading: servicesLoading } = use[Secretaria]Services();
  const { data: statsData, isLoading: statsLoading } = use[Secretaria]Stats();

  const services = servicesData?.data || [];
  const stats = statsData?.data || {};

  // Filtrar serviços com módulo handler
  const servicesWithModule = services.filter((s: any) => s.moduleType);

  if (servicesLoading || statsLoading) {
    return <Skeleton className="h-screen" />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Secretaria de [Nome]</h1>
        <p className="text-muted-foreground">
          Gestão integrada de serviços da [Nome]
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => setShowNewProtocolModal(true)}
          className="btn btn-primary"
        >
          Novo Protocolo
        </button>
        {/* Outros botões */}
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <h3>Total de Protocolos</h3>
          <p className="text-3xl">{stats.totalProtocols || 0}</p>
        </div>
        {/* Mais cards */}
      </div>

      {/* Serviços */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Serviços Disponíveis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map((service: any) => (
            <div key={service.id} className="card">
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              {service.moduleType && (
                <span className="badge badge-success">Motor</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showNewProtocolModal && (
        <NewProtocolModal
          services={servicesWithModule}
          onClose={() => setShowNewProtocolModal(false)}
          apiEndpoint="/admin/secretarias/[nome]/protocols"
        />
      )}
    </div>
  );
}
```

#### Passo 3.4: Reutilizar Componentes Existentes

**Componentes já implementados** (não recriar):
- `NewProtocolModal` (507 linhas) - ✅ Reutilizável
- `DynamicServiceForm` (233 linhas) - ✅ Reutilizável
- `Skeleton` - ✅ Reutilizável

**Apenas personalizar**:
- Passar `apiEndpoint` correto para o modal
- Passar lista de `services` filtrada

---

### FASE 4: VALIDAÇÃO (1-2 horas)

#### Passo 4.1: Compilação

```bash
# Backend
cd digiurban/backend
npx tsc --noEmit

# Frontend
cd digiurban/frontend
npx tsc --noEmit
```

- [ ] Zero erros TypeScript

#### Passo 4.2: Teste Manual

1. Acessar página da secretaria
2. Clicar em "Novo Protocolo"
3. Selecionar serviço com "Motor"
4. Preencher dados do cidadão
5. Preencher formulário dinâmico
6. Submeter

**Validar**:
- [ ] Modal abre corretamente
- [ ] Template é buscado
- [ ] Formulário renderiza com campos corretos
- [ ] Validação funciona
- [ ] Submissão cria Protocol + Entidade
- [ ] Success screen aparece com número do protocolo

#### Passo 4.3: Validação no Banco

```sql
-- Verificar Protocol
SELECT * FROM protocols
WHERE number = '[NUMERO_GERADO]';

-- Verificar Entidade
SELECT * FROM [tabela_entidade]
WHERE protocol = '[NUMERO_GERADO]';

-- Verificar vínculo
SELECT
  p.number,
  p.title,
  e.*
FROM protocols p
JOIN [tabela_entidade] e ON e.protocol = p.number
WHERE p.number = '[NUMERO_GERADO]';
```

- [ ] Protocol existe
- [ ] Entidade existe
- [ ] protocol field vincula corretamente
- [ ] customData contém formData
- [ ] Todos os campos estão corretos

---

## 6. Detalhamento dos Componentes

### 6.1 NewProtocolModal.tsx (507 linhas)

**Responsabilidades**:
- Wizard de 3 etapas
- Buscar template baseado em service
- Validar cada etapa
- Submeter ao backend

**Estados**:
```typescript
const [currentStep, setCurrentStep] = useState<'service' | 'citizen' | 'form'>('service');
const [selectedService, setSelectedService] = useState<Service | null>(null);
const [serviceTemplate, setServiceTemplate] = useState<ServiceTemplate | null>(null);
const [citizenData, setCitizenData] = useState({});
const [formData, setFormData] = useState({});
const [errors, setErrors] = useState({});
const [isSubmitting, setIsSubmitting] = useState(false);
```

**Fluxo**:
1. **Step 1 - Service**: Usuário seleciona serviço
   - Busca template: `GET /api/admin/templates?moduleEntity=${service.moduleEntity}`
   - Valida que template foi encontrado
   - Avança para step 2

2. **Step 2 - Citizen**: Usuário preenche dados do cidadão
   - Validações: CPF, email, phone
   - Avança para step 3

3. **Step 3 - Form**: Usuário preenche formulário dinâmico
   - Renderiza `<DynamicServiceForm>` com `serviceTemplate.formSchema.fields`
   - Valida campos obrigatórios
   - Submete ao backend

4. **Success**: Exibe número do protocolo

**Props**:
```typescript
interface NewProtocolModalProps {
  services: Service[];
  onClose: () => void;
  apiEndpoint: string; // Ex: '/admin/secretarias/agricultura/protocols'
}
```

**Reutilização**:
✅ Totalmente reutilizável entre secretarias
✅ Apenas mudar `apiEndpoint` prop

### 6.2 DynamicServiceForm.tsx (233 linhas)

**Responsabilidades**:
- Renderizar campos dinamicamente de `FormField[]`
- Suportar 8 tipos de campo
- Validação por campo
- Atualizar formData no parent

**Tipos de Campo Suportados**:
1. `text` - Input de texto
2. `number` - Input numérico
3. `email` - Input de email
4. `date` - Date picker
5. `select` - Dropdown single-select
6. `textarea` - Textarea
7. `multiselect` - Checkboxes múltiplos
8. `checkbox` - Checkbox único

**Props**:
```typescript
interface DynamicServiceFormProps {
  fields: FormField[];
  formData: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  errors: Record<string, string>;
}

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'date' | 'select' | 'textarea' | 'multiselect' | 'checkbox';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
  };
}
```

**Reutilização**:
✅ Totalmente reutilizável
✅ Não precisa modificar

### 6.3 Hooks de API

**useAgricultureServices**:
- Query Key: `['agriculture-services']`
- Endpoint: `GET /services?departmentCode=AGRICULTURA`
- Stale Time: 5 minutos
- Retorna: `{ data: { data: Service[] } }`

**useAgricultureStats**:
- Query Key: `['agriculture-stats']`
- Endpoint: `GET /admin/secretarias/agricultura/stats`
- Refetch Interval: 5 minutos (auto-refresh)
- Retorna: `{ data: { data: StatsObject } }`

**Padrão para outras secretarias**:
```typescript
// use[Secretaria]Services
queryKey: ['[secretaria]-services']
endpoint: /services?departmentCode=[CODIGO]

// use[Secretaria]Stats
queryKey: ['[secretaria]-stats']
endpoint: /admin/secretarias/[nome]/stats
```

---

## 7. Fluxo de Dados Completo

### 7.1 Fluxo de Criação de Protocolo

```
1. USER INTERACTION
   └─> Usuário clica "Novo Protocolo"
       └─> Modal abre (NewProtocolModal)
           └─> Step 1: Seleciona serviço
               └─> useEffect detecta service
                   └─> Busca template
                       GET /api/admin/templates?moduleEntity=TechnicalAssistance
                       └─> Backend retorna ServiceTemplate
                           └─> Modal armazena em state
                               └─> Step 2: Preenche dados cidadão
                                   └─> Valida CPF, email, phone
                                       └─> Step 3: Renderiza DynamicServiceForm
                                           └─> DynamicServiceForm recebe:
                                               - fields: serviceTemplate.formSchema.fields
                                               - formData: {}
                                               - onChange: (data) => setFormData(data)
                                               └─> Usuário preenche campos
                                                   └─> onChange atualiza formData
                                                       └─> Usuário clica "Enviar"
                                                           └─> Modal valida formData
                                                               └─> POST /admin/secretarias/agricultura/protocols
                                                                   Body: {
                                                                     serviceId: '...',
                                                                     citizenData: {...},
                                                                     formData: {...}
                                                                   }

2. BACKEND PROCESSING
   └─> Route handler recebe request
       └─> Busca Service (include department)
           └─> Busca/Cria Citizen
               └─> Gera número de protocolo
                   └─> Inicia Transaction
                       └─> Cria Protocol
                           - number: '000123/2025'
                           - title: service.name
                           - description: formData.description || service.description
                           - customData: formData
                           - status: VINCULADO
                           └─> Verifica service.moduleEntity
                               └─> if (moduleEntity === 'TechnicalAssistance')
                                   └─> Cria TechnicalAssistance
                                       - protocol: protocol.number
                                       - todos os campos mapeados
                                       └─> Commit transaction
                                           └─> Retorna ao frontend
                                               {
                                                 success: true,
                                                 data: {
                                                   protocol: {...},
                                                   entityId: '...',
                                                   entityType: 'TechnicalAssistance'
                                                 }
                                               }

3. FRONTEND RESPONSE
   └─> Modal recebe resposta
       └─> Se success:
           └─> Exibe tela de sucesso
               - Número do protocolo
               - Botão "Fechar"
               └─> Invalida queries (React Query)
                   - ['agriculture-stats']
                   - ['protocols']
                   └─> UI atualiza automaticamente
```

### 7.2 Fluxo de Template Loading

```
ServiceTemplate (banco)
    ↓
GET /api/admin/templates?moduleEntity=X
    ↓
Backend retorna:
{
  data: [{
    code: 'AGR_ASSISTENCIA_001',
    formSchema: {
      fields: [
        { name: 'producerName', type: 'text', ... },
        { name: 'assistanceType', type: 'select', ... },
        ...
      ]
    },
    fieldMapping: {
      producerName: 'producerName',
      ...
    }
  }]
}
    ↓
NewProtocolModal armazena em state
    ↓
Passa para DynamicServiceForm:
<DynamicServiceForm
  fields={serviceTemplate.formSchema.fields}
  formData={formData}
  onChange={setFormData}
/>
    ↓
DynamicServiceForm renderiza campos
    ↓
Usuário preenche → onChange atualiza formData
    ↓
formData final:
{
  producerName: 'João Silva',
  assistanceType: 'technical',
  ...
}
    ↓
POST ao backend com formData
```

---

## 8. Boas Práticas

### 8.1 Sempre Fazer

✅ **Ler schema Prisma COMPLETO antes de implementar**
- Todos os campos
- Tipos corretos
- Campos obrigatórios vs opcionais
- Valores default
- Enums

✅ **Validar compilação TypeScript constantemente**
```bash
npx tsc --noEmit
```

✅ **Usar Transaction Prisma para múltiplas operações**
```typescript
const result = await prisma.$transaction(async (tx) => {
  const protocol = await tx.protocol.create({...});
  const entity = await tx.entity.create({...});
  return { protocol, entity };
});
```

✅ **Adicionar fallbacks para campos opcionais**
```typescript
propertyArea: formData.propertyArea ? parseFloat(formData.propertyArea) : null,
producerPhone: formData.producerPhone || 'Não informado',
```

✅ **Importar enums do Prisma Client**
```typescript
import { UserRole, ProtocolStatus } from '@prisma/client';
```

✅ **Validar service.moduleEntity antes de usar**
```typescript
if (service.moduleEntity) {
  if (service.moduleEntity === 'TechnicalAssistance') {
    // criar entidade
  }
}
```

✅ **Criar documentação durante implementação**
- Não deixar para depois
- Registrar decisões
- Explicar peculiaridades

✅ **Testar manualmente após cada componente**
- Backend: Testar endpoint no Postman
- Frontend: Testar componente isolado
- Integração: Testar fluxo completo

### 8.2 Nunca Fazer

❌ **Assumir nomes de campos sem verificar**
- Sempre consultar schema
- `sampleArea` vs `propertyArea`
- `intendedCrop` vs `cropIntended`
- `productTypes` vs `products`

❌ **Usar string literals para enums**
```typescript
// ❌ ERRADO
status: 'pending'
role: 'operator'

// ✅ CORRETO
status: ProtocolStatus.VINCULADO
role: UserRole.USER
```

❌ **Criar campos que não existem**
```typescript
// ❌ ERRADO
requestDate: new Date() // Se não existe no schema

// ✅ CORRETO
// Não adicionar o campo
```

❌ **Ignorar campos obrigatórios**
```typescript
// ❌ ERRADO
const protocol = await prisma.protocol.create({
  data: {
    number: '...',
    customData: {...},
    // Faltou title (obrigatório)
  }
});

// ✅ CORRETO
const protocol = await prisma.protocol.create({
  data: {
    number: '...',
    title: service.name,
    customData: {...},
  }
});
```

❌ **Usar `_sum` em campos Json**
```typescript
// ❌ ERRADO
_sum: { items: true } // items é Json, não numérico

// ✅ CORRETO
_count: { id: true }
```

❌ **Criar versões compactas/incompletas**
- Usuário solicitou explicitamente versões completas
- Implementação parcial causa mais problemas

❌ **Modificar componentes reutilizáveis sem necessidade**
- NewProtocolModal é genérico
- DynamicServiceForm é genérico
- Apenas passar props corretas

### 8.3 Padrões de Código

**Nomenclatura**:
```typescript
// Hooks
use[Entidade][Ação] → useAgricultureServices, useAgricultureStats

// Componentes
[Nome][Tipo] → NewProtocolModal, DynamicServiceForm

// Rotas backend
/api/admin/secretarias/[nome]/[recurso]

// Seeds
[secretaria]-templates.ts

// Código de template
[SEC]_[SERVICO]_[VERSAO] → AGR_ASSISTENCIA_001
```

**Estrutura de resposta API**:
```typescript
// Success
{
  success: true,
  data: {...},
  message: 'Operação realizada com sucesso'
}

// Error
{
  success: false,
  message: 'Descrição do erro',
  error: errorDetails
}
```

**Try-catch em rotas**:
```typescript
try {
  // lógica
  return res.json({ success: true, data });
} catch (error: any) {
  console.error('Contexto do erro:', error);
  return res.status(500).json({
    success: false,
    message: 'Mensagem amigável',
    error: error.message
  });
}
```

---

## 9. Troubleshooting

### Erro: "Property 'X' does not exist"

**Causa**: Campo não existe no modelo Prisma
**Solução**:
1. Verificar schema: `grep -A 30 "model NomeModelo" prisma/schema.prisma`
2. Corrigir nome do campo
3. Se campo for necessário, adicionar ao schema e fazer migration

### Erro: "Type 'string' is not assignable to type 'EnumType'"

**Causa**: Usando string literal em vez de enum
**Solução**:
1. Importar enum: `import { EnumType } from '@prisma/client'`
2. Usar enum: `status: EnumType.VALOR`

### Erro: "Transaction failed"

**Causa**: Alguma operação na transaction falhou
**Solução**:
1. Verificar logs do erro
2. Validar que todos os campos obrigatórios estão presentes
3. Verificar constraints (unique, foreign keys)
4. Testar cada operação isoladamente

### Erro: "Cannot find module"

**Causa**: Import path incorreto
**Solução**:
1. Verificar path relativo
2. Usar alias `@/` quando disponível
3. Verificar que arquivo existe

### Modal não renderiza formulário

**Causa**: Template não foi buscado ou está undefined
**Solução**:
1. Verificar que `service.moduleEntity` está definido
2. Verificar que template existe no banco
3. Verificar endpoint de busca de templates
4. Adicionar logs no useEffect

### Formulário não valida

**Causa**: Campos required não definidos corretamente
**Solução**:
1. Verificar `field.required` no template
2. Implementar validação no modal
3. Exibir erros ao usuário

---

## 10. Resumo Executivo

### O que foi implementado no Piloto Agricultura

✅ **Backend**:
- Route com endpoints GET /stats e POST /protocols
- 4 ServiceTemplates completos com formSchema
- Module Handler para 4 entidades especializadas
- Transaction Prisma garantindo atomicidade
- Validação completa de dados

✅ **Frontend**:
- Página dinâmica consumindo hooks React Query
- Modal wizard de 3 etapas reutilizável
- Formulário dinâmico com 8 tipos de campo
- Hooks de API com cache e auto-refresh
- UI com skeleton loading states

✅ **Arquitetura**:
- 100% integrado com sistema de módulos planejado
- Protocol → Service → Template → Entidade
- Source tracking ('service' vs 'manual')
- Extensível para outras secretarias

### Principais Aprendizados

🎓 **Validação de Schema é Crítica**:
- Ler TODOS os campos antes de implementar
- Verificar nomes exatos
- Checar obrigatórios vs opcionais
- Validar enums

🎓 **TypeScript é seu amigo**:
- Compilar frequentemente
- Corrigir erros imediatamente
- Importar tipos do Prisma Client

🎓 **Reutilização é chave**:
- NewProtocolModal funciona para qualquer secretaria
- DynamicServiceForm é agnóstico
- Apenas mudar props e endpoints

🎓 **Transaction garante consistência**:
- Protocol + Entidade criados atomicamente
- Rollback automático em caso de erro

### Estimativa de Tempo para Replicação

Com esta documentação:
- **Análise**: 1-2 horas
- **Backend**: 2-3 horas
- **Frontend**: 2-3 horas
- **Validação**: 1 hora
- **Total**: 6-9 horas por secretaria

Sem documentação (como foi o piloto):
- **Total**: 15-20 horas (com erros e correções)

**Economia**: ~60% do tempo

---

## 11. Próximos Passos

Para replicar em outras secretarias:

1. **Saúde** (`health`)
   - Models: MedicalAppointment, VaccinationCampaign, MedicineDispensation
   - Templates: Agendamento consulta, Campanha vacinação, Dispensação medicamento

2. **Educação** (`education`)
   - Models: SchoolEnrollment, MaterialRequest, SchoolMaintenance
   - Templates: Matrícula escolar, Solicitação material, Manutenção escola

3. **Assistência Social** (`social`)
   - Models: BenefitApplication, SocialAssistanceAttendance, FamilyRegistration
   - Templates: Cadastro Único, Bolsa Família, Atendimento social

4. **Obras** (`infrastructure`)
   - Models: ConstructionPermit, MaintenanceRequest, PublicWorkProject
   - Templates: Alvará construção, Solicitação reparo, Projeto obra

**Para cada uma**:
- Seguir FASE 1 (Análise) - 2h
- Seguir FASE 2 (Backend) - 3h
- Seguir FASE 3 (Frontend) - 3h
- Seguir FASE 4 (Validação) - 1h
- **Total**: ~9h por secretaria

---

## 12. Contatos e Suporte

**Documentação criada em**: 28/10/2025
**Piloto implementado**: Agricultura
**Versão**: 1.0

**Para dúvidas**:
1. Consultar esta documentação
2. Verificar schema Prisma
3. Consultar código do piloto em:
   - `digiurban/backend/src/routes/secretarias-agricultura.ts`
   - `digiurban/frontend/app/admin/secretarias/agricultura/`
   - `digiurban/frontend/components/admin/NewProtocolModal.tsx`

---

## Apêndices

### Apêndice A: Comandos Úteis

```bash
# Buscar modelo no schema
grep -n "model NomeModelo" prisma/schema.prisma

# Ler modelo completo (linha X + 100 linhas)
head -n $((X+100)) prisma/schema.prisma | tail -n 100

# Verificar TypeScript backend
cd digiurban/backend && npx tsc --noEmit

# Verificar TypeScript frontend
cd digiurban/frontend && npx tsc --noEmit

# Gerar Prisma Client após mudanças
cd digiurban/backend && npx prisma generate

# Criar migration
cd digiurban/backend && npx prisma migrate dev --name descricao

# Ver logs backend
cd digiurban/backend && npm run dev

# Ver logs frontend
cd digiurban/frontend && npm run dev
```

### Apêndice B: Checklist Rápido

Antes de commitar:
- [ ] TypeScript compila sem erros (backend)
- [ ] TypeScript compila sem erros (frontend)
- [ ] Teste manual passou
- [ ] Dados no banco corretos
- [ ] Documentação atualizada
- [ ] Commit message descritivo

### Apêndice C: Templates de Código

**Template de ServiceTemplate**:
```typescript
{
  code: '[SEC]_[SERVICO]_001',
  name: 'Nome do Serviço',
  description: 'Descrição',
  category: 'CATEGORIA',
  moduleType: '[secretaria]',
  moduleEntity: 'NomeExatoModelo',
  formSchema: {
    fields: [
      {
        name: 'campo1',
        label: 'Campo 1',
        type: 'text',
        required: true,
        placeholder: 'Digite...',
      },
    ],
  },
  fieldMapping: {
    campo1: 'campo1',
  },
  defaultFields: {
    status: 'pending',
    source: 'service',
  },
  isActive: true,
  estimatedTime: 30,
}
```

**Template de Module Handler**:
```typescript
if (service.moduleEntity === 'NomeEntidade') {
  const entity = await tx.nomeEntidade.create({
    data: {
      tenantId,
      protocol: protocol.number,
      serviceId: service.id,
      source: 'service',
      // Mapear TODOS os campos obrigatórios
      campoObrigatorio1: formData.campo1,
      // Campos opcionais com fallback
      campoOpcional: formData.campo2 || null,
      // Status inicial
      status: 'pending',
    },
  });
  entityId = entity.id;
  entityType = 'NomeEntidade';
}
```

---

**FIM DA DOCUMENTAÇÃO**

Esta documentação serve como guia completo para replicar o sucesso do Piloto Agricultura em outras secretarias, evitando os erros cometidos e seguindo as boas práticas aprendidas.
