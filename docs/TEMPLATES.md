# 📋 Guia de Criação de Templates de Serviços

## Índice
1. [Introdução](#introdução)
2. [Estrutura de um Template](#estrutura-de-um-template)
3. [Criando Templates via Interface](#criando-templates-via-interface)
4. [Criando Templates Programaticamente](#criando-templates-programaticamente)
5. [Schema de Formulários](#schema-de-formulários)
6. [Exemplos Completos](#exemplos-completos)
7. [Validação e Testes](#validação-e-testes)
8. [Boas Práticas](#boas-práticas)

---

## Introdução

**Templates de Serviços** são modelos pré-configurados que definem como um serviço funciona no DigiUrban. Eles especificam:
- Campos do formulário
- Validações
- Documentos necessários
- Fluxo de aprovação
- SLA (prazo de atendimento)

### Benefícios dos Templates

✅ **Reutilização** - Um template pode ser usado por várias secretarias
✅ **Consistência** - Mesma experiência em diferentes municípios
✅ **Agilidade** - Ativar serviços em minutos, não dias
✅ **Manutenção** - Atualizar template atualiza todos os serviços

---

## Estrutura de um Template

Todo template possui os seguintes campos:

```typescript
interface ServiceTemplate {
  id: string;              // Gerado automaticamente
  name: string;            // Nome do serviço
  description: string;     // Descrição detalhada
  category: string;        // Categoria (SAUDE, EDUCACAO, etc.)
  moduleType: string;      // Tipo do módulo handler

  // Configurações do formulário
  formSchema: object;      // Schema JSON do formulário

  // Documentação necessária
  requiredDocuments: string[];

  // Configurações de fluxo
  requiresApproval: boolean;     // Requer aprovação?
  autoAssign: boolean;           // Auto-atribuir?
  estimatedDays: number;         // Prazo estimado (dias)

  // Configurações de visibilidade
  isPublic: boolean;             // Disponível para cidadãos?
  isActive: boolean;             // Template ativo?

  // Metadados
  icon: string;                  // Ícone do serviço
  color: string;                 // Cor do card
  version: number;               // Versão do template

  // Timestamps
  createdAt: DateTime;
  updatedAt: DateTime;
}
```

---

## Criando Templates via Interface

### Passo 1: Acessar Gerenciador de Templates

1. Login como administrador
2. Navegar para **Admin > Serviços > Templates**
3. Clicar em **"Novo Template"**

### Passo 2: Informações Básicas

```
Nome: Agendamento de Consulta Médica
Categoria: SAUDE
Módulo: consulta-medica
Descrição: Permite que cidadãos agendem consultas médicas em UBS

Ícone: 🏥
Cor: #10B981 (verde)
```

### Passo 3: Configurar Formulário

Use o **Construtor de Formulários** visual:

1. Arrastar campos da paleta
2. Configurar propriedades
3. Definir validações
4. Organizar em seções

### Passo 4: Documentos Necessários

Adicionar documentos obrigatórios:
- Cartão SUS
- Documento de Identidade
- Comprovante de Residência

### Passo 5: Fluxo de Trabalho

```
Requer Aprovação: Sim
Auto-atribuir: Não
Prazo Estimado: 7 dias
Disponível Publicamente: Sim
```

### Passo 6: Publicar

1. Revisar configurações
2. Clicar em **"Publicar Template"**
3. Template fica disponível para todas as secretarias

---

## Criando Templates Programaticamente

### Via API

```typescript
// POST /api/admin/service-templates

const template = {
  name: "Agendamento de Consulta Médica",
  description: "Serviço para agendamento de consultas em UBS",
  category: "SAUDE",
  moduleType: "consulta-medica",

  formSchema: {
    fields: [
      {
        id: "especialidade",
        type: "select",
        label: "Especialidade",
        required: true,
        options: [
          { value: "clinico-geral", label: "Clínico Geral" },
          { value: "pediatria", label: "Pediatria" },
          { value: "ginecologia", label: "Ginecologia" }
        ]
      },
      {
        id: "dataDesejada",
        type: "date",
        label: "Data Desejada",
        required: true,
        validation: {
          minDate: "today",
          maxDate: "+90days"
        }
      },
      {
        id: "periodo",
        type: "radio",
        label: "Período",
        required: true,
        options: [
          { value: "MANHA", label: "Manhã (8h-12h)" },
          { value: "TARDE", label: "Tarde (13h-17h)" }
        ]
      },
      {
        id: "observacoes",
        type: "textarea",
        label: "Observações",
        required: false,
        maxLength: 500
      }
    ]
  },

  requiredDocuments: [
    "Cartão SUS",
    "Documento de Identidade",
    "Comprovante de Residência"
  ],

  requiresApproval: true,
  autoAssign: false,
  estimatedDays: 7,
  isPublic: true,
  isActive: true,

  icon: "🏥",
  color: "#10B981"
};

const response = await fetch('/api/admin/service-templates', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(template)
});
```

### Via Seed Script

```typescript
// digiurban/backend/src/seeds/templates/saude-templates.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedSaudeTemplates() {
  const templates = [
    {
      name: "Agendamento de Consulta Médica",
      slug: "consulta-medica",
      description: "Agende consultas em UBS da sua região",
      category: "SAUDE",
      moduleType: "consulta-medica",

      formSchema: {
        sections: [
          {
            title: "Dados da Consulta",
            fields: [
              {
                id: "especialidade",
                type: "select",
                label: "Especialidade",
                required: true,
                options: [
                  { value: "clinico-geral", label: "Clínico Geral" },
                  { value: "pediatria", label: "Pediatria" }
                ]
              },
              {
                id: "dataDesejada",
                type: "date",
                label: "Data Desejada",
                required: true
              }
            ]
          }
        ]
      },

      requiredDocuments: ["Cartão SUS", "RG"],
      requiresApproval: true,
      estimatedDays: 7,
      isPublic: true,
      isActive: true,
      icon: "🏥",
      color: "#10B981"
    }
  ];

  for (const template of templates) {
    await prisma.serviceTemplate.upsert({
      where: { slug: template.slug },
      update: template,
      create: template
    });
  }

  console.log('✅ Templates de Saúde criados');
}
```

---

## Schema de Formulários

### Estrutura Básica

```json
{
  "sections": [
    {
      "title": "Título da Seção",
      "description": "Descrição opcional",
      "fields": [...]
    }
  ]
}
```

### Tipos de Campos

#### 1. Text Input

```json
{
  "id": "nome",
  "type": "text",
  "label": "Nome Completo",
  "placeholder": "Digite seu nome",
  "required": true,
  "validation": {
    "minLength": 3,
    "maxLength": 100,
    "pattern": "^[A-Za-zÀ-ÿ\\s]+$"
  }
}
```

#### 2. Text Area

```json
{
  "id": "descricao",
  "type": "textarea",
  "label": "Descrição do Problema",
  "placeholder": "Descreva em detalhes...",
  "required": true,
  "rows": 4,
  "maxLength": 500
}
```

#### 3. Select

```json
{
  "id": "especialidade",
  "type": "select",
  "label": "Especialidade",
  "required": true,
  "options": [
    { "value": "clinico", "label": "Clínico Geral" },
    { "value": "pediatria", "label": "Pediatria" }
  ]
}
```

#### 4. Multi-Select

```json
{
  "id": "sintomas",
  "type": "multiselect",
  "label": "Sintomas",
  "required": false,
  "options": [
    { "value": "febre", "label": "Febre" },
    { "value": "tosse", "label": "Tosse" },
    { "value": "dor-cabeca", "label": "Dor de Cabeça" }
  ]
}
```

#### 5. Radio Buttons

```json
{
  "id": "periodo",
  "type": "radio",
  "label": "Período Preferido",
  "required": true,
  "options": [
    { "value": "MANHA", "label": "Manhã (8h-12h)" },
    { "value": "TARDE", "label": "Tarde (13h-17h)" }
  ]
}
```

#### 6. Checkbox

```json
{
  "id": "termos",
  "type": "checkbox",
  "label": "Aceito os termos e condições",
  "required": true
}
```

#### 7. Date

```json
{
  "id": "dataDesejada",
  "type": "date",
  "label": "Data Desejada",
  "required": true,
  "validation": {
    "minDate": "today",
    "maxDate": "+90days"
  }
}
```

#### 8. Time

```json
{
  "id": "horario",
  "type": "time",
  "label": "Horário Preferido",
  "required": false,
  "validation": {
    "minTime": "08:00",
    "maxTime": "18:00"
  }
}
```

#### 9. Number

```json
{
  "id": "idade",
  "type": "number",
  "label": "Idade",
  "required": true,
  "validation": {
    "min": 0,
    "max": 120
  }
}
```

#### 10. File Upload

```json
{
  "id": "receita",
  "type": "file",
  "label": "Anexar Receita Médica",
  "required": false,
  "accept": ".pdf,.jpg,.png",
  "maxSize": 5242880
}
```

#### 11. CPF

```json
{
  "id": "cpf",
  "type": "cpf",
  "label": "CPF",
  "required": true,
  "validation": {
    "validateCPF": true
  }
}
```

#### 12. Phone

```json
{
  "id": "telefone",
  "type": "phone",
  "label": "Telefone para Contato",
  "required": true,
  "mask": "(99) 99999-9999"
}
```

#### 13. CEP

```json
{
  "id": "cep",
  "type": "cep",
  "label": "CEP",
  "required": true,
  "autoFillAddress": true
}
```

#### 14. Address

```json
{
  "id": "endereco",
  "type": "address",
  "label": "Endereço Completo",
  "required": true,
  "fields": {
    "street": true,
    "number": true,
    "complement": false,
    "neighborhood": true,
    "city": true,
    "state": true
  }
}
```

#### 15. Map Location

```json
{
  "id": "localizacao",
  "type": "map",
  "label": "Localização do Problema",
  "required": true,
  "defaultCenter": { "lat": -23.5505, "lng": -46.6333 },
  "zoom": 13
}
```

### Validações

#### Validações de Texto

```json
{
  "validation": {
    "minLength": 3,
    "maxLength": 100,
    "pattern": "^[A-Za-z]+$",
    "customMessage": "Mensagem de erro personalizada"
  }
}
```

#### Validações Numéricas

```json
{
  "validation": {
    "min": 0,
    "max": 100,
    "step": 5,
    "integer": true
  }
}
```

#### Validações de Data

```json
{
  "validation": {
    "minDate": "today",
    "maxDate": "+90days",
    "excludeWeekends": true,
    "excludeDates": ["2025-01-01", "2025-12-25"]
  }
}
```

#### Validações Condicionais

```json
{
  "id": "motivoUrgencia",
  "type": "textarea",
  "label": "Motivo da Urgência",
  "required": true,
  "conditional": {
    "field": "prioridade",
    "operator": "equals",
    "value": "URGENTE"
  }
}
```

### Campos Dinâmicos

```json
{
  "id": "dependentes",
  "type": "repeater",
  "label": "Dependentes",
  "minItems": 0,
  "maxItems": 5,
  "fields": [
    {
      "id": "nome",
      "type": "text",
      "label": "Nome do Dependente"
    },
    {
      "id": "idade",
      "type": "number",
      "label": "Idade"
    }
  ]
}
```

---

## Exemplos Completos

### Exemplo 1: Template de Consulta Médica

```json
{
  "name": "Agendamento de Consulta Médica",
  "slug": "consulta-medica",
  "description": "Agende consultas médicas em UBS da sua região",
  "category": "SAUDE",
  "moduleType": "consulta-medica",

  "formSchema": {
    "sections": [
      {
        "title": "Dados do Paciente",
        "fields": [
          {
            "id": "nomePaciente",
            "type": "text",
            "label": "Nome do Paciente",
            "required": true,
            "validation": {
              "minLength": 3
            }
          },
          {
            "id": "cpfPaciente",
            "type": "cpf",
            "label": "CPF do Paciente",
            "required": true
          },
          {
            "id": "telefone",
            "type": "phone",
            "label": "Telefone para Contato",
            "required": true
          },
          {
            "id": "cartaoSUS",
            "type": "text",
            "label": "Número do Cartão SUS",
            "required": true
          }
        ]
      },
      {
        "title": "Dados da Consulta",
        "fields": [
          {
            "id": "especialidade",
            "type": "select",
            "label": "Especialidade",
            "required": true,
            "options": [
              { "value": "clinico-geral", "label": "Clínico Geral" },
              { "value": "pediatria", "label": "Pediatria" },
              { "value": "ginecologia", "label": "Ginecologia" },
              { "value": "cardiologia", "label": "Cardiologia" }
            ]
          },
          {
            "id": "dataDesejada",
            "type": "date",
            "label": "Data Desejada",
            "required": true,
            "validation": {
              "minDate": "today",
              "maxDate": "+90days",
              "excludeWeekends": false
            }
          },
          {
            "id": "periodo",
            "type": "radio",
            "label": "Período Preferido",
            "required": true,
            "options": [
              { "value": "MANHA", "label": "Manhã (8h-12h)" },
              { "value": "TARDE", "label": "Tarde (13h-17h)" }
            ]
          },
          {
            "id": "prioridade",
            "type": "select",
            "label": "Prioridade",
            "required": true,
            "options": [
              { "value": "NORMAL", "label": "Normal" },
              { "value": "URGENTE", "label": "Urgente" }
            ]
          },
          {
            "id": "motivoUrgencia",
            "type": "textarea",
            "label": "Motivo da Urgência",
            "required": true,
            "conditional": {
              "field": "prioridade",
              "operator": "equals",
              "value": "URGENTE"
            }
          },
          {
            "id": "observacoes",
            "type": "textarea",
            "label": "Observações",
            "required": false,
            "maxLength": 500,
            "placeholder": "Descreva sintomas ou informações relevantes"
          }
        ]
      }
    ]
  },

  "requiredDocuments": [
    "Cartão SUS",
    "Documento de Identidade",
    "Comprovante de Residência"
  ],

  "requiresApproval": true,
  "autoAssign": false,
  "estimatedDays": 7,
  "isPublic": true,
  "isActive": true,

  "icon": "🏥",
  "color": "#10B981",
  "version": 1
}
```

### Exemplo 2: Template de Solicitação de Benefício

```json
{
  "name": "Solicitação de Benefício Social",
  "slug": "beneficio-social",
  "description": "Solicite benefícios de assistência social",
  "category": "ASSISTENCIA_SOCIAL",
  "moduleType": "beneficio-social",

  "formSchema": {
    "sections": [
      {
        "title": "Identificação",
        "fields": [
          {
            "id": "nomeCompleto",
            "type": "text",
            "label": "Nome Completo",
            "required": true
          },
          {
            "id": "cpf",
            "type": "cpf",
            "label": "CPF",
            "required": true
          },
          {
            "id": "rg",
            "type": "text",
            "label": "RG",
            "required": true
          },
          {
            "id": "dataNascimento",
            "type": "date",
            "label": "Data de Nascimento",
            "required": true,
            "validation": {
              "maxDate": "today"
            }
          }
        ]
      },
      {
        "title": "Composição Familiar",
        "fields": [
          {
            "id": "numeroPessoas",
            "type": "number",
            "label": "Número de Pessoas na Família",
            "required": true,
            "validation": {
              "min": 1,
              "max": 20
            }
          },
          {
            "id": "rendaFamiliar",
            "type": "currency",
            "label": "Renda Familiar Total",
            "required": true,
            "prefix": "R$"
          },
          {
            "id": "possuiDeficiente",
            "type": "radio",
            "label": "Possui Pessoa com Deficiência na Família?",
            "required": true,
            "options": [
              { "value": "SIM", "label": "Sim" },
              { "value": "NAO", "label": "Não" }
            ]
          }
        ]
      },
      {
        "title": "Tipo de Benefício",
        "fields": [
          {
            "id": "tipoBeneficio",
            "type": "select",
            "label": "Tipo de Benefício",
            "required": true,
            "options": [
              { "value": "cesta-basica", "label": "Cesta Básica" },
              { "value": "auxilio-aluguel", "label": "Auxílio Aluguel" },
              { "value": "bolsa-familia", "label": "Bolsa Família Municipal" }
            ]
          },
          {
            "id": "justificativa",
            "type": "textarea",
            "label": "Justificativa",
            "required": true,
            "minLength": 50,
            "maxLength": 1000,
            "placeholder": "Explique por que você necessita deste benefício"
          }
        ]
      },
      {
        "title": "Documentação",
        "fields": [
          {
            "id": "comprovanteRenda",
            "type": "file",
            "label": "Comprovante de Renda",
            "required": true,
            "accept": ".pdf,.jpg,.png"
          },
          {
            "id": "comprovanteResidencia",
            "type": "file",
            "label": "Comprovante de Residência",
            "required": true,
            "accept": ".pdf,.jpg,.png"
          }
        ]
      }
    ]
  },

  "requiredDocuments": [
    "RG e CPF",
    "Comprovante de Residência",
    "Comprovante de Renda",
    "Certidão de Nascimento dos Dependentes"
  ],

  "requiresApproval": true,
  "autoAssign": false,
  "estimatedDays": 15,
  "isPublic": true,
  "isActive": true,

  "icon": "🤝",
  "color": "#F59E0B",
  "version": 1
}
```

### Exemplo 3: Template de Problema de Infraestrutura

```json
{
  "name": "Reportar Problema de Infraestrutura",
  "slug": "problema-infraestrutura",
  "description": "Reporte problemas de vias, calçadas, iluminação, etc.",
  "category": "OBRAS_PUBLICAS",
  "moduleType": "problema-infraestrutura",

  "formSchema": {
    "sections": [
      {
        "title": "Tipo de Problema",
        "fields": [
          {
            "id": "tipoProblema",
            "type": "select",
            "label": "Tipo de Problema",
            "required": true,
            "options": [
              { "value": "buraco-rua", "label": "Buraco na Rua" },
              { "value": "calcada-quebrada", "label": "Calçada Quebrada" },
              { "value": "iluminacao", "label": "Problema de Iluminação" },
              { "value": "esgoto", "label": "Problema de Esgoto" },
              { "value": "outro", "label": "Outro" }
            ]
          },
          {
            "id": "gravidade",
            "type": "radio",
            "label": "Gravidade",
            "required": true,
            "options": [
              { "value": "BAIXA", "label": "Baixa - Incômodo pequeno" },
              { "value": "MEDIA", "label": "Média - Requer atenção" },
              { "value": "ALTA", "label": "Alta - Problema sério" },
              { "value": "CRITICA", "label": "Crítica - Risco de acidente" }
            ]
          }
        ]
      },
      {
        "title": "Localização",
        "fields": [
          {
            "id": "endereco",
            "type": "text",
            "label": "Endereço/Referência",
            "required": true,
            "placeholder": "Ex: Rua das Flores, próximo ao mercado"
          },
          {
            "id": "localizacao",
            "type": "map",
            "label": "Marque no Mapa",
            "required": true,
            "defaultCenter": { "lat": -23.5505, "lng": -46.6333 },
            "zoom": 13
          }
        ]
      },
      {
        "title": "Descrição",
        "fields": [
          {
            "id": "descricao",
            "type": "textarea",
            "label": "Descrição Detalhada",
            "required": true,
            "minLength": 20,
            "maxLength": 1000,
            "placeholder": "Descreva o problema em detalhes"
          },
          {
            "id": "fotos",
            "type": "file",
            "label": "Fotos do Problema",
            "required": false,
            "accept": ".jpg,.jpeg,.png",
            "multiple": true,
            "maxFiles": 5
          }
        ]
      }
    ]
  },

  "requiredDocuments": [],

  "requiresApproval": true,
  "autoAssign": true,
  "estimatedDays": 30,
  "isPublic": true,
  "isActive": true,

  "icon": "🚧",
  "color": "#EF4444",
  "version": 1
}
```

---

## Validação e Testes

### Validar Template

```typescript
// digiurban/backend/src/utils/template-validator.ts

import { validateTemplate } from '../utils/template-validator';

const template = { ... };

const validation = validateTemplate(template);

if (!validation.valid) {
  console.error('Erros:', validation.errors);
} else {
  console.log('✅ Template válido!');
}
```

### Testar Template

```typescript
// Criar serviço a partir do template
const service = await prisma.service.create({
  data: {
    name: template.name,
    description: template.description,
    departmentId: 'dept-id',
    moduleType: template.moduleType,
    formSchema: template.formSchema,
    requiresApproval: template.requiresApproval,
    isActive: true
  }
});

// Testar criação de protocolo
const testData = {
  especialidade: "clinico-geral",
  dataDesejada: new Date("2025-02-15"),
  periodo: "MANHA"
};

const protocol = await createProtocol(service.id, 'citizen-id', testData);
console.log('✅ Protocolo criado:', protocol.number);
```

---

## Boas Práticas

### 1. Nomes Descritivos

✅ **BOM:**
```
"Agendamento de Consulta Médica"
"Solicitação de Benefício Social"
"Matrícula Escolar"
```

❌ **RUIM:**
```
"Consulta"
"Benefício"
"Escola"
```

### 2. Descrições Claras

✅ **BOM:**
```
"Agende consultas médicas em Unidades Básicas de Saúde (UBS) da sua região. Atendimento para clínico geral, pediatria, ginecologia e outras especialidades."
```

❌ **RUIM:**
```
"Consultas médicas"
```

### 3. Organização em Seções

✅ **BOM:**
```json
{
  "sections": [
    { "title": "Dados Pessoais", "fields": [...] },
    { "title": "Dados da Consulta", "fields": [...] },
    { "title": "Documentação", "fields": [...] }
  ]
}
```

### 4. Validações Apropriadas

✅ **BOM:**
```json
{
  "id": "dataDesejada",
  "type": "date",
  "validation": {
    "minDate": "today",
    "maxDate": "+90days"
  }
}
```

### 5. Mensagens de Ajuda

✅ **BOM:**
```json
{
  "id": "cpf",
  "type": "cpf",
  "label": "CPF",
  "help": "Digite apenas números, sem pontos ou traços",
  "placeholder": "000.000.000-00"
}
```

### 6. Valores Padrão

✅ **BOM:**
```json
{
  "id": "prioridade",
  "type": "select",
  "defaultValue": "NORMAL",
  "options": [...]
}
```

### 7. Versionamento

Sempre incremente a versão ao atualizar templates:

```typescript
await prisma.serviceTemplate.update({
  where: { id: templateId },
  data: {
    ...updates,
    version: { increment: 1 }
  }
});
```

---

## Checklist de Criação

Antes de publicar um template:

- [ ] Nome descritivo e único
- [ ] Descrição completa e clara
- [ ] Categoria correta definida
- [ ] ModuleType corresponde a handler existente
- [ ] FormSchema válido e testado
- [ ] Todos os campos obrigatórios marcados
- [ ] Validações apropriadas configuradas
- [ ] Documentos necessários listados
- [ ] SLA realista definido
- [ ] Ícone e cor definidos
- [ ] Testado com dados reais
- [ ] Documentação atualizada

---

## Próximos Passos

Após criar seu template:

1. **Ativar em Secretaria** - Criar serviço baseado no template
2. **Testar Fluxo** - Criar protocolos de teste
3. **Treinar Equipe** - Mostrar como usar o serviço
4. **Monitorar** - Acompanhar uso e feedback

---

## Suporte

Dúvidas sobre templates? Consulte:
- [MODULE_HANDLERS.md](./MODULE_HANDLERS.md) - Handlers disponíveis
- [CUSTOM_MODULES.md](./CUSTOM_MODULES.md) - Criar módulos customizados
- [GUIA_RAPIDO_TEMPLATES.md](./GUIA_RAPIDO_TEMPLATES.md) - Referência rápida
