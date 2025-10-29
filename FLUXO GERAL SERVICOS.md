# FLUXO GERAL DOS SERVIÇOS

## Visão Geral do Sistema

O sistema de serviços é o CATÁLOGO que conecta cidadãos às secretarias através de solicitações que viram protocolos.

---

## Fluxo - Gestor/Manager (Criar Serviços)

```
GESTOR/MANAGER
   ↓
PAINEL ADMINISTRATIVO
   ↓
ACESSA CATÁLOGO DE SERVIÇOS
   ↓
CRIA NOVO SERVIÇO
(define: nome, departamento, módulo, features)
   ↓
   └────────────────────────────────────────────────────────┐
                                                            │
                                                            │
                                                            ↓
                                                  CONFIGURAÇÃO DO SERVIÇO
                                                            ↓
                            ┌───────────────────────────────┴───────────────────────────────┐
                            │                                                               │
                            ↓                                                               ↓
                  ┌──────────────────┐                                          ┌──────────────────┐
                  │  DADOS BÁSICOS   │                                          │  FEATURE FLAGS   │
                  │                  │                                          │                  │
                  │ - Nome           │                                          │ - hasCustomForm  │
                  │ - Descrição      │                                          │ - hasLocation    │
                  │ - Departamento   │                                          │ - hasScheduling  │
                  │ - Categoria      │                                          │ - hasSurvey      │
                  │ - Prioridade     │                                          │ - hasWorkflow    │
                  │ - Ícone/Cor      │                                          │ - hasCustomFields│
                  └──────────────────┘                                          └──────────────────┘
                            │                                                               │
                            └───────────────────────────────┬───────────────────────────────┘
                                                            ↓
                                                  ROTEAMENTO DE MÓDULO
                                                            ↓
                            ┌───────────────────────────────┴───────────────────────────────┐
                            │                                                               │
                            ↓                                                               ↓
                  ┌──────────────────┐                                          ┌──────────────────┐
                  │  moduleType      │                                          │  moduleEntity    │
                  │                  │                                          │                  │
                  │ - education      │                                          │ - StudentEnrollment
                  │ - health         │                                          │ - HealthAppointment
                  │ - housing        │                                          │ - HousingApplication
                  │ - security       │                                          │ - PoliceReport
                  │ - culture        │                                          │ - CulturalEvent
                  │ - sports         │                                          │ - SportsTeam
                  │ - agriculture    │                                          │ - TechnicalAssist
                  │ - public_works   │                                          │ - InfrastructureProblem
                  │ - tourism        │                                          │ - TouristAttraction
                  └──────────────────┘                                          └──────────────────┘
                            │                                                               │
                            └───────────────────────────────┬───────────────────────────────┘
                                                            ↓
                                                  SERVIÇO ATIVO NO CATÁLOGO
                                                            ↓
                                                  DISPONÍVEL PARA CIDADÃOS
```

---

## Fluxo - Cidadão (Solicitar Serviços)

```
CIDADÃO
   ↓
CATÁLOGO DE SERVIÇOS
(Portal do Cidadão)
   ↓
   └──────────────────────────────────────────────────────────┐
                                                              │
                                                              ↓
                                                    BUSCA/FILTRA SERVIÇOS
                                                              │
                    ┌─────────────────────────────────────────┼─────────────────────────────────────────┐
                    │                                         │                                         │
                    ↓                                         ↓                                         ↓
          ┌──────────────────┐                      ┌──────────────────┐                    ┌──────────────────┐
          │  POR CATEGORIA   │                      │   POR BUSCA      │                    │   POPULARES      │
          │                  │                      │                  │                    │                  │
          │ - Educação       │                      │ - "matrícula"    │                    │ - Mais Solicitados│
          │ - Saúde          │                      │ - "alvará"       │                    │ - Mais Acessados  │
          │ - Habitação      │                      │ - "consulta"     │                    │                  │
          │ - Segurança      │                      │                  │                    │                  │
          └──────────────────┘                      └──────────────────┘                    └──────────────────┘
                    │                                         │                                         │
                    └─────────────────────────────────────────┼─────────────────────────────────────────┘
                                                              ↓
                                                    SELECIONA SERVIÇO
                                                              ↓
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                         DETALHES DO SERVIÇO                                                  │
│                                                                                                              │
│  Nome: "Matrícula Escolar 2025"                                                                             │
│  Descrição: Solicitação de vaga em escola municipal                                                         │
│  Departamento: Secretaria de Educação                                                                       │
│  Prazo Estimado: 15 dias                                                                                    │
│  Documentos Necessários: [RG, Comprovante de Residência]                                                    │
│                                                                                                              │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                              ↓
                                                    CLICA "SOLICITAR"
                                                              ↓
                                      FORMULÁRIO DINÂMICO (baseado nas features)
                                                              ↓
                    ┌─────────────────────────────────────────┼─────────────────────────────────────────┐
                    │                                         │                                         │
                    ↓                                         ↓                                         ↓
        ┌────────────────────┐                    ┌────────────────────┐                  ┌────────────────────┐
        │  FORMULÁRIO BASE   │                    │   GEOLOCALIZAÇÃO   │                  │   AGENDAMENTO      │
        │                    │                    │  (se hasLocation)  │                  │ (se hasScheduling) │
        │ - Descrição        │                    │                    │                  │                    │
        │ - Campos Custom    │                    │ - Clica no Mapa    │                  │ - Escolhe Data     │
        │ - Anexos           │                    │ - Lat/Lng          │                  │ - Escolhe Horário  │
        │                    │                    │ - Endereço         │                  │ - Confirma Slot    │
        └────────────────────┘                    └────────────────────┘                  └────────────────────┘
                    │                                         │                                         │
                    └─────────────────────────────────────────┼─────────────────────────────────────────┘
                                                              ↓
                                                    CONFIRMA SOLICITAÇÃO
                                                              ↓
                                                    ═══════════════════
                                                    ║ MODULE HANDLER  ║
                                                    ═══════════════════
                                                              ↓
                                            Detecta moduleType do Serviço
                                                              ↓
                    ┌─────────────────────────────────────────┴─────────────────────────────────────────┐
                    │                                                                                   │
                    │   if (moduleType == "education")  → Criar StudentEnrollment                       │
                    │   if (moduleType == "health")     → Criar HealthAppointment                       │
                    │   if (moduleType == "housing")    → Criar HousingApplication                      │
                    │   if (moduleType == "security")   → Criar PoliceReport                            │
                    │   if (moduleType == "agriculture")→ Criar TechnicalAssistance                     │
                    │   ... (13+ módulos)                                                               │
                    │                                                                                   │
                    └───────────────────────────────────────────────────────────────────────────────────┘
                                                              ↓
                                            ┌─────────────────────────────────┐
                                            │  RESULTADO DA CRIAÇÃO:          │
                                            │                                 │
                                            │  1. Protocol criado             │
                                            │     - number: PMSP-2025-000123  │
                                            │     - status: VINCULADO         │
                                            │     - serviceId: srv_xyz        │
                                            │                                 │
                                            │  2. Entidade Especializada      │
                                            │     - StudentEnrollment         │
                                            │     - protocol: PMSP-2025-000123│
                                            │     - studentName: João Silva   │
                                            │     - status: PENDING           │
                                            │                                 │
                                            └─────────────────────────────────┘
                                                              ↓
                                                    NOTIFICAÇÃO ENVIADA
                                                              ↓
                                        "Protocolo PMSP-2025-000123 criado com sucesso!"
```

---

## Fluxo - Servidor (Processar Solicitações)

```
SERVIDOR (funcionário do departamento)
   ↓
PAINEL DO DEPARTAMENTO
   ↓
ACESSA MÓDULO ESPECIALIZADO
(ex: Painel de Matrículas Escolares)
   ↓
   └────────────────────────────────────────────────────────┐
                                                            │
                                                            ↓
                                              VÊ LISTA DE SOLICITAÇÕES
                                                            │
                            ┌───────────────────────────────┴───────────────────────────────┐
                            │                                                               │
                            ↓                                                               ↓
                  ┌──────────────────┐                                          ┌──────────────────┐
                  │  PENDENTES       │                                          │  EM ANÁLISE      │
                  │                  │                                          │                  │
                  │ - 25 solicitações│                                          │ - 10 solicitações│
                  └──────────────────┘                                          └──────────────────┘
                            │                                                               │
                            └───────────────────────────────┬───────────────────────────────┘
                                                            ↓
                                              SELECIONA UMA SOLICITAÇÃO
                                                            ↓
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    DETALHES DA SOLICITAÇÃO                                                   │
│                                                                                                              │
│  Protocolo: PMSP-2025-000123                                                                                │
│  Cidadão: Maria Santos                                                                                      │
│  Serviço: Matrícula Escolar 2025                                                                            │
│  Status: PENDING                                                                                            │
│                                                                                                              │
│  DADOS DA ENTIDADE:                                                                                         │
│  - Nome do Aluno: João Santos                                                                               │
│  - Data de Nascimento: 10/05/2015                                                                           │
│  - Série Desejada: 1º Ano                                                                                   │
│  - Turno: Manhã                                                                                             │
│  - Necessidades Especiais: Não                                                                              │
│                                                                                                              │
│  DOCUMENTOS ANEXADOS:                                                                                       │
│  - RG do Aluno ✓                                                                                            │
│  - Comprovante de Residência ✓                                                                              │
│                                                                                                              │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                            ↓
                                              AÇÕES DO SERVIDOR
                                                            ↓
                    ┌─────────────────────────────────────────┼─────────────────────────────────────────┐
                    │                                         │                                         │
                    ↓                                         ↓                                         ↓
          ┌──────────────────┐                      ┌──────────────────┐                    ┌──────────────────┐
          │  APROVAR         │                      │  SOLICITAR DOCS  │                    │  REJEITAR        │
          │                  │                      │                  │                    │                  │
          │ - Define Escola  │                      │ - Lista docs     │                    │ - Motivo         │
          │ - Confirma Turma │                      │ - Prazo          │                    │ - Observação     │
          │ - Gera Matrícula │                      │                  │                    │                  │
          └──────────────────┘                      └──────────────────┘                    └──────────────────┘
                    │                                         │                                         │
                    └─────────────────────────────────────────┼─────────────────────────────────────────┘
                                                              ↓
                                              ATUALIZA ENTIDADE + PROTOCOL
                                                              ↓
                                            ┌─────────────────────────────────┐
                                            │  ENTIDADE:                      │
                                            │  status: APPROVED/REJECTED      │
                                            │  assignedSchool: "EMEF Central" │
                                            │  approvedBy: servidor_id        │
                                            │                                 │
                                            │  PROTOCOL:                      │
                                            │  status: PROGRESSO/CONCLUIDO    │
                                            │  ProtocolHistory: ação criada   │
                                            │                                 │
                                            └─────────────────────────────────┘
                                                              ↓
                                              NOTIFICAÇÃO ENVIADA AO CIDADÃO
                                                              ↓
                                        "Sua matrícula foi aprovada! Escola: EMEF Central"
```

---

## Arquitetura Simplificada

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                            CAMADA DE CATÁLOGO                               │
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐            │
│   │   CIDADÃO    │      │   SERVIDOR   │      │   GESTOR     │            │
│   │              │      │              │      │              │            │
│   │ - Ver Serv.  │      │ - Processar  │      │ - Criar Serv.│            │
│   │ - Solicitar  │      │ - Aprovar    │      │ - Configurar │            │
│   └──────────────┘      └──────────────┘      └──────────────┘            │
│                                                                             │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                              SERVICE (Catálogo)                             │
│                                                                             │
│   - name: "Matrícula Escolar 2025"                                          │
│   - departmentId: "dept_educacao"                                           │
│   - moduleType: "education"                                                 │
│   - moduleEntity: "StudentEnrollment"                                       │
│   - hasCustomForm: true                                                     │
│   - hasLocation: false                                                      │
│   - hasScheduling: true                                                     │
│                                                                             │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                           MODULE HANDLER (Roteador)                         │
│                                                                             │
│   Detecta moduleType → Roteia para handler correto                          │
│                                                                             │
│   ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐          │
│   │ education  │  │  health    │  │  housing   │  │  security  │          │
│   └────────────┘  └────────────┘  └────────────┘  └────────────┘          │
│   ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐          │
│   │ culture    │  │  sports    │  │ agriculture│  │  tourism   │          │
│   └────────────┘  └────────────┘  └────────────┘  └────────────┘          │
│   ┌────────────┐  ┌────────────┐  ┌────────────┐                          │
│   │public_works│  │   urban    │  │   custom   │                          │
│   └────────────┘  └────────────┘  └────────────┘                          │
│                                                                             │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                         PROTOCOL + ENTIDADE ESPECIALIZADA                   │
│                                                                             │
│   ┌─────────────────────┐         ┌──────────────────────────┐             │
│   │     PROTOCOL        │         │   ENTIDADE ESPECÍFICA    │             │
│   │                     │         │                          │             │
│   │ - number            │◄────────┤ - protocol (number)      │             │
│   │ - status            │  Vínculo│ - dados específicos      │             │
│   │ - serviceId         │         │ - status                 │             │
│   │ - citizenId         │         │                          │             │
│   └─────────────────────┘         └──────────────────────────┘             │
│                                                                             │
│   Exemplos de Entidades:                                                    │
│   - StudentEnrollment (Educação)                                            │
│   - HealthAppointment (Saúde)                                               │
│   - HousingApplication (Habitação)                                          │
│   - PoliceReport (Segurança)                                                │
│   - BuildingPermit (Planejamento Urbano)                                    │
│   - TechnicalAssistance (Agricultura)                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Módulos Disponíveis

```
┌──────────────────────────────────────────────────────────────────┐
│                        MÓDULOS DO SISTEMA                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🎓 EDUCATION          → StudentEnrollment, SchoolTransport      │
│  🏥 HEALTH             → HealthAppointment, MedicineRequest      │
│  🏠 HOUSING            → HousingApplication, Regularization      │
│  👨‍👩‍👧‍👦 SOCIAL            → SocialAssistance, BenefitRequest        │
│  🎭 CULTURE            → CulturalEvent, CulturalSpace            │
│  ⚽ SPORTS             → SportsTeam, Athlete, Competition        │
│  🌳 ENVIRONMENT        → EnvironmentalLicense, TreeAuth          │
│  🚔 SECURITY           → PoliceReport, PatrolRequest, Camera     │
│  🏗️ URBAN_PLANNING     → BuildingPermit, Certificate, LotSubdiv │
│  🌾 AGRICULTURE        → TechnicalAssist, SeedDistribution       │
│  🗺️ TOURISM            → TouristAttraction, LocalBusiness        │
│  🚧 PUBLIC_WORKS       → InfrastructureProblem, StreetMaint      │
│  🧹 PUBLIC_SERVICES    → TreePruning, WasteRemoval, Cleaning     │
│  ⚙️ CUSTOM             → CustomDataRecord (tabelas dinâmicas)    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Ciclo de Vida Completo

```
1. GESTOR CRIA SERVIÇO
   ↓
2. SERVIÇO FICA DISPONÍVEL NO CATÁLOGO
   ↓
3. CIDADÃO BUSCA E SOLICITA
   ↓
4. FORMULÁRIO DINÂMICO (baseado em features)
   ↓
5. MODULE HANDLER ROTEIA
   ↓
6. CRIA PROTOCOL + ENTIDADE ESPECIALIZADA
   ↓
7. SERVIDOR ACESSA PAINEL DO MÓDULO
   ↓
8. ANALISA E PROCESSA
   ↓
9. ATUALIZA STATUS (Entidade + Protocol)
   ↓
10. CIDADÃO RECEBE NOTIFICAÇÃO
```

---

## Resumo Visual

```
                    ┌─────────────┐
                    │   SERVICE   │
                    │  (Catálogo) │
                    └──────┬──────┘
                           │
                ┌──────────┼──────────┐
                │          │          │
                ↓          ↓          ↓
           ┌─────────┐ ┌─────────┐ ┌─────────┐
           │ CIDADÃO │ │SERVIDOR │ │ GESTOR  │
           │ Solicita│ │Processa │ │ Cria    │
           └────┬────┘ └────┬────┘ └────┬────┘
                │           │           │
                ↓           ↓           ↓
           ┌─────────────────────────────────┐
           │      MODULE HANDLER             │
           │  (Roteia para módulo correto)   │
           └────────────┬────────────────────┘
                        │
                        ↓
           ┌─────────────────────────────────┐
           │  PROTOCOL + ENTIDADE            │
           │  - Vínculo via protocol.number  │
           │  - Dados específicos do módulo  │
           └─────────────────────────────────┘
```

---

**Documento:** Fluxo Geral dos Serviços - DigiUrban
**Data:** 28/10/2025
**Versão:** 1.0 (Simplificada)
