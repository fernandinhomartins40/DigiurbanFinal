# 🎯 Guia de Padrões TypeScript - DigiUrban Backend

## 📋 Visão Geral

Este documento estabelece os padrões TypeScript modernos implementados na **Fase 3** da migração do DigiUrban Backend. Todos os desenvolvedores devem seguir estes padrões para manter a consistência e qualidade do código.

---

## 🔧 Configuração TypeScript

### tsconfig.json - Configuração Rigorosa

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "useUnknownInCatchVariables": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Scripts NPM Disponíveis

```bash
# Verificação de tipos
npm run type-check
npm run type-check:watch

# Linting e formatação
npm run lint
npm run lint:fix
npm run format
npm run format:check

# Validação completa
npm run check              # type-check + lint + format
npm run validate:production # check + regression tests

# Testes de regressão
npm run test:regression
npm run test:phase3
```

---

## 🏗️ Padrões Arquiteturais

### 1. Sistema de Tipos Centralizado

**✅ CORRETO:**
```typescript
// Sempre importar tipos do sistema centralizado
import {
  AuthenticatedRequest,
  SuccessResponse,
  ErrorResponse,
  TypedRequest,
  TypedResponse
} from '../types';
```

**❌ INCORRETO:**
```typescript
// Nunca definir tipos localmente se já existem no sistema
interface AuthenticatedRequest extends Request {
  user: any; // ❌ Já existe no sistema centralizado
}
```

### 2. Handlers de Rota Tipados

**✅ CORRETO - Padrão Moderno:**
```typescript
import { TypedRequest, TypedResponse, AuthenticatedRequest } from '../types';

// Handler tipado para dados de entrada e saída
router.post('/create', async (
  req: TypedRequest<CreateUserData, {}, { tenantId: string }>,
  res: TypedResponse<SuccessResponse<User> | ErrorResponse>
) => {
  // TypeScript garante tipos seguros automaticamente
  const { name, email } = req.body; // ✅ Tipado
  const { tenantId } = req.params;   // ✅ Tipado

  res.json({
    success: true,
    data: user // ✅ Tipado
  });
});

// Handler autenticado
router.get('/profile', requireAuth, async (
  req: AuthenticatedRequest,
  res: TypedResponse<SuccessResponse<UserProfile> | ErrorResponse>
) => {
  // req.user é garantidamente tipado e não-nulo
  const user = req.user; // ✅ UserWithRelations
  const tenant = req.tenant; // ✅ TenantWithMeta
});
```

### 3. Interfaces de Response Padronizadas

```typescript
// Response de sucesso
interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

// Response de erro
interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  details?: any;
}

// Response paginada
interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Exemplo de uso
const response: SuccessResponse<User[]> = {
  success: true,
  data: users,
  message: 'Usuários encontrados com sucesso'
};
```

### 4. Validação com Zod

```typescript
import { z } from 'zod';

// Schema de validação
const createUserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  role: z.enum(['USER', 'ADMIN'], { errorMap: () => ({ message: 'Role inválido' }) })
});

// Interface derivada do schema
type CreateUserData = z.infer<typeof createUserSchema>;

// Uso no handler
router.post('/users', validateRequest(createUserSchema), async (
  req: TypedRequest<CreateUserData>,
  res: TypedResponse<SuccessResponse<User> | ValidationErrorResponse>
) => {
  // req.body é automaticamente tipado e validado
  const userData = req.body; // ✅ CreateUserData
});
```

### 5. Type Guards Robustos

```typescript
import { isAuthenticatedRequest, hasPermission } from '../utils/guards';

// Usando type guards
router.get('/admin-only', (req, res, next) => {
  if (!isAuthenticatedRequest(req)) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  if (!hasPermission(req, 'ADMIN')) {
    return res.status(403).json({ error: 'Permissão negada' });
  }

  // A partir daqui, TypeScript sabe que req é AuthenticatedRequest
  const user = req.user; // ✅ UserWithRelations
  const userRole = req.userRole; // ✅ UserRole
});
```

---

## 🛠️ Utilitários Modernos

### 1. Prisma Helpers

```typescript
import {
  executePrismaOperation,
  buildDynamicWhere,
  buildPagination,
  executeWithRetry
} from '../utils/prisma-helpers';

// Operação Prisma com tratamento de erro
const result = await executePrismaOperation(async () => {
  return prisma.user.create({ data: userData });
});

if (result.success) {
  res.json({ success: true, data: result.data });
} else {
  res.status(400).json({ success: false, error: result.error });
}

// Paginação automática
const pagination = buildPagination({ page: '1', limit: '20', sortBy: 'name' });
const users = await prisma.user.findMany({
  ...pagination,
  where: buildDynamicWhere({ status: 'active' }, req.tenant.id)
});
```

### 2. Express Helpers

```typescript
import {
  asyncHandler,
  validateRequest,
  sendSuccess,
  sendError,
  extractPaginationParams
} from '../utils/express-helpers';

// Handler assíncrono seguro
router.get('/users', asyncHandler(async (req, res) => {
  const { page, limit } = extractPaginationParams(req.query);
  const users = await prisma.user.findMany();

  sendSuccess(res, users, 'Usuários carregados com sucesso');
}));

// Validação automática
router.post('/users',
  validateRequest(createUserSchema),
  asyncHandler(async (req, res) => {
    // req.body já validado e tipado
    const user = await prisma.user.create({ data: req.body });
    sendSuccess(res, user, 'Usuário criado com sucesso', 201);
  })
);
```

### 3. Async Helpers

```typescript
import {
  retryWithBackoff,
  AsyncCache,
  CircuitBreaker
} from '../utils/async-helpers';

// Cache com TTL
const cache = new AsyncCache<string, User>(300000); // 5 minutos

const getUser = async (id: string): Promise<User> => {
  return cache.get(id, async () => {
    return prisma.user.findUnique({ where: { id } });
  });
};

// Retry com backoff exponencial
const result = await retryWithBackoff(
  () => externalApiCall(),
  3, // max tentativas
  1000 // delay inicial
);

// Circuit Breaker
const breaker = new CircuitBreaker(externalService, 5, 60000);
const result = await breaker.execute('param1', 'param2');
```

---

## 📝 Diretrizes de Código

### 1. Nomenclatura

```typescript
// ✅ CORRETO
interface UserCreateRequest {
  name: string;
  email: string;
}

type UserWithRelations = User & {
  department: Department | null;
  tenant: Tenant;
};

const getUserById = async (id: string): Promise<User | null> => {};

// ❌ INCORRETO
interface userRequest {}  // PascalCase para interfaces/types
type userType = {};       // PascalCase para types
const GetUser = () => {}; // camelCase para funções
```

### 2. Tratamento de Erros

```typescript
// ✅ CORRETO - Error handling tipado
try {
  const result = await riskyOperation();
  return { success: true, data: result };
} catch (error: unknown) {
  if (error instanceof PrismaClientKnownRequestError) {
    return { success: false, error: 'Database error' };
  }

  if (error instanceof Error) {
    return { success: false, error: error.message };
  }

  return { success: false, error: 'Unknown error' };
}

// ❌ INCORRETO - Catch sem tipagem
try {
  await riskyOperation();
} catch (error) { // ❌ any implícito
  console.log(error.message); // ❌ Unsafe
}
```

### 3. Validação de Entrada

```typescript
// ✅ CORRETO - Validação robusta
const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  role: z.enum(['USER', 'ADMIN']).optional()
}).refine(data => Object.keys(data).length > 0, {
  message: "Pelo menos um campo deve ser fornecido"
});

// ❌ INCORRETO - Sem validação
router.put('/user/:id', (req, res) => {
  const data = req.body; // ❌ any, sem validação
  // Risco de segurança e bugs
});
```

---

## 🚫 Anti-Padrões - O que NÃO fazer

### 1. Supressões TypeScript

```typescript
// ❌ PROIBIDO na Fase 3
// @ts-ignore
// @ts-expect-error
// @ts-nocheck

// ✅ CORREÇÕES ADEQUADAS
// Se algo não está tipado, criar interface apropriada
// Se há erro legítimo, corrigir a causa raiz
```

### 2. Tipos Any

```typescript
// ❌ INCORRETO
const processData = (data: any) => {
  return data.someProperty; // Unsafe
};

// ✅ CORRETO
interface ProcessableData {
  someProperty: string;
  optionalField?: number;
}

const processData = (data: ProcessableData) => {
  return data.someProperty; // Type safe
};
```

### 3. Definições de Tipo Duplicadas

```typescript
// ❌ INCORRETO - Redefinir tipos existentes
interface AuthenticatedRequest extends Request {
  user: any; // Já existe no sistema
}

// ✅ CORRETO - Usar tipos centralizados
import { AuthenticatedRequest } from '../types';
```

---

## ✅ Checklist de Code Review

### Antes de fazer commit:

- [ ] `npm run type-check` passou sem erros
- [ ] `npm run lint` passou sem warnings
- [ ] `npm run format:check` passou
- [ ] Nenhum `@ts-ignore` ou `any` desnecessário
- [ ] Interfaces/types nomeados em PascalCase
- [ ] Handlers usam tipos apropriados (`TypedRequest`, `TypedResponse`)
- [ ] Validação de entrada implementada
- [ ] Tratamento de erro robusto
- [ ] Documentação JSDoc em funções públicas

### Durante Code Review:

- [ ] Padrões TypeScript seguidos
- [ ] Performance considerada
- [ ] Segurança validada
- [ ] Testes apropriados
- [ ] Compatibilidade com sistema existente

---

## 📚 Recursos Adicionais

### Comandos Úteis

```bash
# Verificar erros específicos de um arquivo
npx tsc --noEmit src/routes/specific-file.ts

# Executar testes de regressão
npm run test:regression

# Validação completa pre-deploy
npm run validate:production

# Encontrar arquivos com supressões TypeScript
grep -r "@ts-" src --include="*.ts"
```

### Links Úteis

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zod Documentation](https://zod.dev/)
- [Prisma TypeScript](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/use-custom-model-and-field-names)
- [Express TypeScript](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/express)

---

## 🆘 Suporte e Dúvidas

### Problemas Comuns e Soluções

**1. Erro: "Property does not exist"**
```bash
# Regenerar tipos do Prisma
npx prisma generate

# Verificar imports
# Usar tipos centralizados do sistema
```

**2. Erro: "Type 'unknown' is not assignable"**
```typescript
// Usar type guards ou validação
if (error instanceof Error) {
  console.log(error.message);
}
```

**3. Performance de compilação lenta**
```bash
# Usar incremental compilation
npx tsc --incremental

# Verificar includes/excludes no tsconfig.json
```

### Contato

Para dúvidas sobre estes padrões:
- Documentação: `./docs/`
- Issues: GitHub Issues do projeto
- Testes: `npm run test:regression`

---

**Documento criado por:** Claude Code - Fase 3 TypeScript Migration
**Data:** 24/09/2025
**Versão:** 1.0
**Status:** ✅ Ativo

---

*Este documento é parte do sistema de qualidade do DigiUrban Backend. Todos os desenvolvedores devem estar familiarizados com estes padrões antes de contribuir com o projeto.*