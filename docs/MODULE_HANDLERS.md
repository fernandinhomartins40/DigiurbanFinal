# 🔧 Guia de Desenvolvimento de Module Handlers

## Índice
1. [Introdução](#introdução)
2. [Estrutura de um Handler](#estrutura-de-um-handler)
3. [Criando um Novo Handler](#criando-um-novo-handler)
4. [Validação de Dados](#validação-de-dados)
5. [Integração com o Core](#integração-com-o-core)
6. [Exemplos Práticos](#exemplos-práticos)
7. [Boas Práticas](#boas-práticas)

---

## Introdução

Os **Module Handlers** são componentes fundamentais da arquitetura DigiUrban que processam tipos específicos de serviços. Cada handler implementa a lógica de negócio para um tipo de serviço (consultas, benefícios, infraestrutura, etc.).

### Quando criar um novo handler?

Crie um novo handler quando:
- O tipo de serviço tem regras de negócio únicas
- Necessita validações específicas
- Requer processamento de dados especializados
- Precisa de fluxos de aprovação customizados

---

## Estrutura de um Handler

Todo handler deve seguir esta estrutura:

```typescript
// digiurban/backend/src/modules/[tipo]/[nome]-handler.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface [Nome]Data {
  // Campos específicos do serviço
  campo1: string;
  campo2?: number;
  // ... outros campos
}

export const [nome]Handler = {
  /**
   * Valida os dados específicos do serviço
   */
  validate: async (data: [Nome]Data): Promise<{ valid: boolean; errors: string[] }> => {
    const errors: string[] = [];

    // Validações específicas
    if (!data.campo1) {
      errors.push('Campo1 é obrigatório');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  },

  /**
   * Cria uma nova solicitação
   */
  create: async (protocolId: string, data: [Nome]Data) => {
    // Validar dados
    const validation = await [nome]Handler.validate(data);
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }

    // Criar registro específico
    const record = await prisma.[modelo].create({
      data: {
        protocolId,
        ...data
      }
    });

    return record;
  },

  /**
   * Busca dados específicos de uma solicitação
   */
  get: async (protocolId: string) => {
    const record = await prisma.[modelo].findUnique({
      where: { protocolId }
    });

    return record;
  },

  /**
   * Processa aprovação da solicitação
   */
  approve: async (protocolId: string, approvalData: any) => {
    // Lógica específica de aprovação
    const record = await prisma.[modelo].update({
      where: { protocolId },
      data: {
        status: 'APROVADO',
        ...approvalData
      }
    });

    return record;
  },

  /**
   * Processa rejeição da solicitação
   */
  reject: async (protocolId: string, reason: string) => {
    // Lógica específica de rejeição
    const record = await prisma.[modelo].update({
      where: { protocolId },
      data: {
        status: 'REJEITADO',
        rejectionReason: reason
      }
    });

    return record;
  }
};
```

---

## Criando um Novo Handler

### Passo 1: Definir o Modelo Prisma

```prisma
// digiurban/backend/prisma/schema.prisma

model MeuServico {
  id          String   @id @default(uuid())
  protocolId  String   @unique
  protocol    Protocol @relation(fields: [protocolId], references: [id], onDelete: Cascade)

  // Campos específicos
  campo1      String
  campo2      Int?
  campo3      DateTime?

  status      String   @default("PENDENTE")

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Passo 2: Criar o Handler

```bash
mkdir -p digiurban/backend/src/modules/meu-tipo
touch digiurban/backend/src/modules/meu-tipo/meu-servico-handler.ts
```

### Passo 3: Implementar a Interface

```typescript
// digiurban/backend/src/modules/meu-tipo/meu-servico-handler.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface MeuServicoData {
  campo1: string;
  campo2?: number;
  campo3?: Date;
}

export const meuServicoHandler = {
  validate: async (data: MeuServicoData) => {
    const errors: string[] = [];

    if (!data.campo1 || data.campo1.trim().length === 0) {
      errors.push('Campo1 é obrigatório');
    }

    if (data.campo2 && data.campo2 < 0) {
      errors.push('Campo2 deve ser positivo');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  },

  create: async (protocolId: string, data: MeuServicoData) => {
    const validation = await meuServicoHandler.validate(data);
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }

    return await prisma.meuServico.create({
      data: {
        protocolId,
        campo1: data.campo1,
        campo2: data.campo2,
        campo3: data.campo3
      }
    });
  },

  get: async (protocolId: string) => {
    return await prisma.meuServico.findUnique({
      where: { protocolId }
    });
  },

  approve: async (protocolId: string, approvalData: any) => {
    return await prisma.meuServico.update({
      where: { protocolId },
      data: {
        status: 'APROVADO',
        ...approvalData
      }
    });
  },

  reject: async (protocolId: string, reason: string) => {
    return await prisma.meuServico.update({
      where: { protocolId },
      data: {
        status: 'REJEITADO',
        rejectionReason: reason
      }
    });
  }
};
```

### Passo 4: Registrar no Core

```typescript
// digiurban/backend/src/core/service-handler.ts

import { meuServicoHandler } from '../modules/meu-tipo/meu-servico-handler';

const moduleHandlers = {
  // ... handlers existentes
  'meu-servico': meuServicoHandler,
};
```

---

## Validação de Dados

### Validações Comuns

```typescript
export const validationHelpers = {
  // Validar CPF
  validateCPF: (cpf: string): boolean => {
    const cleaned = cpf.replace(/[^\d]/g, '');
    if (cleaned.length !== 11) return false;
    // ... lógica de validação de CPF
    return true;
  },

  // Validar data futura
  validateFutureDate: (date: Date): boolean => {
    return date > new Date();
  },

  // Validar horário comercial
  validateBusinessHours: (time: string): boolean => {
    const [hour] = time.split(':').map(Number);
    return hour >= 8 && hour < 18;
  },

  // Validar telefone
  validatePhone: (phone: string): boolean => {
    const cleaned = phone.replace(/[^\d]/g, '');
    return cleaned.length === 10 || cleaned.length === 11;
  }
};
```

### Exemplo de Uso

```typescript
validate: async (data: ConsultaData) => {
  const errors: string[] = [];

  if (!validationHelpers.validateCPF(data.cpf)) {
    errors.push('CPF inválido');
  }

  if (!validationHelpers.validateFutureDate(data.dataDesejada)) {
    errors.push('Data deve ser futura');
  }

  return { valid: errors.length === 0, errors };
}
```

---

## Integração com o Core

### Como o Core Chama os Handlers

```typescript
// digiurban/backend/src/core/service-handler.ts

export async function createProtocol(serviceId: string, citizenId: string, data: any) {
  // 1. Busca o serviço
  const service = await prisma.service.findUnique({ where: { id: serviceId } });

  // 2. Identifica o handler
  const handler = moduleHandlers[service.moduleType];

  // 3. Valida os dados
  const validation = await handler.validate(data.specificData);

  // 4. Cria o protocolo
  const protocol = await prisma.protocol.create({ ... });

  // 5. Chama o handler para criar dados específicos
  await handler.create(protocol.id, data.specificData);

  return protocol;
}
```

### Métodos Obrigatórios

Todo handler DEVE implementar:
- `validate(data)` - Valida dados de entrada
- `create(protocolId, data)` - Cria registro específico
- `get(protocolId)` - Recupera dados específicos

### Métodos Opcionais

Handlers PODEM implementar:
- `approve(protocolId, data)` - Lógica de aprovação
- `reject(protocolId, reason)` - Lógica de rejeição
- `update(protocolId, data)` - Atualizar dados
- `cancel(protocolId, reason)` - Cancelar solicitação
- `complete(protocolId, data)` - Completar atendimento

---

## Exemplos Práticos

### Exemplo 1: Handler de Consultas Médicas

```typescript
// digiurban/backend/src/modules/health/consulta-handler.ts

export interface ConsultaData {
  especialidade: string;
  dataDesejada: Date;
  periodo: 'MANHA' | 'TARDE';
  prioridade?: 'NORMAL' | 'URGENTE';
  observacoes?: string;
}

export const consultaHandler = {
  validate: async (data: ConsultaData) => {
    const errors: string[] = [];

    if (!data.especialidade) {
      errors.push('Especialidade é obrigatória');
    }

    if (!data.dataDesejada || data.dataDesejada <= new Date()) {
      errors.push('Data desejada deve ser futura');
    }

    if (!['MANHA', 'TARDE'].includes(data.periodo)) {
      errors.push('Período inválido');
    }

    return { valid: errors.length === 0, errors };
  },

  create: async (protocolId: string, data: ConsultaData) => {
    const validation = await consultaHandler.validate(data);
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }

    return await prisma.consultaMedica.create({
      data: {
        protocolId,
        especialidade: data.especialidade,
        dataDesejada: data.dataDesejada,
        periodo: data.periodo,
        prioridade: data.prioridade || 'NORMAL',
        observacoes: data.observacoes
      }
    });
  },

  get: async (protocolId: string) => {
    return await prisma.consultaMedica.findUnique({
      where: { protocolId }
    });
  },

  approve: async (protocolId: string, approvalData: {
    dataAgendada: Date;
    horario: string;
    local: string;
    medico: string;
  }) => {
    return await prisma.consultaMedica.update({
      where: { protocolId },
      data: {
        status: 'AGENDADO',
        dataAgendada: approvalData.dataAgendada,
        horario: approvalData.horario,
        local: approvalData.local,
        medico: approvalData.medico
      }
    });
  }
};
```

### Exemplo 2: Handler de Benefícios Sociais

```typescript
// digiurban/backend/src/modules/social/beneficio-handler.ts

export interface BeneficioData {
  tipoBeneficio: string;
  rendaFamiliar: number;
  numeroPessoas: number;
  possuiDeficiente: boolean;
  justificativa: string;
  documentosAnexos: string[];
}

export const beneficioHandler = {
  validate: async (data: BeneficioData) => {
    const errors: string[] = [];

    if (!data.tipoBeneficio) {
      errors.push('Tipo de benefício é obrigatório');
    }

    if (data.rendaFamiliar < 0) {
      errors.push('Renda familiar inválida');
    }

    if (data.numeroPessoas < 1) {
      errors.push('Número de pessoas deve ser maior que zero');
    }

    if (!data.justificativa || data.justificativa.length < 20) {
      errors.push('Justificativa deve ter pelo menos 20 caracteres');
    }

    return { valid: errors.length === 0, errors };
  },

  create: async (protocolId: string, data: BeneficioData) => {
    const validation = await beneficioHandler.validate(data);
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }

    // Calcular pontuação de prioridade
    let pontuacao = 0;
    const rendaPerCapita = data.rendaFamiliar / data.numeroPessoas;

    if (rendaPerCapita < 500) pontuacao += 30;
    else if (rendaPerCapita < 1000) pontuacao += 20;
    else if (rendaPerCapita < 1500) pontuacao += 10;

    if (data.possuiDeficiente) pontuacao += 20;
    if (data.numeroPessoas > 4) pontuacao += 10;

    return await prisma.beneficioSocial.create({
      data: {
        protocolId,
        tipoBeneficio: data.tipoBeneficio,
        rendaFamiliar: data.rendaFamiliar,
        numeroPessoas: data.numeroPessoas,
        possuiDeficiente: data.possuiDeficiente,
        justificativa: data.justificativa,
        documentosAnexos: data.documentosAnexos,
        pontuacaoPrioridade: pontuacao
      }
    });
  },

  get: async (protocolId: string) => {
    return await prisma.beneficioSocial.findUnique({
      where: { protocolId },
      include: {
        visitas: true
      }
    });
  },

  approve: async (protocolId: string, approvalData: {
    valorMensal: number;
    dataInicio: Date;
    duracaoMeses: number;
  }) => {
    const dataFim = new Date(approvalData.dataInicio);
    dataFim.setMonth(dataFim.getMonth() + approvalData.duracaoMeses);

    return await prisma.beneficioSocial.update({
      where: { protocolId },
      data: {
        status: 'APROVADO',
        valorMensal: approvalData.valorMensal,
        dataInicio: approvalData.dataInicio,
        dataFim: dataFim
      }
    });
  }
};
```

### Exemplo 3: Handler de Infraestrutura

```typescript
// digiurban/backend/src/modules/infrastructure/problema-handler.ts

export interface ProblemaInfraData {
  tipo: string;
  localizacao: string;
  coordenadas?: { lat: number; lng: number };
  descricao: string;
  gravidade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  fotos: string[];
}

export const problemaInfraHandler = {
  validate: async (data: ProblemaInfraData) => {
    const errors: string[] = [];

    if (!data.tipo) {
      errors.push('Tipo de problema é obrigatório');
    }

    if (!data.localizacao) {
      errors.push('Localização é obrigatória');
    }

    if (!data.descricao || data.descricao.length < 10) {
      errors.push('Descrição deve ter pelo menos 10 caracteres');
    }

    if (!['BAIXA', 'MEDIA', 'ALTA', 'CRITICA'].includes(data.gravidade)) {
      errors.push('Gravidade inválida');
    }

    return { valid: errors.length === 0, errors };
  },

  create: async (protocolId: string, data: ProblemaInfraData) => {
    const validation = await problemaInfraHandler.validate(data);
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }

    // Calcular prazo baseado na gravidade
    let prazoEstimado = 30; // dias
    switch (data.gravidade) {
      case 'CRITICA': prazoEstimado = 1; break;
      case 'ALTA': prazoEstimado = 7; break;
      case 'MEDIA': prazoEstimado = 15; break;
      case 'BAIXA': prazoEstimado = 30; break;
    }

    return await prisma.problemaInfraestrutura.create({
      data: {
        protocolId,
        tipo: data.tipo,
        localizacao: data.localizacao,
        latitude: data.coordenadas?.lat,
        longitude: data.coordenadas?.lng,
        descricao: data.descricao,
        gravidade: data.gravidade,
        fotos: data.fotos,
        prazoEstimado
      }
    });
  },

  get: async (protocolId: string) => {
    return await prisma.problemaInfraestrutura.findUnique({
      where: { protocolId },
      include: {
        manutencoes: true
      }
    });
  },

  approve: async (protocolId: string, approvalData: {
    equipeResponsavel: string;
    dataPrevisaoInicio: Date;
    observacoes?: string;
  }) => {
    return await prisma.problemaInfraestrutura.update({
      where: { protocolId },
      data: {
        status: 'EM_EXECUCAO',
        equipeResponsavel: approvalData.equipeResponsavel,
        dataPrevisaoInicio: approvalData.dataPrevisaoInicio,
        observacoes: approvalData.observacoes
      }
    });
  },

  complete: async (protocolId: string, completionData: {
    dataExecucao: Date;
    equipeExecutora: string;
    fotosApos: string[];
    relatorio: string;
  }) => {
    return await prisma.problemaInfraestrutura.update({
      where: { protocolId },
      data: {
        status: 'CONCLUIDO',
        dataExecucao: completionData.dataExecucao,
        equipeExecutora: completionData.equipeExecutora,
        fotosApos: completionData.fotosApos,
        relatorio: completionData.relatorio
      }
    });
  }
};
```

---

## Boas Práticas

### 1. Validação Rigorosa

✅ **BOM:**
```typescript
validate: async (data: ConsultaData) => {
  const errors: string[] = [];

  if (!data.especialidade || data.especialidade.trim().length === 0) {
    errors.push('Especialidade é obrigatória');
  }

  if (data.dataDesejada && data.dataDesejada <= new Date()) {
    errors.push('Data deve ser futura');
  }

  return { valid: errors.length === 0, errors };
}
```

❌ **RUIM:**
```typescript
validate: async (data: ConsultaData) => {
  return { valid: true, errors: [] }; // Sem validação!
}
```

### 2. Tratamento de Erros

✅ **BOM:**
```typescript
create: async (protocolId: string, data: any) => {
  try {
    const validation = await handler.validate(data);
    if (!validation.valid) {
      throw new Error(`Validação falhou: ${validation.errors.join(', ')}`);
    }

    return await prisma.modelo.create({ data });
  } catch (error) {
    console.error('Erro ao criar:', error);
    throw error;
  }
}
```

❌ **RUIM:**
```typescript
create: async (protocolId: string, data: any) => {
  await prisma.modelo.create({ data }); // Sem tratamento de erro
}
```

### 3. Transações para Operações Complexas

✅ **BOM:**
```typescript
approve: async (protocolId: string, data: any) => {
  return await prisma.$transaction(async (tx) => {
    const record = await tx.modelo.update({ ... });
    await tx.auditLog.create({ ... });
    await tx.notification.create({ ... });
    return record;
  });
}
```

### 4. Incluir Dados Relacionados

✅ **BOM:**
```typescript
get: async (protocolId: string) => {
  return await prisma.modelo.findUnique({
    where: { protocolId },
    include: {
      protocol: {
        include: {
          citizen: true,
          service: true
        }
      }
    }
  });
}
```

### 5. Documentar Interfaces

✅ **BOM:**
```typescript
/**
 * Dados necessários para criar uma consulta médica
 */
export interface ConsultaData {
  /** Especialidade médica desejada */
  especialidade: string;

  /** Data desejada para a consulta (deve ser futura) */
  dataDesejada: Date;

  /** Período do dia preferido */
  periodo: 'MANHA' | 'TARDE';

  /** Prioridade do atendimento (opcional, padrão: NORMAL) */
  prioridade?: 'NORMAL' | 'URGENTE';
}
```

### 6. Usar TypeScript Adequadamente

✅ **BOM:**
```typescript
export const consultaHandler: ModuleHandler<ConsultaData> = {
  validate: async (data: ConsultaData): Promise<ValidationResult> => {
    // ...
  }
}
```

### 7. Separar Lógica de Negócio

✅ **BOM:**
```typescript
// helpers.ts
export function calcularPrioridade(renda: number, pessoas: number): number {
  const rendaPerCapita = renda / pessoas;
  if (rendaPerCapita < 500) return 30;
  if (rendaPerCapita < 1000) return 20;
  return 10;
}

// handler.ts
create: async (protocolId, data) => {
  const pontuacao = calcularPrioridade(data.renda, data.pessoas);
  // ...
}
```

---

## Checklist de Implementação

Antes de finalizar um handler, verifique:

- [ ] Interface TypeScript definida com todos os campos
- [ ] Método `validate` implementado com todas as regras
- [ ] Método `create` com tratamento de erros
- [ ] Método `get` com includes necessários
- [ ] Métodos `approve` e `reject` se aplicável
- [ ] Testes unitários criados
- [ ] Documentação JSDoc nos métodos
- [ ] Handler registrado no core
- [ ] Migration do Prisma aplicada
- [ ] Rotas API criadas se necessário

---

## Próximos Passos

Após criar seu handler:

1. **Criar Template** - Veja [TEMPLATES.md](./TEMPLATES.md)
2. **Criar Rotas** - Veja [API.md](./API.md)
3. **Testar** - Execute testes unitários
4. **Documentar** - Atualize guias de uso

---

## Suporte

Dúvidas sobre handlers? Consulte:
- [ARCHITECTURE.md](./ARQUITETURA_SERVICOS_MODULOS.md) - Arquitetura geral
- [CUSTOM_MODULES.md](./CUSTOM_MODULES.md) - Módulos customizados
- [API.md](./API.md) - Documentação de endpoints
