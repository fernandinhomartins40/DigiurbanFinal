# 🚀 PLANO DE IMPLEMENTAÇÃO COMPLETO: 13 SECRETARIAS + 210 SERVIÇOS

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Fases de Implementação](#fases-de-implementação)
3. [Estrutura de Trabalho](#estrutura-de-trabalho)
4. [Implementação Detalhada por Secretaria](#implementação-detalhada-por-secretaria)
5. [Cronograma](#cronograma)
6. [Recursos Necessários](#recursos-necessários)
7. [Critérios de Aceitação](#critérios-de-aceitação)

---

## 🎯 VISÃO GERAL

### Objetivo

Implementar **100% da arquitetura** de Serviços Padrões + Módulos Especializados para **todas as 13 secretarias**, totalizando:

- ✅ **210 serviços padrões** (templates pré-configurados)
- ✅ **13 módulos especializados** (com persistência automática)
- ✅ **1 sistema de módulos customizados** (extensibilidade)
- ✅ **1 motor de integração** (module handler)
- ✅ **Interfaces admin completas** (gestão visual)

### Escopo Completo

```
📦 ENTREGÁVEIS:

├─ Backend (API)
│  ├─ 210 templates de serviços (ServiceTemplate)
│  ├─ Module Handler (roteamento automático)
│  ├─ 13 módulos com protocolo vinculado
│  ├─ Sistema de módulos customizados
│  └─ Migrações Prisma completas
│
├─ Frontend (Admin)
│  ├─ Catálogo de templates
│  ├─ Ativação de serviços
│  ├─ 13 painéis de gestão especializados
│  ├─ Painéis customizados dinâmicos
│  └─ Dashboard consolidado
│
└─ Documentação
   ├─ Guia de cada módulo
   ├─ Tutoriais de uso
   └─ API documentation
```

---

## 📅 FASES DE IMPLEMENTAÇÃO

### FASE 1: FUNDAÇÃO (Semanas 1-2)

**Objetivo:** Criar infraestrutura base para suportar toda arquitetura.

#### 1.1 Schema Prisma Base

**Tarefa:** Adicionar modelos base ao schema.

**Entregáveis:**
```prisma
// models/service-template.prisma
model ServiceTemplate {
  id              String   @id @default(cuid())
  code            String   @unique
  name            String
  category        String
  description     String
  icon            String?
  defaultFields   Json
  requiredDocs    Json
  estimatedTime   String
  moduleType      String?
  moduleEntity    String?
  fieldMapping    Json?
  isActive        Boolean  @default(true)
  version         String   @default("1.0")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  instances       Service[] @relation("TemplateInstances")

  @@map("service_templates")
}

// Atualizar model Service existente
model Service {
  // ... campos existentes

  // ADICIONAR:
  templateId      String?
  template        ServiceTemplate? @relation("TemplateInstances", fields: [templateId])
  moduleType      String?
  moduleEntity    String?
  fieldMapping    Json?
}

// models/custom-data.prisma
model CustomDataTable {
  id              String   @id @default(cuid())
  tenantId        String
  tableName       String
  displayName     String
  moduleType      String
  schema          Json
  records         CustomDataRecord[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@unique([tenantId, tableName])
  @@map("custom_data_tables")
}

model CustomDataRecord {
  id              String   @id @default(cuid())
  tableId         String
  table           CustomDataTable @relation(fields: [tableId])
  protocol        String?
  serviceId       String?
  data            Json
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([protocol])
  @@index([serviceId])
  @@map("custom_data_records")
}
```

**Arquivos criados:**
- `prisma/models/service-template.prisma`
- `prisma/models/custom-data.prisma`
- `prisma/migrations/XXX_add_templates_and_custom_modules/migration.sql`

**Tempo estimado:** 2 dias

---

#### 1.2 Module Handler (Core)

**Tarefa:** Criar sistema de roteamento automático para módulos.

**Entregáveis:**

```typescript
// src/core/module-handler.ts

interface ModuleAction {
  type: string;         // "education", "health", etc.
  entity: string;       // "StudentEnrollment", "Appointment", etc.
  action: string;       // "create", "update", "approve"
  data: any;
  protocol: string;
  serviceId: string;
  tenantId: string;
}

interface ModuleHandler {
  canHandle(action: ModuleAction): boolean;
  execute(action: ModuleAction, tx: PrismaTransaction): Promise<any>;
}

class ModuleHandlerRegistry {
  private handlers: Map<string, ModuleHandler>;

  register(key: string, handler: ModuleHandler): void;
  execute(action: ModuleAction, tx: PrismaTransaction): Promise<any>;
}

// Exportar singleton
export const moduleHandlerRegistry = new ModuleHandlerRegistry();
```

```typescript
// src/core/handlers/base-handler.ts

abstract class BaseModuleHandler implements ModuleHandler {
  protected moduleType: string;
  protected entityName: string;

  canHandle(action: ModuleAction): boolean {
    return action.type === this.moduleType &&
           action.entity === this.entityName;
  }

  abstract execute(action: ModuleAction, tx: PrismaTransaction): Promise<any>;

  protected mapFields(data: any, mapping: any): any {
    // Lógica de mapeamento de campos
  }
}
```

**Arquivos criados:**
- `src/core/module-handler.ts`
- `src/core/handlers/base-handler.ts`
- `src/core/handlers/index.ts`
- `src/types/module-handler.ts`

**Tempo estimado:** 3 dias

---

#### 1.3 Atualizar Rota de Solicitação de Serviços

**Tarefa:** Integrar module handler ao fluxo de solicitação.

**Entregáveis:**

```typescript
// src/routes/citizen-services.ts (MODIFICAR)

router.post('/:id/request', async (req, res) => {
  const { serviceId } = req.params;
  const formData = req.body;

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: {
      customForm: true,
      template: true
    }
  });

  const result = await prisma.$transaction(async (tx) => {
    // 1. Criar protocolo (já existe)
    const protocol = await tx.protocol.create({
      data: {
        tenantId: tenant.id,
        citizenId: citizen.id,
        serviceId: service.id,
        number: await getNextProtocolNumber(tenant.id),
        title: service.name,
        description: service.description,
        status: 'VINCULADO',
        priority: 3
      }
    });

    // 2. NOVO: Executar ação no módulo se configurado
    if (service.moduleType && service.moduleEntity) {
      await moduleHandlerRegistry.execute({
        type: service.moduleType,
        entity: service.moduleEntity,
        action: 'create',
        data: formData,
        protocol: protocol.number,
        serviceId: service.id,
        tenantId: tenant.id
      }, tx);
    }

    // 3. Salvar custom fields (já existe)
    if (service.hasCustomForm) {
      await saveCustomFieldValues(tx, protocol.id, formData);
    }

    return protocol;
  });

  res.json({ protocol: result });
});
```

**Arquivos modificados:**
- `src/routes/citizen-services.ts`

**Tempo estimado:** 2 dias

---

#### 1.4 Sistema de Módulos Customizados

**Tarefa:** CRUD completo para módulos customizados.

**Entregáveis:**

```typescript
// src/routes/custom-modules.ts

const router = Router();

// Listar tabelas customizadas do tenant
router.get('/tables', tenantMiddleware, adminAuth, async (req, res) => {
  const tables = await prisma.customDataTable.findMany({
    where: { tenantId: req.tenantId },
    include: {
      _count: { select: { records: true } }
    }
  });
  res.json(tables);
});

// Criar nova tabela customizada
router.post('/tables', tenantMiddleware, adminAuth, async (req, res) => {
  const { tableName, displayName, moduleType, schema } = req.body;

  const table = await prisma.customDataTable.create({
    data: {
      tenantId: req.tenantId,
      tableName,
      displayName,
      moduleType,
      schema
    }
  });

  res.json(table);
});

// Listar registros de uma tabela
router.get('/tables/:tableId/records', tenantMiddleware, adminAuth, async (req, res) => {
  const { tableId } = req.params;
  const { page = 1, limit = 20, search } = req.query;

  const records = await prisma.customDataRecord.findMany({
    where: { tableId },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' }
  });

  res.json({ records, pagination: {...} });
});

// Criar registro em tabela customizada
router.post('/tables/:tableId/records', tenantMiddleware, adminAuth, async (req, res) => {
  const { tableId } = req.params;
  const { data, protocol, serviceId } = req.body;

  const record = await prisma.customDataRecord.create({
    data: {
      tableId,
      protocol,
      serviceId,
      data
    }
  });

  res.json(record);
});

export default router;
```

**Arquivos criados:**
- `src/routes/custom-modules.ts`
- `src/routes/admin-custom-modules.ts`

**Tempo estimado:** 3 dias

---

### FASE 2: TEMPLATES BASE (Semanas 3-4)

**Objetivo:** Criar estrutura de templates e primeiros 30 serviços (3 secretarias piloto).

#### 2.1 Sistema de Templates

**Tarefa:** CRUD de templates + seed script.

**Entregáveis:**

```typescript
// src/routes/service-templates.ts

router.get('/templates', async (req, res) => {
  const { category, search } = req.query;

  const templates = await prisma.serviceTemplate.findMany({
    where: {
      ...(category && { category }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      }),
      isActive: true
    },
    orderBy: [
      { category: 'asc' },
      { name: 'asc' }
    ]
  });

  res.json(templates);
});

router.post('/templates/:templateId/activate', tenantMiddleware, adminAuth, async (req, res) => {
  const { templateId } = req.params;
  const { customizations } = req.body;

  const template = await prisma.serviceTemplate.findUnique({
    where: { id: templateId }
  });

  const service = await prisma.service.create({
    data: {
      tenantId: req.tenantId,
      templateId: template.id,
      name: customizations?.name || template.name,
      description: customizations?.description || template.description,
      moduleType: template.moduleType,
      moduleEntity: template.moduleEntity,
      fieldMapping: customizations?.fieldMapping || template.fieldMapping,
      serviceType: 'REQUEST',
      isActive: true,
      // ... outros campos do template
    }
  });

  res.json(service);
});
```

```typescript
// prisma/seed-templates.ts

const templates: ServiceTemplate[] = [
  // EDUCAÇÃO (20 templates)
  {
    code: 'EDU_MATRICULA_001',
    name: 'Matrícula Escolar',
    category: 'Educação',
    description: 'Solicitação de matrícula em escola municipal',
    icon: 'GraduationCap',
    defaultFields: [...],
    requiredDocs: ['RG/CPF', 'Comprovante residência'],
    estimatedTime: '3 dias úteis',
    moduleType: 'education',
    moduleEntity: 'StudentEnrollment',
    fieldMapping: {...}
  },
  // ... mais 19 templates de educação

  // SAÚDE (30 templates)
  {
    code: 'SAU_CONSULTA_001',
    name: 'Agendar Consulta Médica',
    category: 'Saúde',
    // ...
  },
  // ... mais 29 templates de saúde

  // ASSISTÊNCIA SOCIAL (25 templates)
  {
    code: 'ASS_CESTA_001',
    name: 'Solicitar Cesta Básica',
    category: 'Assistência Social',
    // ...
  },
  // ... mais 24 templates
];

async function seedTemplates() {
  for (const template of templates) {
    await prisma.serviceTemplate.upsert({
      where: { code: template.code },
      update: template,
      create: template
    });
  }
}
```

**Arquivos criados:**
- `src/routes/service-templates.ts`
- `prisma/seed-templates.ts`
- `prisma/templates/education.json`
- `prisma/templates/health.json`
- `prisma/templates/social-assistance.json`

**Tempo estimado:** 5 dias

---

### FASE 3: SECRETARIAS PILOTO (Semanas 5-7)

**Objetivo:** Implementar completamente 3 secretarias (Educação, Saúde, Assistência Social).

---

#### 3.1 SECRETARIA: EDUCAÇÃO

**Templates:** 20 serviços
**Módulo:** `specialized/education.ts`

##### 3.1.1 Atualizar Schema Prisma

```prisma
// Adicionar campos de vínculo
model StudentEnrollment {
  // ... campos existentes

  protocol        String?   @index
  serviceId       String?
  source          String    @default("manual") // "service", "manual", "import"
  createdBy       String?

  @@index([protocol])
  @@index([serviceId])
}

// Adicionar em outros modelos de educação conforme necessário
model SchoolTransport {
  // ... campos existentes
  protocol        String?   @index
  serviceId       String?
  source          String    @default("manual")
}

// ... outros modelos
```

##### 3.1.2 Criar Handlers

```typescript
// src/core/handlers/education/enrollment-handler.ts

export class StudentEnrollmentHandler extends BaseModuleHandler {
  moduleType = 'education';
  entityName = 'StudentEnrollment';

  async execute(action: ModuleAction, tx: PrismaTransaction) {
    const { data, protocol, serviceId, tenantId } = action;

    // 1. Criar ou buscar estudante
    let student = await tx.student.findFirst({
      where: {
        tenantId,
        cpf: data.studentCpf
      }
    });

    if (!student) {
      student = await tx.student.create({
        data: {
          tenantId,
          name: data.studentName,
          birthDate: new Date(data.birthDate),
          cpf: data.studentCpf,
          parentName: data.parentName,
          parentPhone: data.parentPhone,
          address: data.address,
          isActive: true
        }
      });
    }

    // 2. Criar matrícula pendente
    const enrollment = await tx.studentEnrollment.create({
      data: {
        tenantId,
        studentId: student.id,
        classId: null, // Admin define depois
        grade: data.desiredGrade,
        year: new Date().getFullYear(),
        status: 'pending_approval',
        protocol,
        serviceId,
        source: 'service'
      }
    });

    return { student, enrollment };
  }
}
```

```typescript
// src/core/handlers/education/transport-handler.ts

export class SchoolTransportHandler extends BaseModuleHandler {
  moduleType = 'education';
  entityName = 'SchoolTransport';

  async execute(action: ModuleAction, tx: PrismaTransaction) {
    // Implementação similar
  }
}
```

**Handlers a criar:**
- `enrollment-handler.ts` (Matrícula)
- `transport-handler.ts` (Transporte)
- `meal-handler.ts` (Merenda especial)
- `material-handler.ts` (Material escolar)
- `transfer-handler.ts` (Transferência)

##### 3.1.3 Registrar Handlers

```typescript
// src/core/handlers/education/index.ts

import { moduleHandlerRegistry } from '../../module-handler';
import { StudentEnrollmentHandler } from './enrollment-handler';
import { SchoolTransportHandler } from './transport-handler';
// ... outros handlers

export function registerEducationHandlers() {
  moduleHandlerRegistry.register(
    'education:StudentEnrollment',
    new StudentEnrollmentHandler()
  );

  moduleHandlerRegistry.register(
    'education:SchoolTransport',
    new SchoolTransportHandler()
  );

  // ... registrar todos os 20
}
```

##### 3.1.4 Criar Templates

```json
// prisma/templates/education.json

[
  {
    "code": "EDU_MATRICULA_001",
    "name": "Matrícula Escolar",
    "category": "Educação",
    "description": "Solicitação de matrícula em escola municipal para o ano letivo",
    "icon": "GraduationCap",
    "defaultFields": [
      {
        "id": "studentName",
        "label": "Nome do Estudante",
        "type": "text",
        "required": true,
        "placeholder": "Nome completo do estudante"
      },
      {
        "id": "birthDate",
        "label": "Data de Nascimento",
        "type": "date",
        "required": true
      },
      {
        "id": "studentCpf",
        "label": "CPF do Estudante",
        "type": "text",
        "mask": "999.999.999-99",
        "required": false
      },
      {
        "id": "parentName",
        "label": "Nome do Responsável",
        "type": "text",
        "required": true
      },
      {
        "id": "parentPhone",
        "label": "Telefone do Responsável",
        "type": "phone",
        "required": true
      },
      {
        "id": "address",
        "label": "Endereço Completo",
        "type": "textarea",
        "required": true
      },
      {
        "id": "desiredGrade",
        "label": "Série/Ano Desejado",
        "type": "select",
        "required": true,
        "options": [
          "Berçário",
          "Maternal",
          "Pré I",
          "Pré II",
          "1º ano",
          "2º ano",
          "3º ano",
          "4º ano",
          "5º ano",
          "6º ano",
          "7º ano",
          "8º ano",
          "9º ano"
        ]
      },
      {
        "id": "shift",
        "label": "Turno Preferencial",
        "type": "select",
        "required": true,
        "options": ["Matutino", "Vespertino", "Integral"]
      },
      {
        "id": "specialNeeds",
        "label": "Necessidades Especiais",
        "type": "textarea",
        "required": false,
        "placeholder": "Descreva se o estudante possui alguma necessidade especial"
      }
    ],
    "requiredDocs": [
      "Certidão de Nascimento ou RG do estudante",
      "CPF do estudante (se houver)",
      "RG e CPF do responsável",
      "Comprovante de residência atualizado",
      "Cartão de vacina atualizado",
      "Declaração de transferência (se vier de outra escola)"
    ],
    "estimatedTime": "3 dias úteis",
    "moduleType": "education",
    "moduleEntity": "StudentEnrollment",
    "fieldMapping": {
      "studentName": "student.name",
      "birthDate": "student.birthDate",
      "studentCpf": "student.cpf",
      "parentName": "student.parentName",
      "parentPhone": "student.parentPhone",
      "address": "student.address",
      "desiredGrade": "enrollment.grade",
      "shift": "enrollment.shift"
    }
  },

  {
    "code": "EDU_TRANSPORTE_002",
    "name": "Transporte Escolar",
    "category": "Educação",
    "description": "Solicitação de vaga no transporte escolar municipal",
    // ... definição completa
  },

  // ... mais 18 templates
]
```

##### 3.1.5 Atualizar Painel Admin

```typescript
// frontend/app/admin/secretarias/educacao/matriculas/page.tsx

export default function MatriculasPage() {
  const { data: enrollments } = useQuery({
    queryKey: ['enrollments'],
    queryFn: async () => {
      const res = await fetch('/api/specialized/education/enrollments?includeProtocol=true');
      return res.json();
    }
  });

  return (
    <div>
      <h1>Matrículas</h1>

      {/* Filtros */}
      <div className="filters">
        <Select label="Status">
          <option value="all">Todas</option>
          <option value="pending_approval">Pendentes</option>
          <option value="active">Ativas</option>
          <option value="cancelled">Canceladas</option>
        </Select>

        <Select label="Origem">
          <option value="all">Todas</option>
          <option value="service">Portal do Cidadão</option>
          <option value="manual">Cadastro Manual</option>
        </Select>
      </div>

      {/* Lista */}
      <div className="enrollments-list">
        {enrollments.map(enrollment => (
          <EnrollmentCard
            key={enrollment.id}
            enrollment={enrollment}
            showProtocol={enrollment.protocol !== null}
          />
        ))}
      </div>
    </div>
  );
}
```

**Tempo estimado Educação:** 7 dias

---

#### 3.2 SECRETARIA: SAÚDE

**Templates:** 30 serviços
**Módulo:** `specialized/health.ts`

##### Handlers a criar:

1. `appointment-handler.ts` - Consultas
2. `vaccination-handler.ts` - Vacinas
3. `medicine-request-handler.ts` - Medicamentos
4. `exam-handler.ts` - Exames
5. `program-enrollment-handler.ts` - Programas (Hiperdia, Gestante)
6. `home-care-handler.ts` - Atendimento domiciliar

**Templates JSON:**
```json
// prisma/templates/health.json
[
  {
    "code": "SAU_CONSULTA_001",
    "name": "Agendar Consulta Médica",
    "moduleType": "health",
    "moduleEntity": "Appointment",
    // ... 30 definições completas
  }
]
```

**Tempo estimado Saúde:** 10 dias

---

#### 3.3 SECRETARIA: ASSISTÊNCIA SOCIAL

**Templates:** 25 serviços
**Módulo:** `specialized/social-assistance.ts`

##### Handlers a criar:

1. `benefit-request-handler.ts` - Cestas, auxílios
2. `program-enrollment-handler.ts` - Bolsa Família, Renda Cidadã
3. `home-visit-handler.ts` - Visitas domiciliares
4. `document-request-handler.ts` - Documentação
5. `family-registration-handler.ts` - Cadastro familiar

**Templates JSON:**
```json
// prisma/templates/social-assistance.json
[
  {
    "code": "ASS_CESTA_001",
    "name": "Solicitar Cesta Básica",
    "moduleType": "social_assistance",
    "moduleEntity": "BenefitRequest",
    // ... 25 definições completas
  }
]
```

**Tempo estimado Assistência Social:** 8 dias

---

### FASE 4: SECRETARIAS DE INFRAESTRUTURA (Semanas 8-10)

**Objetivo:** Implementar Obras Públicas, Serviços Públicos, Habitação.

---

#### 4.1 SECRETARIA: OBRAS PÚBLICAS

**Templates:** 25 serviços
**Módulo:** `specialized/public-works.ts`

##### Schema Updates

```prisma
model InfrastructureProblem {
  id              String   @id @default(cuid())
  tenantId        String
  type            String   // "pothole", "lighting", "leak", "sewer"
  description     String
  location        String
  coordinates     Json?
  photos          Json?
  status          String   @default("pending")
  priority        String   @default("normal")

  protocol        String?   @index
  serviceId       String?
  source          String    @default("manual")

  resolvedAt      DateTime?
  resolvedBy      String?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@map("infrastructure_problems")
}
```

##### Handlers

1. `infrastructure-problem-handler.ts` - Buracos, iluminação, vazamentos
2. `street-maintenance-handler.ts` - Pavimentação, calçadas
3. `accessibility-handler.ts` - Rampas, adaptações
4. `signage-handler.ts` - Placas, faixas, sinalização

**Templates:**
```json
{
  "code": "OBR_BURACO_001",
  "name": "Reportar Buraco na Rua",
  "category": "Obras Públicas",
  "moduleType": "public_works",
  "moduleEntity": "InfrastructureProblem",
  "defaultFields": [
    {
      "id": "location",
      "label": "Localização do Problema",
      "type": "text",
      "required": true
    },
    {
      "id": "coordinates",
      "label": "Localização GPS",
      "type": "map",
      "required": false
    },
    {
      "id": "description",
      "label": "Descrição do Problema",
      "type": "textarea",
      "required": true
    },
    {
      "id": "photos",
      "label": "Fotos do Local",
      "type": "file-multiple",
      "accept": "image/*",
      "maxFiles": 5,
      "required": false
    },
    {
      "id": "size",
      "label": "Tamanho Aproximado",
      "type": "select",
      "options": ["Pequeno (< 1m)", "Médio (1-3m)", "Grande (> 3m)"]
    }
  ],
  "fieldMapping": {
    "location": "problem.location",
    "coordinates": "problem.coordinates",
    "description": "problem.description",
    "photos": "problem.photos",
    "size": "problem.metadata.size"
  }
}
```

**Tempo estimado:** 8 dias

---

#### 4.2 SECRETARIA: SERVIÇOS PÚBLICOS

**Templates:** 20 serviços
**Módulo:** `specialized/public-services.ts`

##### Handlers

1. `tree-pruning-handler.ts` - Poda de árvores
2. `waste-removal-handler.ts` - Retirada de entulho
3. `pest-control-handler.ts` - Dedetização
4. `cleaning-handler.ts` - Limpeza, capina
5. `garbage-collection-handler.ts` - Coleta especial

**Tempo estimado:** 7 dias

---

#### 4.3 SECRETARIA: HABITAÇÃO

**Templates:** 15 serviços
**Módulo:** `specialized/housing.ts`

##### Handlers

1. `housing-application-handler.ts` - MCMV
2. `lot-application-handler.ts` - Lotes
3. `regularization-handler.ts` - Regularização fundiária
4. `housing-aid-handler.ts` - Auxílio construção/aluguel

**Tempo estimado:** 6 dias

---

### FASE 5: SECRETARIAS CULTURAIS (Semanas 11-12)

**Objetivo:** Implementar Cultura, Esporte, Turismo.

---

#### 5.1 SECRETARIA: CULTURA

**Templates:** 12 serviços
**Handlers:** 4
**Tempo:** 4 dias

#### 5.2 SECRETARIA: ESPORTE

**Templates:** 10 serviços
**Handlers:** 3
**Tempo:** 3 dias

#### 5.3 SECRETARIA: TURISMO

**Templates:** 7 serviços
**Handlers:** 3
**Tempo:** 2 dias

---

### FASE 6: SECRETARIAS AMBIENTAIS (Semanas 13-14)

**Objetivo:** Implementar Meio Ambiente, Agricultura, Planejamento Urbano.

---

#### 6.1 SECRETARIA: MEIO AMBIENTE

**Templates:** 15 serviços
**Módulo:** `specialized/environment.ts`

##### Handlers

1. `environmental-license-handler.ts` - Licenças
2. `tree-authorization-handler.ts` - Autorização poda/supressão
3. `environmental-complaint-handler.ts` - Denúncias
4. `organic-certification-handler.ts` - Certificação orgânica

**Tempo:** 5 dias

---

#### 6.2 SECRETARIA: AGRICULTURA

**Templates:** 8 serviços
**Módulo:** `specialized/agriculture.ts`

##### Handlers

1. `technical-assistance-handler.ts` - Assistência técnica
2. `seed-distribution-handler.ts` - Sementes/mudas
3. `soil-analysis-handler.ts` - Análise de solo
4. `market-registration-handler.ts` - Feira do produtor

**Tempo:** 3 dias

---

#### 6.3 SECRETARIA: PLANEJAMENTO URBANO

**Templates:** 15 serviços
**Módulo:** `specialized/urban-planning.ts`

##### Handlers

1. `building-permit-handler.ts` - Alvarás
2. `certificate-handler.ts` - Certidões
3. `property-numbering-handler.ts` - Numeração
4. `lot-subdivision-handler.ts` - Desmembramento

**Tempo:** 5 dias

---

### FASE 7: SECRETARIA DE SEGURANÇA (Semana 15)

**Objetivo:** Implementar Segurança Pública.

---

#### 7.1 SECRETARIA: SEGURANÇA PÚBLICA

**Templates:** 8 serviços
**Módulo:** `specialized/security.ts`

##### Handlers

1. `police-report-handler.ts` - Boletim de ocorrência
2. `patrol-request-handler.ts` - Solicitação de ronda
3. `camera-request-handler.ts` - Câmeras
4. `anonymous-tip-handler.ts` - Denúncias

**Tempo:** 3 dias

---

### FASE 8: INTERFACES ADMIN (Semanas 16-18)

**Objetivo:** Criar painéis de gestão para todas as 13 secretarias.

#### 8.1 Catálogo de Templates

**Páginas:**
```
/admin/servicos/templates
/admin/servicos/templates/[category]
/admin/servicos/templates/[templateId]/preview
```

**Funcionalidades:**
- Busca e filtros por categoria
- Preview de formulário do template
- Ativação com customização
- Gestão de serviços ativos

**Tempo:** 5 dias

---

#### 8.2 Painéis de Gestão (13 secretarias)

**Padrão para cada secretaria:**

```typescript
// frontend/app/admin/secretarias/[secretaria]/layout.tsx

export default function SecretariaLayout({ children }) {
  return (
    <div>
      <SecretariaSidebar />
      <div>{children}</div>
    </div>
  );
}
```

**Páginas por secretaria:**
```
/admin/secretarias/[secretaria]/dashboard
/admin/secretarias/[secretaria]/[entidade]
/admin/secretarias/[secretaria]/[entidade]/[id]
/admin/secretarias/[secretaria]/relatorios
```

**Componentes comuns:**
- `<DataTable>` - Lista paginada com filtros
- `<ProtocolBadge>` - Badge de protocolo
- `<SourceIndicator>` - Indicador origem (portal/manual)
- `<StatusBadge>` - Status visual
- `<ApprovalActions>` - Ações de aprovação

**Tempo por secretaria:** 2 dias
**Total:** 26 dias (13 × 2)

---

#### 8.3 Módulos Customizados

**Páginas:**
```
/admin/modulos-customizados
/admin/modulos-customizados/novo
/admin/modulos-customizados/[tableId]
/admin/modulos-customizados/[tableId]/registros
```

**Funcionalidades:**
- CRUD visual de tabelas
- Interface dinâmica baseada em schema
- Exportação de dados
- Relatórios customizados

**Tempo:** 5 dias

---

### FASE 9: TESTES E VALIDAÇÃO (Semanas 19-20)

**Objetivo:** Testar toda integração e corrigir bugs.

#### 9.1 Testes Unitários

**Cobertura:**
- Module Handlers (100%)
- Template System (100%)
- Custom Modules (100%)

**Ferramentas:**
- Jest
- Testing Library

**Tempo:** 5 dias

---

#### 9.2 Testes de Integração

**Cenários:**
- Cidadão solicita → Admin aprova → Protocolo atualiza
- Ativar template → Customizar → Testar formulário
- Criar módulo customizado → Adicionar dados → Consultar

**Tempo:** 3 dias

---

#### 9.3 Testes E2E

**Fluxos completos:**
- Matrícula escolar (ponta a ponta)
- Consulta médica (ponta a ponta)
- Cesta básica (ponta a ponta)
- Buraco na rua (ponta a ponta)

**Ferramentas:**
- Playwright

**Tempo:** 2 dias

---

### FASE 10: DOCUMENTAÇÃO E TREINAMENTO (Semana 21)

**Objetivo:** Documentar tudo e preparar treinamento.

#### 10.1 Documentação Técnica

**Documentos:**
- `ARCHITECTURE.md` ✅ (já criado)
- `MODULE_HANDLERS.md` - Como criar handlers
- `TEMPLATES.md` - Como criar templates
- `CUSTOM_MODULES.md` - Como usar módulos customizados
- `API.md` - Documentação de endpoints

**Tempo:** 3 dias

---

#### 10.2 Guias de Uso

**Para cada secretaria:**
- Como ativar serviços
- Como gerenciar solicitações
- Como aprovar/rejeitar
- Relatórios disponíveis

**Tempo:** 2 dias

---

#### 10.3 Vídeos de Treinamento

**Vídeos:**
- Overview do sistema (10min)
- Ativando serviços padrões (5min)
- Gerenciando solicitações (10min)
- Criando módulos customizados (8min)
- Por secretaria (13 × 5min)

**Tempo:** 2 dias

---

## 📊 CRONOGRAMA CONSOLIDADO

### Resumo por Fase

| Fase | Descrição | Semanas | Dias Úteis |
|------|-----------|---------|------------|
| 1 | Fundação | 1-2 | 10 |
| 2 | Templates Base | 3-4 | 10 |
| 3 | Secretarias Piloto (3) | 5-7 | 15 |
| 4 | Infraestrutura (3) | 8-10 | 15 |
| 5 | Culturais (3) | 11-12 | 10 |
| 6 | Ambientais (3) | 13-14 | 10 |
| 7 | Segurança (1) | 15 | 5 |
| 8 | Interfaces Admin | 16-18 | 15 |
| 9 | Testes e Validação | 19-20 | 10 |
| 10 | Documentação | 21 | 5 |
| **TOTAL** | **21 semanas** | **~105 dias úteis** | **~5 meses** |

---

## 👥 RECURSOS NECESSÁRIOS

### Equipe Mínima

**Backend (2 desenvolvedores):**
- Dev 1: Module Handlers + Integração
- Dev 2: Templates + Custom Modules

**Frontend (2 desenvolvedores):**
- Dev 3: Painéis Admin + Catálogo
- Dev 4: Módulos Customizados + Dashboard

**Fullstack (1 desenvolvedor):**
- Dev 5: Ponte entre back e front, correções

**QA (1 testador):**
- Testes manuais e automatizados

**Tech Lead (1):**
- Revisão de código, arquitetura, bloqueios

**TOTAL: 7 pessoas**

---

### Infraestrutura

**Desenvolvimento:**
- 7 ambientes de dev local
- 1 servidor staging
- 1 servidor de testes E2E

**Ferramentas:**
- GitHub (repositório)
- Figma (designs)
- Notion (documentação)
- Slack (comunicação)
- Jira (gestão de tarefas)

---

## ✅ CRITÉRIOS DE ACEITAÇÃO

### Por Secretaria

Para cada uma das 13 secretarias, deve ter:

**Backend:**
- ✅ Todos templates criados e seedados
- ✅ Handlers implementados e testados
- ✅ Schema Prisma atualizado com protocolo
- ✅ Endpoints funcionando

**Frontend:**
- ✅ Painel de gestão completo
- ✅ Filtros e busca funcionando
- ✅ Aprovação/rejeição implementada
- ✅ Indicadores de origem (portal/manual)

**Integração:**
- ✅ Serviço ativado → Formulário funciona
- ✅ Cidadão solicita → Dados persistem no módulo
- ✅ Admin aprova → Protocolo atualiza
- ✅ Notificações funcionando

---

### Geral

**Sistema de Templates:**
- ✅ 210 templates cadastrados
- ✅ Catálogo navegável
- ✅ Ativação funciona
- ✅ Customização funciona

**Module Handler:**
- ✅ Roteamento automático funciona
- ✅ 13 módulos integrados
- ✅ Transações atômicas
- ✅ Tratamento de erros

**Módulos Customizados:**
- ✅ CRUD de tabelas
- ✅ CRUD de registros
- ✅ Interface dinâmica
- ✅ Vínculo com protocolo

**Documentação:**
- ✅ Arquitetura documentada
- ✅ Guias de uso por secretaria
- ✅ API documentada
- ✅ Vídeos de treinamento

---

## 🚨 RISCOS E MITIGAÇÕES

### Riscos Técnicos

**Risco 1: Complexidade dos Handlers**
- **Mitigação:** Templates bem definidos, revisão de código rigorosa

**Risco 2: Performance com 210 templates**
- **Mitigação:** Cache, lazy loading, índices no banco

**Risco 3: Schema migrations complexas**
- **Mitigação:** Migrations incrementais, backup antes de cada deploy

### Riscos de Escopo

**Risco 4: Aumento de escopo durante implementação**
- **Mitigação:** Freeze de features após FASE 2, backlog para v2

**Risco 5: Templates incompletos**
- **Mitigação:** Revisão com stakeholders após cada lote de 20 templates

---

## 📈 MÉTRICAS DE SUCESSO

### KPIs Técnicos

- ✅ 210 templates funcionais
- ✅ 13 módulos 100% integrados
- ✅ 0 erros críticos em produção
- ✅ Cobertura de testes > 80%
- ✅ Tempo de resposta < 2s

### KPIs de Produto

- ✅ 100% das secretarias usando o sistema
- ✅ 80% de solicitações via portal (vs manual)
- ✅ Redução de 50% no tempo de aprovação
- ✅ Satisfação admin > 4.5/5
- ✅ Satisfação cidadão > 4.5/5

---

## 🎯 ENTREGA FINAL

### Checklist de Conclusão

**Backend (100%):**
- [x] 210 templates seedados
- [x] 50+ handlers implementados
- [x] Custom modules funcionando
- [x] Todas migrations aplicadas
- [x] Testes passando

**Frontend (100%):**
- [x] Catálogo de templates
- [x] 13 painéis especializados
- [x] Interface módulos customizados
- [x] Dashboard consolidado
- [x] Responsivo mobile

**Integração (100%):**
- [x] Fluxo ponta-a-ponta testado
- [x] Todas 13 secretarias integradas
- [x] Notificações funcionando
- [x] Relatórios disponíveis

**Documentação (100%):**
- [x] Arquitetura
- [x] Guias de uso
- [x] API docs
- [x] Vídeos de treinamento
- [x] FAQ

---

## 🚀 PRÓXIMOS PASSOS

1. ✅ Aprovação deste plano
2. ✅ Formação da equipe (7 pessoas)
3. ✅ Kick-off meeting
4. ✅ Setup de ambientes
5. ✅ Início Fase 1 (Fundação)

---

**Plano criado em:** 27/10/2025
**Versão:** 1.0
**Duração total:** 21 semanas (~5 meses)
**Equipe:** 7 pessoas
**Entregáveis:** 210 templates + 13 módulos + sistema completo
