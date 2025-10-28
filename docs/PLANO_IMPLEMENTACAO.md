# Plano de Implementação - Sistema de Serviços DigiUrban

**Data:** 27 de Outubro de 2025
**Versão:** 1.0
**Responsável:** Equipe DigiUrban

---

## 1. Visão Geral

Este plano detalha a implementação completa do sistema de serviços do DigiUrban, desde a criação pelo admin até a solicitação pelo cidadão, garantindo integração total com o motor de protocolos.

### 1.1 Objetivos

- ✅ Implementar fluxo completo de solicitação de serviços pelo cidadão
- ✅ Corrigir salvamento de configurações avançadas na criação de serviços
- ✅ Integrar as 10 secretarias restantes com o motor de protocolos
- ✅ Padronizar numeração, rastreamento e conclusão de protocolos
- ✅ Adicionar tipagem de serviços (REQUEST, REGISTRATION, CONSULTATION, BOTH)

### 1.2 Escopo

**Incluído:**
- Backend: 11 arquivos de rotas + schema Prisma
- Frontend: 8 páginas + 4 hooks + 12 componentes
- Banco de Dados: 4 migrações SQL
- Testes: 27 casos de teste automatizados

**Excluído:**
- Redesign visual (mantém shadcn/ui atual)
- Integração com sistemas externos (pagamentos, SMS)
- App mobile (foco no web)

---

## 2. Backlog Priorizado

### Epic 1: CRÍTICO - Implementar Fluxo de Solicitação de Serviços pelo Cidadão

**Prioridade:** P0 (Blocker)
**Estimativa Total:** L (8-13 dias)

#### Tarefa 1.1: Criar endpoint POST /api/citizen/services/:serviceId/request
- **Estimativa:** M (3-5 dias)
- **Complexidade:** Média
- **Responsável:** Backend Developer
- **Descrição:** Endpoint que recebe dados do formulário do cidadão e cria protocolo automaticamente
- **Critérios de Aceite:**
  - [ ] Recebe JSON com dados do serviço e cidadão autenticado via JWT
  - [ ] Valida campos obrigatórios via Zod schema
  - [ ] Valida feature flags (hasLocation → requer locationData)
  - [ ] Cria Protocol com status ABERTO e número único
  - [ ] Cria AttendanceGeneric vinculado ao protocolId
  - [ ] Retorna 201 com protocolNumber e dados completos
  - [ ] Retorna 400 se validação falhar com mensagens claras
  - [ ] Retorna 404 se serviceId não existir para o tenant
- **Arquivos Afetados:**
  - `backend/src/routes/citizen-services.ts` (adicionar rota)
  - `backend/src/types/citizen-request.types.ts` (novo arquivo)
- **Dependências:** Nenhuma

#### Tarefa 1.2: Criar página de solicitação /cidadao/servicos/[id]/solicitar
- **Estimativa:** M (3-5 dias)
- **Complexidade:** Alta
- **Responsável:** Frontend Developer
- **Descrição:** Formulário dinâmico multi-step baseado nas feature flags do serviço
- **Critérios de Aceite:**
  - [ ] Carrega dados do serviço via GET /api/citizen/services/:id
  - [ ] Renderiza steps condicionalmente (dados básicos → localização → agendamento → anexos → revisão)
  - [ ] Valida cada step antes de avançar (Zod + React Hook Form)
  - [ ] Exibe mapa interativo se hasLocation (Leaflet)
  - [ ] Exibe calendário de agendamento se hasScheduling
  - [ ] Permite upload de múltiplos arquivos se hasAttachments
  - [ ] Envia POST com FormData para /api/citizen/services/:id/request
  - [ ] Redireciona para /cidadao/protocolos com toast de sucesso
  - [ ] Exibe erros de validação inline em cada campo
- **Arquivos Afetados:**
  - `frontend/app/cidadao/servicos/[id]/solicitar/page.tsx` (novo)
  - `frontend/components/citizen/ServiceRequestForm.tsx` (novo)
  - `frontend/components/citizen/LocationStep.tsx` (novo)
  - `frontend/components/citizen/SchedulingStep.tsx` (novo)
  - `frontend/components/citizen/AttachmentsStep.tsx` (novo)
  - `frontend/components/citizen/ReviewStep.tsx` (novo)
- **Dependências:** Tarefa 1.1

#### Tarefa 1.3: Atualizar hook useCitizenServices para incluir requestService
- **Estimativa:** S (1-2 dias)
- **Complexidade:** Baixa
- **Responsável:** Frontend Developer
- **Descrição:** Adicionar função requestService ao hook com tratamento de erros
- **Critérios de Aceite:**
  - [ ] Função async requestService(serviceId, formData) retorna protocol
  - [ ] Trata erros 400/404/500 com mensagens claras
  - [ ] Atualiza estado de loading durante request
  - [ ] Invalida cache de serviços após sucesso
- **Arquivos Afetados:**
  - `frontend/hooks/useCitizenServices.ts`
- **Dependências:** Tarefa 1.1

#### Tarefa 1.4: Remover toast placeholder em /cidadao/servicos
- **Estimativa:** S (1 hora)
- **Complexidade:** Trivial
- **Responsável:** Frontend Developer
- **Descrição:** Substituir toast por router.push
- **Critérios de Aceite:**
  - [ ] Remove toast.info placeholder (linhas 26-34)
  - [ ] Adiciona router.push(`/cidadao/servicos/${serviceId}/solicitar`)
- **Arquivos Afetados:**
  - `frontend/app/cidadao/servicos/page.tsx`
- **Dependências:** Tarefa 1.2

---

### Epic 2: CRÍTICO - Corrigir Salvamento de Configurações Avançadas

**Prioridade:** P0 (Blocker)
**Estimativa Total:** M (5-8 dias)

#### Tarefa 2.1: Criar transaction wrapper para criação de serviços
- **Estimativa:** S (2-3 dias)
- **Complexidade:** Média
- **Responsável:** Backend Developer
- **Descrição:** Envolver toda criação de serviço em prisma.$transaction
- **Critérios de Aceite:**
  - [ ] Usa prisma.$transaction para garantir atomicidade
  - [ ] Cria Service, ServiceForm, ServiceWorkflow, ServiceNotification, ServiceLocation em sequência
  - [ ] Se qualquer operação falhar, faz rollback completo
  - [ ] Retorna serviço completo com todos relacionamentos
  - [ ] Logs estruturados para cada step da transação
- **Arquivos Afetados:**
  - `backend/src/routes/services.ts` (linhas 138-443)
- **Dependências:** Nenhuma

#### Tarefa 2.2: Adicionar campos de config no payload do frontend
- **Estimativa:** M (3-5 dias)
- **Complexidade:** Média
- **Responsável:** Frontend Developer
- **Descrição:** Incluir todos os campos de configuração avançada no POST
- **Critérios de Aceite:**
  - [ ] Adiciona customFormConfig ao payload se hasCustomForm
  - [ ] Adiciona locationConfig ao payload se hasLocation
  - [ ] Adiciona schedulingConfig ao payload se hasScheduling
  - [ ] Adiciona attachmentConfig ao payload se hasAttachments
  - [ ] Adiciona notificationConfig ao payload se hasNotifications
  - [ ] Adiciona workflowConfig ao payload se hasWorkflow
  - [ ] Valida estrutura JSON de cada config antes de enviar
  - [ ] Exibe erros de validação se config incompleto
- **Arquivos Afetados:**
  - `frontend/app/admin/servicos/novo/page.tsx` (linhas 206-227)
- **Dependências:** Nenhuma

#### Tarefa 2.3: Criar testes E2E para criação completa de serviços
- **Estimativa:** S (2 dias)
- **Complexidade:** Baixa
- **Responsável:** QA Engineer
- **Descrição:** Testar criação de serviço com todas feature flags ativas
- **Critérios de Aceite:**
  - [ ] Teste cria serviço com customForm e valida registro no DB
  - [ ] Teste cria serviço com location e valida ServiceLocation
  - [ ] Teste cria serviço com scheduling e valida config
  - [ ] Teste cria serviço com todas flags e valida integridade
  - [ ] Teste valida rollback se alguma operação falhar
- **Arquivos Afetados:**
  - `backend/tests/e2e/services.test.ts` (novo)
- **Dependências:** Tarefas 2.1 e 2.2

---

### Epic 3: CRÍTICO - Integrar 10 Secretarias com Motor de Protocolos

**Prioridade:** P0 (Blocker)
**Estimativa Total:** L (10-15 dias)

#### Tarefa 3.1: Migrar modelos Attendance para usar protocolId (FK)
- **Estimativa:** M (3-5 dias)
- **Complexidade:** Alta
- **Responsável:** Backend Developer + DBA
- **Descrição:** Adicionar campo protocolId Int? + FK constraint nos 10 modelos
- **Critérios de Aceite:**
  - [ ] Executa migração SQL para adicionar coluna protocolId
  - [ ] Adiciona FK constraint referenciando Protocol(id)
  - [ ] Remove campo protocol String dos 10 modelos
  - [ ] Atualiza seed data para popular protocolId
  - [ ] Valida integridade referencial no banco
- **Arquivos Afetados:**
  - `backend/prisma/schema.prisma` (10 modelos Attendance*)
  - `backend/prisma/migrations/XXXXXX_add_protocolid_fk/migration.sql` (novo)
- **Dependências:** Nenhuma

#### Tarefa 3.2: Refatorar rotas de secretarias para criar Protocol
- **Estimativa:** L (5-8 dias)
- **Complexidade:** Alta
- **Responsável:** Backend Developer
- **Descrição:** Atualizar 10 arquivos de rotas para criar Protocol + Attendance em transação
- **Critérios de Aceite:**
  - [ ] POST em cada secretaria cria Protocol com status ABERTO
  - [ ] Gera número único via getNextProtocolNumber()
  - [ ] Vincula serviceId se solicitação veio de serviço
  - [ ] Cria registro Attendance* específico vinculado ao protocolId
  - [ ] Usa prisma.$transaction para garantir atomicidade
  - [ ] Retorna protocolo completo com dados do attendance
  - [ ] Implementado em todas 10 rotas de secretarias
- **Arquivos Afetados:**
  - `backend/src/routes/secretarias-saude.ts`
  - `backend/src/routes/secretarias-educacao.ts`
  - `backend/src/routes/secretarias-habitacao.ts`
  - `backend/src/routes/secretarias-assistencia-social.ts`
  - `backend/src/routes/secretarias-cultura.ts`
  - `backend/src/routes/secretarias-esportes.ts`
  - `backend/src/routes/secretarias-turismo.ts`
  - `backend/src/routes/secretarias-meio-ambiente.ts`
  - `backend/src/routes/secretarias-obras.ts`
  - `backend/src/routes/secretarias-transito.ts`
- **Dependências:** Tarefa 3.1

#### Tarefa 3.3: Criar função utilitária getProtocolWithAttendance()
- **Estimativa:** S (1-2 dias)
- **Complexidade:** Média
- **Responsável:** Backend Developer
- **Descrição:** Função helper que retorna Protocol + dados do Attendance específico
- **Critérios de Aceite:**
  - [ ] Recebe protocolId e detecta secretaria via serviceId
  - [ ] Busca dados do Attendance* correspondente (Health, Education, etc.)
  - [ ] Retorna objeto combinado { protocol, attendance, service }
  - [ ] Trata caso onde protocolo não tem attendance vinculado
  - [ ] Tipagem TypeScript correta para cada tipo de attendance
- **Arquivos Afetados:**
  - `backend/src/utils/protocol-helpers.ts` (novo)
- **Dependências:** Tarefa 3.1

#### Tarefa 3.4: Atualizar frontend para exibir dados específicos de cada secretaria
- **Estimativa:** M (3-5 dias)
- **Complexidade:** Média
- **Responsável:** Frontend Developer
- **Descrição:** Componentes que renderizam campos específicos de cada tipo de attendance
- **Critérios de Aceite:**
  - [ ] Componente ProtocolDetails detecta tipo de secretaria
  - [ ] Renderiza campos específicos (ex: Health → patientName, symptoms)
  - [ ] Usa type guards para garantir tipagem correta
  - [ ] Exibe dados genéricos + dados específicos em abas
  - [ ] Funciona em /admin/protocolos e /cidadao/protocolos
- **Arquivos Afetados:**
  - `frontend/components/protocols/ProtocolDetails.tsx`
  - `frontend/components/protocols/HealthAttendanceDetails.tsx` (novo)
  - `frontend/components/protocols/EducationAttendanceDetails.tsx` (novo)
  - (... +8 componentes similares)
- **Dependências:** Tarefas 3.2 e 3.3

---

### Epic 4: ALTO - Adicionar Tipagem de Serviços (serviceType)

**Prioridade:** P1 (High)
**Estimativa Total:** M (5-7 dias)

#### Tarefa 4.1: Criar enum ServiceType no schema Prisma
- **Estimativa:** S (1 dia)
- **Complexidade:** Baixa
- **Responsável:** Backend Developer
- **Descrição:** Adicionar enum ServiceType e campo serviceType no modelo Service
- **Critérios de Aceite:**
  - [ ] Enum ServiceType com valores: REQUEST, REGISTRATION, CONSULTATION, BOTH
  - [ ] Campo serviceType ServiceType @default(REQUEST) adicionado
  - [ ] Migração SQL gerada e aplicada
  - [ ] Seed atualizado para popular serviceType nos registros existentes
- **Arquivos Afetados:**
  - `backend/prisma/schema.prisma`
  - `backend/prisma/migrations/XXXXXX_add_service_type/migration.sql` (novo)
- **Dependências:** Nenhuma

#### Tarefa 4.2: Adicionar campo serviceType no formulário de criação
- **Estimativa:** S (1-2 dias)
- **Complexidade:** Baixa
- **Responsável:** Frontend Developer
- **Descrição:** Select para escolher tipo de serviço no BasicInfoStep
- **Critérios de Aceite:**
  - [ ] Select com 4 opções (Solicitação, Cadastro, Consulta, Ambos)
  - [ ] Valor padrão "REQUEST"
  - [ ] Descrição explicativa de cada tipo
  - [ ] Valor incluído no payload de criação
- **Arquivos Afetados:**
  - `frontend/app/admin/servicos/novo/page.tsx`
  - `frontend/components/admin/BasicInfoStep.tsx`
- **Dependências:** Tarefa 4.1

#### Tarefa 4.3: Implementar lógica condicional baseada em serviceType
- **Estimativa:** M (3-4 dias)
- **Complexidade:** Média
- **Responsável:** Full Stack Developer
- **Descrição:** Ajustar comportamento do sistema baseado no tipo de serviço
- **Critérios de Aceite:**
  - [ ] REQUEST: Cria protocolo, exige validação do servidor
  - [ ] REGISTRATION: Apenas salva dados, não cria protocolo
  - [ ] CONSULTATION: Read-only, não cria registros
  - [ ] BOTH: Permite escolher ação (solicitar ou consultar)
  - [ ] Frontend exibe botões diferentes baseado no tipo
  - [ ] Backend valida tipo antes de criar protocolo
- **Arquivos Afetados:**
  - `backend/src/routes/citizen-services.ts`
  - `frontend/app/cidadao/servicos/page.tsx`
  - `frontend/components/citizen/ServiceCard.tsx`
- **Dependências:** Tarefas 4.1 e 4.2

---

### Epic 5: ALTO - Padronizar Numeração de Protocolos

**Prioridade:** P1 (High)
**Estimativa Total:** M (4-6 dias)

#### Tarefa 5.1: Criar função centralizada getNextProtocolNumber()
- **Estimativa:** S (2-3 dias)
- **Complexidade:** Média
- **Responsável:** Backend Developer
- **Descrição:** Função única para gerar números sequenciais por tenant
- **Critérios de Aceite:**
  - [ ] Formato: {tenantPrefix}-{YYYY}-{sequential}
  - [ ] Busca último protocolo do tenant no ano corrente
  - [ ] Incrementa sequencial com padding de 6 dígitos
  - [ ] Thread-safe usando lock ou SELECT FOR UPDATE
  - [ ] Retorna string única garantida
- **Arquivos Afetados:**
  - `backend/src/utils/protocol-number-generator.ts` (novo)
- **Dependências:** Nenhuma

#### Tarefa 5.2: Refatorar todas rotas para usar função centralizada
- **Estimativa:** S (1-2 dias)
- **Complexidade:** Baixa
- **Responsável:** Backend Developer
- **Descrição:** Substituir geração manual por getNextProtocolNumber()
- **Critérios de Aceite:**
  - [ ] Substituído em protocols.ts (linha 67)
  - [ ] Substituído em admin-protocols.ts (linha 1075)
  - [ ] Substituído em secretarias-genericas.ts
  - [ ] Substituído nas 10 novas rotas de secretarias (após Epic 3)
  - [ ] Remove lógica duplicada de geração
- **Arquivos Afetados:**
  - `backend/src/routes/protocols.ts`
  - `backend/src/routes/admin-protocols.ts`
  - `backend/src/routes/secretarias-*.ts` (11 arquivos)
- **Dependências:** Tarefa 5.1

#### Tarefa 5.3: Criar migração para renumerar protocolos existentes
- **Estimativa:** S (1-2 dias)
- **Complexidade:** Baixa
- **Responsável:** Backend Developer + DBA
- **Descrição:** Script SQL para padronizar números existentes
- **Critérios de Aceite:**
  - [ ] Script de migração de dados (data migration)
  - [ ] Mantém ordem cronológica original
  - [ ] Atualiza todos registros por tenant
  - [ ] Backup antes da migração
  - [ ] Rollback script disponível
- **Arquivos Afetados:**
  - `backend/prisma/migrations/XXXXXX_renumber_protocols/migration.sql` (novo)
  - `backend/scripts/renumber-protocols.ts` (novo)
- **Dependências:** Tarefa 5.1

---

### Epic 6: MÉDIO - Corrigir Rastreamento de Conclusão de Protocolos

**Prioridade:** P2 (Medium)
**Estimativa Total:** S (2-3 dias)

#### Tarefa 6.1: Adicionar atualização de concludedAt em protocols.ts
- **Estimativa:** S (1 hora)
- **Complexidade:** Trivial
- **Responsável:** Backend Developer
- **Descrição:** Adicionar lógica para setar concludedAt quando status = CONCLUIDO
- **Critérios de Aceite:**
  - [ ] Se status === 'CONCLUIDO', seta concludedAt: new Date()
  - [ ] Se status !== 'CONCLUIDO' e tinha concludedAt, seta null
  - [ ] Aplica em PATCH /protocols/:id (linha 320)
- **Arquivos Afetados:**
  - `backend/src/routes/protocols.ts` (linha 320)
- **Dependências:** Nenhuma

#### Tarefa 6.2: Criar teste unitário para conclusão de protocolos
- **Estimativa:** S (2-3 dias)
- **Complexidade:** Baixa
- **Responsável:** QA Engineer
- **Descrição:** Validar que concludedAt é setado corretamente
- **Critérios de Aceite:**
  - [ ] Teste: mudar status para CONCLUIDO seta concludedAt
  - [ ] Teste: mudar status para EM_ANDAMENTO limpa concludedAt
  - [ ] Teste: concludedAt não muda se status não mudar
  - [ ] Teste: concludedAt mantém valor se já concluído
- **Arquivos Afetados:**
  - `backend/tests/unit/protocols.test.ts` (novo)
- **Dependências:** Tarefa 6.1

---

## 3. Cronograma e Marcos

### Fase 1: Funcionalidades Críticas (Semanas 1-3)
**Objetivo:** Desbloquear solicitação de serviços pelo cidadão

| Epic | Duração | Início | Fim |
|------|---------|--------|-----|
| Epic 1: Fluxo Cidadão | 8-13 dias | Sem 1 | Sem 2-3 |
| Epic 2: Config Avançadas | 5-8 dias | Sem 1 | Sem 2 |

**Marco 1:** Cidadão consegue solicitar serviços e gerar protocolos ✅

### Fase 2: Integração Completa (Semanas 3-5)
**Objetivo:** Integrar todas secretarias com motor de protocolos

| Epic | Duração | Início | Fim |
|------|---------|--------|-----|
| Epic 3: Secretarias | 10-15 dias | Sem 3 | Sem 5 |
| Epic 4: Tipagem | 5-7 dias | Sem 3 | Sem 4 |

**Marco 2:** Todas secretarias criam e rastreiam protocolos ✅

### Fase 3: Refinamento e QA (Semana 6)
**Objetivo:** Padronizar e validar sistema completo

| Epic | Duração | Início | Fim |
|------|---------|--------|-----|
| Epic 5: Numeração | 4-6 dias | Sem 6 | Sem 6 |
| Epic 6: Conclusão | 2-3 dias | Sem 6 | Sem 6 |

**Marco 3:** Sistema 100% funcional e testado ✅

### Cronograma Visual

```
Semana 1: [Epic 1 ████████] [Epic 2 ████████]
Semana 2: [Epic 1 █████] [Epic 2 ███]
Semana 3: [Epic 3 ████████] [Epic 4 ████████]
Semana 4: [Epic 3 ████████] [Epic 4 ███]
Semana 5: [Epic 3 ███]
Semana 6: [Epic 5 ████████] [Epic 6 ████]
          [Testes E2E ████████████████]
```

**Duração Total Estimada:** 6 semanas (30 dias úteis)

---

## 4. Estratégia de Deploy

### 4.1 Ambiente de Desenvolvimento

**Pré-requisitos:**
- Node.js 18+ instalado
- PostgreSQL 14+ rodando
- Git configurado
- Acesso ao repositório DigiUrban

**Setup Local:**
```bash
# 1. Criar branch de desenvolvimento
git checkout -b feature/service-flow-complete

# 2. Instalar dependências
cd digiurban/backend && npm install
cd ../frontend && npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env.local
# Editar DATABASE_URL, JWT_SECRET, etc.

# 4. Rodar migrações
cd backend
npx prisma migrate dev

# 5. Popular banco com dados de teste
npx prisma db seed

# 6. Iniciar servidores
npm run dev # backend (porta 3001)
cd ../frontend && npm run dev # frontend (porta 3000)
```

### 4.2 Deploy em Staging

**Sequência de Deploy:**

1. **Preparação (Day D-1):**
```bash
# Criar backup completo do banco
pg_dump -U postgres digiurban_staging > backup_pre_deploy_$(date +%Y%m%d).sql

# Validar que todas migrações estão commitadas
cd backend/prisma/migrations
ls -la

# Rodar testes completos
npm run test:e2e
npm run test:unit
```

2. **Deploy Backend (Day D, 02:00 AM):**
```bash
# Pull do código
git pull origin feature/service-flow-complete

# Instalar dependências
npm ci --production

# Rodar migrações (ordem específica)
npx prisma migrate deploy

# Verificar migrações aplicadas
npx prisma migrate status

# Build do backend
npm run build

# Restart do serviço
pm2 restart digiurban-backend
pm2 logs digiurban-backend --lines 100

# Healthcheck
curl https://staging.digiurban.com.br/api/health
```

3. **Deploy Frontend (Day D, 02:30 AM):**
```bash
# Build do Next.js
npm run build

# Verificar que build foi bem-sucedido
ls -la .next/

# Restart do serviço
pm2 restart digiurban-frontend
pm2 logs digiurban-frontend --lines 100

# Healthcheck
curl https://staging.digiurban.com.br/
```

4. **Smoke Tests (Day D, 03:00 AM):**
```bash
# Testar endpoints críticos
curl -X POST https://staging.digiurban.com.br/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"test123"}'

# Testar criação de serviço (via Postman Collection)
newman run tests/postman/digiurban-staging.json

# Testar solicitação de serviço pelo cidadão
# (via script Playwright)
npx playwright test tests/e2e/citizen-service-request.spec.ts
```

5. **Validação Manual (Day D, 09:00 AM):**
- [ ] Login como super admin
- [ ] Criar novo serviço com todas feature flags
- [ ] Validar que configs foram salvas
- [ ] Login como cidadão
- [ ] Solicitar serviço criado
- [ ] Validar que protocolo foi gerado
- [ ] Verificar protocolo em /admin/protocolos
- [ ] Testar em pelo menos 3 secretarias diferentes

### 4.3 Deploy em Produção

**Pré-requisitos:**
- ✅ Todos testes em staging passando
- ✅ Validação manual completa
- ✅ Aprovação do Product Owner
- ✅ Janela de manutenção agendada
- ✅ Comunicação enviada aos usuários

**Janela de Manutenção:**
- **Início:** Domingo, 05:00 AM (horário de menor tráfego)
- **Duração Estimada:** 2 horas
- **Duração Máxima:** 4 horas (com rollback)

**Sequência de Deploy:**

1. **Pré-Deploy (04:45 AM):**
```bash
# Ativar modo de manutenção
curl -X POST https://api.digiurban.com.br/admin/maintenance -d '{"enabled":true}'

# Backup completo
pg_dump -U postgres digiurban_prod > backup_production_$(date +%Y%m%d_%H%M).sql
aws s3 cp backup_production_*.sql s3://digiurban-backups/

# Snapshot do servidor (AWS/DigitalOcean)
# Via console ou CLI
```

2. **Deploy (05:00 AM):**
```bash
# Mesmo processo do staging (ver seção 4.2)
# Atenção: usar branch main, não feature branch
git checkout main
git pull origin main
```

3. **Pós-Deploy (06:30 AM):**
```bash
# Desativar modo de manutenção
curl -X POST https://api.digiurban.com.br/admin/maintenance -d '{"enabled":false}'

# Monitoramento ativo por 2 horas
pm2 monit
tail -f /var/log/nginx/access.log
```

### 4.4 Rollback

**Quando fazer rollback:**
- Taxa de erro > 5% nos primeiros 30 minutos
- Funcionalidade crítica quebrada (login, criação de protocolos)
- Performance degradada (response time > 3s)
- Erro de migração de banco de dados

**Procedimento de Rollback:**

1. **Rollback do Banco (crítico fazer primeiro):**
```bash
# Reverter migrações na ordem inversa
npx prisma migrate resolve --rolled-back XXXXXX_add_protocolid_fk
npx prisma migrate resolve --rolled-back XXXXXX_add_service_type

# OU restaurar backup completo (se migrações não revertem)
psql -U postgres digiurban_prod < backup_production_20251027_0445.sql
```

2. **Rollback do Código:**
```bash
# Backend
git checkout main
git reset --hard <commit-hash-anterior>
npm ci --production
npm run build
pm2 restart digiurban-backend

# Frontend
git reset --hard <commit-hash-anterior>
npm ci --production
npm run build
pm2 restart digiurban-frontend
```

3. **Validação Pós-Rollback:**
```bash
# Smoke tests
curl https://api.digiurban.com.br/api/health
newman run tests/postman/digiurban-prod-smoke.json

# Verificar logs de erro
pm2 logs digiurban-backend --err --lines 50
```

**Tempo Estimado de Rollback:** 15-30 minutos

---

## 5. Checklist de QA

### 5.1 Testes Funcionais

#### Módulo: Criação de Serviços (Admin)

**Cenário 1: Criação básica de serviço**
- [ ] Admin consegue acessar /admin/servicos/novo
- [ ] Formulário multi-step renderiza corretamente
- [ ] Validação de campos obrigatórios funciona
- [ ] POST cria serviço com sucesso (201)
- [ ] Serviço aparece na listagem /admin/servicos
- [ ] Dados básicos estão corretos (nome, descrição, secretaria)

**Cenário 2: Criação com custom form**
- [ ] Toggle hasCustomForm funciona
- [ ] Editor de schema JSON aparece
- [ ] Schema inválido é rejeitado com mensagem clara
- [ ] Schema válido é salvo em ServiceForm
- [ ] ServiceForm está vinculado ao Service (serviceId correto)

**Cenário 3: Criação com localização**
- [ ] Toggle hasLocation funciona
- [ ] Mapa interativo é exibido
- [ ] Configuração de raio/polígono funciona
- [ ] Config é salva em ServiceLocation
- [ ] ServiceLocation está vinculado ao Service

**Cenário 4: Criação com agendamento**
- [ ] Toggle hasScheduling funciona
- [ ] Configuração de horários disponíveis funciona
- [ ] Duração do atendimento pode ser definida
- [ ] Config é salva no campo schedulingConfig (JSON)

**Cenário 5: Criação completa (todas features)**
- [ ] Serviço com 6 feature flags é criado
- [ ] Todas configurações são salvas em transação
- [ ] Se uma falhar, rollback completo acontece
- [ ] Serviço completo pode ser recuperado com includes

#### Módulo: Solicitação de Serviços (Cidadão)

**Cenário 1: Catálogo de serviços**
- [ ] Cidadão acessa /cidadao/servicos sem erro
- [ ] Lista de serviços é carregada do tenant correto
- [ ] Filtros por categoria/secretaria funcionam
- [ ] Busca textual funciona
- [ ] Card de serviço exibe informações corretas
- [ ] Botão "Solicitar" está visível

**Cenário 2: Solicitação básica**
- [ ] Clicar em "Solicitar" redireciona para /servicos/[id]/solicitar
- [ ] Formulário de solicitação renderiza
- [ ] Campos obrigatórios são validados
- [ ] Enviar formulário cria protocolo (POST 201)
- [ ] Protocolo tem número único gerado
- [ ] Redirecionamento para /cidadao/protocolos funciona
- [ ] Toast de sucesso é exibido
- [ ] Protocolo aparece na lista

**Cenário 3: Solicitação com localização**
- [ ] Step de localização é renderizado
- [ ] Mapa interativo permite marcar ponto
- [ ] Validação de área permitida funciona
- [ ] Ponto fora da área é rejeitado com mensagem
- [ ] locationData é enviado no payload

**Cenário 4: Solicitação com agendamento**
- [ ] Step de agendamento é renderizado
- [ ] Calendário exibe apenas datas/horários disponíveis
- [ ] Seleção de data/hora funciona
- [ ] schedulingData é enviado no payload

**Cenário 5: Solicitação com anexos**
- [ ] Step de anexos é renderizado
- [ ] Upload de múltiplos arquivos funciona
- [ ] Validação de tipo/tamanho funciona
- [ ] Preview de arquivos funciona
- [ ] Arquivos são enviados via FormData

**Cenário 6: Revisão e envio**
- [ ] Step de revisão exibe todos dados
- [ ] Botão "Voltar" permite editar steps anteriores
- [ ] Botão "Enviar" envia requisição completa
- [ ] Loading state é exibido durante envio

#### Módulo: Integração com Secretarias

**Cenário 1: Saúde (Health)**
- [ ] POST /admin/secretarias/saude cria Protocol + AttendanceHealth
- [ ] Campos específicos (patientName, symptoms) são salvos
- [ ] protocolId FK está correto
- [ ] Protocolo aparece em /admin/protocolos

**Cenário 2: Educação (Education)**
- [ ] POST /admin/secretarias/educacao cria Protocol + AttendanceEducation
- [ ] Campos específicos (studentName, schoolName) são salvos

**Cenário 3: Habitação (Housing)**
- [ ] POST /admin/secretarias/habitacao cria Protocol + AttendanceHousing
- [ ] Campos específicos (address, housingType) são salvos

**(Repetir para as 10 secretarias)**

**Cenário 11: Transação atômica**
- [ ] Se criação de Protocol falhar, Attendance não é criado
- [ ] Se criação de Attendance falhar, Protocol é revertido
- [ ] Banco de dados fica consistente

#### Módulo: Rastreamento de Protocolos

**Cenário 1: Atualização de status**
- [ ] Admin altera status de ABERTO para EM_ANDAMENTO
- [ ] updatedAt é atualizado
- [ ] Status é salvo corretamente

**Cenário 2: Conclusão de protocolo**
- [ ] Admin altera status para CONCLUIDO
- [ ] concludedAt é setado com data/hora atual
- [ ] Protocolo não pode mais ser editado (validação)

**Cenário 3: Reabertura de protocolo**
- [ ] Admin altera status de CONCLUIDO para ABERTO
- [ ] concludedAt é limpo (null)

**Cenário 4: Numeração única**
- [ ] Cada protocolo tem número único no formato {PREFIX}-{YYYY}-{SEQ}
- [ ] Sequencial nunca se repete dentro do mesmo tenant/ano
- [ ] Múltiplos tenants têm sequências independentes

### 5.2 Testes Não-Funcionais

#### Performance

**Critérios de Aceite:**
- [ ] GET /api/citizen/services retorna em < 500ms (100 serviços)
- [ ] POST /api/citizen/services/:id/request retorna em < 2s
- [ ] GET /api/protocols?page=1 retorna em < 800ms (1000 protocolos)
- [ ] Frontend renderiza página em < 1.5s (4G)
- [ ] Bundle size do frontend < 1MB (gzipped)

**Testes de Carga:**
- [ ] Sistema suporta 100 requisições/segundo sem degradação
- [ ] Banco suporta 500 conexões simultâneas
- [ ] Criação de 1000 protocolos em paralelo não causa deadlock

#### Segurança

**Critérios de Aceite:**
- [ ] JWT expirado retorna 401 Unauthorized
- [ ] Cidadão não acessa endpoints /admin/* (403)
- [ ] Tenant A não acessa dados do Tenant B
- [ ] SQL Injection não funciona em filtros de busca
- [ ] XSS não funciona em campos de texto
- [ ] CSRF token é validado em mutations

**Testes de Penetração:**
- [ ] Tentar acessar protocolo de outro tenant (deve retornar 404)
- [ ] Tentar enviar payload malicioso em customForm
- [ ] Tentar upload de arquivo executável (.exe, .sh)
- [ ] Tentar bypass de rate limiting

#### Usabilidade

**Critérios de Aceite:**
- [ ] Mensagens de erro são claras e acionáveis
- [ ] Loading states são exibidos em todas operações assíncronas
- [ ] Formulários têm validação inline
- [ ] Sistema funciona em mobile (responsive)
- [ ] Sistema é acessível (WCAG 2.1 AA)

**Testes de Usabilidade:**
- [ ] Usuário não-técnico consegue solicitar serviço em < 3 minutos
- [ ] Admin consegue criar serviço completo em < 5 minutos
- [ ] Navegação é intuitiva (não requer treinamento)

#### Compatibilidade

**Critérios de Aceite:**
- [ ] Funciona no Chrome 120+
- [ ] Funciona no Firefox 121+
- [ ] Funciona no Safari 17+
- [ ] Funciona no Edge 120+
- [ ] Funciona em mobile (iOS Safari, Chrome Android)

### 5.3 Testes de Regressão

**Funcionalidades Existentes que NÃO podem quebrar:**

- [ ] Login de super admin
- [ ] Login de admin
- [ ] Login de cidadão
- [ ] Criação de tenant
- [ ] Cadastro de usuários
- [ ] Listagem de serviços (admin)
- [ ] Edição de serviços (admin)
- [ ] Exclusão de serviços (admin)
- [ ] Listagem de protocolos (admin)
- [ ] Listagem de protocolos (cidadão)
- [ ] Filtros em protocolos
- [ ] Exportação de relatórios
- [ ] Atribuição de protocolos a agentes

---

## 6. Critérios de Aceite Globais

### 6.1 Por Epic

**Epic 1 - Fluxo Cidadão:**
- ✅ Cidadão consegue solicitar qualquer serviço ativo
- ✅ Protocolo é gerado automaticamente
- ✅ Número do protocolo é único e rastreável
- ✅ Cidadão recebe confirmação com número do protocolo
- ✅ Protocolo aparece em /cidadao/protocolos imediatamente
- ✅ Formulário valida todos campos obrigatórios
- ✅ Mensagens de erro são claras

**Epic 2 - Config Avançadas:**
- ✅ Todas configurações são salvas em transação
- ✅ Se uma falhar, rollback completo acontece
- ✅ ServiceForm é criado se hasCustomForm
- ✅ ServiceLocation é criado se hasLocation
- ✅ Config JSON é validado antes de salvar
- ✅ Serviço completo pode ser recuperado com include

**Epic 3 - Secretarias:**
- ✅ 10 secretarias criam protocolos automaticamente
- ✅ Cada Attendance está vinculado a um Protocol via FK
- ✅ Não há mais campo protocol String
- ✅ Dados podem ser consultados via JOIN
- ✅ Frontend exibe dados específicos de cada secretaria

**Epic 4 - Tipagem:**
- ✅ Campo serviceType existe em todos serviços
- ✅ Frontend exibe botões condicionalmente baseado no tipo
- ✅ Backend valida tipo antes de criar protocolo
- ✅ Migração popula tipo correto em serviços existentes

**Epic 5 - Numeração:**
- ✅ Todos protocolos têm formato {PREFIX}-{YYYY}-{SEQ}
- ✅ Função centralizada é usada em todas rotas
- ✅ Não há duplicação de números
- ✅ Protocolos existentes foram renumerados

**Epic 6 - Conclusão:**
- ✅ concludedAt é setado quando status = CONCLUIDO
- ✅ concludedAt é limpo quando status muda de CONCLUIDO
- ✅ Testes unitários cobrem todos cenários

### 6.2 Definição de "Done"

Uma tarefa é considerada **Done** quando:

1. ✅ **Código implementado:**
   - Código escrito seguindo padrões do projeto
   - Tipagem TypeScript completa
   - Sem erros de lint (ESLint)
   - Sem warnings do compilador

2. ✅ **Testes passando:**
   - Testes unitários criados e passando
   - Testes E2E criados e passando (se aplicável)
   - Cobertura de código > 80% nas novas linhas

3. ✅ **Code Review aprovado:**
   - Pelo menos 1 aprovação de outro desenvolvedor
   - Comentários do review resolvidos
   - Sem code smells reportados pelo SonarQube

4. ✅ **Documentação atualizada:**
   - README atualizado se necessário
   - Comentários JSDoc nos métodos públicos
   - Swagger/OpenAPI atualizado (se endpoint novo)

5. ✅ **Deploy em staging:**
   - Código merged na branch staging
   - Deploy executado com sucesso
   - Smoke tests passando

6. ✅ **Validação funcional:**
   - QA validou manualmente
   - Product Owner aprovou
   - Sem bugs críticos ou blockers abertos

---

## 7. Gestão de Riscos

### 7.1 Matriz de Riscos

| ID | Risco | Probabilidade | Impacto | Severidade | Mitigação |
|----|-------|---------------|---------|------------|-----------|
| R1 | Perda de dados durante migração de protocolId | Baixa | Alto | **ALTO** | Backup completo antes da migração + teste em staging |
| R2 | Performance degradada com JOINs nas 10 secretarias | Média | Médio | **MÉDIO** | Criar índices em protocolId + testes de carga |
| R3 | Inconsistência de numeração em alta concorrência | Média | Alto | **ALTO** | Usar SELECT FOR UPDATE + testes de stress |
| R4 | Formulários dinâmicos quebram com schema inválido | Alta | Médio | **MÉDIO** | Validação Zod no frontend + backend |
| R5 | Upload de arquivos grandes causa timeout | Média | Baixo | **BAIXO** | Implementar chunked upload + limite de 10MB |
| R6 | Tenant A acessa dados do Tenant B | Baixa | Crítico | **CRÍTICO** | Middleware de validação + testes de segurança |
| R7 | Rollback falha em produção | Baixa | Crítico | **CRÍTICO** | Testar rollback em staging + snapshot do servidor |
| R8 | Frontend bundle size explode com novos componentes | Média | Baixo | **BAIXO** | Code splitting + lazy loading |
| R9 | Dependências desatualizadas com vulnerabilidades | Média | Médio | **MÉDIO** | npm audit + Dependabot configurado |
| R10 | Equipe não familiar com Prisma transactions | Alta | Médio | **MÉDIO** | Pair programming + documentação interna |

### 7.2 Plano de Mitigação Detalhado

#### R1: Perda de dados durante migração

**Plano de Prevenção:**
1. Criar backup completo do banco antes da migração
2. Rodar migração em ambiente de staging primeiro
3. Validar integridade dos dados após migração
4. Manter script de rollback testado

**Plano de Contingência:**
```sql
-- Se migração falhar, restaurar backup
pg_restore -U postgres -d digiurban_prod backup_pre_migration.sql

-- OU reverter migração específica
ALTER TABLE "AttendanceHealth" DROP COLUMN "protocolId";
-- (repetir para 10 tabelas)
```

#### R3: Inconsistência de numeração

**Plano de Prevenção:**
```typescript
// Usar lock pessimista
const lastProtocol = await prisma.protocol.findFirst({
  where: { tenantId, createdAt: { gte: startOfYear } },
  orderBy: { protocolNumber: 'desc' },
  select: { protocolNumber: true },
  // SELECT FOR UPDATE garante exclusividade
  lock: { mode: 'pessimistic_write' }
});
```

**Plano de Contingência:**
- Criar job que roda diariamente para detectar duplicatas
- Se encontrar, renumerar sequencial mantendo ordem cronológica

#### R6: Vazamento de dados entre tenants

**Plano de Prevenção:**
```typescript
// Middleware obrigatório em TODAS rotas
app.use((req, res, next) => {
  const tenantId = req.headers['x-tenant-id'];
  if (!tenantId) return res.status(400).json({ error: 'Tenant ID required' });
  req.tenantId = tenantId;
  next();
});

// SEMPRE incluir tenantId em queries
const services = await prisma.service.findMany({
  where: { tenantId: req.tenantId } // ← OBRIGATÓRIO
});
```

**Plano de Contingência:**
- Se vazamento detectado, notificar LGPD imediatamente
- Rotacionar JWT secrets para invalidar tokens
- Auditar logs para identificar escopo do vazamento

#### R7: Rollback falha

**Plano de Prevenção:**
1. Sempre testar rollback em staging antes de produção
2. Criar snapshot do servidor antes do deploy
3. Documentar procedimento de rollback em runbook
4. Ter duas pessoas on-call durante deploy

**Plano de Contingência:**
```bash
# Rollback de emergência via snapshot
# (AWS)
aws ec2 create-image --instance-id i-xxxxx --name "pre-deploy-snapshot"
aws ec2 create-replace-root-volume-task --instance-id i-xxxxx --snapshot-id snap-xxxxx

# (DigitalOcean)
doctl compute droplet-action snapshot <droplet-id> --snapshot-name pre-deploy
doctl compute droplet-action restore <droplet-id> --image-id <snapshot-id>
```

---

## 8. Comunicação e Stakeholders

### 8.1 Stakeholders

| Papel | Nome | Responsabilidade | Comunicação |
|-------|------|------------------|-------------|
| Product Owner | [Nome] | Priorização, aceite funcional | Daily standup, Sprint review |
| Tech Lead | [Nome] | Arquitetura, code review | Slack, pair programming |
| Backend Dev 1 | [Nome] | Implementação backend, migrações | Slack, PR reviews |
| Backend Dev 2 | [Nome] | Implementação secretarias, testes | Slack, PR reviews |
| Frontend Dev 1 | [Nome] | Implementação formulários, hooks | Slack, PR reviews |
| Frontend Dev 2 | [Nome] | Implementação componentes UI | Slack, PR reviews |
| QA Engineer | [Nome] | Testes E2E, validação manual | Jira, Slack |
| DevOps | [Nome] | Deploy, monitoramento, rollback | On-call, Slack |
| DBA | [Nome] | Migrações, performance, backup | Email, Slack |

### 8.2 Cadência de Comunicação

**Daily Standup:** 09:30 AM (15 minutos)
- O que fiz ontem?
- O que vou fazer hoje?
- Tenho algum blocker?

**Sprint Planning:** Segunda-feira, 10:00 AM (2 horas)
- Review do backlog
- Estimativa de tarefas
- Commit da sprint

**Sprint Review:** Sexta-feira, 15:00 PM (1 hora)
- Demo das funcionalidades
- Feedback do Product Owner
- Ajustes no backlog

**Sprint Retrospective:** Sexta-feira, 16:00 PM (1 hora)
- O que funcionou bem?
- O que pode melhorar?
- Action items para próxima sprint

**Deploy Meeting:** Conforme agendado (30 minutos)
- Checklist pré-deploy
- Monitoramento ativo
- Post-mortem (se houver incidentes)

### 8.3 Canais de Comunicação

- **Slack #digiurban-dev:** Discussões técnicas diárias
- **Slack #digiurban-alerts:** Alertas de monitoramento
- **Jira:** Tracking de tarefas e bugs
- **GitHub:** Code reviews e PRs
- **Confluence:** Documentação técnica
- **Email:** Comunicação formal (deploy em produção)

---

## 9. Métricas de Sucesso

### 9.1 KPIs Técnicos

| Métrica | Baseline | Meta | Como Medir |
|---------|----------|------|------------|
| Taxa de conclusão de solicitações | 0% (não implementado) | 95% | (Protocolos criados / Tentativas) × 100 |
| Tempo médio de resposta da API | 800ms | < 500ms | Monitoramento APM (New Relic/Datadog) |
| Taxa de erro em produção | N/A | < 1% | (Erros 5xx / Total requests) × 100 |
| Cobertura de testes | 45% | > 80% | Jest coverage report |
| Tempo de deploy | N/A | < 30 min | Medir tempo entre git push e deploy completo |
| MTTR (Mean Time To Recovery) | N/A | < 15 min | Tempo médio entre detecção e rollback |

### 9.2 KPIs de Negócio

| Métrica | Baseline | Meta | Como Medir |
|---------|----------|------|------------|
| Número de serviços solicitados/mês | 0 | 500+ | COUNT(protocols) WHERE createdAt > last_month |
| Taxa de adoção por secretaria | 9% (1/11) | 100% | (Secretarias usando / Total) × 100 |
| Satisfação do usuário (NPS) | N/A | > 8.0 | Survey após conclusão do protocolo |
| Tempo médio de conclusão de protocolo | N/A | < 7 dias | AVG(concludedAt - createdAt) WHERE status = CONCLUIDO |

### 9.3 Dashboards

**Dashboard de Desenvolvimento (Jira):**
- Burndown chart da sprint
- Velocity histórico
- Blocker count
- PR merge time

**Dashboard de Deploy (Grafana):**
- Request rate (req/s)
- Error rate (%)
- Response time (p50, p95, p99)
- Database connections
- CPU/Memory usage

**Dashboard de Negócio (Metabase):**
- Solicitações por dia/semana/mês
- Top 10 serviços mais solicitados
- Tempo médio de conclusão por secretaria
- Taxa de satisfação do cidadão

---

## 10. Apêndices

### Apêndice A: Glossário

- **Protocol:** Registro de atendimento/solicitação rastreável
- **Service:** Serviço oferecido pela prefeitura (cadastrado pelo admin)
- **Attendance:** Registro específico de cada secretaria vinculado a um Protocol
- **Feature Flag:** Boolean que ativa/desativa funcionalidades do serviço
- **ServiceType:** Classificação do serviço (REQUEST, REGISTRATION, CONSULTATION, BOTH)
- **Multi-tenant:** Arquitetura onde múltiplas prefeituras usam a mesma aplicação com dados isolados
- **SLA:** Service Level Agreement (prazo acordado para conclusão)
- **Workflow:** Conjunto de etapas que um protocolo deve seguir

### Apêndice B: Referências

- [Documentação Prisma Transactions](https://www.prisma.io/docs/concepts/components/prisma-client/transactions)
- [Next.js App Router](https://nextjs.org/docs/app)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Zod Validation](https://zod.dev/)
- [React Hook Form](https://react-hook-form.com/)

### Apêndice C: Contatos de Emergência

| Situação | Contato | Telefone | Email |
|----------|---------|----------|-------|
| Deploy blocker | Tech Lead | [Telefone] | [Email] |
| Banco de dados down | DBA | [Telefone] | [Email] |
| Servidor down | DevOps | [Telefone] | [Email] |
| Vazamento de dados | CISO | [Telefone] | [Email] |
| Escalação máxima | CTO | [Telefone] | [Email] |

---

**Aprovações:**

- [ ] Product Owner: _________________ Data: ___/___/___
- [ ] Tech Lead: _________________ Data: ___/___/___
- [ ] DevOps: _________________ Data: ___/___/___

---

*Este documento é vivo e deve ser atualizado conforme o projeto evolui.*
