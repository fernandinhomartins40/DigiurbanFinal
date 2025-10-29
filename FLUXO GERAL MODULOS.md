# FLUXO GERAL DOS MÓDULOS

## Visão Geral

Os **MÓDULOS** são os painéis especializados de cada secretaria. Cada módulo gerencia suas próprias entidades e tipos de solicitações.

---

## Fluxo - Como os Módulos Funcionam

```
CIDADÃO SOLICITA SERVIÇO
   ↓
SERVIÇO TEM moduleType DEFINIDO
(ex: moduleType = "education")
   ↓
MODULE HANDLER DETECTA
   ↓
ROTEIA PARA O MÓDULO CORRETO
   ↓
   └────────────────────────────────────────────────────────┐
                                                            │
                                                            ↓
                                              HANDLER DO MÓDULO EXECUTA
                                                            ↓
                            ┌───────────────────────────────┴───────────────────────────────┐
                            │                                                               │
                            ↓                                                               ↓
                  ┌──────────────────┐                                          ┌──────────────────┐
                  │  CRIA PROTOCOL   │                                          │ CRIA ENTIDADE    │
                  │                  │                                          │                  │
                  │ - number         │                                          │ - Específica do  │
                  │ - status         │                                          │   módulo         │
                  │ - serviceId      │                                          │ - protocol (link)│
                  │ - citizenId      │                                          │ - dados próprios │
                  └──────────────────┘                                          └──────────────────┘
                            │                                                               │
                            └───────────────────────────────┬───────────────────────────────┘
                                                            ↓
                                              SERVIDOR ACESSA PAINEL DO MÓDULO
                                                            ↓
                                              VÊ APENAS DADOS DO SEU MÓDULO
                                                            ↓
                                              PROCESSA E ATUALIZA
```

---

## 🎓 Módulo: EDUCAÇÃO

```
MÓDULO DE EDUCAÇÃO (education)
   ↓
TIPOS DE SERVIÇOS:
   ↓
   ├── Matrícula Escolar → StudentEnrollment
   ├── Transporte Escolar → SchoolTransport
   └── Outros → StudentAttendance (genérico)

FLUXO:
   ↓
CIDADÃO SOLICITA "Matrícula Escolar"
   ↓
MODULE HANDLER
   ↓
handleEducation()
   ↓
┌────────────────────────────────────────────────────┐
│  CRIA StudentEnrollment:                           │
│                                                    │
│  - protocol: "PMSP-2025-000123"                    │
│  - studentName: "João Silva"                       │
│  - birthDate: "2015-05-10"                         │
│  - parentName: "Maria Silva"                       │
│  - parentCpf: "123.456.789-00"                     │
│  - desiredGrade: "1º Ano"                          │
│  - desiredShift: "MANHÃ"                           │
│  - hasSpecialNeeds: false                          │
│  - status: "PENDING"                               │
│  - enrollmentYear: 2025                            │
│                                                    │
└────────────────────────────────────────────────────┘
   ↓
SERVIDOR ACESSA PAINEL DE MATRÍCULAS
   ↓
┌────────────────────────────────────────────────────┐
│  AÇÕES DISPONÍVEIS:                                │
│                                                    │
│  ✓ Aprovar Matrícula                               │
│  ✓ Definir Escola                                  │
│  ✓ Definir Turma/Turno                             │
│  ✓ Solicitar Documentos Adicionais                 │
│  ✓ Rejeitar com Motivo                             │
│                                                    │
└────────────────────────────────────────────────────┘
   ↓
STATUS ATUALIZADO
   ↓
CIDADÃO NOTIFICADO
```

---

## 🏥 Módulo: SAÚDE

```
MÓDULO DE SAÚDE (health)
   ↓
TIPOS DE SERVIÇOS:
   ↓
   ├── Consulta Médica → HealthAppointment
   ├── Solicitação de Medicamento → MedicineRequest
   └── Outros → HealthAttendance (genérico)

FLUXO:
   ↓
CIDADÃO SOLICITA "Consulta Cardiologia"
   ↓
MODULE HANDLER
   ↓
handleHealth()
   ↓
┌────────────────────────────────────────────────────┐
│  CRIA HealthAppointment:                           │
│                                                    │
│  - protocol: "PMSP-2025-000124"                    │
│  - patientName: "Carlos Santos"                    │
│  - patientCpf: "987.654.321-00"                    │
│  - specialty: "Cardiologia"                        │
│  - preferredDate: "2025-02-15"                     │
│  - preferredShift: "MANHÃ"                         │
│  - symptoms: "Dor no peito"                        │
│  - urgency: "HIGH"                                 │
│  - status: "PENDING"                               │
│                                                    │
└────────────────────────────────────────────────────┘
   ↓
SERVIDOR ACESSA PAINEL DE CONSULTAS
   ↓
┌────────────────────────────────────────────────────┐
│  AÇÕES DISPONÍVEIS:                                │
│                                                    │
│  ✓ Agendar Consulta                                │
│  ✓ Definir Médico/Unidade                          │
│  ✓ Definir Data/Hora Final                         │
│  ✓ Remarcar                                        │
│  ✓ Cancelar com Motivo                             │
│                                                    │
└────────────────────────────────────────────────────┘
   ↓
STATUS ATUALIZADO
   ↓
CIDADÃO NOTIFICADO
```

---

## 🏠 Módulo: HABITAÇÃO

```
MÓDULO DE HABITAÇÃO (housing)
   ↓
TIPOS DE SERVIÇOS:
   ↓
   ├── MCMV → HousingApplication
   ├── Terreno → LotApplication
   ├── Regularização → RegularizationRequest
   ├── Aluguel Social → HousingAid
   └── Outros → HousingAttendance (genérico)

FLUXO:
   ↓
CIDADÃO SOLICITA "MCMV - Minha Casa Minha Vida"
   ↓
MODULE HANDLER
   ↓
handleHousing() → HousingApplicationHandler
   ↓
┌────────────────────────────────────────────────────┐
│  CRIA HousingApplication:                          │
│                                                    │
│  - protocol: "PMSP-2025-000125"                    │
│  - applicantName: "Ana Souza"                      │
│  - applicantCpf: "111.222.333-44"                  │
│  - familyIncome: 2500.00                           │
│  - familyMembers: 4                                │
│  - hasDisabledMember: false                        │
│  - hasElderlyMember: true                          │
│  - currentHousingStatus: "ALUGUEL"                 │
│  - currentAddress: "Rua A, 100"                    │
│  - status: "PENDING"                               │
│                                                    │
└────────────────────────────────────────────────────┘
   ↓
SERVIDOR ACESSA PAINEL MCMV
   ↓
┌────────────────────────────────────────────────────┐
│  AÇÕES DISPONÍVEIS:                                │
│                                                    │
│  ✓ Calcular Pontuação                              │
│  ✓ Aprovar Inscrição                               │
│  ✓ Incluir em Lista de Espera                      │
│  ✓ Solicitar Documentos                            │
│  ✓ Agendar Visita Social                           │
│  ✓ Reprovar com Motivo                             │
│                                                    │
└────────────────────────────────────────────────────┘
   ↓
STATUS ATUALIZADO
   ↓
CIDADÃO NOTIFICADO
```

---

## 🚔 Módulo: SEGURANÇA

```
MÓDULO DE SEGURANÇA (security)
   ↓
TIPOS DE SERVIÇOS:
   ↓
   ├── Boletim de Ocorrência → PoliceReport
   ├── Solicitação de Ronda → PatrolRequest
   ├── Solicitação de Câmeras → CameraRequest
   ├── Denúncia Anônima → AnonymousTip
   └── Outros → SecurityAttendance (genérico)

FLUXO:
   ↓
CIDADÃO SOLICITA "Boletim de Ocorrência"
   ↓
MODULE HANDLER
   ↓
handleSecurity() → PoliceReportHandler
   ↓
┌────────────────────────────────────────────────────┐
│  CRIA PoliceReport:                                │
│                                                    │
│  - protocol: "PMSP-2025-000126"                    │
│  - reporterName: "Pedro Lima"                      │
│  - reporterCpf: "555.666.777-88"                   │
│  - incidentType: "FURTO"                           │
│  - incidentDate: "2025-01-20T14:00:00Z"            │
│  - location: "Rua B, 200"                          │
│  - latitude: -23.555                               │
│  - longitude: -46.639                              │
│  - description: "Furto de bicicleta"               │
│  - witnesses: ["Testemunha 1"]                     │
│  - status: "PENDING"                               │
│                                                    │
└────────────────────────────────────────────────────┘
   ↓
SERVIDOR ACESSA PAINEL DE OCORRÊNCIAS
   ↓
┌────────────────────────────────────────────────────┐
│  AÇÕES DISPONÍVEIS:                                │
│                                                    │
│  ✓ Registrar Boletim Oficial                       │
│  ✓ Atribuir a Delegacia                            │
│  ✓ Agendar Investigação                            │
│  ✓ Solicitar Mais Informações                      │
│  ✓ Arquivar Caso                                   │
│                                                    │
└────────────────────────────────────────────────────┘
   ↓
STATUS ATUALIZADO
   ↓
CIDADÃO NOTIFICADO
```

---

## 🏗️ Módulo: PLANEJAMENTO URBANO

```
MÓDULO DE PLANEJAMENTO URBANO (urban_planning)
   ↓
TIPOS DE SERVIÇOS:
   ↓
   ├── Alvará de Construção → BuildingPermit
   ├── Certidão → Certificate
   ├── Numeração de Imóvel → PropertyNumbering
   ├── Parcelamento de Solo → LotSubdivision
   └── Outros → UrbanPlanningAttendance (genérico)

FLUXO:
   ↓
CIDADÃO SOLICITA "Alvará de Construção"
   ↓
MODULE HANDLER
   ↓
handleUrbanPlanning() → BuildingPermitHandler
   ↓
┌────────────────────────────────────────────────────┐
│  CRIA BuildingPermit:                              │
│                                                    │
│  - protocol: "PMSP-2025-000127"                    │
│  - applicantName: "Construtora XYZ"                │
│  - applicantCnpj: "12.345.678/0001-99"             │
│  - propertyAddress: "Av. Principal, 500"           │
│  - constructionType: "RESIDENCIAL"                 │
│  - totalArea: 250.50                               │
│  - floors: 2                                       │
│  - projectDescription: "Casa térrea + sobrado"     │
│  - status: "PENDING"                               │
│                                                    │
└────────────────────────────────────────────────────┘
   ↓
SERVIDOR ACESSA PAINEL DE ALVARÁS
   ↓
┌────────────────────────────────────────────────────┐
│  AÇÕES DISPONÍVEIS:                                │
│                                                    │
│  ✓ Analisar Projeto                                │
│  ✓ Validar Documentação                            │
│  ✓ Solicitar Correções                             │
│  ✓ Agendar Vistoria                                │
│  ✓ Aprovar e Emitir Alvará                         │
│  ✓ Reprovar com Motivo                             │
│                                                    │
└────────────────────────────────────────────────────┘
   ↓
STATUS ATUALIZADO
   ↓
CIDADÃO NOTIFICADO
```

---

## 🌾 Módulo: AGRICULTURA

```
MÓDULO DE AGRICULTURA (agriculture)
   ↓
TIPOS DE SERVIÇOS:
   ↓
   ├── Assistência Técnica (ATER) → TechnicalAssistance
   ├── Distribuição de Sementes → SeedDistribution
   ├── Análise de Solo → SoilAnalysis
   ├── Feira do Produtor → FarmerMarket
   └── Outros → AgricultureAttendance (genérico)

FLUXO:
   ↓
CIDADÃO SOLICITA "Assistência Técnica Rural"
   ↓
MODULE HANDLER
   ↓
handleAgriculture() → TechnicalAssistanceHandler
   ↓
┌────────────────────────────────────────────────────┐
│  CRIA TechnicalAssistance:                         │
│                                                    │
│  - protocol: "PMSP-2025-000128"                    │
│  - producerName: "José Fazendeiro"                 │
│  - producerCpf: "999.888.777-66"                   │
│  - propertyName: "Sítio Boa Vista"                 │
│  - propertyArea: 15.5 (hectares)                   │
│  - activityType: "Horticultura"                    │
│  - requestType: "ATER"                             │
│  - description: "Preciso orientação para cultivo"  │
│  - status: "PENDING"                               │
│                                                    │
└────────────────────────────────────────────────────┘
   ↓
SERVIDOR ACESSA PAINEL ATER
   ↓
┌────────────────────────────────────────────────────┐
│  AÇÕES DISPONÍVEIS:                                │
│                                                    │
│  ✓ Atribuir Técnico Agrícola                       │
│  ✓ Agendar Visita Técnica                          │
│  ✓ Emitir Relatório de Diagnóstico                 │
│  ✓ Aprovar Assistência Continuada                  │
│  ✓ Registrar Atendimento                           │
│                                                    │
└────────────────────────────────────────────────────┘
   ↓
STATUS ATUALIZADO
   ↓
CIDADÃO NOTIFICADO
```

---

## 🚧 Módulo: OBRAS PÚBLICAS

```
MÓDULO DE OBRAS PÚBLICAS (public_works)
   ↓
TIPOS DE SERVIÇOS:
   ↓
   ├── Buraco na Via → InfrastructureProblem
   ├── Manutenção de Rua → StreetMaintenance
   ├── Acessibilidade → Accessibility
   ├── Sinalização → Signage
   └── Outros → PublicWorksAttendance (genérico)

FLUXO:
   ↓
CIDADÃO SOLICITA "Buraco na Rua"
   ↓
MODULE HANDLER
   ↓
handlePublicWorks() → InfrastructureProblemHandler
   ↓
┌────────────────────────────────────────────────────┐
│  CRIA InfrastructureProblem:                       │
│                                                    │
│  - protocol: "PMSP-2025-000129"                    │
│  - reporterName: "Cidadão X"                       │
│  - problemType: "POTHOLE"                          │
│  - location: "Rua das Flores, 300"                 │
│  - latitude: -23.560                               │
│  - longitude: -46.650                              │
│  - description: "Buraco grande na pista"           │
│  - severity: "HIGH"                                │
│  - photos: ["foto1.jpg", "foto2.jpg"]              │
│  - status: "PENDING"                               │
│                                                    │
└────────────────────────────────────────────────────┘
   ↓
SERVIDOR ACESSA PAINEL DE PROBLEMAS
   ↓
┌────────────────────────────────────────────────────┐
│  AÇÕES DISPONÍVEIS:                                │
│                                                    │
│  ✓ Classificar Urgência                            │
│  ✓ Atribuir Equipe de Obras                        │
│  ✓ Agendar Reparo                                  │
│  ✓ Registrar Início do Serviço                     │
│  ✓ Registrar Conclusão                             │
│  ✓ Anexar Foto do Antes/Depois                     │
│                                                    │
└────────────────────────────────────────────────────┘
   ↓
STATUS ATUALIZADO
   ↓
CIDADÃO NOTIFICADO
```

---

## 🧹 Módulo: SERVIÇOS PÚBLICOS

```
MÓDULO DE SERVIÇOS PÚBLICOS (public_services)
   ↓
TIPOS DE SERVIÇOS:
   ↓
   ├── Poda de Árvore → TreePruning
   ├── Retirada de Entulho → WasteRemoval
   ├── Controle de Pragas → PestControl
   ├── Limpeza de Terreno → Cleaning
   ├── Coleta de Lixo → GarbageCollection
   └── Outros → PublicServicesAttendance (genérico)

FLUXO:
   ↓
CIDADÃO SOLICITA "Poda de Árvore"
   ↓
MODULE HANDLER
   ↓
handlePublicServices() → TreePruningHandler
   ↓
┌────────────────────────────────────────────────────┐
│  CRIA TreePruning:                                 │
│                                                    │
│  - protocol: "PMSP-2025-000130"                    │
│  - requesterName: "Morador Y"                      │
│  - location: "Rua Verde, 50"                       │
│  - latitude: -23.565                               │
│  - longitude: -46.655                              │
│  - treeType: "Sibipiruna"                          │
│  - treeHeight: "15 metros"                         │
│  - reason: "Galhos em fiação elétrica"             │
│  - urgency: "HIGH"                                 │
│  - status: "PENDING"                               │
│                                                    │
└────────────────────────────────────────────────────┘
   ↓
SERVIDOR ACESSA PAINEL DE PODAS
   ↓
┌────────────────────────────────────────────────────┐
│  AÇÕES DISPONÍVEIS:                                │
│                                                    │
│  ✓ Agendar Vistoria Técnica                        │
│  ✓ Avaliar Necessidade de Poda                     │
│  ✓ Atribuir Equipe                                 │
│  ✓ Agendar Execução                                │
│  ✓ Registrar Conclusão                             │
│  ✓ Negar com Justificativa                         │
│                                                    │
└────────────────────────────────────────────────────┘
   ↓
STATUS ATUALIZADO
   ↓
CIDADÃO NOTIFICADO
```

---

## 🎭 Módulo: CULTURA

```
MÓDULO DE CULTURA (culture)
   ↓
TIPOS DE SERVIÇOS:
   ↓
   ├── Reserva de Espaço Cultural → CulturalSpace
   ├── Submissão de Projeto → CulturalProject
   ├── Inscrição em Evento → CulturalEvent
   ├── Inscrição em Oficina → CulturalWorkshop
   └── Outros → CulturalAttendance (genérico)

FLUXO:
   ↓
CIDADÃO SOLICITA "Reserva de Teatro Municipal"
   ↓
MODULE HANDLER
   ↓
handleCulture() → CulturalSpaceHandler
   ↓
┌────────────────────────────────────────────────────┐
│  CRIA CulturalSpace:                               │
│                                                    │
│  - protocol: "PMSP-2025-000131"                    │
│  - citizenName: "Grupo de Teatro XYZ"              │
│  - spaceType: "Teatro Municipal"                   │
│  - eventName: "Peça Teatral"                       │
│  - eventDate: "2025-03-15"                         │
│  - eventTime: "19:00"                              │
│  - expectedAudience: 200                           │
│  - eventDescription: "Apresentação teatral"        │
│  - status: "PENDING"                               │
│                                                    │
└────────────────────────────────────────────────────┘
   ↓
SERVIDOR ACESSA PAINEL DE ESPAÇOS
   ↓
┌────────────────────────────────────────────────────┐
│  AÇÕES DISPONÍVEIS:                                │
│                                                    │
│  ✓ Verificar Disponibilidade                       │
│  ✓ Aprovar Reserva                                 │
│  ✓ Enviar Contrato                                 │
│  ✓ Definir Taxa (se aplicável)                     │
│  ✓ Confirmar Evento                                │
│  ✓ Rejeitar com Motivo                             │
│                                                    │
└────────────────────────────────────────────────────┘
   ↓
STATUS ATUALIZADO
   ↓
CIDADÃO NOTIFICADO
```

---

## ⚽ Módulo: ESPORTES

```
MÓDULO DE ESPORTES (sports)
   ↓
TIPOS DE SERVIÇOS:
   ↓
   ├── Inscrição em Escolinha → SportsTeam
   ├── Cadastro de Atleta → Athlete
   ├── Inscrição em Campeonato → Competition
   └── Outros → SportsAttendance (genérico)

FLUXO:
   ↓
CIDADÃO SOLICITA "Escolinha de Futebol"
   ↓
MODULE HANDLER
   ↓
handleSports() → SportsTeamHandler
   ↓
┌────────────────────────────────────────────────────┐
│  CRIA SportsTeam:                                  │
│                                                    │
│  - protocol: "PMSP-2025-000132"                    │
│  - athleteName: "Lucas Silva"                      │
│  - athleteBirthDate: "2010-08-20"                  │
│  - parentName: "Carlos Silva"                      │
│  - sport: "Futebol"                                │
│  - preferredPosition: "Atacante"                   │
│  - experience: "Iniciante"                         │
│  - medicalClearance: true                          │
│  - status: "PENDING"                               │
│                                                    │
└────────────────────────────────────────────────────┘
   ↓
SERVIDOR ACESSA PAINEL DE ESCOLINHAS
   ↓
┌────────────────────────────────────────────────────┐
│  AÇÕES DISPONÍVEIS:                                │
│                                                    │
│  ✓ Verificar Vagas Disponíveis                     │
│  ✓ Aprovar Inscrição                               │
│  ✓ Definir Turma/Horário                           │
│  ✓ Agendar Avaliação                               │
│  ✓ Solicitar Documentos                            │
│  ✓ Rejeitar (sem vagas)                            │
│                                                    │
└────────────────────────────────────────────────────┘
   ↓
STATUS ATUALIZADO
   ↓
CIDADÃO NOTIFICADO
```

---

## 🗺️ Módulo: TURISMO

```
MÓDULO DE TURISMO (tourism)
   ↓
TIPOS DE SERVIÇOS:
   ↓
   ├── Cadastro de Atrativo Turístico → TouristAttraction
   ├── Cadastro de Comércio Local → LocalBusiness
   ├── Inscrição em Programa → TourismProgram
   └── Outros → TourismAttendance (genérico)

FLUXO:
   ↓
CIDADÃO SOLICITA "Cadastro de Pousada"
   ↓
MODULE HANDLER
   ↓
handleTourism() → LocalBusinessHandler
   ↓
┌────────────────────────────────────────────────────┐
│  CRIA LocalBusiness:                               │
│                                                    │
│  - protocol: "PMSP-2025-000133"                    │
│  - businessName: "Pousada Bela Vista"              │
│  - businessType: "HOSPEDAGEM"                      │
│  - ownerName: "José Turismo"                       │
│  - address: "Rua Turística, 100"                   │
│  - phone: "(11) 99999-9999"                        │
│  - email: "pousada@email.com"                      │
│  - capacity: "20 hóspedes"                         │
│  - amenities: ["Wi-Fi", "Café da Manhã"]           │
│  - status: "PENDING"                               │
│                                                    │
└────────────────────────────────────────────────────┘
   ↓
SERVIDOR ACESSA PAINEL DE CADASTROS
   ↓
┌────────────────────────────────────────────────────┐
│  AÇÕES DISPONÍVEIS:                                │
│                                                    │
│  ✓ Validar Documentação                            │
│  ✓ Agendar Vistoria                                │
│  ✓ Aprovar Cadastro                                │
│  ✓ Incluir no Guia Turístico                       │
│  ✓ Solicitar Correções                             │
│  ✓ Rejeitar com Motivo                             │
│                                                    │
└────────────────────────────────────────────────────┘
   ↓
STATUS ATUALIZADO
   ↓
CIDADÃO NOTIFICADO
```

---

## ⚙️ Módulo: CUSTOM (Módulos Customizados)

```
MÓDULO CUSTOM (custom)
   ↓
PARA SERVIÇOS SEM MÓDULO ESPECÍFICO
   ↓
CRIA TABELAS DINÂMICAS
   ↓
   └────────────────────────────────────────────────────────┐
                                                            │
                                                            ↓
                                              SISTEMA DETECTA moduleType = "custom"
                                                            ↓
                                              handleCustomModule()
                                                            ↓
                            ┌───────────────────────────────┴───────────────────────────────┐
                            │                                                               │
                            ↓                                                               ↓
                  ┌──────────────────┐                                          ┌──────────────────┐
                  │ CustomDataTable  │                                          │ CustomDataRecord │
                  │                  │                                          │                  │
                  │ - tableName      │                                          │ - tableId        │
                  │ - displayName    │                                          │ - protocol       │
                  │ - moduleType     │                                          │ - serviceId      │
                  │ - schema (JSON)  │                                          │ - data (JSON)    │
                  │ - fields (JSON)  │                                          │                  │
                  └──────────────────┘                                          └──────────────────┘
                            │                                                               │
                            └───────────────────────────────┬───────────────────────────────┘
                                                            ↓
                                              PAINEL GENÉRICO CRIADO AUTOMATICAMENTE
                                                            ↓
                                              SERVIDOR GERENCIA PELO PAINEL DINÂMICO
```

---

## Resumo: Todos os Módulos

```
┌────────────────────────────────────────────────────────────────────────┐
│                         13 MÓDULOS ESPECIALIZADOS                      │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  1. 🎓 EDUCATION          6 entidades (StudentEnrollment, etc)         │
│                                                                        │
│  2. 🏥 HEALTH             3 entidades (HealthAppointment, etc)         │
│                                                                        │
│  3. 🏠 HOUSING            5 handlers (HousingApplication, etc)         │
│                                                                        │
│  4. 👨‍👩‍👧‍👦 SOCIAL            2 entidades (SocialAssistance, etc)         │
│                                                                        │
│  5. 🎭 CULTURE            4 handlers (CulturalSpace, etc)              │
│                                                                        │
│  6. ⚽ SPORTS             3 handlers (SportsTeam, Athlete, etc)        │
│                                                                        │
│  7. 🌳 ENVIRONMENT        4 handlers (EnvironmentalLicense, etc)       │
│                                                                        │
│  8. 🚔 SECURITY           4 handlers (PoliceReport, PatrolReq, etc)    │
│                                                                        │
│  9. 🏗️ URBAN_PLANNING     4 handlers (BuildingPermit, Certificate)     │
│                                                                        │
│  10. 🌾 AGRICULTURE       4 handlers (TechnicalAssist, Seeds, etc)     │
│                                                                        │
│  11. 🗺️ TOURISM           3 handlers (TouristAttraction, Business)     │
│                                                                        │
│  12. 🚧 PUBLIC_WORKS      4 handlers (Infrastructure, Street, etc)     │
│                                                                        │
│  13. 🧹 PUBLIC_SERVICES   5 handlers (TreePruning, Waste, etc)         │
│                                                                        │
│  14. ⚙️ CUSTOM            Tabelas dinâmicas (genérico)                 │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Arquitetura de Roteamento

```
                            CIDADÃO SOLICITA
                                   ↓
                            SERVICE (Catálogo)
                         { moduleType: "education" }
                                   ↓
                    ┌──────────────────────────────┐
                    │      MODULE HANDLER          │
                    │  (Detecta e Roteia)          │
                    └──────────────┬───────────────┘
                                   ↓
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
         ↓                         ↓                         ↓
    education                   health                   housing
    handleEducation()          handleHealth()          handleHousing()
         │                         │                         │
         ↓                         ↓                         ↓
    Cria Entidade              Cria Entidade            Cria Entidade
    Específica                 Específica               Específica
         │                         │                         │
         └─────────────────────────┼─────────────────────────┘
                                   ↓
                         Protocol + Entidade Criados
                                   ↓
                         Servidor Gerencia no Painel
```

---

## Vínculo Protocol ↔ Entidade

```
┌─────────────────────────┐          ┌──────────────────────────────┐
│      PROTOCOL           │          │   ENTIDADE ESPECIALIZADA     │
│                         │          │                              │
│  id: prt_123            │          │  id: ent_456                 │
│  number: PMSP-2025-0001 │◄─────────┤  protocol: "PMSP-2025-0001"  │
│  status: VINCULADO      │  Vínculo │  studentName: "João"         │
│  serviceId: srv_mat     │          │  status: PENDING             │
│  citizenId: ctz_789     │          │  ... (campos específicos)    │
│                         │          │                              │
└─────────────────────────┘          └──────────────────────────────┘
         │                                        │
         │                                        │
         ↓                                        ↓
    Visão Geral                             Visão Detalhada
    (painel geral)                          (painel do módulo)
```

---

## Fluxo Completo Resumido

```
1. SERVIÇO TEM moduleType
   ↓
2. CIDADÃO SOLICITA
   ↓
3. MODULE HANDLER DETECTA
   ↓
4. ROTEIA PARA HANDLER CORRETO
   ↓
5. HANDLER CRIA ENTIDADE ESPECÍFICA
   ↓
6. VÍNCULO VIA protocol.number
   ↓
7. SERVIDOR ACESSA PAINEL DO MÓDULO
   ↓
8. VÊ APENAS DADOS DO SEU MÓDULO
   ↓
9. PROCESSA/APROVA/REJEITA
   ↓
10. ATUALIZA ENTIDADE + PROTOCOL
   ↓
11. CIDADÃO NOTIFICADO
```

---

**Documento:** Fluxo Geral dos Módulos - DigiUrban
**Data:** 28/10/2025
**Versão:** 1.0
