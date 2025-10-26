# 📘 GUIA COMPLETO - Criação de Serviços no Painel Admin

## 🎯 Visão Geral

O sistema DigiUrban possui uma **interface completa de gerenciamento de serviços** onde gestores municipais podem criar, editar e organizar serviços públicos de forma manual através do painel administrativo.

---

## 🗺️ Arquitetura da Funcionalidade

### 📂 Estrutura de Arquivos

```
digiurban/
├── frontend/
│   ├── app/admin/
│   │   ├── servicos/page.tsx              ← 🎨 INTERFACE PRINCIPAL (CRUD)
│   │   └── gerenciamento-servicos/page.tsx ← 📊 DASHBOARD/ESTATÍSTICAS
│   └── hooks/
│       └── useServices.ts                  ← 🪝 Hook para consulta de serviços
│
└── backend/
    └── src/
        └── routes/
            └── services.ts                 ← 🔌 API REST de Serviços
```

---

## 📱 Interface do Painel Admin

### 📍 Localização
**URL:** `https://digiurban.com.br/admin/servicos`

### 🎨 Funcionalidades da Interface

#### 1️⃣ **Visão Geral (Cards de Estatísticas)**

```
┌─────────────────────────────────────────────────────────┐
│  📊 ESTATÍSTICAS                                        │
├──────────────┬──────────────┬──────────────┬───────────┤
│ Total: 154   │ Ativos: 150  │ Inativos: 4  │ Docs: 120 │
└──────────────┴──────────────┴──────────────┴───────────┘
```

**Localização no código:** [services/page.tsx:342-390](digiurban/frontend/app/admin/servicos/page.tsx:342-390)

#### 2️⃣ **Filtros de Pesquisa**

- 🔍 **Busca por nome/descrição**
- 📁 **Filtro por categoria**
- 🏢 **Filtro por departamento**
- ✅ **Filtro por status** (Ativo/Inativo)

**Localização no código:** [services/page.tsx:393-446](digiurban/frontend/app/admin/servicos/page.tsx:393-446)

#### 3️⃣ **Lista de Serviços (Cards)**

Cada serviço é exibido em um card com:
- Nome e descrição
- Badge de status (Ativo/Inativo)
- Categoria
- Departamento
- Prazo estimado
- Indicador de documentos necessários
- Botões: **Ver**, **Editar**, **Desativar**

**Localização no código:** [services/page.tsx:448-558](digiurban/frontend/app/admin/servicos/page.tsx:448-558)

---

## ✏️ Como Criar um Serviço Manualmente

### 🖱️ Passo a Passo na Interface

#### 1. **Acessar o Painel**
```
/admin/servicos → Botão "Novo Serviço" (canto superior direito)
```

#### 2. **Modal de Criação**
O sistema abre um **Dialog** (modal) com os seguintes campos:

##### 🔴 **Campos Obrigatórios**

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| **Nome** | Texto | Nome do serviço | "Emissão de Alvará Sanitário" |
| **Departamento** | Select | Departamento responsável | "Secretaria de Saúde" |

##### ⚪ **Campos Opcionais**

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| **Descrição** | Textarea | Descrição detalhada | "Emita alvará sanitário para estabelecimentos comerciais..." |
| **Categoria** | Texto | Categoria do serviço | "Licenciamento" |
| **Prazo Estimado** | Número | Dias para conclusão | 10 |
| **Prioridade** | Select (1-5) | Urgência do serviço | 4 - Alta |
| **Requer Documentos** | Checkbox | Indica se precisa de docs | ✅ |
| **Documentos Necessários** | Lista | Array de documentos | ["RG", "CPF", "CNPJ"] |

#### 3. **Adicionar Documentos Necessários** (Se marcado "Requer Documentos")

```typescript
// Sistema de adição de documentos
1. Digite o nome do documento: "RG"
2. Clique no botão "+" ou pressione Enter
3. O documento aparece como Badge removível
4. Repita para cada documento necessário
```

**Localização no código:** [services/page.tsx:666-690](digiurban/frontend/app/admin/servicos/page.tsx:666-690)

#### 4. **Salvar**
Clique em **"Criar Serviço"** → O sistema valida e envia para a API

---

## 🔌 API Backend - Como Funciona

### 📡 Endpoints Disponíveis

#### 1️⃣ **POST /api/services** - Criar Serviço

**Autenticação:** Requer token JWT + role MANAGER ou ADMIN

**Payload:**
```json
{
  "name": "Emissão de Alvará Sanitário",
  "description": "Emita alvará sanitário para estabelecimentos comerciais",
  "category": "Licenciamento",
  "departmentId": "cmh5ofw1l0007cb0kcq8iui1v",
  "requiresDocuments": true,
  "requiredDocuments": ["RG", "CPF", "CNPJ", "Comprovante de endereço"],
  "estimatedDays": 10,
  "priority": 4,
  "icon": "FileCheck",
  "color": "#10b981"
}
```

**Validações Automáticas:**
```typescript
✅ Nome e departmentId são obrigatórios
✅ Departamento deve existir e estar ativo
✅ MANAGER só pode criar serviços do próprio departamento
✅ ADMIN pode criar para qualquer departamento
```

**Resposta de Sucesso (201):**
```json
{
  "message": "Serviço criado com sucesso",
  "service": {
    "id": "clz123...",
    "name": "Emissão de Alvará Sanitário",
    "departmentId": "cmh5ofw1l0007cb0kcq8iui1v",
    "tenantId": "demo",
    "isActive": true,
    "createdAt": "2025-10-25T..."
  }
}
```

**Localização no código:** [services.ts:125-193](digiurban/backend/src/routes/services.ts:125-193)

---

#### 2️⃣ **GET /api/services** - Listar Serviços

**Autenticação:** Opcional (público ou autenticado)

**Query Parameters:**
- `departmentId` - Filtrar por departamento
- `search` - Buscar por nome ou descrição

**Exemplo:**
```bash
GET /api/services?departmentId=cmh5ofw1l0007cb0kcq8iui1v&search=alvará
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clz123...",
      "name": "Emissão de Alvará Sanitário",
      "description": "...",
      "category": "Licenciamento",
      "department": {
        "id": "cmh5...",
        "name": "Secretaria de Saúde"
      },
      "requiresDocuments": true,
      "estimatedDays": 10,
      "priority": 4,
      "isActive": true
    }
  ]
}
```

**Localização no código:** [services.ts:31-77](digiurban/backend/src/routes/services.ts:31-77)

---

#### 3️⃣ **PUT /api/services/:id** - Atualizar Serviço

**Autenticação:** Requer token JWT + role MANAGER ou ADMIN

**Payload (campos opcionais):**
```json
{
  "name": "Novo nome",
  "description": "Nova descrição",
  "requiresDocuments": false,
  "estimatedDays": 5,
  "priority": 3,
  "isActive": true
}
```

**Validações:**
```typescript
✅ Serviço deve existir no tenant
✅ MANAGER só pode editar serviços do próprio departamento
✅ Campos não enviados mantêm valores originais
```

**Localização no código:** [services.ts:199-260](digiurban/backend/src/routes/services.ts:199-260)

---

#### 4️⃣ **DELETE /api/services/:id** - Desativar Serviço

**Autenticação:** Requer token JWT + role MANAGER ou ADMIN

**Importante:** É um **soft delete** - o serviço não é removido, apenas marcado como `isActive: false`

**Validações Especiais:**
```typescript
❌ Não pode desativar se há protocolos ativos vinculados
✅ Permite desativar se todos os protocolos estiverem concluídos
```

**Localização no código:** [services.ts:266-326](digiurban/backend/src/routes/services.ts:266-326)

---

## 🛠️ Ferramentas e Recursos Disponíveis

### 1. **Sistema de Permissões**

```typescript
// Sistema baseado em roles
- SUPER_ADMIN: Acesso total (multi-tenant)
- ADMIN: Gerencia todos os departamentos do tenant
- MANAGER: Gerencia apenas seu departamento
- USER: Apenas visualização
```

**Uso na interface:**
```tsx
{hasPermission('services:create') && (
  <Button onClick={() => setShowCreateDialog(true)}>
    Novo Serviço
  </Button>
)}
```

### 2. **Validação de Formulário**

```typescript
// Validação client-side antes de enviar
const createService = async () => {
  if (!formData.name || !formData.departmentId) {
    toast({
      title: 'Campos obrigatórios',
      description: 'Nome e departamento são obrigatórios.',
      variant: 'destructive',
    })
    return
  }
  // ... enviar para API
}
```

### 3. **Sistema de Feedback**

```typescript
// Notificações toast para feedback visual
toast({
  title: 'Serviço criado',
  description: 'O serviço foi criado com sucesso.',
})
```

### 4. **Multi-Tenant Automático**

```typescript
// O tenantId é detectado automaticamente
// Baseado no JWT do admin logado
tenantId: req.tenantId  // Injetado pelo middleware
```

---

## 🎨 Campos Customizáveis

### 📌 **Ícones** (Opcional)

O sistema suporta ícones da biblioteca **Lucide React**:

```typescript
icon: 'FileCheck'      // ✅ Ícone de checklist
icon: 'Heart'          // ❤️ Saúde
icon: 'GraduationCap'  // 🎓 Educação
icon: 'Building'       // 🏢 Infraestrutura
```

**Biblioteca completa:** https://lucide.dev/icons

### 🎨 **Cores** (Opcional)

Cores em formato hexadecimal para identificação visual:

```typescript
color: '#10b981'  // Verde
color: '#3b82f6'  // Azul
color: '#ef4444'  // Vermelho
color: '#f59e0b'  // Laranja
color: '#8b5cf6'  // Roxo
```

### 📊 **Prioridade**

Sistema de 1 a 5 para ordenação:

```
1 = Muito Baixa  (menos urgente)
2 = Baixa
3 = Normal        (padrão)
4 = Alta
5 = Crítica       (emergencial)
```

Os serviços são exibidos ordenados por `prioridade DESC, nome ASC`

---

## 📝 Exemplo Completo de Criação

### Cenário: Criar serviço "Inspeção Sanitária de Restaurantes"

#### 1. **Dados do Formulário**

```yaml
Nome: Inspeção Sanitária de Restaurantes
Descrição: Solicite inspeção sanitária obrigatória para funcionamento de restaurantes e estabelecimentos alimentícios
Categoria: Fiscalização Sanitária
Departamento: Secretaria de Saúde
Prazo Estimado: 15 dias
Prioridade: 4 - Alta
Requer Documentos: ✅ Sim
Documentos:
  - CNPJ do estabelecimento
  - Alvará de funcionamento
  - Planta baixa do local
  - Documentos do responsável técnico
Ícone: ClipboardCheck
Cor: #ef4444
```

#### 2. **Payload da API**

```json
{
  "name": "Inspeção Sanitária de Restaurantes",
  "description": "Solicite inspeção sanitária obrigatória para funcionamento de restaurantes e estabelecimentos alimentícios",
  "category": "Fiscalização Sanitária",
  "departmentId": "cmh5ofw1l0007cb0kcq8iui1v",
  "requiresDocuments": true,
  "requiredDocuments": [
    "CNPJ do estabelecimento",
    "Alvará de funcionamento",
    "Planta baixa do local",
    "Documentos do responsável técnico"
  ],
  "estimatedDays": 15,
  "priority": 4,
  "icon": "ClipboardCheck",
  "color": "#ef4444"
}
```

#### 3. **Fluxo Completo**

```
1. Admin clica em "Novo Serviço"
   ↓
2. Preenche formulário no modal
   ↓
3. Frontend valida campos obrigatórios
   ↓
4. Envia POST /api/services com JWT
   ↓
5. Backend valida:
   - Autenticação (JWT válido)
   - Autorização (role MANAGER/ADMIN)
   - Departamento existe e está ativo
   - Manager pode criar nesse dept
   ↓
6. Prisma cria registro no banco:
   - Adiciona tenantId automaticamente
   - Define isActive = true por padrão
   - Gera ID único (cuid)
   ↓
7. Retorna serviço criado (201)
   ↓
8. Frontend:
   - Exibe toast de sucesso
   - Fecha modal
   - Recarrega lista de serviços
   ↓
9. Serviço aparece no catálogo
```

---

## 🔍 Consultas e Filtros

### Frontend - useServices Hook

```typescript
import { useServices } from '@/hooks/useServices'

function MeuComponente() {
  const { services, loading, fetchServices } = useServices()

  // services: array com todos os serviços
  // loading: boolean de carregamento
  // fetchServices: função para recarregar
}
```

### Filtros Disponíveis

```typescript
// 1. Busca por texto (nome ou descrição)
const filtered = services.filter(s =>
  s.name.toLowerCase().includes(searchTerm) ||
  s.description?.toLowerCase().includes(searchTerm)
)

// 2. Filtro por categoria
const byCategory = services.filter(s => s.category === 'Consultas Médicas')

// 3. Filtro por departamento
const byDept = services.filter(s => s.departmentId === 'dept-123')

// 4. Filtro por status
const active = services.filter(s => s.isActive === true)
```

---

## 🚀 Casos de Uso Avançados

### 1. **Serviço com Múltiplos Documentos**

```json
{
  "name": "Matrícula Escolar",
  "requiresDocuments": true,
  "requiredDocuments": [
    "Certidão de nascimento",
    "RG do responsável",
    "CPF do responsável",
    "Comprovante de residência",
    "Cartão de vacinação atualizado",
    "Foto 3x4",
    "Histórico escolar (se transferência)"
  ]
}
```

### 2. **Serviço Urgente (Prioridade Máxima)**

```json
{
  "name": "Atendimento de Emergência",
  "priority": 5,
  "estimatedDays": 0,
  "category": "Emergência"
}
```

### 3. **Serviço sem Documentos**

```json
{
  "name": "Consulta de Calendário Escolar",
  "requiresDocuments": false,
  "estimatedDays": 0,
  "priority": 1
}
```

---

## ⚙️ Configurações e Limitações

### Limites Técnicos

```typescript
// Campos de texto
name: string (máx. 191 caracteres - padrão MySQL)
description: text (ilimitado)
category: string (máx. 191 caracteres)

// Numéricos
estimatedDays: int (null permitido)
priority: int (1-5 recomendado)

// Arrays
requiredDocuments: string[] (sem limite de itens)
```

### Regras de Negócio

```
✅ Serviço deve pertencer a um departamento ativo
✅ MANAGER só gerencia serviços do próprio departamento
✅ Não pode desativar serviço com protocolos ativos
✅ Soft delete - serviços nunca são removidos fisicamente
✅ Tenant isolation - cada município vê apenas seus serviços
```

---

## 📊 Dashboard de Estatísticas

**URL:** `/admin/gerenciamento-servicos`

### Métricas Disponíveis

```
1. Total de Serviços
2. Serviços Ativos vs Inativos
3. Serviços que Requerem Documentos
4. Prazo Médio de Conclusão
5. Top 5 Departamentos (mais serviços)
6. Top 5 Categorias (mais utilizadas)
7. Taxa de Ativação
8. Cobertura de Departamentos
```

**Localização:** [gerenciamento-servicos/page.tsx](digiurban/frontend/app/admin/gerenciamento-servicos/page.tsx)

---

## 🎯 Resumo dos Recursos

### ✅ O que você PODE fazer:

- ✅ Criar serviços ilimitados
- ✅ Editar todos os campos (exceto departamento após criação)
- ✅ Desativar/ativar serviços
- ✅ Adicionar/remover documentos necessários
- ✅ Definir prazos e prioridades
- ✅ Categorizar livremente
- ✅ Filtrar e buscar
- ✅ Ver estatísticas em tempo real

### ❌ Limitações:

- ❌ Não pode deletar permanentemente (apenas desativar)
- ❌ Não pode desativar se houver protocolos ativos
- ❌ MANAGER não pode criar para outros departamentos
- ❌ Não pode alterar departamento após criação
- ❌ Não pode criar serviço para departamento inativo

---

## 🔗 Links Úteis

- 📄 **Interface CRUD:** `/admin/servicos`
- 📊 **Dashboard:** `/admin/gerenciamento-servicos`
- 🌐 **Catálogo Público:** `/servicos` (Portal do Cidadão)
- 📚 **Documentação API:** Ver arquivo [services.ts](digiurban/backend/src/routes/services.ts)

---

## 💡 Dicas e Boas Práticas

1. **Nomes Descritivos:** Use nomes claros que o cidadão entenda
2. **Descrições Completas:** Explique o que é o serviço e para que serve
3. **Categorias Consistentes:** Padronize as categorias (ex: sempre "Consultas Médicas", não "consulta" ou "consultas")
4. **Documentos Específicos:** Liste documentos exatos (ex: "RG" não "documento")
5. **Prazos Realistas:** Defina prazos que podem ser cumpridos
6. **Prioridades Corretas:** Reserve prioridade 5 para emergências reais
7. **Ícones Adequados:** Escolha ícones que representam visualmente o serviço
8. **Cores Padronizadas:** Use cores consistentes por tipo de serviço

---

**Sistema desenvolvido por:** DigiUrban
**Versão:** 2.0
**Última atualização:** Outubro 2025
