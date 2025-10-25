# 🏗️ Análise: Serviços em Arquitetura Multi-Tenancy

## 📋 Contexto Atual

### Sistema Multi-Tenancy DigiUrban
- **Modelo**: Cada prefeitura é um tenant isolado
- **Isolamento**: Todos os dados são segregados por `tenantId`
- **Schema Atual**: Service tem campo `tenantId` (obrigatório)

```prisma
model Service {
  id          String  @id @default(cuid())
  name        String
  description String?

  // Multi-tenant - OBRIGATÓRIO
  tenantId String
  tenant   Tenant @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  // Departamento responsável
  departmentId String
  department   Department @relation(fields: [departmentId], references: [id])

  // ... outros campos
}
```

---

## 🎯 Problema Identificado

**Situação Atual:**
- ✅ Seed cria 52 serviços apenas para tenant `demo`
- ❌ Novos tenants NÃO recebem serviços automaticamente
- ❌ Cada tenant precisa criar seus próprios serviços do zero

**Impacto:**
- Admin de novo tenant entra no sistema → 0 serviços
- Precisa criar manualmente 52 serviços (ou mais)
- Experiência ruim de onboarding

---

## 💡 Abordagens Possíveis

### **Opção 1: Serviços por Tenant (Atual - Isolado)**

#### Modelo
```
Tenant A                    Tenant B                    Tenant C
├─ Service 1 (copy)         ├─ Service 1 (copy)         ├─ Service 1 (copy)
├─ Service 2 (copy)         ├─ Service 2 (copy)         ├─ Service 2 (copy)
└─ Service 52 (copy)        └─ Service 52 (copy)        └─ Service 52 (copy)
```

#### ✅ Vantagens
- **Isolamento total**: Cada tenant pode customizar seus serviços
- **Flexibilidade máxima**: Tenant A pode ter "Consulta Médica", Tenant B pode ter "Atendimento de Saúde"
- **Nomes diferentes**: Permite adequação ao vocabulário local
- **Campos customizáveis**: Cada tenant define seus próprios documentos, prazos, etc.
- **Sem conflitos**: Alterações em um tenant não afetam outros
- **Compliance LGPD**: Isolamento físico dos dados

#### ❌ Desvantagens
- **Duplicação massiva**: 100 tenants = 5.200 registros idênticos
- **Manutenção difícil**: Atualizar serviços padrão requer atualizar todos os tenants
- **Banco de dados maior**: Mais registros, mais índices, mais storage
- **Onboarding manual**: Precisa criar/copiar serviços para cada novo tenant

#### 🔧 Implementação
```typescript
// Ao criar tenant
async function createTenant(data) {
  const tenant = await prisma.tenant.create({ data })

  // Criar departamentos padrão
  await createDefaultDepartments(tenant.id)

  // ✅ COPIAR 52 serviços padrão para o novo tenant
  await seedInitialServices(tenant.id)

  return tenant
}
```

---

### **Opção 2: Serviços Globais + Referência (Híbrido)**

#### Modelo
```
Global Service Templates (sem tenant)
├─ Template 1: "Agendamento de Consulta"
├─ Template 2: "Matrícula Escolar"
└─ Template 52: "Coleta de Lixo"

Tenant A                    Tenant B
├─ ServiceInstance         ├─ ServiceInstance
│  ├─ templateId: 1        │  ├─ templateId: 1
│  └─ customName: "..."    │  └─ customName: "..."
└─ ServiceInstance         └─ ServiceInstance
   ├─ templateId: 2           ├─ templateId: 2
   └─ customName: "..."       └─ customName: "..."
```

#### ✅ Vantagens
- **Menos duplicação**: Templates centralizados
- **Atualizações fáceis**: Atualiza template → todos os tenants se beneficiam
- **Onboarding rápido**: Apenas cria referências
- **Banco menor**: Menos registros totais
- **Melhores práticas**: Templates padronizados

#### ❌ Desvantagens
- **Complexidade arquitetural**: Precisa 2 tabelas (Template + Instance)
- **Menos flexibilidade**: Tenants ficam presos ao template
- **Queries mais complexas**: JOINs adicionais
- **Migração difícil**: Schema atual não suporta isso

#### 🔧 Implementação
```prisma
// REQUER MIGRAÇÃO DO SCHEMA
model ServiceTemplate {
  id          String  @id @default(cuid())
  name        String
  description String?
  category    String?
  // ... campos padrão

  instances ServiceInstance[]
}

model ServiceInstance {
  id         String  @id @default(cuid())
  tenantId   String
  templateId String

  // Overrides opcionais
  customName        String?
  customDescription String?

  template Template @relation(...)
  tenant   Tenant   @relation(...)
}
```

---

### **Opção 3: Serviços Compartilhados com Flag (Simples)**

#### Modelo
```
Services (mesma tabela)
├─ Service 1 (tenantId: null, isGlobal: true)  ← Usado por todos
├─ Service 2 (tenantId: null, isGlobal: true)  ← Usado por todos
├─ Service 52 (tenantId: "demo", isGlobal: false) ← Customizado
└─ Service 53 (tenantId: "demo", isGlobal: false) ← Customizado
```

#### ✅ Vantagens
- **Migração simples**: Apenas adiciona campo `isGlobal`
- **Queries simples**: `WHERE isGlobal OR tenantId = ?`
- **Flexibilidade**: Tenant pode usar global OU criar próprio
- **Menos duplicação**: Serviços globais compartilhados

#### ❌ Desvantagens
- **Isolamento fraco**: Dados globais e tenant na mesma tabela
- **Risco de alteração**: Alguém pode alterar serviço global acidentalmente
- **Permissões complexas**: Precisa controlar quem pode editar globais
- **Violação do padrão**: Multi-tenancy estrito requer `tenantId` sempre

---

## 🎯 Recomendação Profissional

### **Opção 1: Serviços por Tenant (Mantém arquitetura atual)**

**Por quê?**

1. **Alinhamento com arquitetura**: O sistema já é 100% multi-tenant com isolamento estrito
2. **Sem breaking changes**: Não precisa migrar schema ou dados
3. **Compliance**: LGPD e regulamentações exigem isolamento de dados
4. **Simplicidade**: Implementação direta e testável
5. **Flexibilidade futura**: Cada prefeitura pode ter serviços únicos

**Desvantagens aceitáveis:**
- Duplicação de dados → Aceitável em sistemas multi-tenant modernos
- Manutenção → Automatizada via seed functions
- Storage → Desprezível (52 serviços × 100 tenants = 5.2k registros = ~2MB)

---

## 📐 Implementação Recomendada

### **Estratégia: Auto-Seed em Criação de Tenant**

```typescript
// 1. Função de seed reutilizável
export async function seedInitialServices(tenantId: string) {
  // Buscar departamentos do tenant
  const departments = await prisma.department.findMany({
    where: { tenantId, isActive: true }
  })

  // Mapear departamentos por código
  const deptMap = new Map()
  departments.forEach(d => {
    if (d.code) deptMap.set(d.code, d.id)
  })

  // Criar 52 serviços
  for (const serviceData of INITIAL_SERVICES) {
    const departmentId = deptMap.get(serviceData.departmentCode)

    if (!departmentId) {
      console.warn(`Departamento ${serviceData.departmentCode} não encontrado`)
      continue
    }

    await prisma.service.create({
      data: {
        name: serviceData.name,
        description: serviceData.description,
        category: serviceData.category,
        tenantId,
        departmentId,
        requiresDocuments: serviceData.requiresDocuments,
        requiredDocuments: serviceData.requiredDocuments,
        estimatedDays: serviceData.estimatedDays,
        priority: serviceData.priority,
        isActive: true
      }
    })
  }
}

// 2. Hook na criação de tenant
async function createTenant(data) {
  // Criar tenant
  const tenant = await prisma.tenant.create({ data })

  // Criar departamentos padrão COM CÓDIGOS
  await createDefaultDepartments(tenant.id) // ← PRECISA CÓDIGOS!

  // Popular serviços automaticamente
  await seedInitialServices(tenant.id)

  return tenant
}
```

### **Requisitos Críticos:**

#### 1. **Departamentos precisam ter códigos padronizados**

```typescript
const DEFAULT_DEPARTMENTS = [
  { name: 'Secretaria de Saúde', code: 'SAUDE' },
  { name: 'Secretaria de Educação', code: 'EDUCACAO' },
  { name: 'Secretaria de Serviços Públicos', code: 'SERVICOS_PUBLICOS' },
  // ... outros
]
```

#### 2. **Schema Department precisa campo `code`**

```prisma
model Department {
  id     String  @id @default(cuid())
  name   String
  code   String? // ← ADICIONAR ESTE CAMPO
  // ...
}
```

#### 3. **Serviços mapeados por código de departamento**

```typescript
const SERVICE_DATA = [
  {
    name: 'Agendamento de Consulta',
    departmentCode: 'SAUDE', // ← Mapeia para departamento
    // ...
  }
]
```

---

## 🚀 Plano de Implementação

### **Fase 1: Preparação do Schema**
- [ ] Adicionar campo `code` em Department (migration)
- [ ] Atualizar seed de departamentos com códigos
- [ ] Validar que todos os departamentos têm códigos únicos

### **Fase 2: Atualizar Função de Seed**
- [ ] Modificar `seedInitialServices()` para usar códigos
- [ ] Adicionar tratamento de erros robusto
- [ ] Adicionar logs detalhados

### **Fase 3: Integrar na Criação de Tenant**
- [ ] Importar `seedInitialServices` em `super-admin.ts`
- [ ] Chamar função após criar departamentos
- [ ] Adicionar try/catch para não falhar tenant se seed falhar

### **Fase 4: Testar**
- [ ] Criar novo tenant via API
- [ ] Verificar que 52 serviços foram criados
- [ ] Validar que serviços aparecem no dropdown
- [ ] Testar criação de protocolo

### **Fase 5: Atualizar Tenants Existentes**
- [ ] Script para popular serviços em tenants existentes
- [ ] Executar para tenant `demo` (já tem, mas validar)
- [ ] Documentar processo de retroativo

---

## 📊 Estimativa de Impacto

### **Storage**
```
1 serviço ≈ 500 bytes (estimativa)
52 serviços × 100 tenants = 5.200 registros
5.200 × 500 bytes = 2.6 MB

100 tenants → 2.6 MB
1.000 tenants → 26 MB
10.000 tenants → 260 MB

Conclusão: Desprezível em termos de storage
```

### **Performance**
```
Query típica: WHERE tenantId = ? AND isActive = true
Índice: (tenantId, isActive)

52 serviços por tenant → Query retorna instantaneamente
Sem JOINs complexos → Sem degradação

Conclusão: Performance excelente
```

### **Manutenção**
```
Atualizar serviço padrão:
- Opção A (global): 1 update
- Opção B (por tenant): 100 updates via script

Impacto: Gerenciável com scripts automatizados
```

---

## ✅ Decisão Final

### **Implementar Opção 1: Serviços por Tenant com Auto-Seed**

**Razões:**
1. ✅ Mantém arquitetura multi-tenant pura
2. ✅ Sem breaking changes
3. ✅ Implementação simples e rápida
4. ✅ Testável e confiável
5. ✅ Compliance total (LGPD, isolamento)

**Próximos Passos:**
1. Adicionar campo `code` em Department
2. Atualizar função de criação de departamentos
3. Integrar seed automático na criação de tenant
4. Testar com novo tenant
5. Documentar processo

---

## 🎓 Aprendizados

### **Multi-Tenancy Best Practices:**

1. **Isolamento é rei**: Sempre prefira isolamento total em multi-tenant B2B
2. **Duplicação aceitável**: Em sistemas modernos, duplicação controlada é OK
3. **Automação essencial**: Onboarding deve ser zero-touch
4. **Templates com cuidado**: Só use se realmente precisar de sincronização
5. **Storage é barato**: Não otimize prematuramente

### **Quando NÃO duplicar:**
- Dados verdadeiramente globais (países, moedas, etc)
- Configurações de sistema
- Catálogos imutáveis (CID, CBO, etc)

### **Quando duplicar:**
- Dados de negócio customizáveis
- Workflows específicos
- Configurações personalizáveis
- Compliance data isolation

---

**Conclusão:** A arquitetura atual está correta. Precisamos apenas automatizar a criação de serviços para novos tenants. 🎯
