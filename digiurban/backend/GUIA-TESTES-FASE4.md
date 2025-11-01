# 🧪 GUIA RÁPIDO - TESTES FASE 4

## 🚀 Comandos Rápidos

### Executar Todos os Testes da Fase 4
```bash
npm run test:phase4
```

Isso executa:
1. ✅ Testes de integração (22 testes)
2. ⚡ Testes de performance (13 testes)
3. 🔍 Auditoria final (100+ verificações)

---

### Executar Testes Individualmente

#### Testes de Integração
```bash
npm run test:integration
```

**O que testa:**
- Criação de protocolos para 8 secretarias
- Aprovação e rejeição de protocolos
- Verificação de entidades de módulo
- Workflows e SLA

**Tempo estimado:** ~2-3 minutos

---

#### Testes de Performance
```bash
npm run test:performance
```

**O que testa:**
- Criação de protocolo (< 500ms)
- Listagem paginada (< 200ms)
- Analytics (< 1s)
- Stress tests (100 protocolos)

**Tempo estimado:** ~3-5 minutos

---

#### Auditoria Final
```bash
npm run audit:phase4
```

**O que audita:**
- 📊 Schema Prisma (104 verificações)
- 🔧 Entity Handlers (cobertura)
- 🔄 Workflows (alinhamento)
- 🗺️ Module Mapping (validação)
- 🗄️ Database (integridade)
- ⚙️ Services (8 arquivos)
- 🛣️ Routes (20 arquivos)

**Tempo estimado:** ~10 segundos

**Saída:**
- Console colorido
- Arquivo `FASE-4-AUDITORIA-FINAL.md`

---

## 📊 Interpretando Resultados

### Testes de Integração

✅ **SUCESSO**
```
PASS  __tests__/integration/protocol-module-integration.test.ts
  ✓ ATENDIMENTOS_SAUDE - Criar protocolo (250ms)
  ✓ AGENDAMENTOS_MEDICOS - Criar protocolo (300ms)
  ...
Tests: 22 passed, 22 total
```

❌ **FALHA**
```
FAIL  __tests__/integration/protocol-module-integration.test.ts
  ✕ ATENDIMENTOS_SAUDE - Criar protocolo (500ms)
    Expected: true
    Received: false
```

**Ação:** Verificar logs do erro e corrigir handler/workflow

---

### Testes de Performance

✅ **SUCESSO**
```
✅ Criação de protocolo: 350ms (esperado < 500ms)
✅ Listagem paginada (20 itens): 120ms (esperado < 200ms)
✅ Estatísticas gerais: 650ms (esperado < 1000ms)
```

⚠️ **ATENÇÃO**
```
⚠️ Criação de protocolo: 480ms (esperado < 500ms)
```
**Ação:** Próximo do limite, considerar otimização

❌ **FALHA**
```
❌ Criação de protocolo: 650ms (esperado < 500ms)
```
**Ação:** Performance abaixo do esperado, otimizar queries

---

### Auditoria Final

✅ **EXCELENTE** (95-100%)
```
🏆 CLASSIFICAÇÃO FINAL: EXCELENTE (10/10)

Total: 120 verificações
✅ Passou: 120 (100%)
❌ Falhou: 0
⚠️ Avisos: 0
```

⚠️ **BOM** (80-94%)
```
⚠️ CLASSIFICAÇÃO FINAL: BOM (8/10)

Total: 120 verificações
✅ Passou: 110 (91.7%)
❌ Falhou: 5
⚠️ Avisos: 5
```

❌ **NECESSITA MELHORIAS** (< 80%)
```
❌ CLASSIFICAÇÃO FINAL: NECESSITA MELHORIAS (6/10)

Total: 120 verificações
✅ Passou: 90 (75%)
❌ Falhou: 20
⚠️ Avisos: 10
```

---

## 🐛 Solução de Problemas

### Problema: Testes falham por timeout

**Erro:**
```
Timeout - Async callback was not invoked within the 5000 ms timeout
```

**Solução:**
```bash
# Já configurado em test:performance
npm run test:performance --testTimeout=60000
```

---

### Problema: Banco de dados não conecta

**Erro:**
```
PrismaClientInitializationError: Can't reach database server
```

**Solução:**
```bash
# 1. Verificar .env
cat .env

# 2. Verificar se PostgreSQL está rodando
# Windows:
Get-Service postgresql*

# Linux/Mac:
sudo systemctl status postgresql

# 3. Gerar cliente Prisma
npx prisma generate

# 4. Aplicar migrations
npx prisma db push
```

---

### Problema: Módulo não encontrado

**Erro:**
```
Cannot find module '@prisma/client'
```

**Solução:**
```bash
# Reinstalar dependências
npm install

# Gerar cliente Prisma
npx prisma generate
```

---

### Problema: Testes passam mas auditoria falha

**Causa:** Handlers ou workflows faltando

**Solução:**
```bash
# Ver relatório detalhado
npm run audit:phase4

# Verificar arquivo gerado
cat FASE-4-AUDITORIA-FINAL.md

# Implementar handlers/workflows faltantes
```

---

## 📈 CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/fase4-tests.yml
name: Fase 4 - Tests & Audit

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma Client
        run: npx prisma generate

      - name: Run migrations
        run: npx prisma db push
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/digiurban_test

      - name: Run Fase 4 Tests
        run: npm run test:phase4
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/digiurban_test

      - name: Upload Audit Report
        uses: actions/upload-artifact@v3
        with:
          name: audit-report
          path: FASE-4-AUDITORIA-FINAL.md
```

---

## 📊 Métricas de Sucesso

### Critérios para Aprovação

✅ **Testes de Integração**
- 100% dos testes passando
- Tempo total < 5 minutos
- Sem erros de timeout

✅ **Testes de Performance**
- Todas as métricas dentro do esperado:
  - Criação: < 500ms
  - Listagem: < 200ms
  - Analytics: < 1s
- Stress test completo

✅ **Auditoria Final**
- Classificação: BOM ou superior (≥ 8/10)
- Taxa de sucesso: ≥ 90%
- 0 falhas críticas

---

## 🔄 Workflow Recomendado

### Desenvolvimento Diário

```bash
# 1. Antes de commitar
npm run test:integration

# 2. Se mudou performance
npm run test:performance

# 3. Antes de PR
npm run test:phase4
```

### Antes de Deploy

```bash
# Suite completa
npm run validate:phase4

# Verificar relatório
cat FASE-4-AUDITORIA-FINAL.md

# Se tudo OK, fazer deploy
```

### Após Deploy

```bash
# Verificar integridade
npm run audit:phase4

# Monitorar performance em produção
# (usar ferramentas de APM)
```

---

## 📚 Documentação Adicional

- [FASE-4-COMPLETA.md](../../FASE-4-COMPLETA.md) - Documentação completa da Fase 4
- [AUDITORIA-MOTOR-PROTOCOLOS-COMPLETA.md](../../AUDITORIA-MOTOR-PROTOCOLOS-COMPLETA.md) - Plano de auditoria
- [__tests__/integration/](../__tests__/integration/) - Código dos testes de integração
- [__tests__/performance/](../__tests__/performance/) - Código dos testes de performance
- [scripts/audit-phase4-final.ts](../scripts/audit-phase4-final.ts) - Script de auditoria

---

## ✅ Checklist Rápido

Antes de considerar a Fase 4 completa:

- [ ] `npm run test:integration` - 22/22 testes passando
- [ ] `npm run test:performance` - 13/13 testes passando
- [ ] `npm run audit:phase4` - Classificação ≥ 8/10
- [ ] Relatório `FASE-4-AUDITORIA-FINAL.md` gerado
- [ ] 0 falhas críticas
- [ ] CI/CD configurado (opcional)

---

**Última atualização:** 31 de Outubro de 2025
