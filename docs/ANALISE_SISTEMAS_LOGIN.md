# Análise Completa dos Sistemas de Login - DigiUrban

## 📋 Sumário Executivo

Este documento apresenta uma análise detalhada dos três sistemas de autenticação implementados no DigiUrban, identificando inconsistências, problemas e propondo soluções padronizadas.

---

## 🔍 Análise da Implementação Atual

### 1. **Painel do Cidadão** (`/cidadao/*`)

#### Backend
- **Rota**: `/api/auth/citizen/login`
- **Arquivo**: `backend/src/routes/citizen-auth.ts`
- **Middleware**: `tenantMiddleware` aplicado
- **Autenticação**: JWT Bearer Token em LocalStorage
- **Multi-tenancy**: ✅ **Login Inteligente** - busca cidadão em qualquer tenant automaticamente

#### Frontend
- **Contexto**: `CitizenAuthContext.tsx`
- **Storage**: `localStorage.getItem('digiurban_citizen_token')`
- **Tenant**: Extraído do JWT payload (linhas 77-88)
- **API Request**: Envia `X-Tenant-ID` extraído do token

#### Fluxo de Autenticação
```
1. Cidadão faz login com CPF/email + senha
2. Backend busca cidadão em QUALQUER tenant (linha 268)
3. Backend gera JWT com { citizenId, tenantId, type: 'citizen' }
4. Frontend armazena token em localStorage
5. Requisições subsequentes: extrai tenantId do JWT e envia via header X-Tenant-ID
```

#### ✅ Pontos Fortes
- Login inteligente sem precisar especificar tenant
- TenantId no JWT garante isolamento
- Extração automática de tenant do token

#### ⚠️ Problemas Identificados
1. **Token em localStorage** - vulnerável a XSS
2. **Não usa httpOnly cookies** como Admin
3. **Inconsistência**: Admin usa cookie, Cidadão usa localStorage

---

### 2. **Painel Admin** (`/admin/*`)

#### Backend
- **Rota**: `/api/admin/auth/login` (NÃO `/api/auth/admin`)
- **Arquivo**: `backend/src/routes/admin-auth.ts`
- **Middleware**: `tenantMiddleware` aplicado
- **Autenticação**: JWT em **httpOnly cookie** `digiurban_admin_token`
- **Multi-tenancy**: ✅ **Login Inteligente** - busca usuário em qualquer tenant automaticamente

#### Frontend
- **Contexto**: `AdminAuthContext.tsx`
- **Storage**: httpOnly cookie (inacessível via JS) + `tenantId` em estado React
- **Tenant**: Backend retorna `tenantId` na resposta, frontend armazena no estado (linha 66)
- **API Request**: Envia `X-Tenant-ID` do estado React + cookie automático

#### Fluxo de Autenticação
```
1. Admin faz login com email + senha
2. Backend busca usuário em QUALQUER tenant (linha 110)
3. Backend gera JWT com { userId, tenantId, role, departmentId, type: 'admin' }
4. Backend seta cookie httpOnly com JWT (linhas 215-222)
5. Backend retorna tenantId na resposta (linha 234)
6. Frontend armazena tenantId no estado React (linhas 151-157)
7. Requisições: cookie enviado automaticamente + X-Tenant-ID do estado
```

#### ✅ Pontos Fortes
- **httpOnly cookie** - seguro contra XSS
- Login inteligente sem precisar especificar tenant
- TenantId no JWT garante isolamento
- Cookie com sameSite: 'lax' para CSRF protection

#### ⚠️ Problemas Identificados
1. **Dependência de localStorage para tenantId** - se limpar localStorage, perde tenant (mas API ainda funciona pois está no cookie)
2. **Complexidade**: Dupla fonte de verdade (cookie JWT + estado React)
3. **URL inconsistente**: Usa `/api/admin/auth/` ao invés de `/api/auth/admin/`

---

### 3. **Painel Super Admin** (`/super-admin/*`)

#### Backend
- **Rota**: `/api/super-admin/login`
- **Arquivo**: `backend/src/routes/super-admin.ts`
- **Middleware**: **SEM tenant middleware** (não é multi-tenant)
- **Autenticação**: JWT Bearer Token
- **Multi-tenancy**: ❌ Não aplica (super admin gerencia TODOS os tenants)

#### Frontend
- **Contexto**: `SuperAdminAuthContext.tsx`
- **Storage**: `localStorage.getItem('digiurban_super_admin_token')`
- **Tenant**: N/A (não pertence a nenhum tenant específico)
- **API Request**: Envia `Authorization: Bearer <token>`

#### Fluxo de Autenticação
```
1. Super Admin faz login com email + senha
2. Backend busca usuário com role 'SUPER_ADMIN' (linha 203)
3. Backend gera JWT com { userId, email, role, type: 'super-admin' }
4. Frontend armazena token em localStorage
5. Requisições: Bearer token via Authorization header
```

#### ✅ Pontos Fortes
- Isolamento completo do sistema multi-tenant
- Implementação simples e direta
- Não precisa de tenant middleware

#### ⚠️ Problemas Identificados
1. **Token em localStorage** - vulnerável a XSS
2. **Inconsistência com Admin**: Admin usa cookie, Super Admin usa localStorage
3. **Rotas confusas**:
   - Login: `/api/super-admin/login`
   - Outras rotas: `/api/super-admin/auth/me`
   - Inconsistente com padrão `/auth/`

---

## 🚨 Problemas Críticos Identificados

### 1. **Inconsistência de Armazenamento de Tokens**

| Sistema | Storage | Segurança |
|---------|---------|-----------|
| Cidadão | localStorage | ❌ Vulnerável a XSS |
| Admin | httpOnly cookie | ✅ Seguro |
| Super Admin | localStorage | ❌ Vulnerável a XSS |

**Impacto**:
- Cidadão e Super Admin vulneráveis a ataques XSS
- Padrões diferentes confundem desenvolvedores
- Manutenção complexa

### 2. **Inconsistência de Rotas de API**

```
❌ ATUAL (Inconsistente):
/api/auth/citizen/login          → Cidadão
/api/admin/auth/login            → Admin
/api/super-admin/login           → Super Admin

✅ PROPOSTA (Padronizado):
/api/auth/citizen/login          → Cidadão
/api/auth/admin/login            → Admin
/api/auth/super-admin/login      → Super Admin
```

### 3. **Gestão de Tenant Complexa e Inconsistente**

| Sistema | Como obtém Tenant | Problema |
|---------|-------------------|----------|
| Cidadão | Extrai do JWT payload | ✅ Funciona |
| Admin | Backend retorna + armazena em estado | ⚠️ Dupla fonte de verdade |
| Super Admin | N/A | ✅ OK |

**Problemas Admin**:
- TenantId está no JWT (cookie)
- Backend também retorna tenantId na resposta
- Frontend armazena em estado React
- Se estado limpar mas cookie existir, perde referência

### 4. **Middleware tenantMiddleware Aplicado Inconsistentemente**

```typescript
// citizen-auth.ts (linha 79)
router.use(tenantMiddleware);  ✅

// admin-auth.ts (linha 97)
router.use(tenantMiddleware);  ✅

// super-admin.ts
// NÃO usa tenantMiddleware  ✅ (correto, não é multi-tenant)
```

**Problema**: O middleware `tenantMiddleware` tenta identificar tenant, mas:
- Login inteligente busca em QUALQUER tenant
- Middleware pode conflitar ou ser redundante
- Complexidade desnecessária

### 5. **Erro 502 no Super Admin Login**

**Causa Raiz Identificada**:
- Frontend tenta acessar `http://localhost:3001/api/super-admin/login`
- Backend NÃO está rodando localmente
- Aplicação está na VPS (72.60.10.108:3060)

**Solução Imediata**:
```env
# .env.local
NEXT_PUBLIC_API_URL=http://72.60.10.108:3060/api
```

---

## ✅ Proposta de Padronização

### Objetivo
Criar um sistema de autenticação **uniforme, seguro e mantível** para os três painéis, respeitando suas diferenças funcionais.

---

### 🎯 Princípios da Arquitetura Proposta

1. **Segurança em Primeiro Lugar**
   - Todos os tokens em httpOnly cookies
   - SameSite cookies para CSRF protection
   - Secure flag em produção

2. **Consistência de Padrões**
   - Mesma estrutura de rotas `/api/auth/{tipo}/`
   - Mesma estratégia de armazenamento
   - Mesma gestão de tenant

3. **Simplicidade**
   - Single source of truth para tenant (JWT)
   - Reduzir lógica duplicada
   - Código fácil de entender

4. **Isolamento Multi-Tenant**
   - TenantId sempre no JWT
   - Backend valida tenant em cada request
   - Frontend extrai tenant do JWT quando necessário

---

### 📐 Arquitetura Padronizada Proposta

#### 1. **Estrutura de Rotas Unificada**

```
Backend:
/api/auth/citizen/login         → Login cidadão
/api/auth/citizen/register      → Registro cidadão
/api/auth/citizen/me            → Dados do cidadão
/api/auth/citizen/logout        → Logout cidadão

/api/auth/admin/login           → Login admin
/api/auth/admin/me              → Dados do admin
/api/auth/admin/permissions     → Permissões do admin
/api/auth/admin/logout          → Logout admin

/api/auth/super-admin/login     → Login super admin
/api/auth/super-admin/me        → Dados do super admin
/api/auth/super-admin/logout    → Logout super admin
```

#### 2. **Storage Unificado: httpOnly Cookies**

**Todos os sistemas usam httpOnly cookies**:

```typescript
// Backend - ao fazer login
res.cookie('digiurban_{tipo}_token', token, {
  httpOnly: true,      // ✅ Não acessível via JS
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',     // ✅ CSRF protection
  maxAge: 3600000,     // 1 hora
  path: '/',
});
```

**Benefícios**:
- ✅ Proteção contra XSS (cookie inacessível via JavaScript)
- ✅ Proteção contra CSRF (sameSite)
- ✅ Consistência entre sistemas
- ✅ Logout real (backend limpa cookie)

#### 3. **Gestão de Tenant Simplificada**

**Proposta: Single Source of Truth**

```typescript
// ✅ PROPOSTA: Tenant sempre no JWT, extraído pelo backend

// Backend - JWT Payload
const jwtPayload = {
  [userId/citizenId]: user.id,
  tenantId: user.tenantId,  // ✅ SEMPRE presente (exceto super-admin)
  role: user.role,
  type: 'admin' | 'citizen' | 'super-admin'
}

// Backend - Middleware de autenticação
function authenticateAndExtractTenant(req, res, next) {
  const token = req.cookies[`digiurban_${type}_token`];
  const decoded = jwt.verify(token, secret);

  req.user = decoded;
  req.tenantId = decoded.tenantId;  // ✅ Backend extrai e disponibiliza
  next();
}

// Frontend - Não precisa gerenciar tenant
// Backend extrai do cookie automaticamente
const response = await apiRequest('/admin/protocols', {
  credentials: 'include'  // Envia cookie automaticamente
});
```

**Mudanças**:
- ❌ Remover `X-Tenant-ID` header do frontend
- ❌ Remover extração manual de tenant do JWT
- ✅ Backend extrai tenant do JWT em middleware de autenticação
- ✅ Frontend apenas envia cookie (credentials: 'include')

#### 4. **Contextos de Autenticação Padronizados**

**Template Unificado**:

```typescript
interface AuthContextType {
  user: User | null;
  stats: Stats | null;
  login: (credentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  apiRequest: (endpoint, options?) => Promise<any>;
  loading: boolean;
  error: string | null;
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);

  // ✅ apiRequest padrão para todos
  const apiRequest = async (endpoint, options = {}) => {
    const url = getFullApiUrl(endpoint);
    const response = await fetch(url, {
      ...options,
      credentials: 'include',  // ✅ Envia cookie automaticamente
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (response.status === 401) {
      // Token expirado, limpar e redirecionar
      setUser(null);
      router.push('/tipo/login');
      throw new Error('Não autenticado');
    }

    return response.json();
  };

  // Login padrão
  const login = async (credentials) => {
    const response = await fetch(getFullApiUrl('/auth/tipo/login'), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) throw new Error('Login falhou');

    const data = await response.json();
    setUser(data.user);
    setStats(data.stats);
    router.push('/tipo/dashboard');
  };

  // Logout padrão
  const logout = async () => {
    try {
      await apiRequest('/auth/tipo/logout', { method: 'POST' });
    } finally {
      setUser(null);
      router.push('/tipo/login');
    }
  };

  return <AuthContext.Provider value={{...}}>{children}</AuthContext.Provider>;
}
```

---

### 🔧 Plano de Implementação

#### Fase 1: Padronizar Rotas Backend ✅

**Ações**:
1. Criar `/api/auth/admin/` renomeando de `/api/admin/auth/`
2. Criar `/api/auth/super-admin/` movendo de `/api/super-admin/`
3. Manter `/api/auth/citizen/` (já correto)
4. Atualizar `index.ts` para usar novas rotas
5. **Manter rotas antigas como aliases temporários** para retrocompatibilidade

**Arquivos**:
- `backend/src/index.ts` (linhas 177-199)
- `backend/src/routes/admin-auth.ts` (mover para `auth/admin.ts`)
- `backend/src/routes/super-admin.ts` (criar versão em `auth/super-admin.ts`)

#### Fase 2: Migrar Admin para httpOnly Cookie (Já feito ✅)

**Situação Atual**: Admin já usa httpOnly cookie, apenas precisa remover gestão duplicada de tenant.

**Ações**:
1. ~~Backend já seta cookie~~ ✅
2. ~~Frontend já usa cookie~~ ✅
3. Remover estado React `tenantId` (linha 66 AdminAuthContext.tsx)
4. Backend extrair tenant do JWT em middleware de autenticação
5. Remover envio de `X-Tenant-ID` header (linha 76)

#### Fase 3: Migrar Cidadão para httpOnly Cookie

**Ações**:
1. Backend: setar cookie httpOnly no login (citizen-auth.ts linha 213)
2. Backend: adicionar rota `/auth/citizen/logout` que limpa cookie
3. Frontend: remover localStorage
4. Frontend: usar `credentials: 'include'` em todas requisições
5. Frontend: remover extração manual de tenant do JWT
6. Frontend: remover envio de `X-Tenant-ID` header

#### Fase 4: Migrar Super Admin para httpOnly Cookie

**Ações**:
1. Backend: setar cookie httpOnly no login (super-admin.ts linha 222)
2. Backend: adicionar rota `/auth/super-admin/logout` que limpa cookie
3. Frontend: remover localStorage
4. Frontend: usar `credentials: 'include'` em todas requisições

#### Fase 5: Simplificar Middleware de Tenant

**Ações**:
1. Criar middleware `authenticateTenant` que:
   - Valida JWT do cookie
   - Extrai `tenantId` do payload
   - Adiciona `req.tenantId` e `req.user`
2. Aplicar em rotas que precisam de tenant
3. Remover middleware `tenantMiddleware` atual (muito complexo)

#### Fase 6: Padronizar Contextos Frontend

**Ações**:
1. Criar `contexts/auth/BaseAuthContext.tsx` com lógica compartilhada
2. Refatorar `CitizenAuthContext.tsx` para estender BaseAuthContext
3. Refatorar `AdminAuthContext.tsx` para estender BaseAuthContext
4. Refatorar `SuperAdminAuthContext.tsx` para estender BaseAuthContext

#### Fase 7: Testes e Documentação

**Ações**:
1. Testar login/logout em todos os painéis
2. Testar renovação de token
3. Testar expiração de sessão
4. Testar isolamento multi-tenant
5. Documentar nova arquitetura
6. Criar guia de migração

---

### 🔒 Melhorias de Segurança

#### 1. **Refresh Tokens**
Implementar sistema de refresh token para melhorar UX:

```typescript
// Access Token: 15 minutos (httpOnly cookie)
// Refresh Token: 7 dias (httpOnly cookie)

// Backend endpoint
POST /api/auth/refresh
- Valida refresh token
- Gera novo access token
- Retorna novo access token em cookie
```

#### 2. **Rate Limiting Aprimorado**
Já implementado ✅ mas pode ser melhorado:

```typescript
// Atual: loginRateLimiter e accountLockoutMiddleware
// Proposta: Adicionar rate limit por IP + por conta
```

#### 3. **Logout em Todos Dispositivos**
Implementar blacklist de tokens:

```typescript
// Backend: Redis/DB para armazenar tokens revogados
// Endpoint: POST /api/auth/{tipo}/logout-all
```

#### 4. **Detecção de Sessões Múltiplas**
Alertar usuário se detectar login de novo dispositivo:

```typescript
// Armazenar sessões ativas no DB
// Enviar notificação/email ao detectar novo login
```

---

### 📊 Comparação: Antes vs Depois

| Aspecto | ❌ Antes | ✅ Depois |
|---------|---------|-----------|
| **Storage** | localStorage (Cidadão, Super Admin)<br>httpOnly cookie (Admin) | httpOnly cookie (todos) |
| **Rotas** | Inconsistentes<br>`/api/admin/auth/`<br>`/api/super-admin/` | Padronizadas<br>`/api/auth/admin/`<br>`/api/auth/super-admin/` |
| **Gestão Tenant** | Dupla fonte de verdade (Admin)<br>Extração manual (Cidadão) | Single source (JWT)<br>Backend extrai automaticamente |
| **Segurança XSS** | ⚠️ Vulnerável (localStorage) | ✅ Protegido (httpOnly) |
| **Segurança CSRF** | ⚠️ Parcial | ✅ sameSite cookies |
| **Manutenção** | 3 implementações diferentes | 1 implementação base estendida |
| **Complexidade** | Alta (muita lógica no frontend) | Baixa (backend gerencia autenticação) |

---

### 🎯 Benefícios da Padronização

#### 1. **Segurança**
- ✅ Proteção contra XSS em todos os painéis
- ✅ Proteção contra CSRF
- ✅ Logout real (backend controla sessão)
- ✅ Tokens não expostos em localStorage

#### 2. **Manutenção**
- ✅ Código DRY (Don't Repeat Yourself)
- ✅ Bugs corrigidos em um lugar afetam todos
- ✅ Fácil adicionar novos tipos de usuários
- ✅ Documentação única

#### 3. **Developer Experience**
- ✅ Padrões claros e consistentes
- ✅ Menos decisões a tomar
- ✅ Onboarding mais rápido
- ✅ Menos confusão

#### 4. **Performance**
- ✅ Cookies enviados automaticamente (sem JS extra)
- ✅ Menos lógica no frontend
- ✅ Backend valida uma vez por request

---

### 🚀 Próximos Passos Imediatos

#### 1. **Corrigir Erro 502 no Super Admin** (URGENTE)

```bash
# digiurban/frontend/.env.local
NEXT_PUBLIC_API_URL=http://72.60.10.108:3060/api
```

#### 2. **Validar Backend na VPS**
```bash
ssh root@72.60.10.108
curl http://127.0.0.1:3001/health
curl -X POST http://127.0.0.1:3001/api/super-admin/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@digiurban.com","password":"senha123"}'
```

#### 3. **Criar Branch de Padronização**
```bash
git checkout -b feature/auth-standardization
```

#### 4. **Implementar Fase 1** (Padronizar Rotas)
Criar aliases para rotas antigas + novas rotas padronizadas

---

### 📝 Checklist de Implementação

#### Backend
- [ ] Criar `/api/auth/admin/` (alias de `/api/admin/auth/`)
- [ ] Criar `/api/auth/super-admin/` (mover de `/api/super-admin/`)
- [ ] Migrar Cidadão para httpOnly cookie
- [ ] Migrar Super Admin para httpOnly cookie
- [ ] Criar middleware `authenticateTenant` unificado
- [ ] Adicionar rotas de logout para todos os tipos
- [ ] Implementar refresh tokens (opcional)

#### Frontend
- [ ] Atualizar URLs de API para padrão `/api/auth/{tipo}/`
- [ ] Remover localStorage de Cidadão e Super Admin
- [ ] Remover estado `tenantId` de Admin
- [ ] Adicionar `credentials: 'include'` em todas requisições
- [ ] Remover envio manual de `X-Tenant-ID` header
- [ ] Criar `BaseAuthContext` com lógica compartilhada
- [ ] Refatorar contextos para estender Base

#### Testes
- [ ] Testar login em todos os painéis
- [ ] Testar logout em todos os painéis
- [ ] Testar expiração de sessão
- [ ] Testar isolamento multi-tenant
- [ ] Testar proteção CSRF
- [ ] Testar em diferentes browsers

#### Documentação
- [ ] Atualizar README com nova arquitetura
- [ ] Criar guia de autenticação
- [ ] Documentar endpoints de API
- [ ] Criar diagramas de fluxo

---

## 📚 Referências

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [MDN: HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)

---

## ✍️ Autoria

**Documento**: Análise e Proposta de Padronização de Sistemas de Login
**Data**: 22 de Outubro de 2025
**Versão**: 1.0
**Status**: Aguardando aprovação para implementação
