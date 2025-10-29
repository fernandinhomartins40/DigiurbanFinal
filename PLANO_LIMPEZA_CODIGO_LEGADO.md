# PLANO DE LIMPEZA - CÓDIGO LEGADO DO MOTOR DE PROTOCOLOS

**Data:** 29/10/2025
**Objetivo:** Remover todo código legado do Motor de Protocolos após implementação do sistema simplificado

---

## 📋 ANÁLISE DO CÓDIGO ATUAL

### **Sistema Legado (A SER REMOVIDO)**

#### 1. **Models Prisma Legados**
Localização: `prisma/schema.prisma`

- ❌ `model Protocol` (linhas 367-409) - 8 flags booleanas
- ❌ `model ProtocolHistory` (linhas 411-421) - sem oldStatus/newStatus
- ❌ `model ProtocolEvaluation` (linhas 478-487)
- ❌ `model ProtocolLocation` (linha 5022)
- ❌ `model ProtocolCustomFieldValue` (linha 5226)
- ❌ `model Service` (linhas 187-233) - com 8 flags booleanas
- ❌ `model ServiceTemplate` (linha 235+)
- ❌ `model ServiceSurvey` (linha 267+)
- ❌ `model ServiceWorkflow` (linha 290+)
- ❌ `model ServiceNotification` (linha 308+)
- ❌ `model ServiceGeneration` (linha 3578+)
- ❌ `model ServiceLocation` (linha 5055+)
- ❌ `model ServiceForm` (linha 5089+)
- ❌ `model ServiceFormSubmission` (linha 5124+)
- ❌ `model ServiceScheduling` (linha 5147+)
- ❌ `model ServiceCustomField` (linha 5191+)
- ❌ `model ServiceDocument` (linha 5249+)

**Total:** ~17 models relacionados ao sistema legado

#### 2. **Routes Legadas**
Localização: `src/routes/`

- ❌ `protocols.ts` - Routes antigas de protocolos (admin/user)
- ❌ `admin-protocols.ts` - Routes antigas admin
- ❌ `citizen-protocols.ts` - Routes antigas cidadão

**Total:** 3 arquivos de routes

#### 3. **Helpers/Utils Legados**
Localização: `src/utils/`

- ❌ `protocol-helpers.ts` - Funções auxiliares antigas

**Total:** 1 arquivo de helpers

#### 4. **Migrations Antigas**
Localização: `prisma/migrations/`

- ❌ `20251024221210_consolidated_schema/` - Migration antiga
- ❌ `20251028173219_init/` - Migration antiga
- ❌ `20251028174344_init_with_data/` - Migration antiga

**Total:** 3 migrations antigas

---

### **Sistema Novo (MANTER)**

#### 1. **Schema Simplificado**
✅ `prisma/simplified-schema.prisma`
- `enum ServiceType` (INFORMATIVO | COM_DADOS)
- `enum ProtocolStatus` (6 estados)
- `model ServiceSimplified`
- `model ProtocolSimplified`
- `model ProtocolHistorySimplified`
- `model ProtocolEvaluationSimplified`

#### 2. **Service Novo**
✅ `src/services/protocol-simplified.service.ts`
- 13 funções completas

#### 3. **Routes Novas**
✅ `src/routes/protocols-simplified.routes.ts`
- 11 endpoints REST

#### 4. **Configuração**
✅ `src/config/module-mapping.ts`
- 108 serviços mapeados

#### 5. **Scripts de Migração**
✅ `scripts/migrate-to-simplified.ts`
✅ `scripts/validate-migration.ts`

#### 6. **Testes**
✅ `__tests__/unit/protocol-simplified.service.test.ts`

#### 7. **Documentação**
✅ `docs/API_PROTOCOLS_SIMPLIFIED.md`
✅ `FASE1_README.md`
✅ `FASE2_README.md`

---

## 🎯 ESTRATÉGIA DE LIMPEZA

### **Princípios**
1. ✅ **Segurança First** - Fazer backup antes de remover
2. ✅ **Validação Contínua** - Testar após cada remoção
3. ✅ **Documentação** - Registrar tudo removido
4. ✅ **Reversibilidade** - Git permite reverter se necessário

### **Ordem de Execução**

```
FASE 1: Análise de Dependências (30 min)
  → Identificar todos os imports do sistema legado
  → Listar arquivos que dependem das routes antigas
  → Verificar referências em outros módulos

FASE 2: Backup e Preparação (15 min)
  → Git commit do estado atual
  → Criar branch de limpeza
  → Documentar estado inicial

FASE 3: Remoção de Routes Legadas (30 min)
  → Remover protocols.ts
  → Remover admin-protocols.ts
  → Remover citizen-protocols.ts
  → Atualizar src/index.ts (remover imports)

FASE 4: Remoção de Helpers Legados (15 min)
  → Remover protocol-helpers.ts
  → Atualizar imports em arquivos que usavam

FASE 5: Integração do Schema Simplificado (45 min)
  → Copiar models do simplified-schema.prisma para schema.prisma
  → Remover models legados do schema.prisma
  → Adicionar enum ServiceType ao schema.prisma
  → Atualizar relações no Tenant model
  → Atualizar relações no User model
  → Atualizar relações no Citizen model
  → Atualizar relações no Department model

FASE 6: Limpeza de Migrations (15 min)
  → Remover migrations antigas
  → Criar nova migration consolidada

FASE 7: Atualização de Imports (30 min)
  → Buscar por imports de Protocol/Service antigos
  → Substituir por ProtocolSimplified/ServiceSimplified
  → Atualizar tipos/interfaces

FASE 8: Validação e Testes (45 min)
  → Rodar testes unitários
  → Validar que nenhuma referência ao legado existe
  → Testar compilação TypeScript
  → Verificar Prisma generate

FASE 9: Documentação Final (30 min)
  → Criar LIMPEZA_COMPLETA.md
  → Listar todos os arquivos removidos
  → Documentar arquivos atualizados

FASE 10: Commit Final (15 min)
  → Git commit com mensagem detalhada
  → Tag de versão
```

**Total estimado:** ~4 horas

---

## 📝 CHECKLIST DE EXECUÇÃO

### **Fase 1: Análise de Dependências**
- [ ] Grep por `import.*protocols` em todo src/
- [ ] Grep por `import.*protocol-helpers` em todo src/
- [ ] Grep por `Protocol[^S]` (Protocol mas não ProtocolSimplified)
- [ ] Grep por `Service[^ST]` (Service mas não ServiceSimplified/ServiceTemplate)
- [ ] Listar arquivos em `src/routes/secretarias-*.ts` que usam protocol
- [ ] Verificar `src/index.ts` para imports de routes antigas
- [ ] Verificar `src/modules/module-handler.ts` para referências

### **Fase 2: Backup**
- [ ] `git status` - verificar estado limpo
- [ ] `git commit -am "checkpoint antes da limpeza"`
- [ ] `git checkout -b feature/limpeza-codigo-legado`
- [ ] Criar snapshot do schema.prisma atual

### **Fase 3: Remoção Routes**
- [ ] Remover `src/routes/protocols.ts`
- [ ] Remover `src/routes/admin-protocols.ts`
- [ ] Remover `src/routes/citizen-protocols.ts`
- [ ] Atualizar `src/index.ts` - remover imports dessas routes
- [ ] Testar: `npx tsc --noEmit`

### **Fase 4: Remoção Helpers**
- [ ] Remover `src/utils/protocol-helpers.ts`
- [ ] Buscar imports: `grep -r "protocol-helpers" src/`
- [ ] Atualizar arquivos que importavam helpers
- [ ] Testar: `npx tsc --noEmit`

### **Fase 5: Schema Consolidado**
- [ ] Backup: `cp prisma/schema.prisma prisma/schema.prisma.backup`
- [ ] Adicionar `enum ServiceType` ao schema.prisma
- [ ] Adicionar `model ServiceSimplified` ao schema.prisma
- [ ] Adicionar `model ProtocolSimplified` ao schema.prisma
- [ ] Adicionar `model ProtocolHistorySimplified` ao schema.prisma
- [ ] Adicionar `model ProtocolEvaluationSimplified` ao schema.prisma
- [ ] Remover `model Protocol` antigo
- [ ] Remover `model ProtocolHistory` antigo
- [ ] Remover `model ProtocolEvaluation` antigo
- [ ] Remover `model ProtocolLocation`
- [ ] Remover `model ProtocolCustomFieldValue`
- [ ] Remover `model Service` antigo
- [ ] Remover models: ServiceTemplate, ServiceSurvey, ServiceWorkflow, etc
- [ ] Atualizar relacionamentos no `model Tenant`
- [ ] Atualizar relacionamentos no `model User`
- [ ] Atualizar relacionamentos no `model Citizen`
- [ ] Atualizar relacionamentos no `model Department`
- [ ] Testar: `npx prisma validate`
- [ ] Testar: `npx prisma format`

### **Fase 6: Migrations**
- [ ] Remover `prisma/migrations/20251024221210_consolidated_schema/`
- [ ] Remover `prisma/migrations/20251028173219_init/`
- [ ] Remover `prisma/migrations/20251028174344_init_with_data/`
- [ ] Criar: `npx prisma migrate dev --name consolidate_simplified_system`

### **Fase 7: Atualização Imports**
- [ ] Buscar: `grep -r "Protocol[^S]" src/ --include="*.ts"`
- [ ] Buscar: `grep -r "from '@prisma/client'" src/ | grep Protocol`
- [ ] Atualizar imports para usar ProtocolSimplified
- [ ] Atualizar tipos/interfaces
- [ ] Testar: `npx tsc --noEmit`

### **Fase 8: Validação**
- [ ] `npx prisma generate` - sem erros
- [ ] `npx tsc --noEmit` - sem erros
- [ ] `npm run test` - testes passando
- [ ] Buscar: `grep -r "Protocol[^S]" src/` - nenhum resultado (exceto comentários)
- [ ] Buscar: `grep -r "Service[^ST]" src/` - nenhum resultado (exceto comentários)

### **Fase 9: Documentação**
- [ ] Criar `LIMPEZA_COMPLETA.md`
- [ ] Listar 100% dos arquivos removidos
- [ ] Listar 100% dos arquivos atualizados
- [ ] Documentar breaking changes (se houver)
- [ ] Adicionar instruções de rollback

### **Fase 10: Commit**
- [ ] `git add .`
- [ ] `git commit -m "refactor: remover 100% código legado Motor Protocolos"`
- [ ] `git tag -a v2.0.0-simplified -m "Sistema simplificado completo"`

---

## ⚠️ ARQUIVOS QUE PRECISAM SER ATUALIZADOS

### **Arquivos com imports do sistema legado:**

1. **`src/index.ts`**
   - Remover: `import protocolsRoutes from './routes/protocols'`
   - Remover: `import adminProtocolsRoutes from './routes/admin-protocols'`
   - Remover: `import citizenProtocolsRoutes from './routes/citizen-protocols'`
   - Adicionar: `import protocolsSimplifiedRoutes from './routes/protocols-simplified.routes'`

2. **Arquivos em `src/routes/secretarias-*.ts`** (se usarem Protocol antigo)
   - `secretarias-saude.ts`
   - `secretarias-educacao.ts`
   - `secretarias-agricultura.ts`
   - `secretarias-habitacao.ts`
   - `secretarias-esporte.ts`
   - `secretarias-cultura.ts`
   - `secretarias-assistencia-social.ts`
   - `secretarias-genericas.ts`

3. **`src/modules/module-handler.ts`** (se usar Protocol antigo)

4. **`src/routes/admin-chamados.ts`** (se usar Protocol antigo)

5. **`src/routes/citizen-services.ts`** (se usar Protocol antigo)

---

## 🔍 COMANDOS DE VERIFICAÇÃO

### **Antes da limpeza:**
```bash
# Contar linhas do schema atual
wc -l prisma/schema.prisma

# Listar todos os models Protocol
grep "^model Protocol" prisma/schema.prisma

# Listar todos os arquivos com "protocol" no nome
find src/ -name "*protocol*"

# Verificar imports de Protocol
grep -r "import.*Protocol" src/ --include="*.ts"
```

### **Depois da limpeza:**
```bash
# Verificar que não há referências ao legado
grep -r "Protocol[^S]" src/ --include="*.ts" | grep -v "comment"

# Verificar que não há Service antigo
grep -r "Service[^ST]" src/ --include="*.ts" | grep -v "comment"

# Validar schema
npx prisma validate

# Gerar client
npx prisma generate

# Compilar TypeScript
npx tsc --noEmit
```

---

## 📊 MÉTRICAS ESPERADAS

### **Redução de Código:**
- **Models removidos:** ~17 models
- **Routes removidas:** 3 arquivos (~1000+ linhas)
- **Helpers removidos:** 1 arquivo (~200+ linhas)
- **Migrations antigas:** 3 migrations
- **Linhas no schema.prisma:** Redução de ~500 linhas

### **Simplificação:**
- **8 flags booleanas** → **1 enum ServiceType**
- **17 models complexos** → **4 models simples**
- **Múltiplas routes** → **1 route unificada**

---

## 🚨 PONTOS DE ATENÇÃO

### **1. Relacionamentos no Schema**
⚠️ Ao remover `model Protocol` e `model Service`, atualizar:
- `model Tenant` - relacionamentos protocols[] e services[]
- `model User` - relacionamentos com protocolos criados/atribuídos
- `model Citizen` - relacionamentos com protocolos
- `model Department` - relacionamentos com services e protocols

### **2. Imports no TypeScript**
⚠️ Buscar e substituir:
```typescript
// Antigo
import { Protocol, Service } from '@prisma/client'

// Novo
import { ProtocolSimplified, ServiceSimplified } from '@prisma/client'
```

### **3. Tipos/Interfaces**
⚠️ Verificar arquivos em `src/types/`:
- `src/types/services.ts` - pode ter tipos legados
- `src/types/globals.ts` - pode ter extensões de Protocol antigo

### **4. Seeds**
⚠️ Verificar:
- `src/seeds/initial-services.ts` - pode usar Service antigo
- `src/seeds/service-templates.ts` - pode precisar atualização

---

## ✅ CRITÉRIOS DE SUCESSO

A limpeza está completa quando:

1. ✅ Zero referências a `model Protocol` (sem Simplified)
2. ✅ Zero referências a `model Service` (sem Simplified/Template)
3. ✅ Zero imports de routes legadas em `src/index.ts`
4. ✅ `npx prisma validate` - sucesso
5. ✅ `npx prisma generate` - sucesso
6. ✅ `npx tsc --noEmit` - sem erros
7. ✅ `npm run test` - todos os testes passam
8. ✅ `grep -r "Protocol[^S]" src/` - apenas comentários
9. ✅ Schema reduzido em ~500 linhas
10. ✅ Documentação completa criada

---

## 📦 ROLLBACK (SE NECESSÁRIO)

Caso algo dê errado:

```bash
# Voltar ao commit anterior
git checkout main

# Ou desfazer commit específico
git revert HEAD

# Ou resetar para commit anterior (perigoso)
git reset --hard HEAD~1
```

**Backup do schema:**
```bash
cp prisma/schema.prisma.backup prisma/schema.prisma
```

---

## 📅 CRONOGRAMA PROPOSTO

**Tempo total:** ~4 horas

- **09:00 - 09:30** - Fase 1: Análise de Dependências
- **09:30 - 09:45** - Fase 2: Backup
- **09:45 - 10:15** - Fase 3: Remoção Routes
- **10:15 - 10:30** - Fase 4: Remoção Helpers
- **10:30 - 11:15** - Fase 5: Schema Consolidado
- **11:15 - 11:30** - Fase 6: Migrations
- **11:30 - 12:00** - Fase 7: Atualização Imports
- **12:00 - 12:45** - Fase 8: Validação e Testes
- **12:45 - 13:15** - Fase 9: Documentação
- **13:15 - 13:30** - Fase 10: Commit Final

---

**PRONTO PARA EXECUÇÃO!** ✅
