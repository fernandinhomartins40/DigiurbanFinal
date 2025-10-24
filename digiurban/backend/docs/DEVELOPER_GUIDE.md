# 🚀 Guia do Desenvolvedor - DigiUrban Backend

## 📋 Bem-vindo ao DigiUrban Backend

Este guia contém tudo que você precisa saber para desenvolver no DigiUrban Backend após a **Migração TypeScript Fase 3**. O projeto agora segue padrões modernos de TypeScript com validação rigorosa e CI/CD automatizado.

---

## ⚡ Quick Start

### 1. Setup Inicial

```bash
# Clone e instale dependências
git clone <repository-url>
cd digiurban/backend
npm install

# Configure o banco de dados
cp .env.example .env
# Edite .env com suas configurações

# Gere o cliente Prisma
npx prisma generate
npx prisma db push
```

### 2. Verificação do Ambiente

```bash
# Verificar se tudo está funcionando
npm run check                # TypeScript + Lint + Format
npm run test:regression      # Testes de regressão completos
npm run validate:production  # Validação completa pré-deploy
```

### 3. Desenvolvimento Diário

```bash
# Modo desenvolvimento
npm run dev                  # Servidor com hot-reload

# Verificações contínuas
npm run type-check:watch     # TypeScript em tempo real
npm run lint:fix             # Corrigir problemas automaticamente
npm run format               # Formatar código
```

---

## 🏗️ Arquitetura e Padrões

### Estrutura do Projeto

```
src/
├── routes/                  # Rotas da API
│   ├── specialized/        # Rotas especializadas (saúde, educação, etc.)
│   └── integrations.ts     # Integrações externas
├── middleware/             # Middlewares Express
├── types/                  # Sistema de tipos centralizado
├── utils/                  # Utilitários modernos
├── lib/                   # Configurações (Prisma, etc.)
└── scripts/               # Scripts de automação
```

### Sistema de Tipos

**✅ SEMPRE usar tipos centralizados:**
```typescript
import {
  AuthenticatedRequest,
  SuccessResponse,
  ErrorResponse,
  TypedRequest,
  TypedResponse
} from '../types';
```

**❌ NUNCA redefinir tipos existentes:**
```typescript
// ❌ Não faça isso
interface AuthenticatedRequest extends Request {
  user: any;
}
```

---

## 📝 Workflow de Desenvolvimento

### 1. Antes de Começar

```bash
# Sempre puxe as últimas mudanças
git pull origin main

# Verifique se está tudo funcionando
npm run check
```

### 2. Durante o Desenvolvimento

```bash
# Crie uma branch para sua feature
git checkout -b feat/nova-funcionalidade

# Execute verificações em tempo real
npm run type-check:watch  # Terminal 1
npm run dev              # Terminal 2
```

### 3. Antes de Commit

Os **pre-commit hooks** executam automaticamente:
- ✅ Lint e formatação automática
- ✅ Verificação TypeScript
- ✅ Detecção de supressões desnecessárias
- ✅ Validação de mensagem de commit

```bash
# Exemplo de commit válido
git add .
git commit -m "feat(auth): implementar autenticação JWT"

# O sistema irá:
# 1. Executar lint-staged
# 2. Verificar TypeScript
# 3. Validar formato da mensagem
# 4. Permitir ou rejeitar o commit
```

### 4. Pull Request

```bash
# Push da branch
git push origin feat/nova-funcionalidade

# O GitHub Actions executará automaticamente:
# ✅ TypeScript validation
# ✅ Build & tests
# ✅ Security audit
# ✅ Performance benchmarks
# ✅ Code quality metrics
```

---

## 🛠️ Ferramentas e Comandos

### Scripts NPM Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor desenvolvimento com hot-reload |
| `npm run build` | Build de produção |
| `npm run type-check` | Verificação TypeScript |
| `npm run type-check:watch` | Verificação contínua |
| `npm run lint` | ESLint checking |
| `npm run lint:fix` | Corrigir problemas ESLint |
| `npm run format` | Formatar com Prettier |
| `npm run format:check` | Verificar formatação |
| `npm run check` | Todas verificações |
| `npm run fix` | Corrigir tudo automaticamente |
| `npm run test:regression` | Testes de regressão |
| `npm run validate:production` | Validação completa |

### Comandos Úteis

```bash
# Regenerar tipos Prisma
npx prisma generate

# Verificar arquivo específico
npx tsc --noEmit src/routes/specific-file.ts

# Encontrar supressões TypeScript
grep -r "@ts-" src --include="*.ts"

# Executar testes de regressão com relatório
npm run test:regression
# Relatórios salvos em: scripts/phase3/results/
```

---

## 📚 Padrões de Código

### 1. Handlers de Rota

```typescript
// ✅ Padrão recomendado
router.post('/users', requireAuth, async (
  req: TypedRequest<CreateUserData, {}, { tenantId: string }>,
  res: TypedResponse<SuccessResponse<User> | ErrorResponse>
) => {
  try {
    const userData = req.body; // ✅ Tipado automaticamente
    const user = await createUser(userData, req.tenant.id);

    res.json({
      success: true,
      data: user,
      message: 'Usuário criado com sucesso'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Failed to create user',
      message: 'Erro ao criar usuário'
    });
  }
});
```

### 2. Validação com Zod

```typescript
import { z } from 'zod';

const createUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  role: z.enum(['USER', 'ADMIN'])
});

type CreateUserData = z.infer<typeof createUserSchema>;

router.post('/users',
  validateRequest(createUserSchema), // Middleware de validação
  async (req: TypedRequest<CreateUserData>, res) => {
    // req.body já validado e tipado
  }
);
```

### 3. Operações Prisma

```typescript
import { executePrismaOperation, buildPagination } from '../utils/prisma-helpers';

// Com tratamento de erro automático
const result = await executePrismaOperation(async () => {
  return prisma.user.create({ data: userData });
});

if (result.success) {
  res.json({ success: true, data: result.data });
} else {
  res.status(400).json({ success: false, error: result.error });
}

// Com paginação
const pagination = buildPagination(req.query);
const users = await prisma.user.findMany({
  ...pagination,
  where: { tenantId: req.tenant.id }
});
```

---

## 🚫 Checklist - O que NÃO fazer

### ❌ Proibido na Fase 3

- [ ] Usar `@ts-ignore`, `@ts-expect-error`, `@ts-nocheck`
- [ ] Definir tipos `any` desnecessários
- [ ] Redefinir interfaces existentes no sistema
- [ ] Ignorar erros TypeScript
- [ ] Commits sem seguir o padrão de mensagem
- [ ] Push sem executar verificações locais

### ⚠️ Cuidados Especiais

- [ ] Sempre validar dados de entrada
- [ ] Usar type guards para verificações
- [ ] Tratar erros de forma tipada
- [ ] Documentar funções públicas
- [ ] Testar localmente antes de push

---

## 🔍 Debugging e Troubleshooting

### Problemas Comuns

**1. "Property does not exist on type..."**
```bash
# Regenerar cliente Prisma
npx prisma generate

# Verificar imports
# Usar tipos centralizados
```

**2. "Type 'unknown' is not assignable..."**
```typescript
// Usar type guards
if (error instanceof Error) {
  console.log(error.message);
}

// Ou validação
const result = someSchema.parse(data);
```

**3. Pre-commit hook falha**
```bash
# Corrigir problemas automaticamente
npm run fix

# Verificar erros específicos
npm run type-check
npm run lint
```

**4. CI/CD falha no GitHub**
```bash
# Executar localmente a mesma validação
npm run validate:production

# Verificar se passou nos testes de regressão
npm run test:regression
```

### Logs e Monitoramento

```bash
# Ver logs detalhados dos testes
npm run test:regression
# Relatórios em: ./scripts/phase3/results/

# Performance benchmarks
# Automático no CI/CD para branch main

# Métricas de qualidade
# Calculadas automaticamente no GitHub Actions
```

---

## 📊 Métricas de Qualidade

### Métricas Automatizadas (CI/CD)

- **TypeScript Coverage:** >95% (meta)
- **Compilation Time:** <30 segundos
- **Build Time:** <2 minutos
- **Active TypeScript Errors:** 0
- **Files with Suppressions:** <5%

### Como Verificar Localmente

```bash
# Relatório completo de qualidade
npm run test:regression

# O relatório incluirá:
# ✅ Cobertura TypeScript
# ✅ Performance benchmarks
# ✅ Erros e warnings
# ✅ Métricas de código
```

---

## 🆘 Suporte e Recursos

### Documentação

- **[Padrões TypeScript](./TYPESCRIPT_PATTERNS.md)** - Padrões detalhados
- **[Plano de Migração](../TYPESCRIPT_MIGRATION_PLAN.md)** - Contexto completo
- **Código de exemplo:** Arquivos em `src/routes/specialized/`

### Comandos de Emergência

```bash
# Projeto não compila?
npm run fix              # Tenta corrigir automaticamente
npx prisma generate      # Regenera tipos
npm install              # Reinstala dependências

# CI/CD falhando?
npm run validate:production  # Simula validação completa
npm run test:regression     # Executa todos os testes

# Precisa fazer commit urgente?
# (⚠️ Apenas em emergências)
git commit -m "fix: correção urgente" --no-verify
```

### Recursos Externos

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zod Documentation](https://zod.dev/)
- [Prisma TypeScript Guide](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/use-custom-model-and-field-names)
- [Express + TypeScript Best Practices](https://github.com/microsoft/TypeScript/wiki/Coding-guidelines)

---

## 🎯 Meta de Qualidade - Fase 3

### ✅ Objetivos Alcançados

- [x] **Zero erros TypeScript críticos**
- [x] **Strict mode ativado**
- [x] **CI/CD totalmente funcional**
- [x] **Pre-commit hooks configurados**
- [x] **Testes de regressão automatizados**
- [x] **Documentação completa**
- [x] **Padrões modernos implementados**

### 📈 Métricas Alvo

- **TypeScript Coverage:** >95%
- **Build Time:** <30s
- **Zero suppressions** desnecessárias
- **100% handlers tipados**
- **Performance** mantida ou melhorada

---

## 🎉 Conclusão

O DigiUrban Backend agora está na **Fase 3** - com TypeScript rigoroso, CI/CD automatizado e padrões modernos. Este setup garante:

- 🔒 **Segurança de tipos** em tempo de compilação
- 🚀 **Produtividade** com ferramentas automatizadas
- 📊 **Qualidade** monitorada continuamente
- 🛠️ **Manutenibilidade** a longo prazo

**Happy Coding! 🚀**

---

**Documento criado por:** Claude Code - Fase 3 TypeScript Migration
**Data:** 24/09/2025
**Versão:** 1.0
**Status:** ✅ Ativo

---

*Para dúvidas ou sugestões de melhorias, consulte a documentação adicional ou execute os testes de regressão para verificar a integridade do sistema.*