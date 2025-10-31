# Correções Necessárias: Departamentos Globais

## 🚨 PROBLEMAS DETECTADOS

Após migração para departamentos globais, os seguintes arquivos AINDA usam `tenantId` ao buscar/criar departamentos:

### ❌ Arquivos que CRIAM departamentos por tenant (REMOVER):
1. **super-admin.ts:570** - Cria departamentos ao criar tenant
2. **tenants.ts:258** - Cria departamentos ao criar tenant
3. **leads.ts:229** - Cria departamentos ao converter lead

### ❌ Arquivos que BUSCAM departamentos com tenantId (CORRIGIR):
1. **admin-agriculture.ts** - 5 ocorrências
2. **admin-management.ts** - 4 ocorrências
3. **secretarias-meio-ambiente.ts** - 1 ocorrência
4. **secretarias-assistencia-social.ts** - 2 ocorrências
5. **secretarias-agricultura.ts** - 2 ocorrências
6. **secretarias-turismo.ts** - 1 ocorrência
7. **secretarias-educacao.ts** - múltiplas
8. **secretarias-saude.ts** - múltiplas
9. **services.ts:174** - Valida departamento ao criar serviço
10. **super-admin.ts:2277** - Lista departamentos de um tenant

## ✅ CORREÇÕES NECESSÁRIAS

### 1. Remover criação de departamentos ao criar tenant

**ANTES:**
```typescript
await Promise.all(
  defaultDepartments.map(dept =>
    prisma.department.create({
      data: {
        name: dept.name,
        tenantId: tenant.id, // ❌ REMOVER
      }
    })
  )
);
```

**DEPOIS:**
```typescript
// ✅ Departamentos são globais - não precisam ser criados por tenant
// Eles já existem no banco e são compartilhados
```

### 2. Buscar departamentos SEM filtro de tenant

**ANTES:**
```typescript
const dept = await prisma.department.findFirst({
  where: {
    tenantId,  // ❌ REMOVER
    code: 'AGRICULTURA'
  }
});
```

**DEPOIS:**
```typescript
const dept = await prisma.department.findFirst({
  where: {
    code: 'AGRICULTURA' // ✅ Buscar apenas por código (global)
  }
});
```

### 3. Listar todos os departamentos globais

**ANTES:**
```typescript
const departments = await prisma.department.findMany({
  where: { tenantId: id } // ❌ REMOVER filtro
});
```

**DEPOIS:**
```typescript
const departments = await prisma.department.findMany({
  // ✅ Sem filtro - retorna TODOS os 14 departamentos globais
  orderBy: { name: 'asc' }
});
```

## 📋 LISTA DE ARQUIVOS A CORRIGIR

Total: ~15 arquivos com ~25+ ocorrências

1. ✅ seeds/services-simplified-complete.ts (JÁ CORRIGIDO)
2. ⚠️  routes/super-admin.ts
3. ⚠️  routes/tenants.ts
4. ⚠️  routes/leads.ts
5. ⚠️  routes/admin-agriculture.ts
6. ⚠️  routes/admin-management.ts
7. ⚠️  routes/services.ts
8. ⚠️  routes/secretarias-*.ts (12 arquivos)
