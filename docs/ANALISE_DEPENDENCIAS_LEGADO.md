# ANÁLISE DE DEPENDÊNCIAS - CÓDIGO LEGADO

**Data:** 29/10/2025
**Status:** Análise completa antes da limpeza

---

## 📊 ARQUIVOS QUE IMPORTAM ROUTES LEGADAS

### **`src/index.ts`** - 3 imports legados

**Linha 71:**
```typescript
import protocolRoutes from './routes/protocols';
```

**Linha 81:**
```typescript
import citizenProtocolsRoutes from './routes/citizen-protocols';
```

**Linha 89:**
```typescript
import adminProtocolsRoutes from './routes/admin-protocols';
```

**AÇÃO:** Remover esses 3 imports e suas respectivas rotas registradas em `app.use()`

---

## 📊 ARQUIVOS QUE USAM `protocol-helpers.ts`

Total: **14 arquivos**

### 1. **`src/routes/admin-chamados.ts`** (linha 15)
```typescript
import { getNextProtocolNumber } from '../utils/protocol-helpers';
```
**USO:** Gerar número de protocolo
**AÇÃO:** Substituir por `protocolServiceSimplified.generateProtocolNumber()`

### 2. **`src/routes/citizen-services.ts`** (linha 6)
```typescript
import { getNextProtocolNumber } from '../utils/protocol-helpers';
```
**USO:** Gerar número de protocolo ao criar serviço
**AÇÃO:** Substituir por `protocolServiceSimplified.generateProtocolNumber()`

### 3. **`src/routes/citizen-protocols.ts`** (linha 7)
```typescript
import { getNextProtocolNumber } from '../utils/protocol-helpers';
```
**USO:** Gerar número de protocolo
**AÇÃO:** Este arquivo será REMOVIDO (faz parte do sistema legado)

### 4. **`src/routes/admin-protocols.ts`** (linha 11)
```typescript
import { getNextProtocolNumber } from '../utils/protocol-helpers';
```
**USO:** Gerar número de protocolo
**AÇÃO:** Este arquivo será REMOVIDO (faz parte do sistema legado)

### 5. **`src/routes/protocols.ts`** (linha 6)
```typescript
import { getNextProtocolNumber } from '../utils/protocol-helpers';
```
**USO:** Gerar número de protocolo
**AÇÃO:** Este arquivo será REMOVIDO (faz parte do sistema legado)

### 6. **`src/routes/secretarias-saude.ts`** (linha 8)
```typescript
import { getNextProtocolNumber } from '../utils/protocol-helpers';
```
**USO:** Criar protocolos de saúde
**AÇÃO:** Substituir por `protocolServiceSimplified.createProtocol()` ou `.generateProtocolNumber()`

### 7. **`src/routes/secretarias-educacao.ts`** (linha 7)
```typescript
import { getNextProtocolNumber } from '../utils/protocol-helpers';
```
**USO:** Criar protocolos de educação
**AÇÃO:** Substituir por `protocolServiceSimplified.createProtocol()` ou `.generateProtocolNumber()`

### 8. **`src/routes/secretarias-assistencia-social.ts`** (linha 9)
```typescript
import { getNextProtocolNumber } from '../utils/protocol-helpers';
```
**USO:** Criar protocolos de assistência social
**AÇÃO:** Substituir por `protocolServiceSimplified.createProtocol()` ou `.generateProtocolNumber()`

### 9. **`src/routes/secretarias-cultura.ts`** (linha 8)
```typescript
import { getNextProtocolNumber } from '../utils/protocol-helpers';
```
**USO:** Criar protocolos de cultura
**AÇÃO:** Substituir por `protocolServiceSimplified.createProtocol()` ou `.generateProtocolNumber()`

### 10. **`src/routes/secretarias-esporte.ts`** (linha 11)
```typescript
import { getNextProtocolNumber } from '../utils/protocol-helpers';
```
**USO:** Criar protocolos de esporte
**AÇÃO:** Substituir por `protocolServiceSimplified.createProtocol()` ou `.generateProtocolNumber()`

### 11. **`src/routes/secretarias-habitacao.ts`** (linha 5)
```typescript
import { getNextProtocolNumber } from '../utils/protocol-helpers';
```
**USO:** Criar protocolos de habitação
**AÇÃO:** Substituir por `protocolServiceSimplified.createProtocol()` ou `.generateProtocolNumber()`

### 12. **`src/routes/secretarias-genericas.ts`** (linha 15)
```typescript
import { getNextProtocolNumber } from '../utils/protocol-helpers';
```
**USO:** Criar protocolos genéricos
**AÇÃO:** Substituir por `protocolServiceSimplified.createProtocol()` ou `.generateProtocolNumber()`

### 13. **`src/routes/secretarias-agricultura.ts`**
**USO:** Possivelmente usa
**AÇÃO:** Verificar e substituir se necessário

---

## 📊 RESUMO DE DEPENDÊNCIAS

### **Arquivos a REMOVER (3):**
1. ✅ `src/routes/protocols.ts`
2. ✅ `src/routes/admin-protocols.ts`
3. ✅ `src/routes/citizen-protocols.ts`
4. ✅ `src/utils/protocol-helpers.ts`

### **Arquivos a ATUALIZAR (11):**
1. ⚠️ `src/index.ts` - Remover imports de routes legadas
2. ⚠️ `src/routes/admin-chamados.ts` - Substituir helper
3. ⚠️ `src/routes/citizen-services.ts` - Substituir helper
4. ⚠️ `src/routes/secretarias-saude.ts` - Substituir helper
5. ⚠️ `src/routes/secretarias-educacao.ts` - Substituir helper
6. ⚠️ `src/routes/secretarias-assistencia-social.ts` - Substituir helper
7. ⚠️ `src/routes/secretarias-cultura.ts` - Substituir helper
8. ⚠️ `src/routes/secretarias-esporte.ts` - Substituir helper
9. ⚠️ `src/routes/secretarias-habitacao.ts` - Substituir helper
10. ⚠️ `src/routes/secretarias-genericas.ts` - Substituir helper
11. ⚠️ `src/routes/secretarias-agricultura.ts` - Verificar e substituir

---

## 🔧 ESTRATÉGIA DE SUBSTITUIÇÃO

### **Para substituir `getNextProtocolNumber()`:**

**Opção 1: Copiar função para módulo compartilhado**
```typescript
// src/utils/protocol-number-generator.ts
export function generateProtocolNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0')

  return `PROT-${year}${month}${day}-${random}`
}
```

**Opção 2: Usar diretamente do service**
```typescript
import { protocolServiceSimplified } from '../services/protocol-simplified.service'

// Usar
const number = protocolServiceSimplified.generateProtocolNumber()
```

**DECISÃO:** Usar Opção 1 (criar utilitário compartilhado) para manter baixo acoplamento

---

## 📝 CHECKLIST DE EXECUÇÃO

### **FASE 2: Criar utilitário compartilhado**
- [ ] Criar `src/utils/protocol-number-generator.ts`
- [ ] Copiar função `generateProtocolNumber()` do service
- [ ] Exportar função

### **FASE 3: Atualizar arquivos de secretarias**
- [ ] Atualizar `src/routes/admin-chamados.ts`
- [ ] Atualizar `src/routes/citizen-services.ts`
- [ ] Atualizar `src/routes/secretarias-saude.ts`
- [ ] Atualizar `src/routes/secretarias-educacao.ts`
- [ ] Atualizar `src/routes/secretarias-assistencia-social.ts`
- [ ] Atualizar `src/routes/secretarias-cultura.ts`
- [ ] Atualizar `src/routes/secretarias-esporte.ts`
- [ ] Atualizar `src/routes/secretarias-habitacao.ts`
- [ ] Atualizar `src/routes/secretarias-genericas.ts`
- [ ] Verificar `src/routes/secretarias-agricultura.ts`

### **FASE 4: Remover arquivos legados**
- [ ] Remover `src/routes/protocols.ts`
- [ ] Remover `src/routes/admin-protocols.ts`
- [ ] Remover `src/routes/citizen-protocols.ts`
- [ ] Remover `src/utils/protocol-helpers.ts`

### **FASE 5: Atualizar src/index.ts**
- [ ] Remover `import protocolRoutes from './routes/protocols'`
- [ ] Remover `import citizenProtocolsRoutes from './routes/citizen-protocols'`
- [ ] Remover `import adminProtocolsRoutes from './routes/admin-protocols'`
- [ ] Remover `app.use('/api', protocolRoutes)`
- [ ] Remover `app.use('/api/citizen/protocols', citizenProtocolsRoutes)`
- [ ] Remover `app.use('/api/admin/protocols', adminProtocolsRoutes)`
- [ ] Adicionar `import protocolsSimplifiedRoutes from './routes/protocols-simplified.routes'`
- [ ] Adicionar `app.use('/api/protocols', protocolsSimplifiedRoutes)`

### **FASE 6: Validar**
- [ ] `npx tsc --noEmit` - sem erros
- [ ] `grep -r "protocol-helpers" src/` - nenhum resultado
- [ ] `grep -r "routes/protocols'" src/` - nenhum resultado legado
- [ ] `grep -r "routes/admin-protocols'" src/` - nenhum resultado
- [ ] `grep -r "routes/citizen-protocols'" src/` - nenhum resultado

---

## ⚠️ RISCOS IDENTIFICADOS

### **1. Dependência circular**
Se `protocol-simplified.service.ts` usar algo que depende de routes antigas
**MITIGAÇÃO:** Criar utilitário independente

### **2. Testes quebrados**
Testes podem referenciar routes antigas
**MITIGAÇÃO:** Atualizar testes após remoção

### **3. Seeds/Migrations**
Seeds podem usar Service/Protocol antigos
**MITIGAÇÃO:** Verificar src/seeds/ antes de remover

---

## ✅ PRONTO PARA EXECUÇÃO

Análise completa. Próximos passos:
1. ✅ Criar utilitário `protocol-number-generator.ts`
2. ✅ Atualizar 11 arquivos de routes
3. ✅ Remover 4 arquivos legados
4. ✅ Atualizar `src/index.ts`
5. ✅ Validar compilação TypeScript
