# 📊 ANÁLISE COMPLETA DO SISTEMA DE AUTENTICAÇÃO ADMIN

**Data:** 18/10/2025
**Status:** Sistema funciona via curl mas falha no browser

---

## 🔍 RESUMO EXECUTIVO

O sistema de autenticação **FUNCIONA CORRETAMENTE** quando testado via curl, mas **FALHA** quando acessado pelo navegador. Isso indica que o problema está na camada de **frontend**, não no backend.

### Evidências:
- ✅ **Curl login:** 200 OK com token válido (16:35:08)
- ❌ **Browser login:** 401 Unauthorized (16:32:53, 16:34:19, 16:36:13)

---

## 🏗️ ARQUITETURA DO SISTEMA

### 1. FLUXO DE AUTENTICAÇÃO (Backend)

```
┌─────────────────────────────────────────────────────────┐
│ POST /api/admin/auth/login                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 1. tenantMiddleware                                     │
│    └─ Identifica tenant via X-Tenant-ID: demo          │
│                                                         │
│ 2. loginRateLimiter                                     │
│    └─ Max 50 tentativas / 5 minutos                    │
│                                                         │
│ 3. accountLockoutMiddleware('user')                     │
│    └─ Verifica se conta está bloqueada                 │
│    └─ Max 5 tentativas falhas → bloqueia 30 min        │
│                                                         │
│ 4. Validação de Credenciais                            │
│    a) Busca usuário: prisma.user.findFirst()           │
│       WHERE: tenantId + email + isActive = true        │
│    b) Compara senha: bcrypt.compare()                  │
│       └─ BCRYPT_ROUNDS: 12                             │
│    c) Se falhar: recordFailedLogin()                   │
│       └─ Incrementa failedLoginAttempts                │
│       └─ Após 5 falhas: bloqueia conta                 │
│                                                         │
│ 5. Geração do Token JWT                                │
│    └─ Payload: userId, tenantId, role, type: 'admin'  │
│    └─ Expiração: 1 hora (ADMIN_EXPIRES_IN)            │
│    └─ Secret: process.env.JWT_SECRET                   │
│                                                         │
│ 6. Auditoria                                            │
│    └─ Log em audit_logs: login_success/login_failed    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 2. CAMADAS DE SEGURANÇA

#### A) Rate Limiting (rate-limit.ts)
```typescript
Window: 5 minutos
Max Attempts: 50 tentativas
Status Code: 429 (Too Many Requests)
```

#### B) Account Lockout (account-lockout.ts)
```typescript
Max Failed Attempts: 5
Lockout Duration: 30 minutos
Status Code: 423 (Locked)
Reset on Success: true
```

#### C) Tenant Isolation (tenant.ts)
```typescript
Identificação:
1. X-Tenant-ID header (prioritário)
2. Subdomínio (municipio.digiurban.com)
3. Query param ?tenant=demo
4. Default: 'demo' (localhost)
```

#### D) Password Hashing (security.ts)
```typescript
Algorithm: bcrypt
Rounds: 12 (OWASP 2024)
Min Length: 8 caracteres
Requirements:
  - Maiúscula
  - Minúscula
  - Número
  - Caractere especial
```

---

## 🔬 DIAGNÓSTICO DO PROBLEMA

### Estado Atual do Banco de Dados

```
Email: prefeito@demo.gov.br
Password Hash: $2b$10$KMw6k0Fu.Pj4Wgma/3GvDuI...
Failed Attempts: 1
Locked Until: null
Is Active: true
Tenant ID: cmgv2zgb40000cbo04gydxw3g
```

### Testes de Senha
```
✅ bcrypt.compare('senha123', hash) → VÁLIDA
❌ bcrypt.compare('Senha123', hash) → INVÁLIDA
```

### Logs do Backend

#### ❌ Tentativa 1 (Browser - 16:32:53)
```
1. SELECT tenant WHERE domain='demo' → ✅ Found
2. SELECT user.lockedUntil → ✅ Not locked
3. SELECT user WHERE email + isActive=true → ✅ Found
4. SELECT failedLoginAttempts → ✅ Found
5. UPDATE failedLoginAttempts = 2 → ❌ Password wrong
6. [AUDIT] login_failed
7. Response: 401 Unauthorized
```

#### ❌ Tentativa 2 (Browser - 16:34:19)
```
Mesmo padrão: 401 Unauthorized
```

#### ✅ Tentativa 3 (Curl - 16:35:08)
```
1-3. [Same as above] → ✅
4. bcrypt.compare('senha123') → ✅ MATCH
5. UPDATE failedLoginAttempts=0, lockedUntil=null
6. [AUDIT] login_success
7. Response: 200 OK + token
```

#### ❌ Tentativa 4 (Browser - 16:36:13)
```
1. SELECT tenant → ✅
2. SELECT user.lockedUntil → ✅
3. SELECT user → ✅
4. UPDATE failedLoginAttempts = 1 → ❌ Password wrong
5. [AUDIT] login_failed
6. Response: 401
```

### 🎯 CONCLUSÃO CRÍTICA

O backend **rejeita a senha do browser** mas **aceita a senha do curl**.

**Possíveis causas:**

1. **Frontend está enviando senha diferente**
   - Autocomplete do browser
   - JavaScript modificando o valor
   - Encoding/charset issues
   - Trim/whitespace

2. **Headers diferentes**
   - Content-Type incorreto
   - Body encoding diferente
   - UTF-8 vs ASCII

3. **Problema no formulário**
   - Event handler incorreto
   - Valor do input não sincronizado
   - React state desatualizado

---

## 📝 CONFIGURAÇÕES DE SEGURANÇA

### security.ts
```typescript
BCRYPT_ROUNDS: 12
ADMIN_EXPIRES_IN: '1h'
RATE_LIMIT.WINDOW_MS: 300000 (5 min)
RATE_LIMIT.MAX_ATTEMPTS: 50
ACCOUNT_LOCKOUT.MAX_FAILED_ATTEMPTS: 5
ACCOUNT_LOCKOUT.LOCKOUT_DURATION_MINUTES: 30
```

### .env (Backend)
```
DEFAULT_TENANT=demo
JWT_SECRET=[configured]
DATABASE_URL=[configured]
```

---

## 🔧 FRONTEND (AdminAuthContext.tsx)

### Função apiRequest()
```typescript
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('digiurban_admin_token')
  const tenant = getTenant() // Returns 'demo' for localhost

  const headers = {
    'Content-Type': 'application/json',
    'X-Tenant-ID': tenant,
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  }

  const response = await fetch(`http://localhost:3001${endpoint}`, {
    ...options,
    headers
  })
  // ... error handling
}
```

### Função login()
```typescript
const login = async (email: string, password: string) => {
  localStorage.removeItem('digiurban_admin_token')

  const response = await apiRequest('/api/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })

  localStorage.setItem('digiurban_admin_token', data.token)
  setUser(data.user)
  router.push('/admin/dashboard')
}
```

### 🚨 DEBUG ADICIONADO

Código inserido para diagnóstico:
```typescript
console.log('[Login] Email:', email)
console.log('[Login] Password length:', password.length)
console.log('[Login] Password:', password) // REMOVER DEPOIS!
```

---

## ⚠️ PROBLEMAS IDENTIFICADOS

### 1. **Password Mismatch no Browser**
- Backend rejeita senha enviada pelo browser
- Backend aceita mesma senha via curl
- **Hipótese:** Frontend está enviando valor diferente

### 2. **Account Lockout Ativo**
- Sistema bloqueia conta após 5 tentativas
- Cada teste falho incrementa contador
- Necessário resetar manualmente para novos testes

### 3. **Falta de Logs no Frontend**
- Sem visibilidade do que está sendo enviado
- Debug logs adicionados mas aguardando teste

### 4. **Possível Autocomplete do Browser**
- Navegador pode estar preenchendo senha antiga
- Necessário verificar console do browser

---

## 🎬 PRÓXIMOS PASSOS

### 1. **Verificar Console do Browser**
Aguardando usuário testar login e enviar logs:
```
[Login] Email: ...
[Login] Password length: ...
[Login] Password: ...
```

### 2. **Comparar Requisições**

#### Curl (Funciona):
```bash
curl -X POST http://localhost:3001/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: demo" \
  -d '{"email":"prefeito@demo.gov.br","password":"senha123"}'
```

#### Browser (Falha):
```
Aguardando Network tab do DevTools
```

### 3. **Soluções Temporárias**

#### Resetar conta:
```bash
node reset-account.js
```

#### Testar senha diretamente:
```bash
node verify-user.js
```

---

## 📊 MÉTRICAS

### Tentativas de Login Registradas
```
16:31:37 → 423 Locked (browser)
16:32:53 → 401 Unauthorized (browser)
16:34:19 → 401 Unauthorized (browser)
16:35:08 → 200 OK (curl) ✅
16:36:13 → 401 Unauthorized (browser)
```

### Taxa de Sucesso
- **Curl:** 100% (1/1)
- **Browser:** 0% (0/4)

---

## 🔐 CREDENCIAIS DE TESTE

```
Email: prefeito@demo.gov.br
Senha: senha123
Tenant: demo
```

**IMPORTANTE:** Senha é case-sensitive!
- ✅ `senha123` → correto
- ❌ `Senha123` → incorreto

---

## 🛡️ STACK DE SEGURANÇA

```
┌──────────────────────────────────┐
│ CAMADA 1: Rate Limiting          │ → 429 Too Many Requests
├──────────────────────────────────┤
│ CAMADA 2: Account Lockout        │ → 423 Locked
├──────────────────────────────────┤
│ CAMADA 3: Tenant Isolation       │ → 404 Tenant Not Found
├──────────────────────────────────┤
│ CAMADA 4: Password Validation    │ → 401 Unauthorized
├──────────────────────────────────┤
│ CAMADA 5: JWT Token              │ → 401 Token Invalid
├──────────────────────────────────┤
│ CAMADA 6: Audit Logging          │ → audit_logs table
└──────────────────────────────────┘
```

---

## 📌 CONCLUSÃO

**O BACKEND ESTÁ FUNCIONANDO PERFEITAMENTE.**

O problema está no **frontend enviando senha incorreta** para o backend. A senha correta `senha123` funciona via curl mas o browser está enviando um valor diferente.

**Ação Necessária:** Verificar console do browser para ver exatamente qual senha está sendo enviada.
