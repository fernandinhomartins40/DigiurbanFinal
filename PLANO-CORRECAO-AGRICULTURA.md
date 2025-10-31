# 🔧 PLANO DE CORREÇÃO - SECRETARIA DE AGRICULTURA

**Data:** 30 de Outubro de 2025
**Prioridade:** CRÍTICA
**Tempo Estimado:** 2-3 horas

---

## 📋 RESUMO EXECUTIVO

Este plano corrige **todos os problemas críticos** identificados na auditoria do sistema de serviços e módulo Produtor Rural da Secretaria de Agricultura.

**Arquivos que serão modificados:** 7
**Arquivos que serão criados:** 2
**Total de mudanças:** 9 arquivos

---

## 🎯 OBJETIVOS

1. ✅ Alinhar 100% dos handlers com MODULE_MAPPING
2. ✅ Eliminar duplicação de rotas
3. ✅ Adicionar validações críticas de citizenId
4. ✅ Implementar carregamento real de dados no frontend
5. ✅ Garantir funcionamento completo do fluxo de cadastro

---

## 📝 MUDANÇAS DETALHADAS

### 1️⃣ CORREÇÃO: Registros de Handlers

**Arquivo:** `backend/src/modules/handlers/agriculture/index.ts`

**Problema:** Chaves de registro não batem com MODULE_MAPPING

**Antes:**
```typescript
moduleHandlerRegistry.register('agriculture:RuralProducer', new RuralProducerHandler());
moduleHandlerRegistry.register('agriculture:TechnicalAssistance', new TechnicalAssistanceHandler());
```

**Depois:**
```typescript
moduleHandlerRegistry.register('AGRICULTURA:CADASTRO_PRODUTOR', new RuralProducerHandler());
moduleHandlerRegistry.register('AGRICULTURA:ASSISTENCIA_TECNICA', new TechnicalAssistanceHandler());
moduleHandlerRegistry.register('AGRICULTURA:INSCRICAO_CURSO_RURAL', new RuralTrainingHandler());
moduleHandlerRegistry.register('AGRICULTURA:INSCRICAO_PROGRAMA_RURAL', new RuralProgramHandler());
moduleHandlerRegistry.register('AGRICULTURA:CADASTRO_PROPRIEDADE_RURAL', new RuralPropertyHandler());
```

**Impacto:** Sistema passa a encontrar os handlers corretamente.

---

### 2️⃣ CORREÇÃO: moduleType nos Handlers

**Arquivos:**
- `backend/src/modules/handlers/agriculture/rural-producer-handler.ts`
- `backend/src/modules/handlers/agriculture/technical-assistance-handler.ts`
- E todos os outros handlers de agricultura

**Problema:** moduleType genérico 'agriculture'

**Antes:**
```typescript
export class RuralProducerHandler extends BaseModuleHandler {
  moduleType = 'agriculture';
  entityName = 'RuralProducer';
```

**Depois:**
```typescript
export class RuralProducerHandler extends BaseModuleHandler {
  moduleType = 'CADASTRO_PRODUTOR';
  entityName = 'RuralProducer';
```

**Impacto:** Identificação específica de cada handler.

---

### 3️⃣ REMOÇÃO: Rota GET Duplicada

**Arquivo:** `backend/src/routes/secretarias-agricultura.ts`

**Problema:** GET /produtores duplicado

**Ação:** REMOVER linhas 286-351 (endpoint GET /produtores)

**Motivo:** Já existe rota dedicada completa em `secretarias-agricultura-produtores.ts`

**Impacto:** Elimina conflito de rotas.

---

### 4️⃣ ADIÇÃO: Validação citizenId no Protocol-Module

**Arquivo:** `backend/src/services/protocol-module.service.ts`

**Problema:** citizenId não validado antes de criar RuralProducer

**Mudança:** Substituir função inline por função completa com validações

**Antes (linha 168):**
```typescript
RuralProducer: () => tx.ruralProducer.create({
  data: {
    tenantId,
    citizenId: formData.citizenId,
    // ...
  }
}),
```

**Depois:**
```typescript
RuralProducer: async () => {
  // Validação 1: citizenId obrigatório
  if (!formData.citizenId) {
    throw new Error('citizenId é obrigatório para cadastro de produtor rural');
  }

  // Validação 2: Cidadão existe
  const citizen = await tx.citizen.findFirst({
    where: {
      id: formData.citizenId,
      tenantId
    }
  });

  if (!citizen) {
    throw new Error('Cidadão não encontrado ou não pertence a este município');
  }

  // Validação 3: Não duplicar
  const existing = await tx.ruralProducer.findFirst({
    where: {
      tenantId,
      citizenId: formData.citizenId
    }
  });

  if (existing) {
    throw new Error('Este cidadão já está cadastrado como produtor rural');
  }

  // Criação com fallback de dados do cidadão
  return tx.ruralProducer.create({
    data: {
      tenantId,
      citizenId: formData.citizenId,
      protocolId,
      name: formData.name || citizen.name,
      document: formData.document || citizen.cpf,
      email: formData.email || citizen.email,
      phone: formData.phone || citizen.phone || '',
      address: formData.address || JSON.stringify(citizen.address),
      productionType: formData.productionType || 'conventional',
      mainCrop: formData.mainCrop || '',
      status: 'PENDING_APPROVAL',
      isActive: false,
    },
  });
}
```

**Impacto:** Previne erros de constraint e fornece mensagens claras.

---

### 5️⃣ CRIAÇÃO: Hook useSecretariaServices

**Arquivo NOVO:** `frontend/hooks/useSecretariaServices.ts`

**Propósito:** Hook reutilizável para buscar serviços de qualquer secretaria

**Conteúdo:**
```typescript
import { useState, useEffect } from 'react';

export interface Service {
  id: string;
  name: string;
  description: string | null;
  moduleType: string | null;
  serviceType: string;
  requiresDocuments: boolean;
  estimatedDays: number | null;
  priority: number;
  isActive: boolean;
  departmentId: string;
}

export function useSecretariaServices(departmentCode: string) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/admin/secretarias/${departmentCode.toLowerCase()}/services`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || 'Erro ao carregar serviços');
        }

        setServices(data.data || []);
      } catch (err: any) {
        console.error('Error fetching services:', err);
        setError(err.message || 'Erro ao carregar serviços');
      } finally {
        setLoading(false);
      }
    }

    if (departmentCode) {
      fetchServices();
    }
  }, [departmentCode]);

  return { services, loading, error, refetch: () => {} };
}
```

---

### 6️⃣ CRIAÇÃO: Hook useSecretariaStats

**Arquivo NOVO:** `frontend/hooks/useSecretariaStats.ts`

**Propósito:** Hook reutilizável para buscar estatísticas de qualquer secretaria

**Conteúdo:**
```typescript
import { useState, useEffect } from 'react';

export function useSecretariaStats(departmentCode: string) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/admin/secretarias/${departmentCode.toLowerCase()}/stats`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || 'Erro ao carregar estatísticas');
        }

        setStats(data.data || {});
      } catch (err: any) {
        console.error('Error fetching stats:', err);
        setError(err.message || 'Erro ao carregar estatísticas');
      } finally {
        setLoading(false);
      }
    }

    if (departmentCode) {
      fetchStats();
    }
  }, [departmentCode]);

  return { stats, loading, error };
}
```

---

### 7️⃣ CORREÇÃO: Página Agricultura - Usar Hooks Reais

**Arquivo:** `frontend/app/admin/secretarias/agricultura/page.tsx`

**Problema:** Dados mockados, sempre vazios

**Antes (linhas 30-41):**
```typescript
// TODO: Migrar para arquitetura baseada em module-configs
const servicesLoading = false;
const statsLoading = false;
const servicesError = null;
const statsError = null;
const services: any[] = [];
const stats: any = {
  producers: { active: 0, total: 0 },
  // ...
};
```

**Depois:**
```typescript
const { services, loading: servicesLoading, error: servicesError } =
  useSecretariaServices('agricultura');

const { stats, loading: statsLoading, error: statsError } =
  useSecretariaStats('agricultura');
```

**Imports a adicionar:**
```typescript
import { useSecretariaServices } from '@/hooks/useSecretariaServices';
import { useSecretariaStats } from '@/hooks/useSecretariaStats';
```

---

### 8️⃣ CORREÇÃO: Handlers Faltantes

**Problema:** Handlers registrados mas não mapeados em MODULE_MAPPING

**Opções:**

**Opção A - Adicionar ao MODULE_MAPPING:**
```typescript
// module-mapping.ts
DISTRIBUICAO_SEMENTES: 'SeedDistribution',
ANALISE_SOLO: 'SoilAnalysis',
FEIRA_PRODUTOR: 'FarmerMarketRegistration',
```

**Opção B - Remover handlers não utilizados:**
Deletar arquivos:
- `seed-distribution-handler.ts`
- `soil-analysis-handler.ts`
- `farmer-market-handler.ts`

**Decisão:** Manter handlers mas não registrar (deixar para fase futura)

---

### 9️⃣ VALIDAÇÃO: Atualizar RuralProducerHandler

**Arquivo:** `backend/src/modules/handlers/agriculture/rural-producer-handler.ts`

**Melhoria:** Adicionar mais validações no método createProducer

**Adicionar:**
```typescript
// Validar campos obrigatórios adicionais
if (!data.productionType) {
  throw new Error('Tipo de produção é obrigatório');
}

if (!data.mainCrop) {
  throw new Error('Cultura principal é obrigatória');
}
```

---

## 📊 RESUMO DAS MUDANÇAS

| # | Tipo | Arquivo | Mudança |
|---|------|---------|---------|
| 1 | Edit | `agriculture/index.ts` | Alinhar chaves de registro |
| 2 | Edit | `rural-producer-handler.ts` | Corrigir moduleType |
| 3 | Edit | `technical-assistance-handler.ts` | Corrigir moduleType |
| 4 | Edit | `secretarias-agricultura.ts` | Remover GET /produtores |
| 5 | Edit | `protocol-module.service.ts` | Adicionar validações |
| 6 | Create | `useSecretariaServices.ts` | Hook de serviços |
| 7 | Create | `useSecretariaStats.ts` | Hook de estatísticas |
| 8 | Edit | `agricultura/page.tsx` | Usar hooks reais |
| 9 | Edit | `rural-producer-handler.ts` | Validações extras |

---

## ✅ CHECKLIST DE EXECUÇÃO

```
[ ] 1. Backup dos arquivos que serão modificados
[ ] 2. Corrigir registros de handlers (agriculture/index.ts)
[ ] 3. Corrigir moduleType em rural-producer-handler.ts
[ ] 4. Corrigir moduleType em technical-assistance-handler.ts
[ ] 5. Remover rota duplicada (secretarias-agricultura.ts)
[ ] 6. Adicionar validações (protocol-module.service.ts)
[ ] 7. Criar useSecretariaServices.ts
[ ] 8. Criar useSecretariaStats.ts
[ ] 9. Atualizar agricultura/page.tsx
[ ] 10. Testar GET /api/admin/secretarias/agricultura/services
[ ] 11. Testar GET /api/admin/secretarias/agricultura/stats
[ ] 12. Testar criação de protocolo de cadastro de produtor
[ ] 13. Verificar no banco se RuralProducer foi criado
[ ] 14. Testar aprovação de produtor rural
[ ] 15. Verificar atualização de status no banco
```

---

## 🧪 PLANO DE TESTES

### Teste 1: Carregamento de Serviços
```
1. Acessar /admin/secretarias/agricultura
2. Verificar se spinner de loading aparece
3. Verificar se serviços são carregados
4. Verificar se cards de serviços aparecem
```

### Teste 2: Estatísticas
```
1. Verificar se números aparecem nos cards
2. Verificar se "0" não aparece quando há dados
3. Verificar se loading funciona
```

### Teste 3: Cadastro de Produtor via Protocolo
```
1. Clicar em "Novo Protocolo"
2. Selecionar serviço "Cadastro de Produtor Rural"
3. Preencher dados obrigatórios incluindo citizenId
4. Submeter
5. Verificar se protocolo foi criado
6. Verificar se RuralProducer foi criado no banco
7. Verificar se status = PENDING_APPROVAL
```

### Teste 4: Validações de citizenId
```
1. Tentar criar protocolo SEM citizenId
2. Deve falhar com mensagem clara
3. Tentar com citizenId inválido
4. Deve falhar com "Cidadão não encontrado"
5. Tentar duplicar produtor
6. Deve falhar com "já está cadastrado"
```

### Teste 5: Aprovação de Produtor
```
1. Buscar produtor pendente
2. Aprovar via interface admin
3. Verificar se status mudou para ACTIVE
4. Verificar se protocolo foi CONCLUIDO
```

---

## 📈 MÉTRICAS DE SUCESSO

| Métrica | Antes | Meta |
|---------|-------|------|
| Handlers encontrados corretamente | 0% | 100% |
| Rotas duplicadas | 2 | 0 |
| Validações de citizenId | 0 | 3 |
| Serviços carregados no frontend | 0 | Todos |
| Taxa de erro em criação de produtor | Alta | <5% |

---

## ⚠️ RISCOS E MITIGAÇÕES

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Breaking change em outros módulos | Baixa | Alto | Testar todas as secretarias |
| Validações muito restritivas | Média | Médio | Mensagens claras de erro |
| Performance do frontend | Baixa | Baixo | Implementar cache se necessário |
| Migração de dados existentes | Baixa | Alto | Script de migração se necessário |

---

## 🚀 ROLLOUT

1. **Desenvolvimento** (agora)
   - Implementar todas as correções
   - Testes locais

2. **Review** (30min)
   - Code review das mudanças
   - Verificar se nada foi esquecido

3. **Staging** (1h)
   - Deploy em ambiente de testes
   - Testes end-to-end
   - Validação com dados reais

4. **Produção** (quando aprovado)
   - Deploy gradual
   - Monitoramento intensivo
   - Rollback preparado

---

## 📞 PRÓXIMOS PASSOS APÓS AGRICULTURA

Após validar todas as correções na Agricultura, criar planos similares para:

1. **Saúde** (11 serviços)
2. **Educação** (11 serviços)
3. **Assistência Social** (10 serviços)
4. **Cultura** (9 serviços)
5. **Esportes** (9 serviços)
6. E demais secretarias...

**Estimativa:** 1-2h por secretaria = 15-20h total

---

**PLANO APROVADO - INICIAR IMPLEMENTAÇÃO**
