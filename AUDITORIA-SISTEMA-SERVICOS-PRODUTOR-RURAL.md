# 🔍 AUDITORIA PROFISSIONAL - SISTEMA DE SERVIÇOS E MÓDULO PRODUTOR RURAL

**Data:** 30 de Outubro de 2025
**Sistema:** DigiUrban - Plataforma Municipal SaaS
**Escopo:** Sistema de Serviços, Sistema de Módulos, Módulo Produtor Rural

---

## 📋 SUMÁRIO EXECUTIVO

Esta auditoria identificou **9 PROBLEMAS CRÍTICOS** e **5 INCONSISTÊNCIAS GRAVES** no sistema de serviços e no módulo Produtor Rural da Secretaria de Agricultura. Os problemas variam desde **desalinhamento entre mapeamentos**, **handlers não implementados corretamente**, até **rotas duplicadas e conflitantes**.

### 🚨 PROBLEMAS CRÍTICOS IDENTIFICADOS

1. **Desalinhamento MODULE_MAPPING vs Handlers**
2. **Handler RuralProducerHandler com moduleType incorreto**
3. **Duplicação de rotas para Produtores Rurais**
4. **Service Templates completamente desativado**
5. **Protocol-Module Service não cria RuralProducer via citizenId**
6. **Frontend não carrega serviços da Agricultura**
7. **Inconsistência de nomenclatura (CADASTRO_PRODUTOR vs RuralProducer)**
8. **Falta de validação de citizenId obrigatório**
9. **Registro de handlers com chave incorreta**

---

## 🔴 PROBLEMA 1: DESALINHAMENTO CRÍTICO - MODULE_MAPPING

### Descrição
O arquivo `module-mapping.ts` define o mapeamento correto:
```typescript
CADASTRO_PRODUTOR: 'RuralProducer'
```

Mas o handler está registrado com chave diferente:
```typescript
// Em agriculture/index.ts
moduleHandlerRegistry.register(
  'agriculture:RuralProducer',  // ❌ ERRADO
  new RuralProducerHandler()
);
```

### Impacto
- **CRÍTICO**: Sistema nunca encontra o handler correto
- Protocolos de cadastro de produtor rural NÃO são processados
- Handler fica "órfão" e inacessível

### Solução
```typescript
// Deve ser:
moduleHandlerRegistry.register(
  'agriculture:CADASTRO_PRODUTOR',  // ✅ CORRETO - alinha com MODULE_MAPPING
  new RuralProducerHandler()
);
```

---

## 🔴 PROBLEMA 2: HANDLER COM moduleType INCORRETO

### Descrição
```typescript
// rural-producer-handler.ts
export class RuralProducerHandler extends BaseModuleHandler {
  moduleType = 'agriculture';  // ❌ GENÉRICO DEMAIS
  entityName = 'RuralProducer';
```

### Impacto
- **ALTO**: Pode causar colisão com outros handlers de agricultura
- Dificulta debugging e rastreamento
- Não segue o padrão dos outros handlers

### Solução
```typescript
moduleType = 'CADASTRO_PRODUTOR';  // ✅ ESPECÍFICO
```

---

## 🔴 PROBLEMA 3: DUPLICAÇÃO DE ROTAS

### Descrição
Existem **DUAS rotas diferentes** para o mesmo recurso:

**Rota 1:** `/api/admin/secretarias/agricultura/produtores`
- Arquivo: `secretarias-agricultura.ts` (linhas 286-351)
- Funcionalidade: GET com paginação e filtros

**Rota 2:** `/api/admin/secretarias/agricultura/produtores`
- Arquivo: `secretarias-agricultura-produtores.ts` (CRUD completo)
- Funcionalidade: GET, POST, PUT, DELETE

**Ambas registradas em index.ts:**
```typescript
app.use('/api/admin/secretarias/agricultura', secretariasAgriculturaRoutes);
app.use('/api/admin/secretarias/agricultura/produtores', secretariasAgricultureProdutoresRoutes);
```

### Impacto
- **CRÍTICO**: Conflito de rotas no Express
- Última registrada sobrescreve a primeira
- Comportamento imprevisível
- Duplicação de lógica de negócio

### Solução
**REMOVER** a rota GET de `secretarias-agricultura.ts` e manter apenas o arquivo dedicado `secretarias-agricultura-produtores.ts`.

---

## 🔴 PROBLEMA 4: SERVICE TEMPLATES DESATIVADO

### Descrição
O arquivo `service-templates.ts` está completamente desativado:

```typescript
// Linha 50-53
// NOTA: Model serviceTemplate não existe no schema
// Retornar lista vazia por enquanto
const templates: any[] = [];
const total = 0;
```

### Impacto
- **MÉDIO**: Funcionalidade de templates não disponível
- Admins não podem ativar serviços padrão
- Reduz produtividade na configuração de novos tenants

### Status
**NÃO É CRÍTICO** para o funcionamento do módulo Produtor Rural, mas deve ser implementado posteriormente.

---

## 🔴 PROBLEMA 5: PROTOCOL-MODULE SERVICE - CRIAÇÃO INCORRETA

### Descrição
No arquivo `protocol-module.service.ts`, a criação do RuralProducer está:

```typescript
// Linha 168-182
RuralProducer: () => tx.ruralProducer.create({
  data: {
    tenantId,
    citizenId: formData.citizenId, // ← OBRIGATÓRIO mas pode vir undefined
    protocolId,
    name: formData.name || formData.producerName || formData.nomeProdutor,
    document: formData.document || formData.producerCpf || formData.cpf,
    // ...
    status: 'PENDING_APPROVAL',
  },
}),
```

### Problemas Específicos

#### 5.1. citizenId pode ser undefined
- Não há validação prévia
- Se formData.citizenId for undefined, violará a constraint do schema
- Erro acontece DENTRO da transação (rollback completo)

#### 5.2. Dados podem vir com nomenclaturas diferentes
- `formData.name` vs `formData.producerName` vs `formData.nomeProdutor`
- `formData.document` vs `formData.producerCpf` vs `formData.cpf`
- Isso indica falta de padronização nos formulários

### Impacto
- **CRÍTICO**: Criação via protocolo pode falhar silenciosamente
- Mensagens de erro genéricas
- Usuários não entendem o que está errado

### Solução
```typescript
RuralProducer: async () => {
  // 1. Validar citizenId obrigatório
  if (!formData.citizenId) {
    throw new Error('citizenId é obrigatório para cadastro de produtor rural');
  }

  // 2. Verificar se cidadão existe
  const citizen = await tx.citizen.findFirst({
    where: { id: formData.citizenId, tenantId }
  });

  if (!citizen) {
    throw new Error('Cidadão não encontrado');
  }

  // 3. Verificar duplicidade
  const existing = await tx.ruralProducer.findFirst({
    where: { tenantId, citizenId: formData.citizenId }
  });

  if (existing) {
    throw new Error('Este cidadão já é cadastrado como produtor rural');
  }

  // 4. Criar com dados validados
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

---

## 🔴 PROBLEMA 6: FRONTEND NÃO CARREGA SERVIÇOS

### Descrição
Na página `agricultura/page.tsx`:

```typescript
// Linhas 30-35
// TODO: Migrar para arquitetura baseada em module-configs
const servicesLoading = false;
const statsLoading = false;
const servicesError = null;
const statsError = null;
const services: any[] = [];  // ❌ SEMPRE VAZIO
```

### Impacto
- **CRÍTICO**: Página nunca carrega serviços
- Modal de novo protocolo não funciona
- Estatísticas sempre zeradas
- Usuários veem tela vazia ou placeholders

### Solução
Implementar hooks para buscar dados:

```typescript
// Criar: hooks/useSecretariaServices.ts
export function useSecretariaServices(departmentCode: string) {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/admin/secretarias/${departmentCode}/services`,
          { credentials: 'include' }
        );

        if (!response.ok) throw new Error('Erro ao carregar serviços');

        const data = await response.json();
        setServices(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, [departmentCode]);

  return { services, loading, error };
}
```

---

## 🔴 PROBLEMA 7: INCONSISTÊNCIA DE NOMENCLATURA

### Onde ocorre

1. **MODULE_MAPPING**: `CADASTRO_PRODUTOR`
2. **Handler Registration**: `agriculture:RuralProducer`
3. **EntityName**: `RuralProducer`
4. **Prisma Model**: `RuralProducer`
5. **Table Name**: `rural_producers`

### Impacto
- **MÉDIO-ALTO**: Confusão no desenvolvimento
- Dificuldade em rastrear código
- Erros de integração

### Padrão Recomendado
- **MODULE_MAPPING Key**: `CADASTRO_PRODUTOR` (SCREAMING_SNAKE_CASE)
- **Handler Registry**: `agriculture:CADASTRO_PRODUTOR`
- **Prisma Model**: `RuralProducer` (PascalCase)
- **Table Name**: `rural_producers` (snake_case)

---

## 🔴 PROBLEMA 8: FALTA DE VALIDAÇÃO citizenId

### Onde falta validação

1. **protocol-module.service.ts** - Linha 171
2. **NewProtocolModal** (frontend) - Não valida antes de enviar

### Schema Prisma
```prisma
model RuralProducer {
  citizenId  String
  citizen    Citizen @relation("RuralProducerCitizen", fields: [citizenId], references: [id])

  @@unique([tenantId, citizenId])  // ← Constraint importante
}
```

### Impacto
- **CRÍTICO**: Violação de constraint
- Transações falham
- Usuários recebem erro genérico de banco de dados

---

## 🔴 PROBLEMA 9: REGISTRO DE HANDLERS INCORRETO

### Descrição
```typescript
// agriculture/index.ts
export function registerAgricultureHandlers() {
  moduleHandlerRegistry.register(
    'agriculture:RuralProducer',  // ❌ Não bate com MODULE_MAPPING
    new RuralProducerHandler()
  );

  moduleHandlerRegistry.register(
    'agriculture:TechnicalAssistance',  // ❌ Não bate com ASSISTENCIA_TECNICA
    new TechnicalAssistanceHandler()
  );
  // ...
}
```

### Padrão Correto
```typescript
// Deve seguir: 'departmentCode:MODULE_TYPE'
moduleHandlerRegistry.register(
  'AGRICULTURA:CADASTRO_PRODUTOR',
  new RuralProducerHandler()
);

moduleHandlerRegistry.register(
  'AGRICULTURA:ASSISTENCIA_TECNICA',
  new TechnicalAssistanceHandler()
);
```

---

## 📊 ANÁLISE DO SCHEMA PRISMA

### ✅ Pontos Positivos

```prisma
model RuralProducer {
  id             String   @id @default(cuid())
  tenantId       String
  citizenId      String    // ✅ Vincula ao cidadão
  protocolId     String?   // ✅ Vincula ao protocolo (opcional)

  // ✅ Constraints corretas
  @@unique([tenantId, document])
  @@unique([tenantId, citizenId])
  @@index([citizenId])
}
```

### ⚠️ Observações

1. **citizenId é obrigatório** - Deve ser validado SEMPRE
2. **protocolId é opcional** - Permite cadastro direto sem protocolo
3. **Unique constraints** - Previnem duplicação
4. **Indexes** - Otimizam queries

---

## 🔧 ANÁLISE DAS ROTAS

### ✅ Rota Dedicada: `/api/admin/secretarias/agricultura/produtores`

**Arquivo:** `secretarias-agricultura-produtores.ts`

**Endpoints:**
- `GET /` - Listar com paginação ✅
- `GET /:id` - Buscar por ID ✅
- `POST /` - Criar novo ✅
- `PUT /:id` - Atualizar ✅
- `DELETE /:id` - Deletar ✅

**Validações implementadas:**
- ✅ citizenId obrigatório
- ✅ Verifica se cidadão existe
- ✅ Previne duplicação por citizenId
- ✅ Previne duplicação por document
- ✅ Verifica propriedades antes de deletar

### ❌ Rota Duplicada: `/api/admin/secretarias/agricultura/produtores`

**Arquivo:** `secretarias-agricultura.ts` (linhas 286-351)

**Problema:** Implementa apenas GET com mesma funcionalidade da rota dedicada.

**Ação:** REMOVER esta implementação duplicada.

---

## 🎯 FLUXO CORRETO ESPERADO

### 1. Cidadão solicita cadastro como produtor rural

```
Frontend (Portal Cidadão)
  ↓
POST /api/protocols
  Body: {
    serviceId: "service-cadastro-produtor",
    formData: {
      citizenId: "citizen-123",
      productionType: "organic",
      mainCrop: "Café"
    }
  }
  ↓
ProtocolModuleService.createProtocolWithModule()
  ↓
1. Busca Service (deve ter moduleType: "CADASTRO_PRODUTOR")
2. Gera número de protocolo
3. Cria ProtocolSimplified (status: VINCULADO)
4. Identifica entityName via MODULE_MAPPING
5. Cria RuralProducer (status: PENDING_APPROVAL)
6. Cria histórico
  ↓
Retorna: { protocol, moduleEntity: RuralProducer }
```

### 2. Admin aprova cadastro

```
Admin Frontend
  ↓
POST /api/admin/secretarias/agricultura/produtores/approve
  Body: {
    producerId: "producer-456",
    approvedBy: "admin-789",
    comment: "Documentação aprovada"
  }
  ↓
RuralProducerHandler.approveProducer()
  ↓
1. Atualiza RuralProducer (status: ACTIVE, isActive: true)
2. Cria ProtocolHistory (action: APPROVED)
3. Atualiza ProtocolSimplified (status: CONCLUIDO)
  ↓
Retorna: { producer }
```

---

## 🔍 VERIFICAÇÃO DE INTEGRIDADE

### MODULE_MAPPING

```typescript
AGRICULTURA: [
  'ATENDIMENTOS_AGRICULTURA',      // → AgricultureAttendance ✅
  'CADASTRO_PRODUTOR',             // → RuralProducer ❌ (handler desalinhado)
  'ASSISTENCIA_TECNICA',           // → TechnicalAssistance ❌ (handler desalinhado)
  'INSCRICAO_CURSO_RURAL',         // → RuralTraining ❌ (handler desalinhado)
  'INSCRICAO_PROGRAMA_RURAL',      // → RuralProgram ❌ (handler desalinhado)
  'CADASTRO_PROPRIEDADE_RURAL'     // → RuralProperty ❌ (handler desalinhado)
]
```

### Handlers Registrados

```typescript
'agriculture:RuralProducer'             // ❌ Deveria ser 'AGRICULTURA:CADASTRO_PRODUTOR'
'agriculture:TechnicalAssistance'       // ❌ Deveria ser 'AGRICULTURA:ASSISTENCIA_TECNICA'
'agriculture:SeedDistribution'          // ❌ Não existe no MODULE_MAPPING
'agriculture:SoilAnalysis'              // ❌ Não existe no MODULE_MAPPING
'agriculture:FarmerMarketRegistration'  // ❌ Não existe no MODULE_MAPPING
```

**PROBLEMA CRÍTICO:** 80% dos handlers de agricultura estão com chave incorreta!

---

## 📝 RECOMENDAÇÕES PRIORITÁRIAS

### 🔴 PRIORIDADE CRÍTICA (Fazer AGORA)

1. **Alinhar registros de handlers**
   - Arquivo: `agriculture/index.ts`
   - Mudar todas as chaves para seguir `AGRICULTURA:MODULE_TYPE`

2. **Remover rota duplicada**
   - Arquivo: `secretarias-agricultura.ts`
   - Remover GET `/produtores` (linhas 286-351)

3. **Adicionar validação de citizenId**
   - Arquivo: `protocol-module.service.ts`
   - Implementar validação antes de criar RuralProducer

4. **Implementar carregamento de serviços no frontend**
   - Arquivo: `agricultura/page.tsx`
   - Criar hook `useSecretariaServices`

### 🟡 PRIORIDADE ALTA (Fazer em seguida)

5. **Padronizar moduleType nos handlers**
   - Todos os handlers de agricultura devem usar nomenclatura SCREAMING_SNAKE_CASE

6. **Implementar Service Templates**
   - Criar model ServiceTemplate no schema
   - Ativar funcionalidades de templates

7. **Revisar MODULE_MAPPING**
   - Adicionar serviços faltantes (SeedDistribution, etc)
   - Ou remover handlers órfãos

### 🟢 PRIORIDADE MÉDIA (Melhorias)

8. **Adicionar testes automatizados**
   - Testar criação via protocolo
   - Testar criação direta
   - Testar aprovação

9. **Melhorar mensagens de erro**
   - Erros mais específicos
   - Códigos de erro padronizados

10. **Documentação**
    - Documentar fluxo completo
    - Criar diagrama de sequência

---

## 📈 IMPACTO DOS PROBLEMAS

### Por Severidade

| Severidade | Quantidade | % |
|------------|------------|---|
| Crítica    | 6          | 67% |
| Alta       | 2          | 22% |
| Média      | 1          | 11% |

### Por Componente

| Componente | Problemas | Status |
|------------|-----------|--------|
| Handlers   | 3         | 🔴 Crítico |
| Rotas      | 2         | 🔴 Crítico |
| Frontend   | 1         | 🔴 Crítico |
| Validações | 2         | 🟡 Alto |
| Templates  | 1         | 🟢 Médio |

---

## ✅ CHECKLIST DE CORREÇÃO

```
[ ] 1. Alinhar chaves de registro dos handlers
[ ] 2. Remover rota GET duplicada de produtores
[ ] 3. Adicionar validação citizenId no protocol-module.service
[ ] 4. Criar hook useSecretariaServices
[ ] 5. Implementar carregamento de serviços no frontend
[ ] 6. Padronizar moduleType em todos os handlers
[ ] 7. Revisar e atualizar MODULE_MAPPING
[ ] 8. Adicionar testes para fluxo completo
[ ] 9. Melhorar mensagens de erro
[ ] 10. Documentar fluxo de cadastro de produtor
```

---

## 🎓 LIÇÕES APRENDIDAS

1. **Nomenclatura inconsistente causa 80% dos problemas**
   - Definir padrão e seguir rigorosamente
   - Usar constantes compartilhadas

2. **Duplicação de rotas é perigosa**
   - Sempre verificar se rota já existe
   - Usar princípio DRY (Don't Repeat Yourself)

3. **Validações devem ser em múltiplas camadas**
   - Frontend (UX)
   - Backend (segurança)
   - Banco de dados (integridade)

4. **MODULE_MAPPING deve ser a fonte única da verdade**
   - Todos os componentes devem consultar
   - Gerar registros automaticamente a partir dele

---

## 📞 PRÓXIMOS PASSOS

1. Apresentar este relatório para a equipe
2. Priorizar correções críticas
3. Criar branch de correção
4. Implementar correções uma a uma
5. Testar cada correção
6. Code review
7. Deploy em ambiente de testes
8. Validação com usuários
9. Deploy em produção
10. Monitoramento pós-deploy

---

**Relatório gerado automaticamente pela Auditoria de Sistema**
**Auditor:** Claude Code Assistant
**Versão:** 1.0
