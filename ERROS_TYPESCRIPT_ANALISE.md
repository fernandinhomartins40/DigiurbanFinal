# 🔴 ANÁLISE DE ERROS TYPESCRIPT - BACKEND

**Data:** 2025-10-29
**Total de erros:** **52 erros**
**Status:** ⚠️ Código com inconsistências entre schema e código

---

## 📊 RESUMO EXECUTIVO

| Categoria | Quantidade | Gravidade |
|-----------|------------|-----------|
| **Models inexistentes** | 15 | 🔴 Alta |
| **Propriedades removidas** | 21 | 🔴 Alta |
| **Schema desatualizado** | 13 | 🟡 Média |
| **Configuração TypeScript** | 3 | 🟡 Média |

---

## 🔴 CATEGORIA 1: MODELS INEXISTENTES NO SCHEMA (15 erros)

Código tenta acessar models que **não existem** no schema Prisma atual.

### **1.1 Model `service` não existe (2 erros)**

**Arquivos afetados:**
- `prisma/seeds/initial-services.ts:1928` - `prisma.service.findFirst`
- `prisma/seeds/initial-services.ts:1941` - `prisma.service.create`

**Problema:**
```typescript
❌ await prisma.service.findFirst(...)  // Model 'service' não existe
❌ await prisma.service.create(...)     // Model 'service' não existe
```

**Schema atual:**
```prisma
model ServiceSimplified { ... }  // ✅ Existe
model Service { ... }            // ❌ NÃO EXISTE
```

**Solução:**
- Opção A: Usar `serviceSimplified` (temporário)
- Opção B: Adicionar model `Service` ao schema (Fase 2 do plano)

---

### **1.2 Model `protocol` não existe (7 erros)**

**Arquivos afetados:**
- `src/routes/secretarias-agricultura.ts:304, 312`
- `src/routes/secretarias-assistencia-social.ts:617`
- `src/routes/secretarias-cultura.ts:329`
- `src/routes/secretarias-educacao.ts:287`
- `src/routes/secretarias-esporte.ts:430`
- `src/routes/secretarias-habitacao.ts:452`
- `src/routes/secretarias-saude.ts:263`

**Problema:**
```typescript
❌ await prisma.protocol.create(...)    // Model 'protocol' não existe
```

**Schema atual:**
```prisma
model ProtocolSimplified { ... }  // ✅ Existe
model Protocol { ... }            // ❌ NÃO EXISTE
```

---

### **1.3 Models de features avançadas (6 erros)**

**Arquivos:** `src/routes/services.ts`

Models que não existem no schema:
```typescript
❌ prisma.serviceForm
❌ prisma.serviceLocation
❌ prisma.serviceScheduling
❌ prisma.serviceSurvey
❌ prisma.serviceWorkflow
❌ prisma.serviceCustomField
❌ prisma.serviceDocument
❌ prisma.serviceNotification
```

**Problema:** Código tenta criar features avançadas que não estão no schema atual.

---

## 🔴 CATEGORIA 2: PROPRIEDADES REMOVIDAS/INEXISTENTES (21 erros)

### **2.1 Propriedade `moduleEntity` removida (5 erros)**

**Arquivo:** `src/routes/secretarias-agricultura.ts:331, 333, 366, 386, 406`

**Problema:**
```typescript
❌ service.moduleEntity  // Propriedade não existe mais
```

**Causa:** Arquitetura antiga de "module handlers" foi removida no plano de simplificação.

---

### **2.2 Propriedades de features avançadas (8 erros)**

**Arquivo:** `src/routes/services.ts:509-516`

Propriedades que não existem em `ServiceSimplified`:
```typescript
❌ hasCustomForm
❌ hasLocation
❌ hasScheduling
❌ hasSurvey
❌ hasCustomWorkflow
❌ hasCustomFields
❌ hasAdvancedDocs
❌ hasNotifications
```

---

### **2.3 Campo `serviceType` faltante (1 erro)**

**Arquivo:** `src/routes/admin-management.ts:450`

**Problema:**
```typescript
await prisma.serviceSimplified.create({
  data: {
    name: '...',
    // ❌ Faltando: serviceType (obrigatório)
  }
})
```

**Schema atual:**
```prisma
model ServiceSimplified {
  serviceType ServiceType  // ✅ Campo obrigatório
}
```

---

### **2.4 Campo `endereco` inválido (1 erro)**

**Arquivo:** `src/routes/citizen-services.ts:429`

**Problema:**
```typescript
await prisma.protocolSimplified.create({
  data: {
    endereco: '...'  // ❌ Campo não existe
  }
})
```

---

### **2.5 Propriedade `_count` (3 erros)**

**Arquivo:** `src/routes/super-admin.ts:1158, 1159`

**Problema:** Tentando acessar `_count` sem ter incluído no `select/include`.

---

## 🟡 CATEGORIA 3: SCHEMA DESATUALIZADO (13 erros)

### **3.1 Query `protocols` inválida (1 erro)**

**Arquivo:** `src/routes/super-admin.ts:1101`

**Problema:**
```typescript
orderBy: {
  protocols: { _count: 'desc' }  // ❌ Não há relação 'protocols'
}
```

**Causa:** Schema não tem relação `protocols`, apenas `protocolsSimplified`.

---

### **3.2 Select em `ProtocolSimplified` (1 erro)**

**Arquivo:** `src/routes/admin-gabinete.ts:299`

**Problema:** Tentando usar propriedade `data` no select.

---

## 🟡 CATEGORIA 4: CONFIGURAÇÃO TYPESCRIPT (3 erros)

### **4.1 Arquivo fora do rootDir**

**Arquivo:** `src/routes/super-admin.ts:12`

**Erro:**
```
File 'prisma/seeds/initial-services.ts' is not under 'rootDir' 'src'
```

**Problema:** Import de arquivo fora da pasta `src/`.

**Solução:** Adicionar `prisma` ao `include` do tsconfig.json

---

## 📋 DISTRIBUIÇÃO POR ARQUIVO

| Arquivo | Erros | Categoria Principal |
|---------|-------|---------------------|
| `services.ts` | 16 | Features avançadas inexistentes |
| `secretarias-agricultura.ts` | 7 | Models e propriedades antigas |
| `initial-services.ts` | 2 | Model `service` não existe |
| `super-admin.ts` | 5 | Queries e imports |
| `admin-management.ts` | 1 | Campo obrigatório faltando |
| `citizen-services.ts` | 1 | Campo inexistente |
| `secretarias-*.ts` (7 arquivos) | 7 | Model `protocol` não existe |
| Outros | 13 | Diversos |

---

## 🎯 PLANO DE CORREÇÃO

### **PRIORIDADE ALTA - BLOQUEADORES (37 erros)**

#### **Fase 1: Atualizar Seeds (2 erros)**
```typescript
// prisma/seeds/initial-services.ts
❌ prisma.service.findFirst
❌ prisma.service.create

✅ Solução: Usar prisma.serviceSimplified temporariamente
```

#### **Fase 2: Corrigir Routes de Secretarias (7 erros)**
```typescript
// src/routes/secretarias-*.ts
❌ await prisma.protocol.create(...)

✅ Solução: Usar prisma.protocolSimplified
```

#### **Fase 3: Remover Features Avançadas (16 erros)**
```typescript
// src/routes/services.ts
❌ prisma.serviceForm, serviceLocation, etc.

✅ Solução: Remover código de features não implementadas
```

#### **Fase 4: Adicionar Campos Obrigatórios (1 erro)**
```typescript
// src/routes/admin-management.ts
✅ Adicionar: serviceType: 'COM_DADOS'
```

---

### **PRIORIDADE MÉDIA - NÃO BLOQUEADORES (15 erros)**

#### **Fase 5: Atualizar Queries (4 erros)**
```typescript
// Atualizar queries para usar relações corretas
❌ protocolsSimplified → protocols
❌ servicesSimplified → services
```

#### **Fase 6: Remover Propriedades Antigas (8 erros)**
```typescript
// Remover referências a:
❌ moduleEntity
❌ hasCustomForm, hasLocation, etc.
```

#### **Fase 7: Ajustar tsconfig.json (3 erros)**
```json
{
  "include": ["src/**/*", "prisma/**/*"]
}
```

---

## 🚀 PRÓXIMOS PASSOS RECOMENDADOS

### **IMEDIATO (Resolver hoje)**

1. ✅ **Corrigir seeds** - Mudar `service` → `serviceSimplified`
2. ✅ **Corrigir routes** - Mudar `protocol` → `protocolSimplified`
3. ✅ **Adicionar serviceType** - Campo obrigatório em admin-management.ts

**Impacto:** Reduz de 52 → 42 erros (-19%)

---

### **CURTO PRAZO (Esta semana)**

4. ⏭️ **Remover features não implementadas** - Limpar código de services.ts
5. ⏭️ **Atualizar queries** - Usar relações corretas

**Impacto:** Reduz de 42 → 18 erros (-58% adicional)

---

### **MÉDIO PRAZO (Próxima semana - Fase 2 do Plano)**

6. ⏭️ **Migrar schema** - Adicionar models `Service` e `Protocol`
7. ⏭️ **Atualizar todos imports** - Migrar para novos models
8. ⏭️ **Ajustar tsconfig.json** - Incluir pasta prisma

**Impacto:** ✅ **Zero erros TypeScript**

---

## 📊 IMPACTO DA CORREÇÃO

| Fase | Erros Corrigidos | % Redução | Esforço |
|------|------------------|-----------|---------|
| **Fase 1-3** | 10 erros | 19% | 1-2 horas |
| **Fase 4-6** | 24 erros | 46% | 3-4 horas |
| **Fase 7 (Plano)** | 18 erros | 35% | 1 semana |
| **TOTAL** | **52 erros** | **100%** | **~2 semanas** |

---

## ✅ RECOMENDAÇÃO PROFISSIONAL

### **Ação Imediata (Hoje):**
1. Corrigir seeds para usar `serviceSimplified`
2. Corrigir routes de secretarias para usar `protocolSimplified`
3. Adicionar campo `serviceType` obrigatório

### **Ação de Curto Prazo (Esta Semana):**
4. Limpar código de features não implementadas
5. Revisar e corrigir queries

### **Ação Estratégica (Fase 2 do Plano):**
6. Implementar migração completa do schema
7. Migrar para models `Service` e `Protocol`
8. Validar com zero erros TypeScript

---

**Status:** ⚠️ **Ação Necessária**
**Prioridade:** 🔴 **Alta** (10 erros bloqueadores)
**Timeline:** 1-2 semanas para correção completa

---

**Documentação relacionada:**
- [PLANO_IMPLEMENTACAO_SIMPLIFICACAO.md](PLANO_IMPLEMENTACAO_SIMPLIFICACAO.md)
- [RESUMO_LIMPEZA_SEEDS.md](RESUMO_LIMPEZA_SEEDS.md)
