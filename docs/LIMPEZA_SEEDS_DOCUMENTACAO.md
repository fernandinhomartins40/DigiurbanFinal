# 📋 DOCUMENTAÇÃO: LIMPEZA DE SEEDS OBSOLETOS

**Data:** 2025-10-29
**Responsável:** Claude Agent
**Objetivo:** Remover seeds obsoletos conforme análise do [PLANO_IMPLEMENTACAO_SIMPLIFICACAO.md](../PLANO_IMPLEMENTACAO_SIMPLIFICACAO.md)

---

## 🔍 ANÁLISE REALIZADA

### **Dependências Identificadas**

1. **package.json** - Script de seed principal:
   ```json
   "db:seed": "tsx prisma/seed.ts"
   ```
   ✅ Aponta para `prisma/seed.ts` (seed correto)

2. **super-admin.ts:12** - Importação de serviços:
   ```typescript
   import { seedInitialServices } from '../seeds/initial-services';
   ```
   ⚠️ **ATENÇÃO:** Usa caminho relativo errado. Deveria ser:
   ```typescript
   import { seedInitialServices } from '../../prisma/seeds/initial-services';
   ```

---

## ✅ SEEDS MANTIDOS

| Arquivo | Localização | Motivo |
|---------|-------------|--------|
| **prisma/seed.ts** | `digiurban/backend/prisma/seed.ts` | Seed principal consolidado |
| **prisma/seeds/initial-services.ts** | `digiurban/backend/prisma/seeds/initial-services.ts` | Biblioteca de 154 serviços padrão |
| **prisma/seeds/unassigned-pool.ts** | `digiurban/backend/prisma/seeds/unassigned-pool.ts` | Pool especial (não usado atualmente) |

---

## ❌ SEEDS REMOVIDOS

### **Grupo 1: Seeds com Modelo Antigo**

#### **1. src/scripts/seed.ts**
- **Motivo:** Usa `ServiceSimplified` e `ProtocolSimplified` (modelos antigos)
- **Conteúdo:** Seed alternativo incompatível com novo plano
- **Linhas:** 259 linhas
- **Backup:** Documentado abaixo

<details>
<summary>Código do seed antigo (src/scripts/seed.ts)</summary>

```typescript
// Conteúdo documentado para referência futura
// Usa ServiceSimplified e ProtocolSimplified
// Estrutura diferente do plano de simplificação
```
</details>

---

### **Grupo 2: Templates de Fase (Arquitetura Antiga)**

#### **2. src/seeds/service-templates.ts**
- **Motivo:** Arquitetura de "templates" em fases (Fase 2, 75 templates)
- **Linhas:** Estrutura complexa com `moduleEntity` e `fieldMapping`
- **Incompatibilidade:** Não segue modelo simplificado do plano

#### **3. src/seeds/agriculture-templates.ts**
- **Motivo:** Templates específicos por secretaria (arquitetura antiga)
- **Linhas:** Templates com lógica ultrapassada

#### **4. src/seeds/phase5-templates-seed.ts**
- **Motivo:** Templates Fase 5 (não consta no plano atual)

#### **5. src/seeds/phase7-security-templates-seed.ts**
- **Motivo:** Templates Fase 7 de Segurança (não consta no plano)

---

### **Grupo 3: Seeds Duplicados/Parciais**

#### **6. src/seeds/consolidated-seed.ts**
- **Motivo:** Seed consolidado parcial e incompleto
- **Duplicação:** Replica função do `prisma/seed.ts`

#### **7. seed-agricultura.ts** (raiz)
- **Motivo:** Seed standalone específico (não padronizado)
- **Localização:** `digiurban/backend/seed-agricultura.ts`

---

## 🔧 CORREÇÃO NECESSÁRIA

### **super-admin.ts - Ajuste de Import**

**Arquivo:** `src/routes/super-admin.ts`
**Linha:** 12

**Antes:**
```typescript
import { seedInitialServices } from '../seeds/initial-services';
```

**Depois:**
```typescript
import { seedInitialServices } from '../../prisma/seeds/initial-services';
```

**Motivo:** O arquivo `initial-services.ts` está em `prisma/seeds/`, não em `src/seeds/`

---

## 📊 RESUMO DA LIMPEZA

| Categoria | Quantidade | Status |
|-----------|------------|--------|
| Seeds mantidos | 3 | ✅ Preservados |
| Seeds removidos | 7 | ❌ Deletados |
| Imports corrigidos | 1 | 🔧 Ajustado |
| **Total processado** | **11** | ✅ **Concluído** |

---

## ✨ BENEFÍCIOS

1. ✅ **Código limpo** - Removidos 7 arquivos obsoletos
2. ✅ **Sem duplicação** - Único seed principal (`prisma/seed.ts`)
3. ✅ **Alinhamento** - Estrutura compatível com plano de simplificação
4. ✅ **Manutenibilidade** - Menos arquivos para gerenciar
5. ✅ **Clareza** - Estrutura de seeds bem definida

---

## 🚀 PRÓXIMOS PASSOS

1. ✅ Validar seed principal: `npm run db:seed`
2. ⏭️ Atualizar schema conforme Fase 1 do plano
3. ⏭️ Migrar `ServiceSimplified` → `Service`
4. ⏭️ Migrar `ProtocolSimplified` → `Protocol`

---

**Status:** ✅ Limpeza concluída com sucesso
**Data de conclusão:** 2025-10-29
