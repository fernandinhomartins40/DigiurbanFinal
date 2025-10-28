# 🏗️ ARQUITETURA: SERVIÇOS PADRÕES + MÓDULOS ESPECIALIZADOS

## 📋 Sumário Executivo

Este documento descreve a arquitetura completa do sistema DigiUrban para integração entre:
- **Catálogo de Serviços** (150+ serviços padrões)
- **Motor de Protocolos** (rastreamento unificado)
- **Módulos Especializados** (13 secretarias + customizados)

---

## 🎯 Visão Geral

### Conceito Central

O DigiUrban funciona como um **ecossistema integrado** onde três sistemas colaboram:

```
┌─────────────────────────────────────────────────────────────┐
│           CIDADÃO SOLICITA VIA PORTAL                       │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  CAMADA 1: CATÁLOGO DE SERVIÇOS                            │
│  • 150+ Serviços Padrões (pré-configurados)                │
│  • Serviços Customizados (criados pelo município)          │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  CAMADA 2: MOTOR DE PROTOCOLOS                             │
│  • Numeração centralizada (PREFIX-YYYY-NNNNNN)             │
│  • Rastreamento de status                                   │
│  • Histórico e notificações                                 │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  CAMADA 3: MÓDULOS ESPECIALIZADOS                          │
│  • 13 Módulos Padrões (uma por secretaria)                 │
│  • Módulos Customizados (tabelas flexíveis)                │
│  • Persistência automática de dados                         │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│           ADMIN GERENCIA EM PAINÉIS ESPECIALIZADOS         │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 CAMADA 1: CATÁLOGO DE SERVIÇOS

### A) Serviços Padrões (150+ Templates)

Biblioteca de serviços prontos para ativar, organizados por secretaria.

#### Estrutura de um Template

```typescript
interface ServiceTemplate {
  // Identificação
  code: string;              // "EDU_MATRICULA_001"
  name: string;              // "Matrícula Escolar"
  category: string;          // "Educação"
  description: string;
  icon: string;

  // Configuração padrão
  defaultFields: Field[];    // Campos do formulário
  requiredDocs: Document[];  // Documentos necessários
  estimatedTime: string;     // "3 dias úteis"

  // Vínculo com módulo
  moduleType: string;        // "education"
  moduleEntity: string;      // "StudentEnrollment"
  fieldMapping: Mapping;     // Como mapear campos → entidade

  // Metadados
  version: string;
  isActive: boolean;
}
```

#### Categorização dos 150+ Serviços

**1. EDUCAÇÃO (20 serviços)**
- Matrícula escolar
- Transferência de escola
- Declaração de matrícula
- Transporte escolar
- Uniforme escolar
- Material escolar
- Merenda escolar especial
- Atestado de frequência
- Histórico escolar
- Boletim escolar
- Declaração de vaga
- Pedido de rematrícula
- Solicitação de segunda via de documentos
- Registro de ocorrência escolar
- Inscrição em atividades extracurriculares
- Solicitação de adaptação curricular
- Pedido de recurso de avaliação
- Inscrição em programas educacionais
- Autorização para eventos/passeios
- Solicitação de atendimento educacional especializado

**2. SAÚDE (30 serviços)**
- Agendar consulta médica
- Agendar consulta odontológica
- Agendar consulta de especialidade
- Agendar exames laboratoriais
- Agendar exames de imagem
- Solicitar cartão SUS
- Solicitar cartão de vacina
- Agendar vacinação
- Solicitar medicamentos
- Programa Farmácia Popular
- Inscrição Hiperdia
- Inscrição gestante
- Pré-natal
- Puericultura
- Teste rápido HIV/Sífilis
- Atestado médico
- Laudo médico
- Declaração de óbito
- Autorização para cirurgia
- Pedido de home care
- Fisioterapia
- Psicologia
- Terapia ocupacional
- Fonoaudiologia
- Programa saúde mental
- Programa antitabagismo
- Programa reeducação alimentar
- Solicitação de cadeira de rodas
- Solicitação de muletas/bengalas
- Atendimento domiciliar

**3. ASSISTÊNCIA SOCIAL (25 serviços)**
- Solicitar cesta básica
- Bolsa Família
- Benefício Eventual
- Auxílio Natalidade
- Auxílio Funeral
- Cadastro Único (CadÚnico)
- Atualização Cadastral
- BPC (Benefício de Prestação Continuada)
- Programa Leite
- Programa Renda Cidadã
- Inscrição CRAS
- Inscrição CREAS
- Visita domiciliar
- Acompanhamento familiar
- Encaminhamento para abrigo
- Programa habitacional social
- Documentação básica (RG, CPF)
- Isenção de taxas
- Programa Primeira Infância
- Programa Jovem Aprendiz
- Programa Idoso Ativo
- Atendimento psicossocial
- Mediação de conflitos familiares
- Denúncia de violência doméstica
- Programa de transferência de renda

**4. OBRAS PÚBLICAS (25 serviços)**
- Reportar buraco na rua
- Reportar iluminação pública queimada
- Reportar vazamento de água
- Reportar esgoto entupido
- Solicitar manutenção de calçada
- Solicitar tapa-buraco
- Solicitar instalação de rampa acessibilidade
- Solicitar manutenção de praça
- Solicitar pintura de faixa de pedestre
- Solicitar sinalização de trânsito
- Reportar semáforo com defeito
- Solicitar quebra-molas
- Solicitar placa de rua
- Reportar problema em ponte/viaduto
- Solicitar drenagem
- Reportar erosão
- Solicitar pavimentação
- Solicitar meio-fio
- Solicitar sarjeta
- Reportar entulho na rua
- Solicitar limpeza de bueiro
- Solicitar manutenção de córrego
- Reportar árvore caída
- Solicitar construção de contenção
- Solicitar melhoria viária

**5. SERVIÇOS PÚBLICOS (20 serviços)**
- Solicitar poda de árvore
- Solicitar corte de grama
- Solicitar retirada de entulho
- Solicitar coleta de móveis velhos
- Solicitar dedetização
- Solicitar limpeza de terreno baldio
- Solicitar capina
- Reportar foco de dengue
- Solicitar coleta de lixo extra
- Solicitar retirada de animal morto
- Solicitar serviço de tapa buraco
- Solicitar limpeza de boca de lobo
- Solicitar varredura de rua
- Reportar lixo acumulado
- Solicitar contentor de lixo
- Reportar problema com coleta seletiva
- Solicitar serviço de caçamba
- Reportar descarte irregular
- Solicitar limpeza após evento
- Solicitar manutenção de cemitério

**6. HABITAÇÃO (15 serviços)**
- Inscrição programa Minha Casa Minha Vida
- Solicitar lote urbanizado
- Regularização fundiária
- Solicitar planta de casa popular
- Solicitar reforma/melhoria habitacional
- Programa de autoconstrução assistida
- Solicitar kit construção
- Solicitar assistência técnica ATHIS
- Regularização de imóvel
- Certidão de regularização
- Cadastro habitacional
- Auxílio aluguel
- Programa de urbanização de favelas
- Declaração de moradia
- Solicitação de vistoria habitacional

**7. CULTURA (12 serviços)**
- Solicitar espaço cultural
- Inscrição em oficina cultural
- Inscrição em curso de arte
- Solicitar apresentação em evento
- Cadastro de artista local
- Inscrição em edital cultural
- Autorização para evento cultural
- Inscrição biblioteca pública
- Empréstimo de livros
- Solicitar visita guiada museu
- Inscrição em grupo teatral
- Cadastro produção cultural

**8. ESPORTE (10 serviços)**
- Inscrição em escolinha esportiva
- Solicitar espaço esportivo
- Inscrição em campeonato
- Cadastro de atleta
- Solicitar assessoria esportiva
- Inscrição em academia ao ar livre
- Autorização para evento esportivo
- Inscrição em projeto social esportivo
- Solicitar kit esportivo
- Cadastro de clube esportivo

**9. MEIO AMBIENTE (15 serviços)**
- Licença ambiental
- Autorização de supressão vegetal
- Autorização de poda de árvore
- Denúncia ambiental
- Solicitar plantio de árvore
- Programa de coleta seletiva
- Inscrição programa reciclagem
- Autorização para evento em área verde
- Cadastro de produtor rural orgânico
- Licença para poço artesiano
- Autorização para construção próxima a APP
- Declaração de área de preservação
- Pedido de vistoria ambiental
- Registro de reserva legal
- Compensação ambiental

**10. SEGURANÇA PÚBLICA (8 serviços)**
- Boletim de ocorrência online
- Solicitar ronda policial
- Reportar iluminação pública para segurança
- Cadastro Vizinhança Solidária
- Denúncia anônima
- Solicitar Câmera de Segurança
- Registro de veículo roubado
- Solicitar atendimento Guarda Municipal

**11. PLANEJAMENTO URBANO (15 serviços)**
- Alvará de construção
- Alvará de reforma
- Alvará de demolição
- Certidão de uso do solo
- Certidão de zoneamento
- Consulta prévia de viabilidade
- Habite-se
- Licença para ocupação de calçada
- Licença para publicidade/outdoor
- Numeração de imóvel
- Remembramento de lote
- Desmembramento de lote
- Certidão de alinhamento
- Certidão de confrontação
- Aprovação de projeto arquitetônico

**12. AGRICULTURA (8 serviços)**
- Assistência técnica rural
- Inscrição programa agricultor familiar
- Solicitar sementes/mudas
- Cadastro produção orgânica
- Solicitação de análise de solo
- Programa mecanização agrícola
- Cadastro feira do produtor
- Certificação de produto

**13. TURISMO (7 serviços)**
- Cadastro de pousada/hotel
- Cadastro de restaurante turístico
- Cadastro guia turístico
- Autorização evento turístico
- Cadastro artesanato local
- Certificação produto típico
- Programa de capacitação turística

**TOTAL: 210 serviços padrões**

---

### B) Serviços Customizados

Municípios podem criar serviços únicos com três opções:

**Opção 1: Baseado em Template**
- Ativa template padrão
- Customiza campos
- Mantém vínculo com módulo

**Opção 2: Novo com Módulo Padrão**
- Cria serviço do zero
- Vincula a módulo existente
- Define mapeamento de campos

**Opção 3: Novo com Módulo Customizado**
- Cria serviço do zero
- Sistema cria tabela customizada automaticamente
- Painel de gestão dinâmico

---

## 🔄 CAMADA 2: MOTOR DE PROTOCOLOS

### Responsabilidades

1. **Numeração Única**
   - Formato: `PREFIX-YYYY-NNNNNN`
   - Geração automática por tenant
   - Sequencial por ano

2. **Rastreamento**
   - Status: VINCULADO → PROGRESSO → CONCLUIDO
   - Histórico completo de mudanças
   - Timestamps de cada etapa

3. **Integridade**
   - Vincula cidadão ao serviço
   - Vincula protocolo ao módulo
   - Garante auditoria completa

### Fluxo de Protocolo

```
Cidadão Solicita
      ↓
Cria Protocol (número único)
      ↓
Detecta módulo vinculado
      ↓
Executa ação no módulo
      ↓
Dados persistidos com protocol
      ↓
Admin gerencia no módulo
      ↓
Atualiza status do protocolo
      ↓
Cidadão acompanha evolução
```

---

## 🗄️ CAMADA 3: MÓDULOS ESPECIALIZADOS

### A) Módulos Padrões (13 Secretarias)

Cada secretaria tem seu módulo com tabelas especializadas.

#### 1. MÓDULO EDUCAÇÃO

**Entidades:**
```typescript
- School              → Escolas do município
- Student             → Estudantes cadastrados
- SchoolClass         → Turmas
- StudentEnrollment   → Matrículas (vinculado a protocolo)
- StudentAttendance   → Frequência diária
- SchoolTransport     → Transporte escolar
- SchoolMeal          → Merenda escolar
- SchoolIncident      → Ocorrências disciplinares
- SchoolEvent         → Eventos escolares
- EducationMaterial   → Uniformes, livros, kits
```

**Serviços Vinculados:**
- Matrícula → StudentEnrollment
- Transporte → SchoolTransport
- Merenda especial → SchoolMeal
- Material escolar → EducationMaterial

#### 2. MÓDULO SAÚDE

**Entidades:**
```typescript
- HealthUnit          → UBS, Hospitais, Clínicas
- Appointment         → Consultas agendadas (vinculado a protocolo)
- MedicalRecord       → Prontuários médicos
- Vaccination         → Registro de vacinas (vinculado a protocolo)
- Medicine            → Estoque de medicamentos
- MedicineRequest     → Solicitações de remédio (vinculado a protocolo)
- HealthCampaign      → Campanhas de saúde
- MedicalEquipment    → Equipamentos
- HealthProgram       → Programas (Hiperdia, Gestante, etc.)
- HealthProfessional  → Médicos, enfermeiros
```

**Serviços Vinculados:**
- Agendar Consulta → Appointment
- Vacina → Vaccination
- Medicamento → MedicineRequest
- Inscrição Programa → HealthProgram (enrollment)

#### 3. MÓDULO ASSISTÊNCIA SOCIAL

**Entidades:**
```typescript
- SocialFamily        → Famílias atendidas
- FamilyMember        → Membros da família
- SocialProgram       → Bolsa Família, Renda Cidadã, etc.
- ProgramEnrollment   → Inscrições em programas
- BenefitRequest      → Solicitações de benefícios (vinculado a protocolo)
- HomeVisit           → Visitas domiciliares
- SocialAssistance    → Acompanhamentos
- SocialWorker        → Assistentes sociais
- SocialCase          → Casos acompanhados
- DocumentRequest     → Solicitação de documentos
```

**Serviços Vinculados:**
- Cesta Básica → BenefitRequest
- Bolsa Família → ProgramEnrollment
- Visita Domiciliar → HomeVisit
- Documentação → DocumentRequest

#### 4. MÓDULO OBRAS PÚBLICAS

**Entidades:**
```typescript
- PublicWork          → Obras em andamento
- WorkRequest         → Solicitações de obras
- InfrastructureProblem → Buracos, iluminação, etc. (vinculado a protocolo)
- MaintenanceSchedule → Cronograma de manutenção
- WorkTeam            → Equipes de obra
- WorkEquipment       → Equipamentos
- WorkMaterial        → Materiais usados
- StreetLighting      → Postes de iluminação
- Pavement            → Pavimentação de ruas
- Bridge              → Pontes e viadutos
```

**Serviços Vinculados:**
- Buraco na rua → InfrastructureProblem
- Iluminação → StreetLighting (repair request)
- Vazamento → InfrastructureProblem
- Pavimentação → Pavement (request)

#### 5. MÓDULO SERVIÇOS PÚBLICOS

**Entidades:**
```typescript
- ServiceRequest      → Solicitações gerais (vinculado a protocolo)
- CleaningSchedule    → Programação de limpeza
- StreetCleaning      → Limpeza de ruas
- GarbageCollection   → Coleta de lixo
- TreePruning         → Podas realizadas (vinculado a protocolo)
- PestControl         → Dedetizações (vinculado a protocolo)
- WasteRemoval        → Retirada de entulho (vinculado a protocolo)
- GreenArea           → Áreas verdes
- PublicCleaning      → Limpeza pública
- ServiceTeam         → Equipes de serviço
```

**Serviços Vinculados:**
- Poda → TreePruning
- Entulho → WasteRemoval
- Dedetização → PestControl
- Limpeza → ServiceRequest

#### 6. MÓDULO HABITAÇÃO

**Entidades:**
```typescript
- HousingProgram      → Programas habitacionais
- HousingApplication  → Inscrições MCMV (vinculado a protocolo)
- HousingUnit         → Unidades habitacionais
- LandRegularization  → Regularização fundiária (vinculado a protocolo)
- ConstructionAid     → Auxílio construção (vinculado a protocolo)
- RentAssistance      → Auxílio aluguel (vinculado a protocolo)
- HousingInspection   → Vistorias
- HousingProject      → Projetos de casa popular
- Lot                 → Lotes disponíveis
- LotApplication      → Solicitação de lote (vinculado a protocolo)
```

**Serviços Vinculados:**
- MCMV → HousingApplication
- Regularização → LandRegularization
- Lote → LotApplication
- Auxílio aluguel → RentAssistance

#### 7. MÓDULO CULTURA

**Entidades:**
```typescript
- CulturalSpace       → Centros culturais, teatros
- SpaceReservation    → Reservas de espaço (vinculado a protocolo)
- CulturalWorkshop    → Oficinas culturais
- WorkshopEnrollment  → Inscrições oficinas (vinculado a protocolo)
- Artist              → Artistas cadastrados
- ArtistRegistration  → Cadastro de artista (vinculado a protocolo)
- CulturalEvent       → Eventos culturais
- EventAuthorization  → Autorizações eventos (vinculado a protocolo)
- CulturalProject     → Projetos culturais
- LibraryMember       → Membros da biblioteca
- BookLoan            → Empréstimos de livros
```

**Serviços Vinculados:**
- Espaço Cultural → SpaceReservation
- Oficina → WorkshopEnrollment
- Cadastro Artista → ArtistRegistration
- Evento → EventAuthorization

#### 8. MÓDULO ESPORTE

**Entidades:**
```typescript
- SportsCenter        → Centros esportivos
- SportsFacility      → Quadras, campos
- FacilityReservation → Reservas (vinculado a protocolo)
- SportsClass         → Escolinhas esportivas
- ClassEnrollment     → Inscrições escolinha (vinculado a protocolo)
- Athlete             → Atletas cadastrados
- AthleteRegistration → Cadastro atleta (vinculado a protocolo)
- Championship        → Campeonatos
- ChampionshipEnrollment → Inscrições campeonato (vinculado a protocolo)
- SportsTeam          → Equipes
- SportsEvent         → Eventos esportivos
```

**Serviços Vinculados:**
- Escolinha → ClassEnrollment
- Espaço → FacilityReservation
- Campeonato → ChampionshipEnrollment
- Cadastro Atleta → AthleteRegistration

#### 9. MÓDULO MEIO AMBIENTE

**Entidades:**
```typescript
- EnvironmentalLicense → Licenças ambientais (vinculado a protocolo)
- TreePlanting        → Plantio de árvores (vinculado a protocolo)
- TreePruningAuth     → Autorizações de poda (vinculado a protocolo)
- EnvironmentalComplaint → Denúncias ambientais (vinculado a protocolo)
- ProtectedArea       → Áreas de preservação
- EnvironmentalProgram → Programas ambientais
- ProgramEnrollment   → Inscrições programas (vinculado a protocolo)
- RecyclingPoint      → Pontos de coleta
- OrganicProducer     → Produtores orgânicos (vinculado a protocolo)
- Well                → Poços artesianos
- WellAuthorization   → Autorizações poço (vinculado a protocolo)
```

**Serviços Vinculados:**
- Licença → EnvironmentalLicense
- Poda → TreePruningAuth
- Plantio → TreePlanting
- Denúncia → EnvironmentalComplaint

#### 10. MÓDULO SEGURANÇA PÚBLICA

**Entidades:**
```typescript
- PoliceReport        → Boletins de ocorrência (vinculado a protocolo)
- PatrolRequest       → Solicitações de ronda (vinculado a protocolo)
- SecurityCamera      → Câmeras de segurança
- CameraRequest       → Solicitação câmera (vinculado a protocolo)
- NeighborhoodWatch   → Vizinhança solidária
- WatchRegistration   → Cadastro vizinhança (vinculado a protocolo)
- AnonymousTip        → Denúncias anônimas (vinculado a protocolo)
- GuardPatrol         → Rondas da guarda
- SecurityIncident    → Incidentes de segurança
```

**Serviços Vinculados:**
- Boletim → PoliceReport
- Ronda → PatrolRequest
- Câmera → CameraRequest
- Denúncia → AnonymousTip

#### 11. MÓDULO PLANEJAMENTO URBANO

**Entidades:**
```typescript
- BuildingPermit      → Alvarás de construção (vinculado a protocolo)
- ConstructionProject → Projetos aprovados
- LandUseCertificate  → Certidões uso do solo (vinculado a protocolo)
- ZoningCertificate   → Certidões zoneamento (vinculado a protocolo)
- DemolitionPermit    → Alvarás de demolição (vinculado a protocolo)
- UrbanProject        → Projetos urbanos
- PublicConsultation  → Consultas públicas
- UrbanZoning         → Zoneamento urbano
- PropertyNumbering   → Numeração de imóveis (vinculado a protocolo)
- LotSubdivision      → Desmembramento (vinculado a protocolo)
```

**Serviços Vinculados:**
- Alvará → BuildingPermit
- Certidão → LandUseCertificate / ZoningCertificate
- Numeração → PropertyNumbering
- Desmembramento → LotSubdivision

#### 12. MÓDULO AGRICULTURA

**Entidades:**
```typescript
- RuralProducer       → Produtores rurais (vinculado a protocolo)
- TechnicalAssistance → Assistência técnica (vinculado a protocolo)
- RuralProgram        → Programas rurais
- ProgramEnrollment   → Inscrições programas (vinculado a protocolo)
- SeedDistribution    → Distribuição sementes/mudas (vinculado a protocolo)
- SoilAnalysis        → Análise de solo (vinculado a protocolo)
- OrganicCertification → Certificação orgânica (vinculado a protocolo)
- FarmerMarket        → Feiras do produtor
- MarketRegistration  → Cadastro feira (vinculado a protocolo)
- RuralProperty       → Propriedades rurais
```

**Serviços Vinculados:**
- Assistência Técnica → TechnicalAssistance
- Sementes → SeedDistribution
- Análise Solo → SoilAnalysis
- Cadastro Feira → MarketRegistration

#### 13. MÓDULO TURISMO

**Entidades:**
```typescript
- TouristAttraction   → Pontos turísticos
- TourismBusiness     → Hotéis, pousadas (vinculado a protocolo)
- TourGuide           → Guias turísticos (vinculado a protocolo)
- TourismEvent        → Eventos turísticos
- EventAuthorization  → Autorizações eventos (vinculado a protocolo)
- LocalCraft          → Artesanato local (vinculado a protocolo)
- TypicalProduct      → Produtos típicos (vinculado a protocolo)
- TourismProgram      → Programas de turismo
- TourismTraining     → Capacitações (vinculado a protocolo)
```

**Serviços Vinculados:**
- Cadastro Hotel → TourismBusiness
- Guia → TourGuide
- Artesanato → LocalCraft
- Capacitação → TourismTraining

---

### B) Módulos Customizados

Sistema de tabelas flexíveis para necessidades únicas do município.

**Estrutura:**
```typescript
- CustomDataTable     → Definição da tabela
  - schema (JSON)     → Estrutura dos campos

- CustomDataRecord    → Registros da tabela
  - data (JSON)       → Dados flexíveis
  - protocol          → Vínculo com protocolo
```

---

## 🔗 INTEGRAÇÃO ENTRE CAMADAS

### Fluxo Completo de Dados

```typescript
// 1. Cidadão solicita serviço "Matrícula Escolar"
POST /api/citizen/services/EDU_MATRICULA_001/request
{
  studentName: "Maria Silva",
  birthDate: "2018-03-15",
  parentName: "João Silva",
  desiredGrade: "1º ano",
  shift: "matutino"
}

// 2. Backend processa
const service = await getService("EDU_MATRICULA_001");
// service.moduleType = "education"
// service.moduleEntity = "StudentEnrollment"

await prisma.$transaction(async (tx) => {
  // 2.1 Criar protocolo
  const protocol = await tx.protocol.create({
    number: "PREF-2025-000123",
    serviceId: service.id,
    citizenId: citizen.id,
    status: "VINCULADO"
  });

  // 2.2 Executar ação no módulo
  await moduleHandler.execute({
    type: "education",
    entity: "StudentEnrollment",
    action: "create",
    data: mapFields(requestData, service.fieldMapping),
    protocol: protocol.number
  });
});

// 3. Módulo cria registros
- Student criado
- StudentEnrollment criado com protocol = "PREF-2025-000123"

// 4. Admin vê no módulo
GET /admin/secretarias/educacao/matriculas
→ Lista StudentEnrollment onde protocol IS NOT NULL

// 5. Admin aprova
PATCH /admin/secretarias/educacao/matriculas/:id/approve
→ Atualiza StudentEnrollment.status = "active"
→ Atualiza Protocol.status = "CONCLUIDO"

// 6. Cidadão acompanha
GET /cidadao/protocolos/PREF-2025-000123
→ Vê status "Concluído"
```

---

## 💾 MODELO DE DADOS UNIFICADO

### Schema Prisma Completo

```prisma
// ========== TEMPLATES ==========
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
}

// ========== SERVIÇOS ==========
model Service {
  id              String   @id
  tenantId        String
  templateId      String?
  template        ServiceTemplate? @relation("TemplateInstances", fields: [templateId])
  name            String
  description     String
  isActive        Boolean
  serviceType     ServiceType
  moduleType      String?
  moduleEntity    String?
  fieldMapping    Json?
  customForm      ServiceForm?
  // ... outros campos
}

// ========== PROTOCOLOS ==========
model Protocol {
  id              String   @id
  number          String   @unique
  tenantId        String
  citizenId       String
  serviceId       String?
  service         Service?
  title           String
  description     String
  status          ProtocolStatus
  priority        Int
  concludedAt     DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

// ========== MÓDULOS (EXEMPLO: EDUCAÇÃO) ==========
model Student {
  id              String   @id
  tenantId        String
  name            String
  birthDate       DateTime
  parentName      String
  // ... outros campos
  enrollments     StudentEnrollment[]
}

model StudentEnrollment {
  id              String   @id
  tenantId        String
  studentId       String
  student         Student  @relation(fields: [studentId])
  classId         String?
  grade           String
  year            Int
  status          String
  protocol        String?   // ⭐ VÍNCULO
  serviceId       String?   // ⭐ VÍNCULO
  source          String    @default("manual")
  createdBy       String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

// ========== MÓDULOS CUSTOMIZADOS ==========
model CustomDataTable {
  id              String   @id
  tenantId        String
  tableName       String
  displayName     String
  moduleType      String
  schema          Json
  records         CustomDataRecord[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  @@unique([tenantId, tableName])
}

model CustomDataRecord {
  id              String   @id
  tableId         String
  table           CustomDataTable @relation(fields: [tableId])
  protocol        String?   // ⭐ VÍNCULO
  serviceId       String?   // ⭐ VÍNCULO
  data            Json
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

---

## 🎨 EXPERIÊNCIA DO USUÁRIO

### Para o Admin

**1. Ativar Serviços Padrões**
```
/admin/servicos/templates
→ Navega por categorias
→ Clica "Ativar" em template desejado
→ Customiza se necessário
→ Serviço ativo instantaneamente
```

**2. Gerenciar Dados nos Módulos**
```
/admin/secretarias/educacao/matriculas
→ Vê lista unificada (portal + manual)
→ Filtra por origem/status
→ Aprova/rejeita solicitações
→ Protocolo atualiza automaticamente
```

**3. Criar Serviço Customizado**
```
/admin/servicos/novo
→ Define campos
→ Escolhe se vincula a módulo
→ Sistema cria tabela se necessário
→ Painel dinâmico gerado
```

### Para o Cidadão

**1. Solicitar Serviço**
```
/cidadao/servicos
→ Vê 150+ serviços disponíveis
→ Clica no serviço desejado
→ Preenche formulário
→ Recebe número de protocolo
```

**2. Acompanhar Protocolo**
```
/cidadao/protocolos/PREF-2025-000123
→ Vê status atualizado
→ Recebe notificações
→ Acessa documentos/respostas
```

---

## 📊 BENEFÍCIOS DA ARQUITETURA

### Técnicos
✅ **Modular** - Adiciona novos templates sem quebrar existentes
✅ **Escalável** - Suporta crescimento de dados
✅ **Manutenível** - Lógica centralizada
✅ **Auditável** - Tudo rastreável por protocolo
✅ **Extensível** - Módulos customizados ilimitados

### Operacionais
✅ **Rápido de implementar** - Templates prontos
✅ **Fácil de usar** - Interface intuitiva
✅ **Flexível** - Customização quando necessário
✅ **Organizado** - Dados no lugar certo
✅ **Completo** - 210 serviços + 13 módulos

### Comerciais
✅ **Valor agregado** - Biblioteca rica de serviços
✅ **Diferencial** - Solução completa
✅ **Upsell** - Módulos customizados
✅ **Retenção** - Quanto mais usa, mais preciso
✅ **Escalabilidade** - Atende pequenas e grandes cidades

---

## 🔐 SEGURANÇA E GOVERNANÇA

### Controle de Acesso

**Por Secretaria:**
- Admin só vê módulo de sua secretaria
- Permissões granulares (read, write, approve)
- Auditoria de todas ações

**Por Serviço:**
- Ativar/desativar serviços por tenant
- Configurar quem pode aprovar
- Definir SLA por tipo de serviço

### Auditoria

**Todas operações registram:**
- Quem fez
- O que fez
- Quando fez
- Qual protocolo vinculado
- Dados antes/depois (para edições)

---

## 🚀 PRÓXIMOS PASSOS

1. ✅ Aprovação da arquitetura
2. ✅ Priorização de templates (quais primeiros)
3. ✅ Definição de cronograma
4. ✅ Implementação em fases
5. ✅ Testes e validação
6. ✅ Rollout gradual

---

## 📝 CONCLUSÃO

Esta arquitetura cria um **ecossistema completo** onde:
- Serviços padrões aceleram implementação
- Protocolos unificam rastreamento
- Módulos organizam dados automaticamente
- Customização atende necessidades únicas
- Tudo colabora de forma integrada

O resultado é uma **plataforma robusta, flexível e escalável** que serve municípios de todos os tamanhos com excelência.

---

**Documento criado em:** 27/10/2025
**Versão:** 1.0
**Autor:** DigiUrban Team
