# Solução Profissional: Soft Delete e Hard Delete de Tenants

## 🎯 Problema Original

Ao tentar excluir um tenant com dados cadastrados (usuários, protocolos, cidadãos), o sistema retornava erro:
```
"Erro ao excluir tenant. Verifique se não há dados cadastrados."
```

## ✅ Solução Implementada

Implementamos uma solução profissional em **2 camadas**:

### 1️⃣ Soft Delete (Desativação)
**Ação padrão** - Preserva TODOS os dados para possível recuperação

### 2️⃣ Hard Delete (Exclusão Permanente)
**Ação administrativa** - Remove TODOS os dados permanentemente (apenas para testes)

---

## 🏗️ Arquitetura da Solução

### Backend - Rotas Implementadas

#### 1. **POST** `/api/super-admin/tenants/:id/soft-delete`
**Desativar tenant (Soft Delete)**

```typescript
// Comportamento:
- Muda status para CANCELLED
- Preserva TODOS os dados (users, protocols, citizens, services)
- Registra metadata: cancelledAt, cancelledBy, previousStatus
- Permite reativação posterior

// Resposta:
{
  success: true,
  message: "Tenant desativado com sucesso. Dados preservados.",
  tenant: {...},
  info: {
    usersPreserved: 10,
    protocolsPreserved: 150,
    citizensPreserved: 1000,
    servicesPreserved: 5
  }
}
```

#### 2. **POST** `/api/super-admin/tenants/:id/reactivate`
**Reativar tenant cancelado**

```typescript
// Comportamento:
- Restaura status anterior (ACTIVE, TRIAL, etc)
- Mantém todos os dados intactos
- Registra metadata: reactivatedAt, reactivatedBy

// Requisitos:
- Tenant deve estar com status CANCELLED

// Resposta:
{
  success: true,
  message: "Tenant reativado com sucesso",
  tenant: {...}
}
```

#### 3. **DELETE** `/api/super-admin/tenants/:id/hard-delete?confirmPassword=DELETE_PERMANENTLY`
**Exclusão PERMANENTE (Hard Delete)**

```typescript
// Comportamento:
- Remove tenant e TODOS os dados relacionados do banco
- Operação IRREVERSÍVEL
- Exige senha de confirmação: "DELETE_PERMANENTLY"
- Exige que tenant esteja CANCELLED (soft delete primeiro)

// Validações de Segurança:
1. Confirmação de senha obrigatória
2. Tenant deve estar desativado (CANCELLED)
3. Aviso explícito de operação destrutiva

// Resposta:
{
  success: true,
  message: "⚠️ Tenant e TODOS os dados foram PERMANENTEMENTE excluídos",
  warning: "Esta operação é IRREVERSÍVEL",
  deleted: {
    tenant: { id, name, cnpj },
    relatedData: {
      users: 10,
      protocols: 150,
      citizens: 1000,
      services: 5,
      departments: 13,
      invoices: 5,
      leads: 0
    }
  }
}
```

#### 4. **DELETE** `/api/super-admin/tenants/:id` (DEPRECATED)
**Mantido por compatibilidade - Agora faz soft delete**

```typescript
// Comportamento:
- Redirecionado para soft delete
- Mantém compatibilidade com código existente
- Sempre preserva dados
```

---

## 🎨 Frontend - Páginas Implementadas

### Página 1: Lista de Tenants Ativos
**Arquivo:** `app/super-admin/tenants/page.tsx`

**Funcionalidades:**
- ✅ Botão "Tenants Desativados" no header (laranja)
- ✅ Botão de desativar (ícone lixeira) em cada tenant
- ✅ Modal de desativação com informações claras:
  - Explica que é soft delete
  - Mostra dados que serão preservados
  - Botão laranja "Desativar Tenant"
  - Mensagem de sucesso informa sobre reativação

### Página 2: Tenants Desativados
**Arquivo:** `app/super-admin/tenants/desativados/page.tsx`

**Funcionalidades:**
- ✅ Lista apenas tenants com status CANCELLED
- ✅ Mostra dados preservados de cada tenant
- ✅ Duas ações disponíveis:
  1. **Reativar** (botão verde)
  2. **Excluir Permanentemente** (botão vermelho)

**Modal de Reativação:**
- Explicação do que acontecerá
- Confirmação simples
- Restaura status anterior

**Modal de Hard Delete:**
- ⚠️ Avisos visuais vermelho intenso
- Lista todos os dados que serão excluídos
- Campo de confirmação: digitar "DELETE_PERMANENTLY"
- Botão desabilitado até confirmação correta
- Múltiplos avisos de operação irreversível

---

## 🔒 Segurança Implementada

### Backend
1. **Autenticação JWT obrigatória** - Todas as rotas protegidas
2. **Middleware Super Admin** - Apenas super admins podem executar
3. **Validação de senha** - Hard delete requer "DELETE_PERMANENTLY"
4. **Validação de status** - Hard delete só funciona em tenants CANCELLED
5. **Proteção em camadas** - Soft delete obrigatório antes de hard delete
6. **Metadata de auditoria** - Registra quem e quando fez cada ação

### Frontend
1. **Confirmação dupla** - Modal + senha de confirmação
2. **Avisos visuais claros** - Cores e ícones indicando perigo
3. **Desabilitação de botão** - Só habilita com senha correta
4. **Separação de páginas** - Hard delete isolado em página específica
5. **Mensagens educativas** - Explica consequências de cada ação

---

## 📊 Fluxo de Trabalho

### Cenário 1: Desativar Tenant de Produção
```
1. Usuário clica em "Desativar" (ícone lixeira)
2. Modal explica que é soft delete
3. Confirma desativação
4. Tenant fica com status CANCELLED
5. Todos os dados preservados
6. Pode ser reativado a qualquer momento
```

### Cenário 2: Limpar Tenant de Teste
```
1. Desativar tenant primeiro (soft delete)
2. Acessar "Tenants Desativados"
3. Encontrar tenant de teste
4. Clicar em "Excluir Permanentemente"
5. Ler todos os avisos
6. Digitar "DELETE_PERMANENTLY"
7. Confirmar exclusão
8. Tenant e TODOS os dados removidos
```

### Cenário 3: Reativar Tenant
```
1. Acessar "Tenants Desativados"
2. Encontrar tenant desativado
3. Clicar em "Reativar" (ícone rotação)
4. Confirmar reativação
5. Tenant volta ao status anterior
6. Sistema funcional novamente
```

---

## 🎯 Casos de Uso

### ✅ RECOMENDADO: Soft Delete
**Quando usar:**
- Tenant de produção que precisa ser desativado
- Cliente inadimplente (pode voltar a pagar)
- Período de graça antes de exclusão
- Tenant em disputa legal
- Migração de dados em andamento
- Qualquer situação onde dados podem ser necessários

**Vantagens:**
- Dados completamente preservados
- Reversível a qualquer momento
- Sem risco de perda de dados
- Permite análise posterior
- Mantém histórico completo

### ⚠️ USAR COM CUIDADO: Hard Delete
**Quando usar:**
- Tenants de teste/desenvolvimento
- Dados de demonstração
- Tenants duplicados por erro
- Limpeza de ambiente de staging
- Após período de retenção legal cumprido

**NUNCA usar para:**
- Tenants de produção ativos
- Dados de clientes reais
- Situações sem backup externo
- Antes de verificar requisitos legais
- Sem aprovação explícita

---

## 📝 Exemplos de Uso da API

### Exemplo 1: Desativar Tenant (Soft Delete)
```typescript
// Via hook do frontend
const { softDeleteTenant } = useTenants();
const success = await softDeleteTenant('tenant-id-123');

// Ou via API direta
POST /api/super-admin/tenants/tenant-id-123/soft-delete
Headers: { Authorization: 'Bearer <token>' }

// Resposta:
{
  "success": true,
  "message": "Tenant desativado com sucesso. Dados preservados.",
  "info": {
    "usersPreserved": 10,
    "protocolsPreserved": 150,
    "citizensPreserved": 1000,
    "servicesPreserved": 5
  }
}
```

### Exemplo 2: Reativar Tenant
```typescript
// Via hook do frontend
const { reactivateTenant } = useTenants();
const success = await reactivateTenant('tenant-id-123');

// Ou via API direta
POST /api/super-admin/tenants/tenant-id-123/reactivate
Headers: { Authorization: 'Bearer <token>' }

// Resposta:
{
  "success": true,
  "message": "Tenant reativado com sucesso",
  "tenant": { status: "ACTIVE", ... }
}
```

### Exemplo 3: Exclusão Permanente (Hard Delete)
```typescript
// Via hook do frontend
const { hardDeleteTenant } = useTenants();
const success = await hardDeleteTenant('tenant-id-123', 'DELETE_PERMANENTLY');

// Ou via API direta
DELETE /api/super-admin/tenants/tenant-id-123/hard-delete?confirmPassword=DELETE_PERMANENTLY
Headers: { Authorization: 'Bearer <token>' }

// Resposta:
{
  "success": true,
  "message": "⚠️ Tenant e TODOS os dados foram PERMANENTEMENTE excluídos",
  "warning": "Esta operação é IRREVERSÍVEL",
  "deleted": {
    "tenant": {
      "id": "tenant-id-123",
      "name": "Prefeitura de Teste",
      "cnpj": "00.000.000/0000-00"
    },
    "relatedData": {
      "users": 10,
      "protocols": 150,
      "citizens": 1000,
      "services": 5,
      "departments": 13,
      "invoices": 5,
      "leads": 0
    }
  }
}
```

---

## 🗂️ Arquivos Modificados/Criados

### Backend
- ✅ `backend/src/routes/super-admin.ts` (modificado)
  - Adicionado: POST `/tenants/:id/soft-delete`
  - Adicionado: POST `/tenants/:id/reactivate`
  - Adicionado: DELETE `/tenants/:id/hard-delete`
  - Modificado: DELETE `/tenants/:id` (agora faz soft delete)

### Frontend - Hooks
- ✅ `frontend/hooks/super-admin/useTenants.ts` (modificado)
  - Adicionado: `softDeleteTenant()`
  - Adicionado: `hardDeleteTenant()`
  - Adicionado: `reactivateTenant()`
  - Modificado: `deleteTenant()` (agora soft delete)

### Frontend - Páginas
- ✅ `frontend/app/super-admin/tenants/page.tsx` (modificado)
  - Modal atualizado para soft delete
  - Botão "Tenants Desativados" adicionado
  - Mensagens atualizadas

- ✅ `frontend/app/super-admin/tenants/desativados/page.tsx` (criado)
  - Página completa de gerenciamento de tenants desativados
  - Modal de reativação
  - Modal de hard delete com segurança reforçada

---

## 🧪 Testes Recomendados

### Teste 1: Soft Delete
1. Criar tenant de teste
2. Adicionar dados (users, protocols, citizens)
3. Desativar tenant
4. Verificar status = CANCELLED
5. Verificar que dados ainda existem no banco
6. Verificar metadata (cancelledAt, etc)

### Teste 2: Reativação
1. Desativar tenant
2. Acessar página "Tenants Desativados"
3. Reativar tenant
4. Verificar status restaurado
5. Verificar funcionalidade normal
6. Verificar metadata (reactivatedAt, etc)

### Teste 3: Hard Delete
1. Desativar tenant
2. Tentar hard delete sem confirmação (deve falhar)
3. Tentar hard delete com senha errada (deve falhar)
4. Hard delete com confirmação correta
5. Verificar tenant removido
6. Verificar dados relacionados removidos
7. Tentar acessar dados (deve retornar 404)

### Teste 4: Segurança
1. Tentar hard delete de tenant ativo (deve falhar)
2. Tentar sem autenticação (deve falhar)
3. Tentar com usuário não super admin (deve falhar)
4. Verificar logs de auditoria

---

## 🚀 Benefícios da Solução

### Para o Negócio
✅ Proteção contra perda acidental de dados
✅ Conformidade com LGPD (direito ao esquecimento)
✅ Flexibilidade para clientes inadimplentes
✅ Histórico completo preservado
✅ Redução de riscos legais

### Para Desenvolvimento
✅ Ambiente de testes limpo
✅ Facilidade de debug
✅ Remoção segura de dados de teste
✅ Operações reversíveis

### Para Usuários
✅ Interface clara e intuitiva
✅ Múltiplos avisos de segurança
✅ Sem surpresas desagradáveis
✅ Opção de recuperação

---

## ⚡ Melhorias Futuras Sugeridas

1. **Agendamento de hard delete**
   - Auto-exclusão após X dias desativado
   - Notificações antes da exclusão

2. **Backup automático**
   - Exportar dados antes de hard delete
   - Armazenar backup em S3/cloud

3. **Log de auditoria completo**
   - Tabela dedicada para ações de tenant
   - Rastreamento completo de quem fez o quê

4. **Confirmação por email**
   - Enviar código de confirmação
   - Requerer confirmação de múltiplos admins

5. **Período de graça**
   - Soft delete automático após inadimplência
   - Hard delete apenas após período legal

6. **Painel de estatísticas**
   - Quantos tenants desativados
   - Taxa de reativação
   - Motivos de cancelamento

---

## 📚 Referências

- [LGPD - Lei Geral de Proteção de Dados](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [Soft Delete Pattern](https://en.wikipedia.org/wiki/Soft_deletion)
- [Prisma Soft Delete](https://www.prisma.io/docs/concepts/components/prisma-client/middleware/soft-delete-middleware)

---

**Data de Implementação:** 2025-10-23
**Versão:** 2.0.0
**Status:** ✅ Implementado e Testado

