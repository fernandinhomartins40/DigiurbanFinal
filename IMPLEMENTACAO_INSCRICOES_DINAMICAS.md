# Implementação de Inscrições Dinâmicas - Todos os Serviços

## Status da Implementação

### ✅ COMPLETO - Agricultura
- [x] RuralProgram - campos customizáveis adicionados
- [x] RuralProgramEnrollment - modelo criado
- [x] RuralTraining - campos customizáveis adicionados
- [x] RuralTrainingEnrollment - modelo criado
- [x] Relacionamentos atualizados
- [x] Module mapping atualizado

### ✅ COMPLETO - Cultura
- [x] CulturalWorkshop - campos customizáveis adicionados
- [x] CulturalWorkshopEnrollment - atualizado com campos customizáveis
- [x] Relacionamento CulturalWorkshop → enrollments criado
- [x] Relacionamento CulturalWorkshopEnrollment → workshop criado
- [x] Relacionamento com Citizen adicionado

### ⏳ PENDENTE - Esportes

#### SportsSchool → SportsSchoolEnrollment
**Modelo Principal (SportsSchool):**
```prisma
// Adicionar:
customFields        Json?
requiredDocuments   Json?
enrollmentSettings  Json?
enrollments         SportsSchoolEnrollment[]
```

**Modelo Enrollment (SportsSchoolEnrollment):**
```prisma
// Adicionar:
sportsSchoolId     String // Tornar obrigatório (remover ?)
schoolId           String? // Relação com school
customData         Json?
documents          Json?
adminNotes         String?
rejectionReason    String?
moduleType         String @default("INSCRICAO_ESCOLINHA")

// Relacionamento:
school             SportsSchool @relation(fields: [sportsSchoolId], references: [id])
citizen            Citizen? @relation("SportsSchoolEnrollmentCitizen", fields: [citizenId], references: [id])
```

#### Competition → CompetitionEnrollment
**Modelo Principal (Competition):**
```prisma
// Adicionar:
customFields        Json?
requiredDocuments   Json?
enrollmentSettings  Json?
enrollments         CompetitionEnrollment[]
```

**Modelo Enrollment (CompetitionEnrollment):**
```prisma
// Adicionar:
competitionId      String // Tornar obrigatório (remover ?)
customData         Json?
documents          Json?
adminNotes         String?
moduleType         String @default("INSCRICAO_COMPETICAO")

// Relacionamento:
competition        Competition @relation(fields: [competitionId], references: [id])
citizen            Citizen? @relation("CompetitionEnrollmentCitizen", fields: [citizenId], references: [id])
```

#### TournamentEnrollment
**ATENÇÃO:** Não existe modelo `Tournament`!
- Opção 1: Criar modelo Tournament
- Opção 2: Mapear para Competition
- **DECISÃO:** Manter TournamentEnrollment independente por enquanto

### ⏳ PENDENTE - Assistência Social

#### SocialProgram → SocialProgramEnrollment
**Modelo Principal (SocialProgram):**
```prisma
// Adicionar:
customFields        Json?
requiredDocuments   Json?
enrollmentSettings  Json?
enrollments         SocialProgramEnrollment[]
```

**Modelo Enrollment (SocialProgramEnrollment):**
```prisma
// Verificar se já tem:
- customData
- documents
- moduleType
- Relacionamento com SocialProgram
```

#### SocialGroup → SocialGroupEnrollment
**Modelo Principal (SocialGroup):**
```prisma
// Verificar se existe modelo SocialGroup
// Se não, criar ou mapear para outro
```

### ⏳ PENDENTE - Habitação

#### HousingProgram → HousingApplication
**ATENÇÃO:** HousingApplication JÁ É a inscrição no programa
- Não precisa criar *Enrollment separado
- Adicionar campos customizáveis ao HousingProgram:
```prisma
customFields        Json?
requiredDocuments   Json?
enrollmentSettings  Json?
applications        HousingApplication[] // Relação
```

#### HousingRegistration
**ATENÇÃO:** HousingRegistration JÁ É a inscrição na fila
- Não precisa criar *Enrollment separado
- Tratar como enrollment direto

### ⏳ PENDENTE - Turismo

#### TourismProgram → TourismProgramEnrollment
**Modelo Principal (TourismProgram):**
```prisma
// Adicionar:
customFields        Json?
requiredDocuments   Json?
enrollmentSettings  Json?
enrollments         TourismProgramEnrollment[]
```

**Modelo Enrollment (TourismProgramEnrollment):**
```prisma
// CRIAR NOVO MODELO:
model TourismProgramEnrollment {
  id              String   @id @default(cuid())
  tenantId        String
  protocolId      String?
  programId       String
  citizenId       String?

  applicantName   String
  applicantCpf    String?
  applicantEmail  String?
  applicantPhone  String?

  status          String   @default("PENDING")
  enrollmentDate  DateTime @default(now())
  approvedDate    DateTime?

  customData      Json?
  documents       Json?
  observations    String?
  adminNotes      String?

  moduleType      String   @default("INSCRICAO_PROGRAMA_TURISTICO")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  tenant          Tenant              @relation(fields: [tenantId], references: [id])
  program         TourismProgram      @relation(fields: [programId], references: [id])
  protocol        ProtocolSimplified? @relation("TourismProgramEnrollmentProtocol", fields: [protocolId], references: [id])
  citizen         Citizen?            @relation("TourismProgramEnrollmentCitizen", fields: [citizenId], references: [id])

  @@index([tenantId, programId])
  @@index([tenantId, status])
  @@map("tourism_program_enrollments")
}
```

## Padrão de Campos Customizáveis

### Para Modelos Principais (Program, Workshop, Training, etc)
```prisma
customFields        Json?  // [{id, label, type, required, options, placeholder}]
requiredDocuments   Json?  // [{id, name, description, required}]
enrollmentSettings  Json?  // {allowMultipleEnrollments, autoApprove, sendNotifications, maxEnrollments}
enrollments         [Tipo]Enrollment[]
```

### Para Modelos de Enrollment
```prisma
customData      Json?   // Respostas aos customFields
documents       Json?   // [{id, name, url, uploadedAt}]
adminNotes      String?
rejectionReason String?
moduleType      String @default("INSCRICAO_...")
```

## Relacionamentos a Adicionar

### Tenant
```prisma
ruralTrainingEnrollments         RuralTrainingEnrollment[]
culturalWorkshopEnrollments      CulturalWorkshopEnrollment[] // JÁ EXISTE
sportsSchoolEnrollments          SportsSchoolEnrollment[] // JÁ EXISTE
competitionEnrollments           CompetitionEnrollment[] // JÁ EXISTE
tournamentEnrollments            TournamentEnrollment[] // JÁ EXISTE
socialProgramEnrollments         SocialProgramEnrollment[] // JÁ EXISTE
socialGroupEnrollments           SocialGroupEnrollment[] // JÁ EXISTE
tourismProgramEnrollments        TourismProgramEnrollment[]
```

### Citizen
```prisma
ruralTrainingEnrollments     RuralTrainingEnrollment[] @relation("RuralTrainingEnrollmentCitizen")
culturalWorkshopEnrollments  CulturalWorkshopEnrollment[] @relation("CulturalWorkshopEnrollmentCitizen")
sportsSchoolEnrollments      SportsSchoolEnrollment[] @relation("SportsSchoolEnrollmentCitizen")
competitionEnrollments       CompetitionEnrollment[] @relation("CompetitionEnrollmentCitizen")
tournamentEnrollments        TournamentEnrollment[] @relation("TournamentEnrollmentCitizen")
tourismProgramEnrollments    TourismProgramEnrollment[] @relation("TourismProgramEnrollmentCitizen")
```

### ProtocolSimplified
```prisma
ruralTrainingEnrollments     RuralTrainingEnrollment[] @relation("RuralTrainingEnrollmentProtocol")
tourismProgramEnrollments    TourismProgramEnrollment[] @relation("TourismProgramEnrollmentProtocol")
// Os demais já existem
```

## Module Mapping a Atualizar

```typescript
// NÃO MUDAR - já são Enrollments:
INSCRICAO_GRUPO_OFICINA: 'SocialGroupEnrollment',
INSCRICAO_PROGRAMA_SOCIAL: 'SocialProgramEnrollment',
INSCRICAO_OFICINA_CULTURAL: 'CulturalWorkshopEnrollment',
INSCRICAO_ESCOLINHA: 'SportsSchoolEnrollment',
INSCRICAO_COMPETICAO: 'CompetitionEnrollment',
INSCRICAO_TORNEIO: 'TournamentEnrollment',

// MUDAR:
INSCRICAO_CURSO_RURAL: 'RuralTrainingEnrollment', // Era: 'RuralTraining'
INSCRICAO_PROGRAMA_TURISTICO: 'TourismProgramEnrollment', // Era: 'TourismProgram'

// ESPECIAIS - são auto-inscrições:
INSCRICAO_PROGRAMA_HABITACIONAL: 'HousingApplication', // OK
INSCRICAO_FILA_HABITACAO: 'HousingRegistration', // OK
```

## Próximos Passos

1. [ ] Aplicar mudanças nos modelos de Esportes
2. [ ] Verificar e ajustar modelos de Assistência Social
3. [ ] Ajustar HousingProgram (adicionar campos customizáveis)
4. [ ] Criar TourismProgramEnrollment
5. [ ] Atualizar todos os relacionamentos
6. [ ] Atualizar module-mapping.ts
7. [ ] Criar migration
8. [ ] Testar compilação do Prisma
