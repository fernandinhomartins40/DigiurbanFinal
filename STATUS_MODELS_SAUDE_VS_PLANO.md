# STATUS - MODELS DE SAÚDE vs PLANO

**Data:** 29/10/2025
**Referência:** PLANO_IMPLEMENTACAO_SIMPLIFICACAO.md (linhas 232-245)

---

## 📋 VERIFICAÇÃO DOS 11 MODELS DEFINIDOS NO PLANO

| # | Model do PLANO | Existe no Schema? | Ação Necessária |
|---|----------------|-------------------|-----------------|
| 1 | `HealthAttendance` | ✅ SIM (linha 1403) | Adicionar `protocolId` |
| 2 | `HealthAppointment` | ✅ SIM (linha 1701) | Adicionar `protocolId` |
| 3 | `MedicationDispense` | ✅ SIM (linha 2186) | Adicionar `protocolId` |
| 4 | `HealthCampaign` | ✅ SIM (linha 2208) | Adicionar `protocolId` |
| 5 | `HealthProgram` | ❌ NÃO EXISTE | Criar model + adicionar `protocolId` |
| 6 | `HealthTransport` | ✅ SIM (linha 2166) | Adicionar `protocolId` |
| 7 | `HealthExam` | ❌ NÃO EXISTE | Criar model + adicionar `protocolId` |
| 8 | `HealthTransportRequest` | ❌ NÃO EXISTE | Criar model + adicionar `protocolId` |
| 9 | `Vaccination` | ✅ SIM (linha 1492) | Adicionar `protocolId` |
| 10 | `Patient` | ❌ NÃO EXISTE | Criar model + adicionar `protocolId` |
| 11 | `CommunityHealthAgent` | ❌ NÃO EXISTE | Criar model + adicionar `protocolId` |

---

## 🎯 PLANO DE AÇÃO (Seguindo o PLANO)

### **DECISÃO:**

Conforme o PLANO_IMPLEMENTACAO_SIMPLIFICACAO.md define esses models, vou:

1. ✅ **Criar os 5 models faltantes** exatamente como o PLANO especifica
2. ✅ **Adicionar `protocolId`** nos 6 models existentes
3. ✅ **Adicionar relações** no ProtocolSimplified

### **Models a CRIAR (5):**

```prisma
// 1. HealthProgram (Programas de Saúde)
model HealthProgram {
  id          String               @id @default(cuid())
  tenantId    String
  protocolId  String?
  name        String
  description String
  programType String
  startDate   DateTime
  endDate     DateTime?
  coordinator String
  status      String               @default("ACTIVE")
  createdAt   DateTime             @default(now())
  updatedAt   DateTime             @updatedAt
  protocol    ProtocolSimplified?  @relation("HealthProgramProtocol", fields: [protocolId], references: [id])
  tenant      Tenant               @relation(fields: [tenantId], references: [id])

  @@map("health_programs")
}

// 2. HealthExam (Exames)
model HealthExam {
  id           String               @id @default(cuid())
  tenantId     String
  protocolId   String?
  patientName  String
  patientCpf   String
  examType     String
  requestDate  DateTime             @default(now())
  scheduledDate DateTime?
  status       String               @default("REQUESTED")
  observations String?
  createdAt    DateTime             @default(now())
  updatedAt    DateTime             @updatedAt
  protocol     ProtocolSimplified?  @relation("HealthExamProtocol", fields: [protocolId], references: [id])
  tenant       Tenant               @relation(fields: [tenantId], references: [id])

  @@map("health_exams")
}

// 3. HealthTransportRequest (Transporte de Pacientes)
model HealthTransportRequest {
  id              String               @id @default(cuid())
  tenantId        String
  protocolId      String?
  patientName     String
  patientCpf      String
  origin          String
  destination     String
  requestDate     DateTime             @default(now())
  scheduledDate   DateTime?
  transportType   String
  urgencyLevel    String
  status          String               @default("REQUESTED")
  observations    String?
  createdAt       DateTime             @default(now())
  updatedAt       DateTime             @updatedAt
  protocol        ProtocolSimplified?  @relation("HealthTransportRequestProtocol", fields: [protocolId], references: [id])
  tenant          Tenant               @relation(fields: [tenantId], references: [id])

  @@map("health_transport_requests")
}

// 4. Patient (Cadastro de Paciente)
model Patient {
  id             String               @id @default(cuid())
  tenantId       String
  protocolId     String?
  name           String
  cpf            String
  birthDate      DateTime
  phone          String?
  email          String?
  address        String?
  bloodType      String?
  allergies      Json?
  chronicDiseases Json?
  susCardNumber  String?
  status         String               @default("ACTIVE")
  createdAt      DateTime             @default(now())
  updatedAt      DateTime             @updatedAt
  protocol       ProtocolSimplified?  @relation("PatientProtocol", fields: [protocolId], references: [id])
  tenant         Tenant               @relation(fields: [tenantId], references: [id])

  @@unique([tenantId, cpf])
  @@map("patients")
}

// 5. CommunityHealthAgent (Gestão ACS)
model CommunityHealthAgent {
  id             String               @id @default(cuid())
  tenantId       String
  protocolId     String?
  name           String
  cpf            String
  phone          String
  email          String?
  assignedArea   String
  familiesCount  Int                  @default(0)
  status         String               @default("ACTIVE")
  createdAt      DateTime             @default(now())
  updatedAt      DateTime             @updatedAt
  protocol       ProtocolSimplified?  @relation("CommunityHealthAgentProtocol", fields: [protocolId], references: [id])
  tenant         Tenant               @relation(fields: [tenantId], references: [id])

  @@unique([tenantId, cpf])
  @@map("community_health_agents")
}
```

### **Models a ATUALIZAR (6):**

Adicionar `protocolId` e relação em:
1. HealthAttendance
2. HealthAppointment
3. MedicationDispense
4. HealthCampaign
5. HealthTransport
6. Vaccination

---

## ⚠️ IMPORTANTE

O PLANO é a fonte da verdade. Todos os 11 models listados no PLANO devem existir no schema, mesmo que isso signifique criar novos models.

**Próximo passo:** Implementar exatamente como o PLANO define.

Aguardando confirmação para criar os 5 models faltantes e adicionar `protocolId` nos 6 existentes.
