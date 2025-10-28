# 🎨 Guia de Módulos Customizados

## Índice
1. [Introdução](#introdução)
2. [O que são Módulos Customizados](#o-que-são-módulos-customizados)
3. [Quando Usar Módulos Customizados](#quando-usar-módulos-customizados)
4. [Criando um Módulo Customizado](#criando-um-módulo-customizado)
5. [Gerenciamento via Interface](#gerenciamento-via-interface)
6. [Gerenciamento via API](#gerenciamento-via-api)
7. [Exemplos Práticos](#exemplos-práticos)
8. [Integração com Templates](#integração-com-templates)
9. [Boas Práticas](#boas-práticas)

---

## Introdução

Os **Módulos Customizados** permitem que municípios criem serviços específicos que não estão disponíveis nos templates padrões. É a forma de estender o DigiUrban sem precisar de desenvolvimento técnico.

### Diferença: Template vs Módulo Customizado

| Template Padrão | Módulo Customizado |
|----------------|-------------------|
| Criado pela equipe DigiUrban | Criado pelo município |
| Disponível para todos | Específico do município |
| Handler pré-programado | Usa handler genérico |
| Não pode ser modificado | Totalmente customizável |
| Melhor performance | Flexibilidade máxima |

---

## O que são Módulos Customizados

Um módulo customizado é composto por:

```typescript
interface CustomModule {
  id: string;
  name: string;                  // Nome do módulo
  description: string;            // Descrição
  category: string;               // Categoria
  departmentId: string;           // ID da secretaria

  formSchema: object;             // Schema do formulário
  validationRules: object;        // Regras de validação
  workflowConfig: object;         // Configuração de fluxo

  isActive: boolean;
  createdAt: DateTime;
  updatedAt: DateTime;
}
```

### Componentes de um Módulo

1. **Formulário** - Define campos que o cidadão preenche
2. **Validações** - Regras para validar dados
3. **Workflow** - Como o protocolo será processado
4. **Notificações** - Quando notificar o cidadão
5. **Documentos** - Quais documentos são necessários

---

## Quando Usar Módulos Customizados

### Use Módulos Customizados quando:

✅ **Serviço único** - Específico do seu município
✅ **Necessidades locais** - Não atendidas por templates
✅ **Processo diferenciado** - Fluxo próprio de trabalho
✅ **Experimentação** - Testar novo tipo de serviço
✅ **Integração local** - Com sistemas municipais

### Use Templates quando:

⚠️ **Serviço comum** - Consultas, matrículas, benefícios
⚠️ **Melhor performance** - Handlers otimizados
⚠️ **Atualizações** - Recebe melhorias automáticas
⚠️ **Suporte** - Documentação e exemplos

---

## Criando um Módulo Customizado

### Passo 1: Definir o Objetivo

Antes de começar, responda:
- Qual problema esse módulo resolve?
- Quem vai usar (cidadãos, empresas)?
- Que informações são necessárias?
- Como será o fluxo de aprovação?
- Qual o prazo de atendimento?

### Passo 2: Estrutura do Formulário

Defina os campos necessários:

```json
{
  "sections": [
    {
      "title": "Seção 1",
      "fields": [
        {
          "id": "campo1",
          "type": "text",
          "label": "Campo 1",
          "required": true
        }
      ]
    }
  ]
}
```

### Passo 3: Regras de Validação

```json
{
  "rules": [
    {
      "field": "campo1",
      "type": "required",
      "message": "Campo obrigatório"
    },
    {
      "field": "campo2",
      "type": "min",
      "value": 0,
      "message": "Valor deve ser positivo"
    }
  ]
}
```

### Passo 4: Configurar Workflow

```json
{
  "steps": [
    {
      "name": "Análise Inicial",
      "assignTo": "ROLE_ANALISTA",
      "autoAssign": true,
      "estimatedDays": 3
    },
    {
      "name": "Aprovação Final",
      "assignTo": "ROLE_COORDENADOR",
      "requiresPreviousApproval": true,
      "estimatedDays": 2
    }
  ],
  "notifications": {
    "onCreate": true,
    "onStatusChange": true,
    "onApprove": true,
    "onReject": true
  }
}
```

---

## Gerenciamento via Interface

### Criar Novo Módulo

1. **Login como Gestor da Secretaria**
   - Acesse: Admin > Módulos Customizados
   - Clique: "Novo Módulo"

2. **Informações Básicas**
   ```
   Nome: Autorização para Evento
   Categoria: CULTURA
   Descrição: Autorização para realização de eventos culturais
   ```

3. **Construtor de Formulário**
   - Arraste campos da paleta
   - Configure propriedades
   - Defina validações
   - Organize em seções

4. **Configurar Workflow**
   - Definir etapas de aprovação
   - Configurar prazos
   - Atribuir responsáveis

5. **Testar e Publicar**
   - Preencher formulário de teste
   - Verificar validações
   - Ativar módulo

---

## Gerenciamento via API

### Criar Módulo

```typescript
// POST /api/admin/custom-modules

const customModule = {
  name: "Autorização para Evento",
  description: "Autorização para realização de eventos culturais em espaços públicos",
  category: "CULTURA",
  departmentId: "dept-cultura-id",

  formSchema: {
    sections: [
      {
        title: "Dados do Evento",
        fields: [
          {
            id: "nomeEvento",
            type: "text",
            label: "Nome do Evento",
            required: true,
            maxLength: 200
          },
          {
            id: "dataEvento",
            type: "date",
            label: "Data do Evento",
            required: true,
            validation: {
              minDate: "+15days" // Pelo menos 15 dias de antecedência
            }
          },
          {
            id: "localEvento",
            type: "select",
            label: "Local do Evento",
            required: true,
            options: [
              { value: "praca-central", label: "Praça Central" },
              { value: "centro-cultural", label: "Centro Cultural" },
              { value: "outro", label: "Outro Local" }
            ]
          },
          {
            id: "outroLocal",
            type: "text",
            label: "Especifique o Local",
            required: true,
            conditional: {
              field: "localEvento",
              operator: "equals",
              value: "outro"
            }
          },
          {
            id: "horaInicio",
            type: "time",
            label: "Hora de Início",
            required: true
          },
          {
            id: "horaFim",
            type: "time",
            label: "Hora de Término",
            required: true
          },
          {
            id: "publicoEstimado",
            type: "number",
            label: "Público Estimado",
            required: true,
            validation: {
              min: 1,
              max: 10000
            }
          },
          {
            id: "tipoEvento",
            type: "multiselect",
            label: "Tipo de Evento",
            required: true,
            options: [
              { value: "show", label: "Show Musical" },
              { value: "teatro", label: "Teatro" },
              { value: "danca", label: "Dança" },
              { value: "feira", label: "Feira Cultural" }
            ]
          },
          {
            id: "descricao",
            type: "textarea",
            label: "Descrição do Evento",
            required: true,
            minLength: 50,
            maxLength: 1000
          }
        ]
      },
      {
        title: "Responsável pelo Evento",
        fields: [
          {
            id: "nomeResponsavel",
            type: "text",
            label: "Nome Completo",
            required: true
          },
          {
            id: "cpfResponsavel",
            type: "cpf",
            label: "CPF",
            required: true
          },
          {
            id: "telefoneResponsavel",
            type: "phone",
            label: "Telefone",
            required: true
          },
          {
            id: "emailResponsavel",
            type: "email",
            label: "E-mail",
            required: true
          }
        ]
      },
      {
        title: "Recursos Necessários",
        fields: [
          {
            id: "precisaCadeiras",
            type: "checkbox",
            label: "Necessita Cadeiras"
          },
          {
            id: "quantidadeCadeiras",
            type: "number",
            label: "Quantidade de Cadeiras",
            required: true,
            conditional: {
              field: "precisaCadeiras",
              operator: "equals",
              value: true
            }
          },
          {
            id: "precisaPalco",
            type: "checkbox",
            label: "Necessita Palco"
          },
          {
            id: "precisaSom",
            type: "checkbox",
            label: "Necessita Som"
          },
          {
            id: "precisaIluminacao",
            type: "checkbox",
            label: "Necessita Iluminação Especial"
          },
          {
            id: "outrosRecursos",
            type: "textarea",
            label: "Outros Recursos",
            required: false
          }
        ]
      },
      {
        title: "Documentação",
        fields: [
          {
            id: "projetoEvento",
            type: "file",
            label: "Projeto do Evento (PDF)",
            required: true,
            accept: ".pdf"
          },
          {
            id: "documentoResponsavel",
            type: "file",
            label: "Documento de Identidade do Responsável",
            required: true,
            accept: ".pdf,.jpg,.png"
          }
        ]
      }
    ]
  },

  validationRules: {
    custom: [
      {
        name: "validateEventDuration",
        description: "Evento não pode durar mais de 12 horas",
        validate: function(data) {
          const inicio = new Date(`2000-01-01T${data.horaInicio}`);
          const fim = new Date(`2000-01-01T${data.horaFim}`);
          const horas = (fim - inicio) / (1000 * 60 * 60);
          return horas > 0 && horas <= 12;
        },
        message: "Evento deve durar entre 1 e 12 horas"
      },
      {
        name: "validateAdvanceNotice",
        description: "Evento deve ser solicitado com pelo menos 15 dias de antecedência",
        validate: function(data) {
          const dataEvento = new Date(data.dataEvento);
          const hoje = new Date();
          const diasDiferenca = (dataEvento - hoje) / (1000 * 60 * 60 * 24);
          return diasDiferenca >= 15;
        },
        message: "Evento deve ser solicitado com no mínimo 15 dias de antecedência"
      }
    ]
  },

  workflowConfig: {
    steps: [
      {
        name: "Análise Técnica",
        description: "Verificar viabilidade técnica e disponibilidade do local",
        assignTo: "ROLE_TECNICO_CULTURA",
        autoAssign: true,
        estimatedDays: 3,
        requiredActions: [
          "verificar_disponibilidade_local",
          "avaliar_recursos_necessarios",
          "validar_documentacao"
        ]
      },
      {
        name: "Aprovação do Coordenador",
        description: "Aprovação final do coordenador de cultura",
        assignTo: "ROLE_COORDENADOR_CULTURA",
        requiresPreviousApproval: true,
        estimatedDays: 2,
        requiredActions: [
          "revisar_projeto",
          "aprovar_ou_rejeitar"
        ]
      }
    ],

    statusFlow: {
      initial: "PENDENTE",
      transitions: [
        { from: "PENDENTE", to: "EM_ANALISE", trigger: "start_analysis" },
        { from: "EM_ANALISE", to: "AGUARDANDO_APROVACAO", trigger: "technical_approved" },
        { from: "AGUARDANDO_APROVACAO", to: "APROVADO", trigger: "coordinator_approved" },
        { from: "AGUARDANDO_APROVACAO", to: "REJEITADO", trigger: "coordinator_rejected" },
        { from: "*", to: "CANCELADO", trigger: "cancel" }
      ]
    },

    notifications: {
      onCreate: {
        enabled: true,
        message: "Sua solicitação de autorização para evento foi recebida. Protocolo: {protocol}"
      },
      onStatusChange: {
        enabled: true,
        message: "Status atualizado para: {status}"
      },
      onApprove: {
        enabled: true,
        message: "Evento aprovado! Você pode realizar o evento na data solicitada."
      },
      onReject: {
        enabled: true,
        message: "Solicitação não aprovada. Motivo: {reason}"
      },
      reminders: [
        {
          trigger: "3_days_before_event",
          message: "Lembrete: Seu evento será em 3 dias. Protocolo: {protocol}"
        }
      ]
    },

    automations: [
      {
        trigger: "on_create",
        action: "check_date_availability",
        description: "Verifica automaticamente se a data está disponível"
      },
      {
        trigger: "on_approve",
        action: "reserve_location",
        description: "Reserva o local automaticamente"
      },
      {
        trigger: "on_approve",
        action: "generate_authorization_document",
        description: "Gera documento de autorização em PDF"
      }
    ]
  },

  isActive: true
};

const response = await fetch('/api/admin/custom-modules', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(customModule)
});

const created = await response.json();
console.log('Módulo criado:', created.id);
```

### Listar Módulos

```typescript
// GET /api/admin/custom-modules?departmentId=dept-id

const response = await fetch('/api/admin/custom-modules?departmentId=dept-id', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const modules = await response.json();
```

### Atualizar Módulo

```typescript
// PUT /api/admin/custom-modules/:id

const updates = {
  formSchema: {
    // Schema atualizado
  },
  workflowConfig: {
    // Workflow atualizado
  }
};

await fetch(`/api/admin/custom-modules/${moduleId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(updates)
});
```

### Desativar Módulo

```typescript
// PATCH /api/admin/custom-modules/:id/deactivate

await fetch(`/api/admin/custom-modules/${moduleId}/deactivate`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## Exemplos Práticos

### Exemplo 1: Cadastro de Produtor Rural

```json
{
  "name": "Cadastro de Produtor Rural",
  "description": "Cadastro para produtores rurais acessarem programas de agricultura",
  "category": "AGRICULTURA",

  "formSchema": {
    "sections": [
      {
        "title": "Dados do Produtor",
        "fields": [
          {
            "id": "nomeProdutor",
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
            "id": "telefone",
            "type": "phone",
            "label": "Telefone",
            "required": true
          }
        ]
      },
      {
        "title": "Dados da Propriedade",
        "fields": [
          {
            "id": "nomePropriedade",
            "type": "text",
            "label": "Nome da Propriedade",
            "required": true
          },
          {
            "id": "areaTotalHectares",
            "type": "number",
            "label": "Área Total (hectares)",
            "required": true,
            "validation": {
              "min": 0.1,
              "max": 10000
            }
          },
          {
            "id": "localizacao",
            "type": "map",
            "label": "Localização da Propriedade",
            "required": true
          },
          {
            "id": "tipoProducao",
            "type": "multiselect",
            "label": "Tipo de Produção",
            "required": true,
            "options": [
              { "value": "hortifruti", "label": "Hortifrutigranjeiros" },
              { "value": "graos", "label": "Grãos" },
              { "value": "leite", "label": "Leite" },
              { "value": "aves", "label": "Avicultura" },
              { "value": "outros", "label": "Outros" }
            ]
          }
        ]
      },
      {
        "title": "Documentação",
        "fields": [
          {
            "id": "documentoPropriedade",
            "type": "file",
            "label": "Documento da Propriedade",
            "required": true,
            "accept": ".pdf"
          },
          {
            "id": "car",
            "type": "text",
            "label": "CAR - Cadastro Ambiental Rural",
            "required": false
          }
        ]
      }
    ]
  },

  "workflowConfig": {
    "steps": [
      {
        "name": "Verificação",
        "assignTo": "ROLE_TECNICO_AGRICULTURA",
        "estimatedDays": 5
      },
      {
        "name": "Aprovação",
        "assignTo": "ROLE_COORDENADOR_AGRICULTURA",
        "estimatedDays": 3
      }
    ]
  }
}
```

### Exemplo 2: Solicitação de Poda de Árvore Particular

```json
{
  "name": "Autorização para Poda de Árvore",
  "description": "Solicite autorização para poda de árvore em propriedade particular",
  "category": "MEIO_AMBIENTE",

  "formSchema": {
    "sections": [
      {
        "title": "Dados do Solicitante",
        "fields": [
          {
            "id": "nomeProprietario",
            "type": "text",
            "label": "Nome do Proprietário",
            "required": true
          },
          {
            "id": "cpf",
            "type": "cpf",
            "label": "CPF",
            "required": true
          }
        ]
      },
      {
        "title": "Localização",
        "fields": [
          {
            "id": "endereco",
            "type": "address",
            "label": "Endereço da Propriedade",
            "required": true
          },
          {
            "id": "localizacaoArvore",
            "type": "map",
            "label": "Localização Exata da Árvore",
            "required": true
          }
        ]
      },
      {
        "title": "Informações da Árvore",
        "fields": [
          {
            "id": "especieArvore",
            "type": "text",
            "label": "Espécie da Árvore (se souber)",
            "required": false
          },
          {
            "id": "alturaEstimada",
            "type": "select",
            "label": "Altura Estimada",
            "required": true,
            "options": [
              { "value": "ate-3m", "label": "Até 3 metros" },
              { "value": "3-5m", "label": "3 a 5 metros" },
              { "value": "5-10m", "label": "5 a 10 metros" },
              { "value": "mais-10m", "label": "Mais de 10 metros" }
            ]
          },
          {
            "id": "tipoPoda",
            "type": "radio",
            "label": "Tipo de Poda",
            "required": true,
            "options": [
              { "value": "limpeza", "label": "Limpeza (galhos secos)" },
              { "value": "reducao", "label": "Redução de Copa" },
              { "value": "formacao", "label": "Poda de Formação" }
            ]
          },
          {
            "id": "motivoPoda",
            "type": "textarea",
            "label": "Motivo da Poda",
            "required": true,
            "minLength": 20
          },
          {
            "id": "fotosArvore",
            "type": "file",
            "label": "Fotos da Árvore",
            "required": true,
            "accept": ".jpg,.jpeg,.png",
            "multiple": true,
            "maxFiles": 4
          }
        ]
      }
    ]
  },

  "workflowConfig": {
    "steps": [
      {
        "name": "Vistoria Técnica",
        "description": "Engenheiro ambiental faz vistoria in loco",
        "assignTo": "ROLE_ENGENHEIRO_AMBIENTAL",
        "estimatedDays": 7
      },
      {
        "name": "Análise e Parecer",
        "description": "Análise técnica e emissão de parecer",
        "assignTo": "ROLE_COORDENADOR_MEIO_AMBIENTE",
        "estimatedDays": 3
      }
    ],
    "notifications": {
      "onApprove": {
        "enabled": true,
        "message": "Poda autorizada. Validade: 30 dias. Deve ser realizada por profissional habilitado."
      }
    }
  }
}
```

### Exemplo 3: Reserva de Quadra Esportiva

```json
{
  "name": "Reserva de Quadra Esportiva",
  "description": "Reserve quadras esportivas municipais",
  "category": "ESPORTES",

  "formSchema": {
    "sections": [
      {
        "title": "Dados do Solicitante",
        "fields": [
          {
            "id": "tipoSolicitante",
            "type": "radio",
            "label": "Tipo de Solicitante",
            "required": true,
            "options": [
              { "value": "pessoa-fisica", "label": "Pessoa Física" },
              { "value": "associacao", "label": "Associação/Clube" },
              { "value": "escola", "label": "Escola" }
            ]
          },
          {
            "id": "nome",
            "type": "text",
            "label": "Nome/Razão Social",
            "required": true
          },
          {
            "id": "cpfCnpj",
            "type": "text",
            "label": "CPF/CNPJ",
            "required": true
          }
        ]
      },
      {
        "title": "Dados da Reserva",
        "fields": [
          {
            "id": "quadra",
            "type": "select",
            "label": "Quadra",
            "required": true,
            "options": [
              { "value": "quadra-centro", "label": "Quadra do Centro Esportivo" },
              { "value": "quadra-bairro-1", "label": "Quadra do Bairro São José" },
              { "value": "quadra-bairro-2", "label": "Quadra do Bairro Vila Nova" }
            ]
          },
          {
            "id": "dataReserva",
            "type": "date",
            "label": "Data da Reserva",
            "required": true,
            "validation": {
              "minDate": "+1days",
              "maxDate": "+30days"
            }
          },
          {
            "id": "horarioInicio",
            "type": "time",
            "label": "Horário de Início",
            "required": true,
            "validation": {
              "minTime": "06:00",
              "maxTime": "22:00"
            }
          },
          {
            "id": "horarioFim",
            "type": "time",
            "label": "Horário de Término",
            "required": true,
            "validation": {
              "minTime": "07:00",
              "maxTime": "23:00"
            }
          },
          {
            "id": "modalidade",
            "type": "select",
            "label": "Modalidade",
            "required": true,
            "options": [
              { "value": "futebol", "label": "Futebol" },
              { "value": "futsal", "label": "Futsal" },
              { "value": "volei", "label": "Vôlei" },
              { "value": "basquete", "label": "Basquete" },
              { "value": "outros", "label": "Outros" }
            ]
          },
          {
            "id": "finalidade",
            "type": "textarea",
            "label": "Finalidade",
            "required": true,
            "placeholder": "Ex: Treino da equipe, jogo amistoso, etc."
          }
        ]
      }
    ]
  },

  "workflowConfig": {
    "steps": [
      {
        "name": "Verificação de Disponibilidade",
        "autoAssign": true,
        "assignTo": "ROLE_COORDENADOR_ESPORTES",
        "estimatedDays": 1
      }
    ],
    "automations": [
      {
        "trigger": "on_create",
        "action": "check_availability",
        "description": "Verifica se quadra está disponível"
      },
      {
        "trigger": "on_approve",
        "action": "block_schedule",
        "description": "Bloqueia horário na agenda"
      },
      {
        "trigger": "1_day_before",
        "action": "send_reminder",
        "description": "Envia lembrete 1 dia antes"
      }
    ]
  }
}
```

---

## Integração com Templates

### Converter Template em Módulo Customizado

Você pode usar um template como base e customizar:

```typescript
// GET /api/admin/service-templates/:id
const template = await fetch('/api/admin/service-templates/consulta-medica')
  .then(r => r.json());

// Customizar
const customModule = {
  ...template,
  name: `${template.name} - ${municipio}`,
  departmentId: myDepartmentId,

  // Adicionar campos customizados
  formSchema: {
    ...template.formSchema,
    sections: [
      ...template.formSchema.sections,
      {
        title: "Campos Adicionais do Município",
        fields: [
          {
            id: "numeroCartaoMunicipal",
            type: "text",
            label: "Número do Cartão Municipal de Saúde",
            required: false
          }
        ]
      }
    ]
  }
};

// Criar módulo customizado
await fetch('/api/admin/custom-modules', {
  method: 'POST',
  body: JSON.stringify(customModule)
});
```

---

## Boas Práticas

### 1. Nomenclatura Clara

✅ **BOM:**
- "Autorização para Evento Cultural"
- "Cadastro de Produtor Rural"
- "Reserva de Quadra Esportiva"

❌ **RUIM:**
- "Módulo 1"
- "Novo Serviço"
- "Teste"

### 2. Validações Apropriadas

✅ **BOM:**
```json
{
  "validation": {
    "minDate": "+15days",
    "message": "Evento deve ser solicitado com 15 dias de antecedência"
  }
}
```

### 3. Fluxo Realista

✅ **BOM:**
```json
{
  "estimatedDays": 7,
  "steps": [
    { "name": "Análise", "days": 5 },
    { "name": "Aprovação", "days": 2 }
  ]
}
```

### 4. Notificações Úteis

✅ **BOM:**
```json
{
  "onApprove": {
    "message": "Solicitação aprovada! Compareça na data agendada com os documentos originais."
  }
}
```

### 5. Documentação Completa

Sempre documente:
- Objetivo do módulo
- Campos e validações
- Fluxo de aprovação
- Documentos necessários
- Prazos de atendimento

### 6. Testes Antes de Publicar

Antes de ativar:
- [ ] Preencher formulário completamente
- [ ] Testar todas as validações
- [ ] Verificar campos condicionais
- [ ] Testar fluxo de aprovação
- [ ] Verificar notificações

---

## Limitações e Considerações

### Limitações de Módulos Customizados

⚠️ **Performance** - Handlers genéricos são mais lentos que específicos
⚠️ **Validações** - Validações complexas podem não ser possíveis
⚠️ **Integrações** - Integrações com sistemas externos requerem desenvolvimento
⚠️ **Relatórios** - Relatórios customizados requerem configuração adicional

### Quando Solicitar Desenvolvimento

Se você precisa de:
- Integração com sistema externo
- Cálculos complexos automáticos
- Validações em tempo real com APIs
- Relatórios estatísticos avançados
- Performance otimizada para alto volume

**Contate a equipe DigiUrban para desenvolvimento de um handler específico.**

---

## Checklist de Criação

Antes de publicar um módulo customizado:

- [ ] Nome descritivo e único
- [ ] Descrição completa
- [ ] Categoria apropriada
- [ ] Todos os campos necessários incluídos
- [ ] Validações configuradas
- [ ] Campos condicionais funcionando
- [ ] Documentos listados
- [ ] Fluxo de aprovação definido
- [ ] Prazos realistas configurados
- [ ] Notificações configuradas
- [ ] Testado com dados reais
- [ ] Documentação criada
- [ ] Equipe treinada

---

## Suporte

Dúvidas sobre módulos customizados?

- [MODULE_HANDLERS.md](./MODULE_HANDLERS.md) - Entenda os handlers
- [TEMPLATES.md](./TEMPLATES.md) - Aprenda sobre templates
- [API.md](./API.md) - Documentação de API
- **Suporte**: suporte@digiurban.com.br

---

## Casos de Uso Comuns

### Agricultura
- Cadastro de produtores rurais
- Solicitação de insumos agrícolas
- Agendamento de assistência técnica
- Registro de pragas

### Cultura
- Autorização para eventos
- Reserva de espaços culturais
- Inscrição em oficinas
- Cadastro de artistas locais

### Meio Ambiente
- Autorização de poda
- Denúncia ambiental
- Licenciamento simplificado
- Coleta de resíduos especiais

### Esportes
- Reserva de quadras
- Inscrição em campeonatos
- Agendamento de avaliação física
- Cadastro de atletas

### Turismo
- Cadastro de atrativos turísticos
- Autorização para guias turísticos
- Eventos turísticos
- Roteiros turísticos

---

**Lembre-se**: Módulos customizados são poderosos, mas templates padrões oferecem melhor performance e suporte. Use módulos customizados apenas quando o template não atender suas necessidades específicas.
