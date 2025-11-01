# 🔌 PLANO DE INTEGRAÇÃO: FRONTEND x BACKEND PROTOCOLOS

**Data:** 01/11/2025
**Sistema:** DigiUrban - Motor de Protocolos
**Objetivo:** Integrar componentes frontend com os novos endpoints da auditoria

---

## 📊 DIAGNÓSTICO ATUAL

### ✅ O QUE JÁ ESTÁ IMPLEMENTADO (BACKEND)

**Modelos de Dados:**
- ✅ `ProtocolInteraction` (Interações)
- ✅ `ProtocolDocument` (Documentos)
- ✅ `ProtocolPending` (Pendências)
- ✅ `ProtocolStage` (Etapas de Workflow)
- ✅ `ProtocolSLA` (SLA e Prazos)
- ✅ `ModuleWorkflow` (Configuração de workflows por módulo)

**Rotas Backend (API):**
- ✅ `/api/protocols/:id/interactions` (GET, POST)
- ✅ `/api/protocols/:id/documents` (GET, POST, PATCH, DELETE)
- ✅ `/api/protocols/:id/pendings` (GET, POST, PATCH)
- ✅ `/api/protocols/:id/stages` (GET, PATCH)
- ✅ `/api/protocols/:id/sla` (GET, POST)
- ✅ `/api/protocols/:id/approve` (PUT)
- ✅ `/api/protocols/:id/reject` (PUT)

### ✅ COMPONENTES FRONTEND CRIADOS

**Componentes de Protocolo:**
- ✅ `ProtocolInteractionsTab` (💬 Interações) - [components/admin/protocol/ProtocolInteractionsTab.tsx](digiurban/frontend/components/admin/protocol/ProtocolInteractionsTab.tsx)
- ✅ `ProtocolDocumentsTab` (📄 Documentos) - [components/admin/protocol/ProtocolDocumentsTab.tsx](digiurban/frontend/components/admin/protocol/ProtocolDocumentsTab.tsx)
- ✅ `ProtocolPendingsTab` (⚠️ Pendências) - [components/admin/protocol/ProtocolPendingsTab.tsx](digiurban/frontend/components/admin/protocol/ProtocolPendingsTab.tsx)
- ✅ `ProtocolStagesTab` (🔄 Workflow) - [components/admin/protocol/ProtocolStagesTab.tsx](digiurban/frontend/components/admin/protocol/ProtocolStagesTab.tsx)
- ✅ `ProtocolSLAIndicator` (⏰ SLA) - [components/admin/protocol/ProtocolSLAIndicator.tsx](digiurban/frontend/components/admin/protocol/ProtocolSLAIndicator.tsx)

**Página de Detalhes:**
- ✅ `/admin/protocolos/[id]` - [app/admin/protocolos/[id]/page.tsx](digiurban/frontend/app/admin/protocolos/[id]/page.tsx)

**Services:**
- ✅ `protocol-interactions.service.ts` (existe em [services/](digiurban/frontend/services/))
- ✅ `protocol-sla.service.ts` (existe)

---

## ❌ GAPS IDENTIFICADOS

### 1. **ModuleDataTable** NÃO está usando as novas funcionalidades

**Arquivo:** [components/admin/modules/ModuleDataTable.tsx](digiurban/frontend/components/admin/modules/ModuleDataTable.tsx:170-179)

**Problema:**
- ✅ JÁ MOSTRA botão "Ver Protocolo" (linha 174) quando `record.protocolId` existe
- ❌ MAS o link vai para `/admin/protocolos/${record.protocolId}` que **já existe e funciona!**
- ✅ SOLUÇÃO: **Este componente JÁ está integrado corretamente!**

```tsx
// LINHA 170-179: JÁ IMPLEMENTADO! ✅
{record.protocolId && (
  <Button
    variant="ghost"
    size="sm"
    onClick={() => router.push(`/admin/protocolos/${record.protocolId}`)}
    title="Ver protocolo completo (interações, documentos, pendências)"
  >
    <FileText className="h-4 w-4 text-blue-600" />
  </Button>
)}
```

---

### 2. **PendingProtocolsList** NÃO mostra link para protocolo completo

**Arquivo:** [components/admin/modules/PendingProtocolsList.tsx](digiurban/frontend/components/admin/modules/PendingProtocolsList.tsx:348-358)

**Problema:**
- ✅ Tem botão "Ver mais" (linha 348)
- ❌ MAS está mockado: `toast.info('Visualização detalhada em desenvolvimento')`
- ❌ DEVERIA redirecionar para `/admin/protocolos/${protocol.id}`

**Código Atual (Linha 348-358):**
```tsx
<Button
  size="sm"
  variant="ghost"
  onClick={() => {
    // TODO: Abrir modal de detalhes
    toast.info('Visualização detalhada em desenvolvimento');
  }}
>
  <FileText className="h-4 w-4 mr-1" />
  Ver mais
</Button>
```

**Solução Necessária:**
```tsx
<Button
  size="sm"
  variant="ghost"
  onClick={() => router.push(`/admin/protocolos/${protocol.id}`)}
  title="Ver protocolo completo (interações, documentos, pendências)"
>
  <FileText className="h-4 w-4 mr-1" />
  Ver Protocolo
</Button>
```

---

### 3. **Falta página** `/admin/protocolos` (lista geral)

**Problema:**
- ✅ Existe `/admin/protocolos/[id]` (detalhe)
- ❌ NÃO existe `/admin/protocolos` (lista)
- ❌ Botão "Voltar para Protocolos" ([page.tsx:108](digiurban/frontend/app/admin/protocolos/[id]/page.tsx:108)) vai para rota inexistente

**Solução:** Criar página de listagem geral de protocolos

---

### 4. **ProtocolDetailPage** carrega dados mockados

**Arquivo:** [app/admin/protocolos/[id]/page.tsx](digiurban/frontend/app/admin/protocolos/[id]/page.tsx:58-65)

**Problema:**
- ✅ Carrega protocolo (linha 45)
- ✅ Carrega SLA (linha 52)
- ❌ Documentos mockados: `setDocuments([])` (linha 59)
- ❌ Pendências mockadas: `setPendings([])` (linha 62)
- ❌ Stages mockados: `setStages([])` (linha 65)

**Código Atual:**
```tsx
// Carregar documentos (mock - implementar chamada real)
setDocuments([])

// Carregar pendências (mock - implementar chamada real)
setPendings([])

// Carregar etapas (mock - implementar chamada real)
setStages([])
```

**Solução:** Chamar endpoints reais

---

### 5. **Faltam services** no frontend

**Problema:**
- ✅ Existe `protocol-interactions.service.ts`
- ✅ Existe `protocol-sla.service.ts`
- ❌ FALTA `protocol-documents.service.ts`
- ❌ FALTA `protocol-pendings.service.ts`
- ❌ FALTA `protocol-stages.service.ts`
- ❌ FALTA `protocol-workflows.service.ts`

---

## 🎯 PLANO DE AÇÃO

### **FASE 1: Corrigir PendingProtocolsList** (5 min)
1. ✅ Adicionar `useRouter`
2. ✅ Substituir `toast.info()` por redirecionamento real
3. ✅ Testar botão "Ver mais"

---

### **FASE 2: Criar Services Faltantes** (30 min)

#### 2.1. `protocol-documents.service.ts`
```typescript
// GET /api/protocols/:id/documents
export async function getProtocolDocuments(protocolId: string)

// POST /api/protocols/:id/documents/upload
export async function uploadDocument(protocolId: string, file: File, documentType: string)

// PATCH /api/protocols/:id/documents/:docId/validate
export async function validateDocument(protocolId: string, docId: string)

// PATCH /api/protocols/:id/documents/:docId/reject
export async function rejectDocument(protocolId: string, docId: string, reason: string)

// DELETE /api/protocols/:id/documents/:docId
export async function deleteDocument(protocolId: string, docId: string)
```

#### 2.2. `protocol-pendings.service.ts`
```typescript
// GET /api/protocols/:id/pendings
export async function getProtocolPendings(protocolId: string)

// POST /api/protocols/:id/pendings
export async function createPending(protocolId: string, data: CreatePendingData)

// PATCH /api/protocols/:id/pendings/:pendingId/resolve
export async function resolvePending(protocolId: string, pendingId: string, resolution: string)

// PATCH /api/protocols/:id/pendings/:pendingId/cancel
export async function cancelPending(protocolId: string, pendingId: string)
```

#### 2.3. `protocol-stages.service.ts`
```typescript
// GET /api/protocols/:id/stages
export async function getProtocolStages(protocolId: string)

// PATCH /api/protocols/:id/stages/:stageId/complete
export async function completeStage(protocolId: string, stageId: string, data: CompleteStageData)

// PATCH /api/protocols/:id/stages/:stageId/fail
export async function failStage(protocolId: string, stageId: string, reason: string)
```

#### 2.4. `module-workflows.service.ts` (JÁ EXISTE!)
- ✅ Arquivo: [src/services/module-workflows.service.ts](digiurban/frontend/src/services/module-workflows.service.ts)
- ✅ Já implementado!

---

### **FASE 3: Conectar ProtocolDetailPage aos Endpoints Reais** (15 min)

**Arquivo:** [app/admin/protocolos/[id]/page.tsx](digiurban/frontend/app/admin/protocolos/[id]/page.tsx)

**Modificar `loadProtocolData()`:**
```tsx
const loadProtocolData = async () => {
  try {
    setIsLoading(true)

    // Carregar protocolo
    const protocolData = await apiRequest(`/protocols/${protocolId}`)
    if (protocolData.success) {
      setProtocol(protocolData.data)
    }

    // Carregar SLA
    try {
      const slaData = await apiRequest(`/protocols/${protocolId}/sla`)
      if (slaData.success) setSLA(slaData.data)
    } catch (err) {
      // SLA pode não existir
    }

    // ✅ NOVO: Carregar documentos REAIS
    try {
      const docs = await getProtocolDocuments(protocolId)
      setDocuments(docs)
    } catch (err) {
      setDocuments([])
    }

    // ✅ NOVO: Carregar pendências REAIS
    try {
      const pends = await getProtocolPendings(protocolId)
      setPendings(pends)
    } catch (err) {
      setPendings([])
    }

    // ✅ NOVO: Carregar stages REAIS
    try {
      const stgs = await getProtocolStages(protocolId)
      setStages(stgs)
    } catch (err) {
      setStages([])
    }

  } catch (error) {
    toast({
      title: 'Erro ao carregar dados',
      description: error instanceof Error ? error.message : 'Erro desconhecido',
      variant: 'destructive',
    })
  } finally {
    setIsLoading(false)
  }
}
```

---

### **FASE 4: Criar Página de Lista de Protocolos** (45 min)

**Arquivo a criar:** `app/admin/protocolos/page.tsx`

**Funcionalidades:**
- Lista todos os protocolos do tenant
- Filtros: status, prioridade, departamento, responsável
- Busca por número/título
- Paginação
- Botão "Ver Detalhes" → `/admin/protocolos/[id]`

---

### **FASE 5: Melhorar Componentes de Protocolo** (30 min)

#### 5.1. `ProtocolDocumentsTab`
- ✅ Conectar ao service
- ✅ Implementar upload real
- ✅ Implementar validação/rejeição

#### 5.2. `ProtocolPendingsTab`
- ✅ Conectar ao service
- ✅ Implementar criação de pendência
- ✅ Implementar resolução/cancelamento

#### 5.3. `ProtocolStagesTab`
- ✅ Conectar ao service
- ✅ Implementar conclusão de stage
- ✅ Implementar falha de stage

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### ✅ JÁ FUNCIONANDO
- [x] Backend: Modelos de dados
- [x] Backend: Rotas de API
- [x] Frontend: Componentes de abas
- [x] Frontend: Página de detalhes `/admin/protocolos/[id]`
- [x] Frontend: `ModuleDataTable` → botão "Ver Protocolo"
- [x] Frontend: `protocol-interactions.service.ts`
- [x] Frontend: `protocol-sla.service.ts`
- [x] Frontend: `module-workflows.service.ts`

### ❌ PENDENTE (ORDEM DE PRIORIDADE)

#### 🔴 CRÍTICO (Fazer AGORA)
- [ ] **1. Corrigir `PendingProtocolsList` → Botão "Ver mais"** (5 min)
- [ ] **2. Criar `protocol-documents.service.ts`** (10 min)
- [ ] **3. Criar `protocol-pendings.service.ts`** (10 min)
- [ ] **4. Criar `protocol-stages.service.ts`** (10 min)
- [ ] **5. Conectar `ProtocolDetailPage` aos serviços reais** (15 min)

#### 🟡 IMPORTANTE (Fazer em seguida)
- [ ] **6. Criar página `/admin/protocolos`** (45 min)
- [ ] **7. Implementar upload de documentos** (20 min)
- [ ] **8. Implementar criação de pendências** (20 min)
- [ ] **9. Implementar workflow de stages** (30 min)

#### 🟢 DESEJÁVEL (Melhorias futuras)
- [ ] **10. Notificações em tempo real** (websockets)
- [ ] **11. Exportação de relatórios**
- [ ] **12. Gráficos de analytics**
- [ ] **13. Histórico visual (timeline)**

---

## 🚀 COMEÇAR POR:

### **TAREFA 1: Corrigir PendingProtocolsList** (AGORA!)
```tsx
// Arquivo: components/admin/modules/PendingProtocolsList.tsx
// Linha: 348-358

// ANTES:
<Button
  size="sm"
  variant="ghost"
  onClick={() => {
    toast.info('Visualização detalhada em desenvolvimento');
  }}
>
  <FileText className="h-4 w-4 mr-1" />
  Ver mais
</Button>

// DEPOIS:
<Button
  size="sm"
  variant="ghost"
  onClick={() => router.push(`/admin/protocolos/${protocol.id}`)}
  title="Ver protocolo completo com todas as interações, documentos e pendências"
>
  <FileText className="h-4 w-4 mr-1" />
  Ver Protocolo
</Button>
```

**Imports necessários:**
```tsx
import { useRouter } from 'next/navigation';

// Dentro do componente:
const router = useRouter();
```

---

## 📊 RESULTADO ESPERADO

Após implementar todas as fases:

1. ✅ Usuário clica em "Ver Protocolo" em qualquer módulo → vai para `/admin/protocolos/[id]`
2. ✅ Página de detalhes carrega DADOS REAIS:
   - 💬 Interações (já funciona)
   - 📄 Documentos (novo)
   - ⚠️ Pendências (novo)
   - 🔄 Stages de workflow (novo)
   - ⏰ SLA (já funciona)
3. ✅ Servidor pode:
   - Responder mensagens do cidadão
   - Validar/rejeitar documentos
   - Criar pendências
   - Avançar/falhar etapas do workflow
4. ✅ Cidadão pode (no portal):
   - Ver todas as interações
   - Enviar documentos
   - Resolver pendências
   - Acompanhar progresso do workflow

---

## 🎯 PRÓXIMOS PASSOS IMEDIATOS

1. **Implementar Tarefa 1** (PendingProtocolsList)
2. **Criar services faltantes** (documents, pendings, stages)
3. **Conectar ProtocolDetailPage** aos serviços
4. **Testar fluxo completo**

**Tempo estimado total:** ~2h para ter o MVP funcional

---

**Documento preparado por:** Claude Code
**Data de criação:** 01/11/2025
**Status:** Pronto para implementação
