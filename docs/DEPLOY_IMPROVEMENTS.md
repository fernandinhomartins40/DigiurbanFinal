# Melhorias no Deploy - DigiUrban

## Problema Identificado

O sistema apresentava erros recorrentes de credenciais após deploy devido a:

1. **Migrations não eram sempre aplicadas** - O script tentava aplicar migrations mas falhava silenciosamente em alguns casos
2. **Seed não era reexecutado** - O arquivo `.seeded` persistia no volume Docker, impedindo que o seed fosse executado novamente mesmo quando dados essenciais estavam faltando
3. **Sem validação de dados** - Não havia verificação se dados críticos (Super Admin, UNASSIGNED_POOL) existiam no banco

## Soluções Implementadas

### 1. Backup Automático do Banco
- Antes de cada migration, é criado um backup do banco com timestamp
- Mantém apenas os 3 backups mais recentes
- Se migration falhar, o backup é restaurado automaticamente

```bash
BACKUP_FILE="/app/data/dev.db.backup-$(date +%Y%m%d-%H%M%S)"
cp /app/data/dev.db "$BACKUP_FILE"
```

### 2. Verificação Inteligente de Dados Essenciais

Criado script Node.js (`scripts/check-db-integrity.js`) que verifica:
- ✅ Existência de Super Admin
- ✅ Existência do UNASSIGNED_POOL tenant
- ✅ Existência do Demo tenant

O script retorna:
- **Exit code 0**: Todos os dados essenciais existem
- **Exit code 1**: Faltam dados, seed precisa ser executado

### 3. Seed Condicional e Inteligente

O seed agora é executado quando:
- É a primeira execução (sem arquivo `.seeded`)
- **OU** quando dados essenciais estão faltando (mesmo com `.seeded` presente)

Fluxo:
```
1. Verificar se arquivo .seeded existe
2. Verificar integridade dos dados
3. Se dados faltando → Remover .seeded e executar seed
4. Após seed → Verificar novamente
5. Se ainda faltando → Falhar deployment
```

### 4. Fallback de Migrations

Estratégia em cascata para aplicar migrations:
```
1. Tentar: prisma migrate deploy
   ↓ (se falhar)
2. Tentar: prisma db push
   ↓ (se falhar)
3. Restaurar backup
4. Falhar deployment
```

## Arquivos Modificados

### 1. `docker/startup.sh`
- ✅ Adicionado backup automático
- ✅ Adicionada função `check_essential_data()`
- ✅ Adicionada lógica condicional de seed
- ✅ Adicionada validação pós-seed
- ✅ Melhor tratamento de erros

### 2. `digiurban/backend/scripts/check-db-integrity.js` (novo)
- ✅ Script Node.js para verificar integridade
- ✅ Usa Prisma Client para queries seguras
- ✅ Retorna JSON com status detalhado

### 3. `Dockerfile`
- ✅ Adicionada cópia da pasta `scripts` no build

## Como Funciona Agora

### Deploy Normal (dados existem)
```
🚀 Startup
📁 Criando diretórios
🔧 Gerando Prisma Client
💾 Backup do banco
📦 Executando migrations → ✅ OK
🔍 Verificando dados essenciais
  - Super Admins: 1 ✅
  - UNASSIGNED_POOL: EXISTS ✅
  - Demo Tenant: EXISTS ✅
ℹ️  Database já inicializado
✅ Startup concluído
```

### Deploy com Dados Faltando
```
🚀 Startup
📁 Criando diretórios
🔧 Gerando Prisma Client
💾 Backup do banco
📦 Executando migrations → ✅ OK
🔍 Verificando dados essenciais
  - Super Admins: 0 ❌
  - UNASSIGNED_POOL: MISSING ❌
⚠️  Dados essenciais faltando!
🌱 Executando seed...
✅ Seed concluído
🔍 Verificando novamente
  - Super Admins: 1 ✅
  - UNASSIGNED_POOL: EXISTS ✅
✅ Startup concluído
```

### Deploy com Falha
```
🚀 Startup
📦 Executando migrations → ❌ FALHOU
⚠️  Tentando db push... → ❌ FALHOU
❌ Restaurando backup... → ✅ OK
❌ Deploy falhou (banco restaurado)
```

## Benefícios

1. **🔒 Segurança**: Backup automático antes de migrations
2. **🎯 Confiabilidade**: Sempre verifica se dados essenciais existem
3. **🔄 Auto-recuperação**: Seed é reexecutado automaticamente se necessário
4. **📊 Transparência**: Logs detalhados de cada etapa
5. **⚡ Performance**: Seed só é executado quando realmente necessário
6. **🛡️ Proteção**: Restauração automática de backup em caso de falha

## Testes Recomendados

Para validar as melhorias, teste os seguintes cenários:

### Teste 1: Deploy Normal
```bash
# Deploy deve completar sem executar seed
docker-compose -f docker-compose.vps.yml up --build
# Logs devem mostrar: "Database já foi inicializado"
```

### Teste 2: Simular Dados Faltando
```bash
# Remover arquivo .seeded
docker exec digiurban-vps rm /app/data/.seeded
# Restart - deve executar seed
docker-compose -f docker-compose.vps.yml restart
```

### Teste 3: Verificar Integridade Manual
```bash
# Executar script de verificação
docker exec digiurban-vps sh -c "cd /app/backend && DATABASE_URL=file:/app/data/dev.db node scripts/check-db-integrity.js"
# Deve retornar JSON com status
```

## Monitoramento

Logs importantes para monitorar:

- `💾 Fazendo backup do banco` - Backup criado
- `📦 Executando migrations` - Migrations em execução
- `🔍 Verificando dados essenciais` - Validação de dados
- `🌱 Executando seed` - Seed sendo executado
- `✅ Startup concluído` - Tudo OK

## Rollback

Se necessário reverter as mudanças:

1. Os backups são mantidos em `/app/data/dev.db.backup-*`
2. Para restaurar manualmente:
```bash
docker exec digiurban-vps cp /app/data/dev.db.backup-TIMESTAMP /app/data/dev.db
docker-compose -f docker-compose.vps.yml restart
```

## Próximos Passos (Opcional)

- [ ] Adicionar healthcheck que verifica dados essenciais
- [ ] Notificação quando seed é executado em produção
- [ ] Métricas de tempo de startup
- [ ] Testes automatizados de integridade
