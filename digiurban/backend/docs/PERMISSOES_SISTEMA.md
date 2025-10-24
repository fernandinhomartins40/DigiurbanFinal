# Sistema de Permissões - DigiUrban

## Estrutura de Cargos (UserRole)

```
GUEST → USER → COORDINATOR → MANAGER → ADMIN → SUPER_ADMIN
  0       1          2            3        4          5
```

## 🎯 Filosofia de Permissões: Todos Podem Ajudar

**Princípio Fundamental**: Qualquer servidor municipal pode cadastrar e aprovar cidadãos para **agilizar o processo de atendimento**.

### Por que essa decisão?

- ✅ **Agilidade no Atendimento**: Cidadão não precisa esperar apenas um departamento específico
- ✅ **Descentralização**: Servidores na ponta podem resolver imediatamente
- ✅ **Realidade Municipal**: Em cidades pequenas, todos ajudam em tudo
- ✅ **Responsabilidade Compartilhada**: Sistema registra quem aprovou (auditoria mantida)

---

## 📋 Permissões por Cargo

### 🔵 **GUEST** (Visitante)
**Nível**: 0
**Acesso**: Nenhum
```typescript
permissions: []
```

---

### 🟢 **USER** (Servidor/Funcionário)
**Nível**: 1
**Descrição**: Servidor municipal básico, funcionário de qualquer secretaria

#### Permissões:
```typescript
[
  // Protocolos
  'protocols:read',      // Ler protocolos
  'protocols:update',    // Atualizar protocolos atribuídos a ele
  'protocols:comment',   // Comentar em protocolos

  // Departamento
  'department:read',     // Ver informações do departamento

  // 🆕 CIDADÃOS (Para Agilizar Atendimento)
  'citizens:read',       // Buscar e visualizar cidadãos
  'citizens:verify',     // APROVAR cadastros pendentes (Bronze → Prata)
  'citizens:update',     // Atualizar dados de cidadãos

  // 🆕 ASSISTÊNCIA SOCIAL (Para Agilizar Atendimento)
  'social-assistance:read',    // Ver famílias vulneráveis
  'social-assistance:create',  // Cadastrar vulnerabilidade
  'social-assistance:update',  // Atualizar dados sociais
]
```

**Casos de Uso**:
- Atendente do balcão pode aprovar cadastro de cidadão na hora
- Servidor da educação pode cadastrar vulnerabilidade ao identificar criança em risco
- Funcionário de qualquer secretaria pode atualizar telefone/endereço

---

### 🟡 **COORDINATOR** (Coordenador)
**Nível**: 2
**Descrição**: Coordenador de equipe ou setor

#### Permissões Adicionais:
```typescript
[
  // Protocolos
  'protocols:assign',    // Atribuir protocolos a membros da equipe

  // Equipe
  'team:read',          // Ver equipe do departamento
  'team:metrics',       // Ver métricas da equipe

  // Todas as permissões de USER incluindo cidadãos
]
```

---

### 🟠 **MANAGER** (Secretário)
**Nível**: 3
**Descrição**: Secretário municipal, gestor de departamento

#### Permissões Adicionais:
```typescript
[
  // Serviços
  'services:create',     // Criar novos serviços
  'services:update',     // Modificar serviços

  // Equipe
  'team:manage',         // Gerenciar equipe completa

  // Relatórios
  'reports:department',  // Relatórios do departamento

  // Departamento
  'department:manage',   // Gerenciar departamento

  // Cidadãos
  'citizens:manage',     // Gestão completa de cidadãos

  // Todas as permissões de COORDINATOR
]
```

---

### 🔴 **ADMIN** (Administrador)
**Nível**: 4
**Descrição**: Prefeito, Vice-Prefeito, Administrador Geral

#### Permissões Adicionais:
```typescript
[
  // Protocolos
  'protocols:create',    // Criar protocolos manualmente

  // Serviços
  'services:delete',     // Remover serviços

  // Chamados
  'chamados:create',     // Sistema de chamados internos

  // Relatórios
  'reports:full',        // Todos os relatórios do município

  // Departamentos
  'departments:read',    // Ver todos departamentos

  // Analytics
  'analytics:full',      // Analytics completo

  // Todas as permissões de MANAGER
]
```

---

### ⚫ **SUPER_ADMIN** (Super Administrador)
**Nível**: 5
**Descrição**: Suporte técnico DigiUrban, acesso multi-tenant

#### Permissões:
```typescript
[
  'system:admin',        // Administração do sistema
  'tenants:manage',      // Gerenciar municípios
  'users:super_manage',  // Gerenciar usuários cross-tenant
  '*',                   // TODAS as permissões (wildcard)
]
```

---

## 🔐 Endpoints e Permissões Necessárias

### Cidadãos

| Endpoint | Método | Permissão | Quem Pode? |
|----------|--------|-----------|------------|
| `/admin/citizens/search` | GET | `citizens:read` | ✅ USER+ |
| `/admin/citizens/pending` | GET | `citizens:verify` | ✅ USER+ |
| `/admin/citizens/:id/verify` | PUT | `citizens:verify` | ✅ USER+ |
| `/admin/citizens/:id/reject` | PUT | `citizens:verify` | ✅ USER+ |
| `/admin/citizens/:id/details` | GET | `citizens:read` | ✅ USER+ |
| `/admin/citizens/:id/family` | GET | `citizens:read` | ✅ USER+ |
| `/admin/citizens/:id/family` | POST | `citizens:update` | ✅ USER+ |
| `/admin/citizens/:id/family/:memberId` | DELETE | `citizens:update` | ✅ USER+ |

### Assistência Social

| Endpoint | Método | Permissão | Quem Pode? |
|----------|--------|-----------|------------|
| `/admin/citizens/vulnerable` | GET | `social-assistance:read` | ✅ USER+ |
| `/admin/citizens/:id/vulnerability` | POST | `social-assistance:create` | ✅ USER+ |
| `/admin/citizens/:id/vulnerability` | PUT | `social-assistance:update` | ✅ USER+ |

---

## 🎭 Exemplos Práticos

### Cenário 1: Atendente no Balcão
**Cargo**: USER (Servidor)

```typescript
// Cidadão chega no balcão
// 1. Busca por CPF
GET /admin/citizens/search?cpf=12345678900
// ✅ Permitido: citizens:read

// 2. Não encontrou, cidadão se cadastra via app
// 3. Aparece na lista de pendentes
GET /admin/citizens/pending
// ✅ Permitido: citizens:verify

// 4. Atendente revisa e aprova NA HORA
PUT /admin/citizens/123/verify
// ✅ Permitido: citizens:verify
// Sistema registra: "Aprovado por: Maria Silva (USER)"

// Cidadão já sai com cadastro aprovado! 🎉
```

### Cenário 2: Professora Identifica Vulnerabilidade
**Cargo**: USER (Servidor da Educação)

```typescript
// Professora percebe criança em situação de risco
// 1. Busca o responsável
GET /admin/citizens/search?cpf=98765432100
// ✅ Permitido: citizens:read

// 2. Registra vulnerabilidade social
POST /admin/citizens/456/vulnerability
{
  memberCount: 5,
  monthlyIncome: 500,
  riskLevel: "HIGH",
  vulnerabilityType: "FOOD_INSECURITY",
  observations: "Criança relatou não ter almoçado..."
}
// ✅ Permitido: social-assistance:create

// Assistência Social é notificada automaticamente
// Família entra no sistema de acompanhamento
```

### Cenário 3: Secretário Aprova em Lote
**Cargo**: MANAGER (Secretário)

```typescript
// 20 cadastros pendentes
GET /admin/citizens/pending
// ✅ Permitido: citizens:verify

// Aprova todos que estão completos
for (let citizen of pendingCitizens) {
  PUT /admin/citizens/{citizen.id}/verify
  // ✅ Permitido: citizens:verify
}

// Sistema mantém log de auditoria:
// "20 cadastros aprovados por: João Santos (MANAGER)"
```

---

## 🔍 Auditoria e Segurança

### O que é registrado?

Mesmo com permissões amplas, TUDO é auditado:

```typescript
// Toda aprovação registra:
{
  verifiedBy: "user-id-123",
  verifiedAt: "2025-10-02T14:30:00Z",
  verificationNotes: "Documentos conferidos no balcão"
}

// Logs do sistema:
[AUDIT] 2025-10-02 14:30:00 - User: maria@prefeitura.gov.br (USER)
        - Action: APPROVE_CITIZEN - IP: 192.168.1.50
```

### Proteções Mantidas

- ✅ **Multi-tenant**: Servidor só vê cidadãos do próprio município
- ✅ **Autenticação**: Precisa estar logado com token válido
- ✅ **Rastreabilidade**: Quem aprovou fica registrado
- ✅ **Reversível**: Admin pode desativar cidadão se necessário
- ✅ **Notificações**: Cidadão recebe confirmação por email/app

---

## 🚀 Benefícios do Sistema Atual

### Para o Cidadão
- ⚡ Aprovação imediata no balcão
- 📱 Não precisa voltar outro dia
- 🎯 Qualquer servidor pode ajudar

### Para a Prefeitura
- 🏃 Atendimento mais ágil
- 📊 Menos filas
- 👥 Responsabilidade compartilhada
- 🔍 Auditoria completa mantida

### Para Servidores
- 💪 Autonomia para resolver
- 🤝 Colaboração entre secretarias
- 📝 Processo simples e rápido

---

## 📝 Notas de Implementação

### Como verificar permissão no código:

```typescript
// Backend - middleware automático
router.get('/pending',
  requirePermission('citizens:verify'),
  asyncHandler(async (req, res) => {
    // Só executa se usuário tiver permissão
  })
);

// Frontend - verificar antes de mostrar UI
import { useAdminPermissions } from '@/contexts/AdminAuthContext'

const { hasPermission } = useAdminPermissions()

{hasPermission('citizens:verify') && (
  <Button onClick={handleApprove}>
    Aprovar Cadastro
  </Button>
)}
```

### Adicionando novas permissões:

1. Adicione em `getRolePermissions()` no `admin-auth.ts`
2. Use `requirePermission('nova:permissao')` no endpoint
3. Documente neste arquivo

---

## 🔄 Histórico de Mudanças

### v2.0 - Outubro 2025
- ✅ **MUDANÇA IMPORTANTE**: Todos servidores (USER+) podem aprovar cidadãos
- ✅ Adicionadas permissões de assistência social para todos
- ✅ Justificativa: Agilizar atendimento municipal

**Migração**: Automática, não requer alterações no banco.

---

## 📞 Suporte

Dúvidas sobre permissões? Contate o time DigiUrban.

**Lembre-se**: Autonomia com responsabilidade. Todas ações são auditadas! 🔍
