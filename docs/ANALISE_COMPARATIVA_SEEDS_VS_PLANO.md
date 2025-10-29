# ANÁLISE COMPARATIVA: SEEDS ATUAL vs PLANO DE SIMPLIFICAÇÃO

**Data:** 29/10/2025
**Objetivo:** Comparar serviços do seed atual com o PLANO_IMPLEMENTACAO_SIMPLIFICACAO.md

---

## 📊 RESUMO EXECUTIVO

### **SEED ATUAL**
- **Total:** 154 serviços
- **Estrutura:** Genérica (sem serviceType, moduleType, formSchema)
- **Departamentos:** 13 secretarias
- **Status:** ❌ **DESALINHADO** com nova arquitetura

### **PLANO DE SIMPLIFICAÇÃO**
- **Total:** 108 serviços (95 COM_DADOS + 12 INFORMATIVOS + 1 transversal)
- **Estrutura:** Simplificada (serviceType + moduleType + formSchema)
- **Cobertura:** 100% mapeada com módulos
- **Status:** ✅ **PRONTO** para implementação

---

## 🔍 PROBLEMAS IDENTIFICADOS NO SEED ATUAL

### **1. FALTA DE CLASSIFICAÇÃO (serviceType)**

❌ **Problema:** Nenhum serviço tem `serviceType` definido

**Seed Atual:**
```typescript
{
  name: 'Registro de Elogio, Sugestão ou Reclamação',
  description: '...',
  category: 'Ouvidoria',
  // ❌ Sem serviceType
  // ❌ Sem moduleType
  // ❌ Sem formSchema
}
```

**Deveria ser:**
```typescript
{
  name: 'Registro de Elogio, Sugestão ou Reclamação',
  serviceType: 'COM_DADOS', // ✅ Classificado
  moduleType: 'ATENDIMENTOS_OUVIDORIA', // ✅ Roteamento
  formSchema: {
    fields: [
      { id: 'tipo', type: 'select', options: ['Elogio', 'Sugestão', 'Reclamação'] },
      { id: 'descricao', type: 'textarea', required: true }
    ]
  }
}
```

---

### **2. SERVIÇOS DUPLICADOS/REDUNDANTES**

#### **Seed Atual tem MUITOS serviços genéricos:**

**Exemplos de Redundância:**
- "Agendamento de Consulta Geral"
- "Agendamento Online de Consultas"
- "Reagendamento de Consulta"
→ **Deveria ser 1 serviço:** "Agendamento de Consulta" (COM_DADOS → AGENDAMENTOS_MEDICOS)

**Outro exemplo:**
- "Solicitação de Transporte para Consultas"
- "Transporte para Exames Especializados"
→ **Deveria ser 1 serviço:** "Transporte de Pacientes" (COM_DADOS → TRANSPORTE_PACIENTES)

---

### **3. SERVIÇOS QUE DEVERIAM SER INFORMATIVOS**

❌ **Seed atual trata tudo como se gerasse protocolo**

**Exemplos que deveriam ser INFORMATIVOS:**
```typescript
// Seed Atual (gera protocolo)
{ name: 'Consulta de Cronograma de Coleta' }
{ name: 'Cardápio da Merenda Escolar' }
{ name: 'Consulta do Calendário Escolar' }
{ name: 'Consulta de Frequência do Aluno' }

// Deveria ser INFORMATIVO (não gera protocolo)
{
  name: 'Calendário Escolar',
  serviceType: 'INFORMATIVO',
  moduleType: null,
  formSchema: null
}
```

---

### **4. FALTA DE MAPEAMENTO PARA MÓDULOS**

**Seed Atual:** 0 serviços mapeados para módulos
**Plano:** 95 serviços COM_DADOS mapeados

**Exemplo de serviço do seed atual:**
```typescript
{
  name: 'Matrícula Escolar Online',
  category: 'Educação',
  // ❌ Sem moduleType
  // ❌ Dados não vão para módulo Student
}
```

**Deveria ser:**
```typescript
{
  name: 'Matrícula de Aluno',
  serviceType: 'COM_DADOS',
  moduleType: 'MATRICULA_ALUNO', // ✅ Dados vão para Student
  formSchema: {
    fields: [
      { id: 'nomeAluno', type: 'text', required: true },
      { id: 'dataNascimento', type: 'date', required: true },
      { id: 'escolaDesejada', type: 'text', required: true },
      { id: 'serie', type: 'select', options: ['1º Ano', ...] }
    ]
  }
}
```

---

## 📋 COMPARAÇÃO DETALHADA POR SECRETARIA

### **1. SAÚDE**

| Seed Atual (20 serviços) | Plano (11 serviços) | Status |
|--------------------------|---------------------|--------|
| Agendamento de Consulta Geral | ✅ Agendamento de Consulta | Consolidar |
| Agendamento Online de Consultas | ⚠️ Duplicado | Remover |
| Reagendamento de Consulta | ⚠️ Duplicado | Remover |
| Atendimento de Emergência | ✅ Atendimentos Saúde | OK |
| Consulta Especializada | ⚠️ Duplicado | Remover |
| Dispensação de Medicamentos | ✅ Controle de Medicamentos | OK |
| Consulta de Estoque de Medicamentos | ⚠️ Duplicado | Remover |
| Inscrição em Campanhas de Vacinação | ✅ Campanhas de Saúde | OK |
| Certificado de Vacinação | ⚠️ Duplicado | Remover |
| Inscrição no Programa Hiperdia | ✅ Programas de Saúde | OK |
| Acompanhamento Pré-Natal | ⚠️ Duplicado | Remover |
| Solicitação de TFD | ✅ Encaminhamentos TFD | OK |
| Acompanhamento de Solicitação TFD | ⚠️ Duplicado | Remover |
| Agendamento de Exames Laboratoriais | ✅ Exames | Consolidar |
| Agendamento de Exames de Imagem | ⚠️ Duplicado | Remover |
| Consulta de Resultados de Exames | ⚠️ Duplicado | Remover |
| Solicitação de Visita Domiciliar | ⚠️ Não está no plano | Remover |
| Cadastro Familiar no PSF | ⚠️ Não está no plano | Remover |
| Solicitação de Transporte para Consultas | ✅ Transporte de Pacientes | Consolidar |
| Transporte para Exames Especializados | ⚠️ Duplicado | Remover |

**Redução:** 20 → 11 serviços (**-45%**)

---

### **2. EDUCAÇÃO**

| Seed Atual (14 serviços) | Plano (11 serviços) | Status |
|--------------------------|---------------------|--------|
| Justificativa de Falta Escolar | ✅ Registro de Ocorrência Escolar | Consolidar |
| Consulta de Frequência do Aluno | ✅ Consulta de Frequência | OK (INFORMATIVO?) |
| Matrícula Escolar Online | ✅ Matrícula de Aluno | Renomear |
| Transferência Escolar | ✅ Transferência Escolar | OK |
| Segunda Via de Histórico Escolar | ✅ Solicitação de Documento Escolar | Consolidar |
| Consulta de Vagas Escolares | ⚠️ INFORMATIVO | Reclassificar |
| Solicitação de Reunião com Coordenação | ⚠️ Não está no plano | Remover |
| Solicitação de Transporte Escolar | ✅ Transporte Escolar | OK |
| Consulta de Rotas de Transporte | ⚠️ INFORMATIVO | Reclassificar |
| Cardápio da Merenda Escolar | ⚠️ INFORMATIVO | Reclassificar |
| Solicitação de Dieta Especial | ✅ Gestão de Merenda | Consolidar |
| Registro de Ocorrência Escolar | ✅ Registro de Ocorrência Escolar | OK |
| Acompanhamento Pedagógico | ⚠️ Não está no plano | Remover |
| Consulta do Calendário Escolar | ✅ Calendário Escolar (INFORMATIVO) | OK |

**Redução:** 14 → 11 serviços (**-21%**)

---

### **3. ASSISTÊNCIA SOCIAL**

| Seed Atual (12 serviços) | Plano (10 serviços) | Status |
|--------------------------|---------------------|--------|
| Cadastro no CadÚnico | ✅ Cadastro Único | OK |
| Consulta de Benefícios | ✅ Solicitação de Benefício | Consolidar |
| Solicitação de Auxílio | ⚠️ Duplicado | Remover |
| Agendamento de Atendimento Social | ✅ Agendamento de Atendimento Social | OK |
| Denúncia de Violência | ⚠️ Não está no plano | Remover |
| Solicitação de Cesta Básica | ✅ Entrega Emergencial | Consolidar |
| Inscrição em Programas Sociais | ✅ Inscrição em Programa Social | OK |
| Acompanhamento de Família | ⚠️ Gestão CRAS? | Verificar |
| Solicitação de Documentação | ⚠️ Não está no plano | Remover |
| Registro de Visita Domiciliar | ✅ Visitas Domiciliares | OK |
| Inscrição em Oficinas | ✅ Inscrição em Grupo/Oficina | OK |
| Consulta de Programas Disponíveis | ⚠️ INFORMATIVO | Reclassificar |

**Redução:** 12 → 10 serviços (**-17%**)

---

### **4. AGRICULTURA**

| Seed Atual (10 serviços) | Plano (6 serviços) | Status |
|--------------------------|---------------------|--------|
| Cadastro de Produtor Rural | ✅ Cadastro de Produtor | OK |
| Solicitação de Assistência Técnica | ✅ Assistência Técnica | OK |
| Inscrição em Cursos Rurais | ✅ Inscrição em Curso Rural | OK |
| Consulta de Calendário Agrícola | ⚠️ INFORMATIVO | Reclassificar |
| Solicitação de Análise de Solo | ⚠️ Deveria estar em ASSISTENCIA_TECNICA | Consolidar |
| Registro de Produção | ⚠️ Deveria estar em CADASTRO_PRODUTOR | Consolidar |
| Solicitação de Mudas | ⚠️ Deveria estar em ASSISTENCIA_TECNICA | Consolidar |
| Agendamento de Visita Técnica | ⚠️ Deveria estar em ASSISTENCIA_TECNICA | Consolidar |
| Consulta de Programas Rurais | ⚠️ INFORMATIVO | Reclassificar |
| Denúncia de Desmatamento | ⚠️ Deveria estar em MEIO_AMBIENTE | Mover |

**Redução:** 10 → 6 serviços (**-40%**)

---

### **5. COMPARAÇÃO GERAL**

| Secretaria | Seed Atual | Plano | Diferença | % Redução |
|------------|------------|-------|-----------|-----------|
| Administração | 10 | 0* | -10 | -100% |
| Saúde | 20 | 11 | -9 | -45% |
| Educação | 14 | 11 | -3 | -21% |
| Serviços Públicos | 18 | 9 | -9 | -50% |
| Assistência Social | 12 | 10 | -2 | -17% |
| Cultura | 10 | 9 | -1 | -10% |
| Esportes | 8 | 9 | +1 | +13% |
| Meio Ambiente | 14 | 7 | -7 | -50% |
| Obras | 12 | 7 | -5 | -42% |
| Planejamento | 8 | 9 | +1 | +13% |
| Fazenda | 10 | 0* | -10 | -100% |
| Agricultura | 10 | 6 | -4 | -40% |
| Turismo | 8 | 9 | +1 | +13% |
| Segurança | 0 | 11 | +11 | N/A |
| **TOTAL** | **154** | **108** | **-46** | **-30%** |

*Administração e Fazenda foram excluídas do plano por serem serviços internos/genéricos

---

## 🎯 PROBLEMAS CRÍTICOS IDENTIFICADOS

### **1. NENHUM SERVIÇO TEM `serviceType`**
```typescript
// ❌ Atual (154 serviços)
serviceType: undefined

// ✅ Deveria ter
serviceType: 'INFORMATIVO' | 'COM_DADOS'
```

### **2. NENHUM SERVIÇO TEM `moduleType`**
```typescript
// ❌ Atual
moduleType: undefined

// ✅ Deveria ter (95 serviços)
moduleType: 'MATRICULA_ALUNO' | 'ATENDIMENTOS_SAUDE' | etc
```

### **3. NENHUM SERVIÇO TEM `formSchema`**
```typescript
// ❌ Atual
formSchema: undefined

// ✅ Deveria ter (95 serviços COM_DADOS)
formSchema: {
  type: 'object',
  fields: [...]
}
```

### **4. MUITOS SERVIÇOS DUPLICADOS**
- **20 serviços de Saúde** → podem ser **11**
- **14 serviços de Educação** → podem ser **11**
- **18 serviços de Serviços Públicos** → podem ser **9**

### **5. SERVIÇOS EM SECRETARIAS ERRADAS**
- "Denúncia de Desmatamento" (Agricultura) → deveria ser Meio Ambiente
- "Consulta de Cronograma de Coleta" → deveria ser INFORMATIVO

---

## 📋 RECOMENDAÇÕES

### **OPÇÃO 1: MIGRAÇÃO GRADUAL (Recomendada)**

**Passo 1:** Adicionar campos novos ao seed atual
```typescript
interface ServiceSeedData {
  name: string
  description: string
  category: string
  departmentCode: string

  // ✅ NOVOS CAMPOS
  serviceType: 'INFORMATIVO' | 'COM_DADOS'
  moduleType?: string
  formSchema?: any

  // Campos existentes
  requiresDocuments: boolean
  requiredDocuments?: string[]
  estimatedDays: number | null
  priority: number
  icon?: string
  color?: string
}
```

**Passo 2:** Classificar os 154 serviços
```typescript
// Exemplo: Matrícula Escolar
{
  name: 'Matrícula Escolar Online',
  serviceType: 'COM_DADOS', // ✅ Adicionar
  moduleType: 'MATRICULA_ALUNO', // ✅ Adicionar
  formSchema: { // ✅ Adicionar
    fields: [
      { id: 'nomeAluno', type: 'text', required: true },
      { id: 'dataNascimento', type: 'date', required: true }
    ]
  },
  // ... resto dos campos
}
```

**Passo 3:** Remover duplicados (154 → ~120 serviços)

**Passo 4:** Consolidar com plano (120 → 108 serviços)

---

### **OPÇÃO 2: SUBSTITUIÇÃO COMPLETA (Mais Rápida)**

**Passo 1:** Criar novo seed baseado no plano
```bash
# Backup do seed atual
cp initial-services.ts initial-services.backup.ts

# Criar novo seed
touch initial-services-v2.ts
```

**Passo 2:** Implementar 108 serviços do plano
(Ver mapeamento completo no PLANO_IMPLEMENTACAO_SIMPLIFICACAO.md linhas 230-411)

**Passo 3:** Migrar dados existentes
```typescript
// Script de migração
async function migrateExistingServices() {
  const oldServices = await prisma.service.findMany()

  for (const old of oldServices) {
    const serviceType = determineServiceType(old.name)
    const moduleType = determineModuleType(old.name)
    const formSchema = buildDefaultFormSchema(moduleType)

    await prisma.serviceSimplified.create({
      data: {
        ...old,
        serviceType,
        moduleType,
        formSchema
      }
    })
  }
}
```

---

## 🔧 SCRIPT DE CONVERSÃO

### **Função: Determinar serviceType**
```typescript
function determineServiceType(serviceName: string): 'INFORMATIVO' | 'COM_DADOS' {
  const informativeKeywords = [
    'Consulta de',
    'Calendário',
    'Acompanhamento de',
    'Mapa',
    'Agenda de',
    'Estatísticas'
  ]

  const isInformative = informativeKeywords.some(keyword =>
    serviceName.includes(keyword)
  )

  return isInformative ? 'INFORMATIVO' : 'COM_DADOS'
}
```

### **Função: Determinar moduleType**
```typescript
function determineModuleType(serviceName: string): string | null {
  const mapping: Record<string, string> = {
    // Saúde
    'Agendamento de Consulta': 'AGENDAMENTOS_MEDICOS',
    'Dispensação de Medicamentos': 'CONTROLE_MEDICAMENTOS',
    'Vacinação': 'CAMPANHAS_SAUDE',
    'TFD': 'ENCAMINHAMENTOS_TFD',
    'Exames': 'EXAMES',
    'Transporte': 'TRANSPORTE_PACIENTES',

    // Educação
    'Matrícula': 'MATRICULA_ALUNO',
    'Transporte Escolar': 'TRANSPORTE_ESCOLAR',
    'Ocorrência Escolar': 'REGISTRO_OCORRENCIA_ESCOLAR',
    'Histórico Escolar': 'SOLICITACAO_DOCUMENTO_ESCOLAR',
    'Transferência Escolar': 'TRANSFERENCIA_ESCOLAR',

    // Assistência Social
    'CadÚnico': 'CADASTRO_UNICO',
    'Benefício': 'SOLICITACAO_BENEFICIO',
    'Cesta Básica': 'ENTREGA_EMERGENCIAL',
    'Visita Domiciliar': 'VISITAS_DOMICILIARES',
    'Programa Social': 'INSCRICAO_PROGRAMA_SOCIAL',

    // ... mais mapeamentos
  }

  for (const [keyword, module] of Object.entries(mapping)) {
    if (serviceName.includes(keyword)) {
      return module
    }
  }

  return null
}
```

---

## 📊 ESTATÍSTICAS FINAIS

### **SEED ATUAL**
- ✅ 154 serviços implementados
- ❌ 0 classificados (serviceType)
- ❌ 0 mapeados (moduleType)
- ❌ 0 com formulários (formSchema)
- ⚠️ ~30% duplicados/redundantes

### **PLANO DE SIMPLIFICAÇÃO**
- ✅ 108 serviços (otimizados)
- ✅ 95 COM_DADOS (88%)
- ✅ 12 INFORMATIVOS (11%)
- ✅ 1 Transversal (1%)
- ✅ 100% mapeados e classificados

### **PRÓXIMOS PASSOS**
1. ✅ Decidir: Migração Gradual ou Substituição Completa
2. ⏳ Classificar 154 serviços existentes
3. ⏳ Remover ~46 serviços duplicados/desnecessários
4. ⏳ Adicionar formSchema para 95 serviços COM_DADOS
5. ⏳ Testar migração em ambiente de dev
6. ⏳ Validar com stakeholders
7. ⏳ Deploy em produção

---

**Recomendação Final:**
**Substituição Completa** usando os 108 serviços do plano + script de migração de dados existentes. É mais rápido e garante 100% de alinhamento com a nova arquitetura.

---

**Documento:** Análise Comparativa Seeds vs Plano
**Data:** 29/10/2025
**Status:** Análise Completa
**Próximo Passo:** Decisão sobre estratégia de migração
