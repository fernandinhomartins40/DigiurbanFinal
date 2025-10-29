# 🎯 PLANO DE REPLICAÇÃO - TODAS AS SECRETARIAS

**Data:** 29/10/2025
**Base:** Piloto de Agricultura (100% funcional)
**Objetivo:** Replicar integração Protocolo ↔ Módulo para TODAS as 13 secretarias

---

## 📊 VISÃO GERAL

### **Total de Secretarias: 13**

Cada secretaria é **única e importante**, com características e módulos específicos:

| # | Secretaria | Módulos COM_DADOS | Módulos INFORMATIVOS | Total | Prioridade |
|---|------------|-------------------|----------------------|-------|------------|
✅ | **Agricultura** | 6 | 0 | 6 | COMPLETO |
| 1 | **Saúde** | 11 | 0 | 11 | ALTA |
| 2 | **Educação** | 10 | 1 | 11 | ALTA |
| 3 | **Assistência Social** | 9 | 0 | 9 | ALTA |
| 4 | **Segurança Pública** | 10 | 1 | 11 | ALTA |
| 5 | **Cultura** | 8 | 1 | 9 | MÉDIA |
| 6 | **Esportes** | 8 | 1 | 9 | MÉDIA |
| 7 | **Meio Ambiente** | 7 | 0 | 7 | MÉDIA |
| 8 | **Planejamento Urbano** | 7 | 2 | 9 | MÉDIA |
| 9 | **Serviços Públicos** | 8 | 1 | 9 | MÉDIA |
| 10 | **Turismo** | 7 | 2 | 9 | MÉDIA |
| 11 | **Habitação** | 6 | 1 | 7 | MÉDIA |
| 12 | **Obras Públicas** | 5 | 2 | 7 | MÉDIA |

**Total:** 95 módulos COM_DADOS + 12 INFORMATIVOS = **108 serviços**

---

## 🏗️ PADRÃO DE REPLICAÇÃO (Por Secretaria)

Para cada secretaria, seguir este checklist:

### **1. BACKEND - Schema Prisma**

```prisma
// Para CADA modelo da secretaria, adicionar:
model NomeModelo {
  id         String   @id @default(cuid())
  tenantId   String
  protocolId String?  // ← ADICIONAR
  // ... campos existentes

  protocol   ProtocolSimplified? @relation("NomeModeloProtocol", fields: [protocolId], references: [id])
  tenant     Tenant   @relation(...)
}

// No ProtocolSimplified, adicionar relação inversa:
model ProtocolSimplified {
  // ... campos
  nomeModelos NomeModelo[] @relation("NomeModeloProtocol")
}
```

### **2. BACKEND - Rota da Secretaria**

Criar/atualizar: `backend/src/routes/secretarias-[nome].ts`

```typescript
// Estrutura padrão:
import { MODULE_BY_DEPARTMENT } from '../config/module-mapping';

router.get('/stats', async (req, res) => {
  // Buscar departamento
  const dept = await prisma.department.findFirst({
    where: { tenantId, code: 'CODIGO_DEPT' }
  });

  // Stats por módulo usando ProtocolSimplified
  const protocolsByModule = await prisma.protocolSimplified.groupBy({
    by: ['moduleType', 'status'],
    where: {
      tenantId,
      departmentId: dept.id,
      moduleType: { in: MODULE_BY_DEPARTMENT.NOME_DEPT },
    },
  });

  // Contar registros nos módulos
  const [modulo1Count, modulo2Count, ...] = await Promise.all([
    prisma.modulo1.aggregate({ where: { tenantId } }),
    prisma.modulo2.aggregate({ where: { tenantId } }),
  ]);
});

// Rotas CRUD para cada módulo
router.get('/modulo1', ...);
router.get('/modulo2', ...);
```

### **3. BACKEND - Atualizar protocol-module.service.ts**

Adicionar mapeamento de entidades:

```typescript
private async createModuleEntity(tx, entityName, data) {
  const entityMap = {
    // ... entidades existentes

    // NOVA SECRETARIA
    NovaEntidade1: () => tx.novaEntidade1.create({ data: {...} }),
    NovaEntidade2: () => tx.novaEntidade2.create({ data: {...} }),
  };
}

private async updateModuleEntityStatus(tx, entityName, protocolId, status) {
  const updateMap = {
    // ... updates existentes

    // NOVA SECRETARIA
    NovaEntidade1: () => tx.novaEntidade1.updateMany({...}),
    NovaEntidade2: () => tx.novaEntidade2.updateMany({...}),
  };
}
```

### **4. FRONTEND - Configuração de Módulos**

Criar: `frontend/lib/module-configs/[nome-secretaria].ts`

```typescript
import { ModuleConfig } from './types';

export const modulo1Config: ModuleConfig = {
  key: 'modulo-1',
  entityName: 'Modulo1Entity',
  displayName: 'Nome do Módulo',

  fields: [
    { name: 'field1', label: 'Campo 1', type: 'text', showInList: true },
    // ... campos
  ],

  stats: [
    { key: 'total', label: 'Total', icon: 'Users' },
    // ... stats
  ],

  filters: [
    { key: 'status', type: 'select', options: [...] },
  ],

  apiEndpoint: '/api/admin/secretarias/[nome]/modulo1'
};

// Exportar todos os configs
export const configsSecretaria = {
  modulo1: modulo1Config,
  modulo2: modulo2Config,
  // ...
};
```

### **5. FRONTEND - Páginas da Secretaria**

Estrutura de pastas:

```
frontend/app/admin/secretarias/[nome]/
├── page.tsx              # Dashboard principal
├── modulo1/
│   └── page.tsx         # Página do módulo com tabs
├── modulo2/
│   └── page.tsx
└── ...
```

Cada página de módulo:

```typescript
'use client';

import { ModulePageTemplate } from '@/components/admin/modules/ModulePageTemplate';
import { PendingProtocolsList } from '@/components/admin/modules/PendingProtocolsList';
import { modulo1Config } from '@/lib/module-configs/[secretaria]';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Modulo1Page() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="cadastrados">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="cadastrados">Cadastrados</TabsTrigger>
          <TabsTrigger value="pendentes">Aguardando Aprovação</TabsTrigger>
        </TabsList>

        <TabsContent value="cadastrados">
          <ModulePageTemplate
            config={modulo1Config}
            departmentType="[nome-secretaria]"
          />
        </TabsContent>

        <TabsContent value="pendentes">
          <PendingProtocolsList
            moduleType="TIPO_MODULO"
            moduleName="Nome do Módulo"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

---

## 📋 DETALHAMENTO POR SECRETARIA

### **1. SECRETARIA DE SAÚDE (11 módulos)**

**Características Únicas:**
- Maior volume de atendimentos
- Dados sensíveis (LGPD)
- Integração com DATASUS
- Campanhas de vacinação em massa

**Módulos COM_DADOS:**
1. `HealthAttendance` - Atendimentos gerais
2. `HealthAppointment` - Agendamentos médicos
3. `MedicationDispense` - Controle de medicamentos
4. `HealthCampaign` - Campanhas de saúde
5. `HealthProgram` - Programas de saúde
6. `HealthTransport` - TFD (Tratamento Fora Domicílio)
7. `HealthExam` - Solicitação de exames
8. `HealthTransportRequest` - Transporte de pacientes
9. `Vaccination` - Vacinação
10. `Patient` - Cadastro de pacientes
11. `CommunityHealthAgent` - Gestão de ACS

**Particularidades:**
- Campos de saúde: pressão arterial, tipo sanguíneo, alergias
- Histórico médico
- Prescrições e receitas
- Controle de estoque de medicamentos

---

### **2. SECRETARIA DE EDUCAÇÃO (11 módulos)**

**Características Únicas:**
- Calendário escolar
- Histórico acadêmico
- Gestão de merenda
- Transporte escolar

**Módulos COM_DADOS:**
1. `EducationAttendance` - Atendimentos educação
2. `Student` - Matrícula de alunos
3. `StudentTransport` - Transporte escolar
4. `DisciplinaryRecord` - Ocorrências escolares
5. `SchoolDocument` - Documentos escolares
6. `StudentTransfer` - Transferências
7. `AttendanceRecord` - Frequência
8. `GradeRecord` - Notas
9. `SchoolManagement` - Gestão escolar
10. `SchoolMeal` - Merenda escolar

**Módulos INFORMATIVOS:**
11. `CALENDARIO_ESCOLAR` - Calendário informativo

**Particularidades:**
- Ano letivo e períodos
- Turmas e séries
- Professores e disciplinas
- Boletins e históricos

---

### **3. SECRETARIA DE ASSISTÊNCIA SOCIAL (9 módulos)**

**Características Únicas:**
- Dados de vulnerabilidade social
- Benefícios assistenciais
- Visitas domiciliares
- CRAS e CREAS

**Módulos COM_DADOS:**
1. `SocialAssistanceAttendance` - Atendimentos
2. `VulnerableFamily` - Cadastro Único
3. `BenefitRequest` - Solicitação de benefícios
4. `EmergencyDelivery` - Entregas emergenciais
5. `SocialGroupEnrollment` - Grupos e oficinas
6. `HomeVisit` - Visitas domiciliares
7. `SocialProgramEnrollment` - Programas sociais
8. `SocialAppointment` - Agendamentos
9. `SocialEquipment` - Gestão CRAS/CREAS

**Particularidades:**
- Renda per capita
- Composição familiar
- Situação habitacional
- Acompanhamento social

---

### **4. SECRETARIA DE SEGURANÇA PÚBLICA (11 módulos)**

**Características Únicas:**
- Ocorrências criminais
- Denúncias anônimas
- Patrulhamento
- Sistema de câmeras

**Módulos COM_DADOS:**
1. `SecurityAttendance` - Atendimentos
2. `SecurityOccurrence` - Registro de ocorrências
3. `PatrolRequest` - Solicitação de ronda
4. `SecurityCameraRequest` - Câmeras de segurança
5. `AnonymousTip` - Denúncias anônimas
6. `CriticalPoint` - Pontos críticos
7. `SecurityAlert` - Alertas
8. `SecurityPatrol` - Registro de patrulha
9. `MunicipalGuard` - Gestão guarda municipal
10. `SurveillanceSystem` - Sistema de vigilância

**Módulos INFORMATIVOS:**
11. `ESTATISTICAS_SEGURANCA` - Estatísticas

**Particularidades:**
- Geolocalização precisa
- Natureza da ocorrência
- Gravidade e urgência
- Integração com câmeras

---

### **5. SECRETARIA DE CULTURA (9 módulos)**

**Características Únicas:**
- Espaços culturais
- Projetos e eventos
- Grupos artísticos
- Lei de incentivo

**Módulos COM_DADOS:**
1. `CulturalAttendance` - Atendimentos
2. `CulturalSpaceReservation` - Reserva de espaços
3. `CulturalWorkshopEnrollment` - Oficinas culturais
4. `ArtisticGroup` - Grupos artísticos
5. `CulturalProject` - Projetos culturais
6. `CulturalProjectSubmission` - Submissão de projetos
7. `CulturalEvent` - Eventos culturais
8. `CulturalManifestation` - Manifestações culturais

**Módulos INFORMATIVOS:**
9. `AGENDA_EVENTOS_CULTURAIS` - Agenda

**Particularidades:**
- Datas de eventos
- Capacidade de espaços
- Orçamento de projetos
- Editais e seleção

---

### **6. SECRETARIA DE ESPORTES (9 módulos)**

**Características Únicas:**
- Escolinhas esportivas
- Competições e torneios
- Espaços esportivos
- Atletas e equipes

**Módulos COM_DADOS:**
1. `SportsAttendance` - Atendimentos
2. `SportsSchoolEnrollment` - Escolinhas
3. `Athlete` - Cadastro de atletas
4. `SportsInfrastructureReservation` - Reserva de espaços
5. `CompetitionEnrollment` - Competições
6. `SportsTeam` - Equipes esportivas
7. `TournamentEnrollment` - Torneios
8. `SportsModality` - Modalidades

**Módulos INFORMATIVOS:**
9. `AGENDA_EVENTOS_ESPORTIVOS` - Agenda

**Particularidades:**
- Modalidades esportivas
- Categorias por idade
- Horários de treinamento
- Resultados de competições

---

### **7. SECRETARIA DE HABITAÇÃO (7 módulos)**

**Características Únicas:**
- Programas habitacionais
- Regularização fundiária
- Auxílio aluguel
- Fila de espera

**Módulos COM_DADOS:**
1. `HousingAttendance` - Atendimentos
2. `HousingApplication` - Programas habitacionais
3. `LandRegularization` - Regularização fundiária
4. `RentAssistance` - Auxílio aluguel
5. `HousingUnit` - Unidades habitacionais
6. `HousingRegistration` - Fila de habitação

**Módulos INFORMATIVOS:**
7. `CONSULTA_PROGRAMAS_HABITACIONAIS` - Consulta

**Particularidades:**
- Renda familiar
- Situação habitacional atual
- Pontuação de critérios
- Documentação imobiliária

---

### **8. SECRETARIA DE MEIO AMBIENTE (7 módulos)**

**Características Únicas:**
- Licenciamento ambiental
- Denúncias ambientais
- Áreas protegidas
- Autorizações

**Módulos COM_DADOS:**
1. `EnvironmentalAttendance` - Atendimentos
2. `EnvironmentalLicense` - Licenças ambientais
3. `EnvironmentalComplaint` - Denúncias
4. `EnvironmentalProgram` - Programas ambientais
5. `TreeCuttingAuthorization` - Poda e corte
6. `EnvironmentalInspection` - Vistorias
7. `ProtectedArea` - Áreas protegidas

**Particularidades:**
- Geolocalização de áreas
- Espécies de árvores
- Impacto ambiental
- Laudos técnicos

---

### **9. SECRETARIA DE OBRAS PÚBLICAS (7 módulos)**

**Características Únicas:**
- Obras públicas
- Manutenção viária
- Vistorias técnicas
- Mapas de obras

**Módulos COM_DADOS:**
1. `PublicWorksAttendance` - Atendimentos
2. `RoadRepairRequest` - Reparos de vias
3. `TechnicalInspection` - Vistorias técnicas
4. `PublicWork` - Cadastro de obras
5. `WorkInspection` - Inspeção de obras

**Módulos INFORMATIVOS:**
6. `ACOMPANHAMENTO_OBRAS` - Acompanhamento
7. `MAPA_OBRAS` - Mapa

**Particularidades:**
- Localização de obras
- Cronograma
- Orçamento
- Percentual de execução

---

### **10. SECRETARIA DE PLANEJAMENTO URBANO (9 módulos)**

**Características Únicas:**
- Alvarás e licenças
- Aprovação de projetos
- Zoneamento
- Consultas públicas

**Módulos COM_DADOS:**
1. `UrbanPlanningAttendance` - Atendimentos
2. `ProjectApproval` - Aprovação de projetos
3. `BuildingPermit` - Alvará de construção
4. `BusinessLicense` - Alvará de funcionamento
5. `CertificateRequest` - Certidões
6. `UrbanInfraction` - Denúncias
7. `UrbanZoning` - Loteamentos

**Módulos INFORMATIVOS:**
8. `CONSULTAS_PUBLICAS` - Consultas
9. `MAPA_URBANO` - Mapa

**Particularidades:**
- Plantas e projetos
- Metragem e gabarito
- Zoneamento urbano
- Legislação municipal

---

### **11. SECRETARIA DE SERVIÇOS PÚBLICOS (9 módulos)**

**Características Únicas:**
- Iluminação pública
- Limpeza urbana
- Coleta seletiva
- Manutenção urbana

**Módulos COM_DADOS:**
1. `PublicServiceAttendance` - Atendimentos
2. `StreetLighting` - Iluminação pública
3. `UrbanCleaning` - Limpeza urbana
4. `SpecialCollection` - Coleta especial
5. `WeedingRequest` - Capina
6. `DrainageRequest` - Desobstrução
7. `TreePruningRequest` - Poda de árvores
8. `ServiceTeam` - Gestão de equipes

**Módulos INFORMATIVOS:**
9. `REGISTRO_PROBLEMA_COM_FOTO` - Funcionalidade transversal

**Particularidades:**
- Geolocalização de problemas
- Foto do local
- Priorização por região
- Rotas de equipes

---

### **12. SECRETARIA DE TURISMO (9 módulos)**

**Características Únicas:**
- Atrativos turísticos
- Guias e roteiros
- Eventos turísticos
- Cadastro de estabelecimentos

**Módulos COM_DADOS:**
1. `TourismAttendance` - Atendimentos
2. `LocalBusiness` - Estabelecimentos turísticos
3. `TourismGuide` - Guias turísticos
4. `TourismProgram` - Programas turísticos
5. `TouristAttraction` - Atrativos
6. `TourismRoute` - Roteiros
7. `TourismEvent` - Eventos turísticos

**Módulos INFORMATIVOS:**
8. `MAPA_TURISTICO` - Mapa
9. `GUIA_TURISTICO_CIDADE` - Guia

**Particularidades:**
- Geolocalização de atrativos
- Idiomas dos guias
- Horários de funcionamento
- Classificação turística

---

## 📊 ORDEM DE IMPLEMENTAÇÃO SUGERIDA

### **Fase 1: Secretarias Essenciais (3-4 semanas)**
1. ✅ Agricultura (COMPLETO)
2. Saúde (11 módulos) - 1 semana
3. Educação (11 módulos) - 1 semana
4. Assistência Social (9 módulos) - 5 dias

### **Fase 2: Segurança e Infraestrutura (2-3 semanas)**
5. Segurança Pública (11 módulos) - 1 semana
6. Obras Públicas (7 módulos) - 4 dias
7. Serviços Públicos (9 módulos) - 5 dias
8. Planejamento Urbano (9 módulos) - 5 dias

### **Fase 3: Cultura e Desenvolvimento (2 semanas)**
9. Cultura (9 módulos) - 5 dias
10. Esportes (9 módulos) - 5 dias
11. Turismo (9 módulos) - 4 dias

### **Fase 4: Complementares (1 semana)**
12. Habitação (7 módulos) - 3 dias
13. Meio Ambiente (7 módulos) - 4 dias

**Tempo Total Estimado:** 8-10 semanas para todas as 13 secretarias

---

## ✅ CHECKLIST DE REPLICAÇÃO (Por Secretaria)

- [ ] **Schema Prisma:** Adicionar `protocolId` em todos os models
- [ ] **Schema Prisma:** Adicionar relações inversas no ProtocolSimplified
- [ ] **Migration:** Gerar e aplicar migration
- [ ] **Service:** Atualizar protocol-module.service.ts com mapeamentos
- [ ] **Backend Routes:** Criar/atualizar rota da secretaria
- [ ] **Backend Routes:** Implementar GET /stats
- [ ] **Backend Routes:** Implementar rotas CRUD dos módulos
- [ ] **Frontend Configs:** Criar module-configs/[secretaria].ts
- [ ] **Frontend Configs:** Configurar todos os módulos
- [ ] **Frontend Pages:** Criar estrutura de pastas
- [ ] **Frontend Pages:** Criar página principal (dashboard)
- [ ] **Frontend Pages:** Criar páginas de cada módulo com tabs
- [ ] **Testes:** Criar protocolo e verificar vinculação
- [ ] **Testes:** Aprovar protocolo e verificar ativação
- [ ] **Documentação:** Documentar particularidades da secretaria

---

## 🎯 PRÓXIMO PASSO

Começar pela **Secretaria de Saúde** (maior volume e complexidade)?

Aguardando confirmação para iniciar! 🚀
