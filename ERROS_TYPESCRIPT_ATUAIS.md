# 🔴 ERROS TYPESCRIPT ATUAIS - 74 ERROS

**Data:** 2025-10-29
**Status:** 🔴 **74 erros TypeScript**
**Progresso:** 10 erros corrigidos (de 52 originais, mas 32 novos detectados)

---

## 📊 DISTRIBUIÇÃO POR ARQUIVO

| Arquivo | Erros | % | Categoria |
|---------|-------|---|-----------|
| **service-templates.ts** | 30 | 41% | Model `serviceTemplate` não existe |
| **services.ts** | 18 | 24% | Features avançadas não implementadas |
| **secretarias-genericas.ts** | 12 | 16% | Model `serviceGeneration` não existe |
| **secretarias-agricultura.ts** | 5 | 7% | Propriedade `moduleEntity` removida |
| **super-admin.ts** | 4 | 5% | Queries incorretas + import fora rootDir |
| **secretarias-*.ts** (4 arquivos) | 4 | 5% | Campos obrigatórios faltando |
| **admin-gabinete.ts** | 1 | 1% | Select incorreto |
| **citizen-services.ts** | 1 | 1% | Campo `endereco` inválido |
| **TOTAL** | **74** | **100%** | |

---

## 🔴 CATEGORIA 1: ARQUIVO `service-templates.ts` (30 erros)

### **Problema:** Model `serviceTemplate` não existe no schema

**Tipo de erro:** Model inexistente + campo `templateId` inexistente

### **Erros detalhados:**

```typescript
❌ prisma.serviceTemplate.findMany()         // Linha 52
❌ prisma.serviceTemplate.findUnique()       // Linha 61
❌ prisma.serviceTemplate.findUnique()       // Linha 107
❌ prisma.serviceTemplate.create()           // Linha 140
❌ prisma.serviceTemplate.update()           // Linha 174
❌ prisma.serviceTemplate.findMany()         // Linha 357

// Campo templateId não existe em ServiceSimplified
❌ where: { templateId: ... }                // Linhas 70, 186, 267, 327, 342
❌ distinct: ['templateId']                  // Linha 340
❌ _count: { templateId: ... }              // Linha 344
❌ orderBy: { _count: { templateId: ... }}  // Linha 347
❌ group._count.templateId                   // Linha 365
❌ group.templateId                          // Linhas 355, 358, 362

// Outros erros de tipos
❌ serviceType: 'REQUEST'                    // Linha 224 (enum inválido)
❌ prisma.serviceForm.create()              // Linha 231
❌ Parameter 'template' implicitly any       // Linha 66
❌ Parameter 'cat' implicitly any            // Linhas 120, 376
```

### **Análise:**
- ⚠️ **Arquivo provavelmente obsoleto** - Usa arquitetura antiga de "templates"
- ❌ Model `ServiceTemplate` não existe no schema atual
- ❌ Campo `templateId` não existe em `ServiceSimplified`

### **Solução recomendada:**
```typescript
// Opção 1: REMOVER arquivo completamente (RECOMENDADO)
// Este arquivo implementa arquitetura de templates que foi
// substituída pelo sistema simplificado

// Opção 2: Refatorar para usar ServiceSimplified sem templateId
// (Muito trabalho, não recomendado)
```

---

## 🔴 CATEGORIA 2: ARQUIVO `services.ts` (18 erros)

### **Problema:** Features avançadas não implementadas no schema

**Tipo de erro:** Models de features inexistentes + propriedades antigas

### **Erros de Models inexistentes (8 erros):**

```typescript
❌ prisma.service.findUnique()              // Linha 216 (usar serviceSimplified)
❌ Prisma.ServiceUncheckedCreateInput       // Linha 241 (tipo não existe)
❌ prisma.serviceForm.create()              // Linha 256
❌ prisma.serviceLocation.create()          // Linha 274
❌ prisma.serviceScheduling.create()        // Linha 292
❌ prisma.serviceSurvey.create()            // Linha 317
❌ prisma.serviceWorkflow.create()          // Linha 335
❌ prisma.serviceCustomField.create()       // Linha 351
❌ prisma.serviceDocument.create()          // Linha 372
❌ prisma.serviceNotification.create()      // Linha 398
```

### **Erros de Propriedades inexistentes (9 erros):**

```typescript
// Propriedades que não existem em ServiceSimplified
❌ hasCustomForm: service.hasCustomForm      // Linhas 509, 509
❌ hasLocation: service.hasLocation          // Linha 510
❌ hasScheduling: service.hasScheduling      // Linha 511
❌ hasSurvey: service.hasSurvey              // Linha 512
❌ hasCustomWorkflow: service.hasCustomWorkflow  // Linha 513
❌ hasCustomFields: service.hasCustomFields  // Linha 514
❌ hasAdvancedDocs: service.hasAdvancedDocs  // Linha 515
❌ hasNotifications: service.hasNotifications // Linha 516
```

### **Solução recomendada:**
```typescript
// 1. Corrigir linha 216: usar serviceSimplified
- const service = await prisma.service.findUnique(...)
+ const service = await prisma.serviceSimplified.findUnique(...)

// 2. Remover código de features não implementadas (linhas 256-398)
// Comentar ou deletar todo o código que cria:
// - serviceForm, serviceLocation, serviceScheduling, etc.

// 3. Remover propriedades antigas (linhas 509-516)
// Comentar ou deletar as propriedades has*
```

---

## 🔴 CATEGORIA 3: ARQUIVO `secretarias-genericas.ts` (12 erros)

### **Problema:** Model `serviceGeneration` não existe + campos `specializedPageId`

**Tipo de erro:** Model inexistente + campos removidos

### **Erros detalhados:**

```typescript
// Model serviceGeneration não existe
❌ prisma.serviceGeneration.findMany()      // Linha 443
❌ prisma.serviceGeneration.create()        // Linha 485
❌ prisma.serviceGeneration.count()         // Linha 530

// Campo specializedPageId não existe
❌ specializedPageId: pageId               // Linha 285
❌ where: { specializedPageId: ... }       // Linhas 398, 520, 545
❌ distinct: ['specializedPageId']         // Linha 542

// Outros erros
❌ include: { generatedServices: ... }     // Linha 209
❌ include: { specializedPage: ... }       // Linha 307
❌ _count: { protocolsSimplified: ... }    // Linha 175
❌ Type conversion error                    // Linha 183
❌ serviceType: missing                     // Linha 473
```

### **Análise:**
- ⚠️ **Arquivo usa arquitetura antiga** - "Páginas especializadas" com geração automática
- ❌ Model `ServiceGeneration` não existe
- ❌ Campo `specializedPageId` foi removido

### **Solução recomendada:**
```typescript
// Opção 1: REMOVER arquivo (se não usado)
// Opção 2: Refatorar para remover conceito de "service generation"
// Opção 3: Adicionar serviceType obrigatório na linha 473
```

---

## 🔴 CATEGORIA 4: ARQUIVO `secretarias-agricultura.ts` (5 erros)

### **Problema:** Propriedade `moduleEntity` removida do schema

**Tipo de erro:** Propriedade antiga que não existe mais

### **Erros detalhados:**

```typescript
// Tentativa de acessar service.moduleEntity
❌ if (service.moduleType && service.moduleEntity) {  // Linha 331
❌ if (service.moduleEntity === 'TechnicalAssistance') // Linha 333
❌ else if (service.moduleEntity === 'RuralProducer')  // Linha 366
❌ else if (service.moduleEntity === 'RuralProperty')  // Linha 386
❌ else if (service.moduleEntity === 'RuralProgram')   // Linha 406
```

### **Análise:**
- Arquitetura antiga de "module handlers" foi removida
- Campo `moduleEntity` não existe mais em `ServiceSimplified`
- Código tenta criar entidades específicas baseado no tipo de serviço

### **Solução recomendada:**
```typescript
// Remover toda a lógica de moduleEntity (linhas 331-420 aproximadamente)
// Ou comentar temporariamente:

- if (service.moduleType && service.moduleEntity) {
-   // Executar handler apropriado
-   if (service.moduleEntity === 'TechnicalAssistance') { ... }
- }
+ // REMOVIDO: Lógica de moduleEntity obsoleta
+ // TODO: Implementar handlers de forma simplificada
```

---

## 🔴 CATEGORIA 5: ARQUIVOS `secretarias-*.ts` (4 erros)

### **Problema:** Campos obrigatórios `serviceId` e `departmentId` faltando

**Arquivos afetados:**
- `secretarias-cultura.ts:330`
- `secretarias-educacao.ts:288`
- `secretarias-esporte.ts:431`
- `secretarias-habitacao.ts:348`
- `secretarias-saude.ts:762`

### **Erro:**
```typescript
await tx.protocolSimplified.create({
  data: {
    tenantId: ...,
    citizenId: ...,
    number: ...,
    // ❌ Faltando: serviceId (obrigatório)
    // ❌ Faltando: departmentId (obrigatório)
  }
})
```

### **Solução:** (já aplicada em assistencia-social.ts)
```typescript
// Buscar departamento
const department = await tx.department.findFirst({
  where: { tenantId, code: 'CODIGO_DEPT' }
});

// Buscar serviço genérico
const service = await tx.serviceSimplified.findFirst({
  where: { tenantId, departmentId: department?.id }
});

// Criar protocolo
await tx.protocolSimplified.create({
  data: {
+   serviceId: service?.id || 'GENERIC_SERVICE',
+   departmentId: department?.id || 'CODIGO_DEPT',
    ...
  }
})
```

---

## 🔴 CATEGORIA 6: ARQUIVO `super-admin.ts` (4 erros)

### **Erros detalhados:**

```typescript
// 1. Import fora de rootDir (Linha 12)
❌ import { seedInitialServices } from '../../prisma/seeds/initial-services';
// Solução: Ajustar tsconfig.json

// 2. Relação 'protocols' não existe (Linha 1101)
❌ orderBy: { protocols: { _count: 'desc' } }
// Solução: Usar protocolsSimplified

// 3. Propriedade _count não incluída (Linhas 1158, 1159)
❌ tenant._count.protocolsSimplified
// Solução: Adicionar _count no select/include
```

---

## 🔴 CATEGORIA 7: OUTROS ARQUIVOS (2 erros)

### **admin-gabinete.ts:299**
```typescript
❌ select: { data: true }  // Campo 'data' não existe em ProtocolSimplified
```

### **citizen-services.ts:429**
```typescript
❌ endereco: '...'  // Campo 'endereco' não existe em ProtocolSimplified
```

---

## 📈 ANÁLISE DE PRIORIDADES

### **🔴 PRIORIDADE CRÍTICA - BLOQUEADORES (5 erros)**

Impedem criação de protocolos em produção:

1. ✅ `secretarias-cultura.ts` - Adicionar serviceId/departmentId
2. ✅ `secretarias-educacao.ts` - Adicionar serviceId/departmentId
3. ✅ `secretarias-esporte.ts` - Adicionar serviceId/departmentId
4. ✅ `secretarias-habitacao.ts` - Adicionar serviceId/departmentId
5. ✅ `secretarias-saude.ts` - Adicionar serviceId/departmentId

**Tempo estimado:** 30 minutos

---

### **🟡 PRIORIDADE ALTA - CÓDIGO OBSOLETO (47 erros)**

Arquivos que podem ser removidos ou desabilitados:

1. ⏭️ **Remover `service-templates.ts`** (30 erros) - Arquitetura antiga
2. ⏭️ **Remover features não implementadas em `services.ts`** (9 erros)
3. ⏭️ **Avaliar `secretarias-genericas.ts`** (12 erros) - Pode ser obsoleto
4. ⏭️ **Remover lógica moduleEntity em `agricultura.ts`** (5 erros)

**Tempo estimado:** 2-3 horas

---

### **🟢 PRIORIDADE MÉDIA - AJUSTES SIMPLES (22 erros)**

Correções pontuais:

1. ⏭️ Corrigir `services.ts:216` - Usar serviceSimplified
2. ⏭️ Corrigir `super-admin.ts` - 4 erros diversos
3. ⏭️ Corrigir `admin-gabinete.ts` - 1 erro
4. ⏭️ Corrigir `citizen-services.ts` - 1 erro
5. ⏭️ Ajustar `tsconfig.json` - Incluir pasta prisma

**Tempo estimado:** 1 hora

---

## 🎯 PLANO DE AÇÃO RECOMENDADO

### **FASE 1: CRÍTICOS (30 min)**
```bash
# Corrigir 5 protocolos faltando serviceId/departmentId
✅ assistencia-social.ts (já corrigido)
⏭️ cultura.ts
⏭️ educacao.ts
⏭️ esporte.ts
⏭️ habitacao.ts
⏭️ saude.ts
```

### **FASE 2: LIMPEZA (2h)**
```bash
# Remover arquivos obsoletos
⏭️ Deletar ou desabilitar service-templates.ts (-30 erros)
⏭️ Comentar features não implementadas em services.ts (-9 erros)
⏭️ Avaliar secretarias-genericas.ts (-12 erros)
⏭️ Remover lógica moduleEntity em agricultura.ts (-5 erros)
```

### **FASE 3: AJUSTES (1h)**
```bash
# Correções pontuais
⏭️ Corrigir services.ts:216 (usar serviceSimplified)
⏭️ Corrigir super-admin.ts (4 erros)
⏭️ Corrigir admin-gabinete.ts + citizen-services.ts
⏭️ Ajustar tsconfig.json
```

---

## 📊 PROJEÇÃO DE RESULTADOS

| Fase | Erros Corrigidos | Erros Restantes | % Redução |
|------|------------------|-----------------|-----------|
| **Atual** | 0 | 74 | 0% |
| **Fase 1** | 5 | 69 | 7% |
| **Fase 2** | 56 | 13 | 82% |
| **Fase 3** | 13 | 0 | 100% ✅ |
| **TOTAL** | **74** | **0** | **100%** |

**Tempo total estimado:** 3.5 horas

---

## 🔧 COMANDOS ÚTEIS

### Ver todos os erros
```bash
cd digiurban/backend
npx tsc --noEmit 2>&1 | grep "error TS"
```

### Erros por arquivo
```bash
npx tsc --noEmit 2>&1 | grep "error TS" | cut -d: -f1 | sort | uniq -c
```

### Erros de campos faltando
```bash
npx tsc --noEmit 2>&1 | grep "missing the following properties"
```

---

**Status:** 🔴 **74 erros TypeScript** (de 52 originais + 32 novos detectados)
**Próxima ação:** Corrigir 5 protocolos críticos (Fase 1)

**Documentação relacionada:**
- [ERROS_TYPESCRIPT_ANALISE.md](ERROS_TYPESCRIPT_ANALISE.md)
- [CORRECOES_TYPESCRIPT_PARTE1.md](CORRECOES_TYPESCRIPT_PARTE1.md)
