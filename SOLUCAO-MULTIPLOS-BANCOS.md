# 🔧 Solução: Múltiplos Bancos SQLite Criados no Deploy

## 🎯 Problema Identificado

Durante o deploy na VPS, **3 bancos de dados SQLite** estavam sendo criados:

1. `/root/digiurban/digiurban/backend/dev.db` - **0 bytes (vazio)**
2. `/root/digiurban/digiurban/backend/prisma/dev.db` - **1.7 MB**
3. `/app/data/dev.db` (dentro do container) - **1.7 MB (correto)** ✅

Isso causava:
- ❌ Inconsistência de dados
- ❌ Serviços não aparecendo para cidadãos
- ❌ Confusão sobre qual banco estava sendo usado
- ❌ Desperdício de espaço em disco

---

## 🔍 Causa Raiz

### 1. **Dockerfile - Linha 23 (ANTES)**
```dockerfile
# Gerar Prisma Client
RUN npx prisma generate
```

**Problema:** `prisma generate` era executado **SEM** a variável `DATABASE_URL` configurada, fazendo o Prisma criar um banco temporário em um local indefinido.

### 2. **startup.sh - Linha 18 (ANTES)**
```sh
# Gerar Prisma Client (garantir que está correto)
echo "🔧 Gerando Prisma Client..."
npx prisma generate || echo "⚠️ Prisma generate falhou"
```

**Problema:** Executava `prisma generate` novamente no diretório `/app/backend` sem `DATABASE_URL`, potencialmente criando outro banco.

### 3. **.env local**
```env
DATABASE_URL="file:./dev.db"
```

**Problema:** Caminho **relativo** que muda dependendo do diretório onde o comando é executado.

---

## ✅ Solução Implementada

### 1. Corrigir Dockerfile

**Arquivo:** `Dockerfile` (linhas 22-26)

```dockerfile
# Gerar Prisma Client (sem criar banco - apenas gerar tipos)
# ⚠️ IMPORTANTE: usar DATABASE_URL temporário para evitar criação de banco
ARG DATABASE_URL=file:/app/data/dev.db
ENV DATABASE_URL=${DATABASE_URL}
RUN npx prisma generate
```

**Benefício:** Garante que mesmo durante o build, o Prisma sabe onde o banco estará em produção.

---

### 2. Otimizar startup.sh

**Arquivo:** `docker/startup.sh` (linhas 16-24)

```sh
# Gerar Prisma Client APENAS se não existir
# (já foi gerado durante o build do Docker, mas podemos revalidar)
echo "🔧 Validando Prisma Client..."
if [ ! -d "node_modules/.prisma/client" ]; then
    echo "   Gerando Prisma Client..."
    DATABASE_URL="file:/app/data/dev.db" npx prisma generate || echo "⚠️ Prisma generate falhou"
else
    echo "   ✅ Prisma Client já existe"
fi
```

**Benefícios:**
- ✅ Só regenera se realmente necessário
- ✅ Sempre usa `DATABASE_URL` explícito
- ✅ Evita criação de bancos duplicados

---

### 3. Padronizar .env local

**Arquivo:** `digiurban/backend/.env`

```env
# Database
# IMPORTANTE: Usar caminho relativo a partir de backend/
DATABASE_URL="file:./prisma/dev.db"
```

**Benefício:** Caminho relativo consistente que sempre aponta para `backend/prisma/dev.db`.

---

## 📋 Fluxo Correto Após a Correção

### Durante o Build (Dockerfile)
```
1. ✅ Copiar código do backend
2. ✅ Gerar Prisma Client com DATABASE_URL=file:/app/data/dev.db
3. ✅ Build TypeScript
   → Nenhum banco é criado, apenas tipos são gerados
```

### Durante o Startup (startup.sh)
```
1. ✅ Criar diretórios /app/data, /app/uploads, /app/logs
2. ✅ Validar se Prisma Client existe (se não, regenerar)
3. ✅ Criar /app/data/dev.db se não existir
4. ✅ Fazer backup do banco
5. ✅ Executar migrations com DATABASE_URL=file:/app/data/dev.db
6. ✅ Executar seed se necessário
7. ✅ Iniciar supervisord (backend + frontend + nginx)
```

**Resultado:** Apenas **1 banco** é criado e usado: `/app/data/dev.db`

---

## 🚀 Como Aplicar a Correção na VPS

### Passo 1: Fazer backup do banco atual
```bash
ssh root@72.60.10.108
docker cp digiurban-vps:/app/data/dev.db ~/backup-dev.db
```

### Passo 2: Rebuild e redeploy
```bash
# Na sua máquina local (após pull das mudanças)
cd c:\Projetos Cursor\DigiurbanFinal

# Build com timestamp para invalidar cache
docker-compose -f docker-compose.vps.yml build --build-arg BUILD_TIMESTAMP=$(date +%s)

# Fazer deploy (copiar imagem para VPS ou rebuild na VPS)
```

### Passo 3: Limpar bancos antigos na VPS
```bash
ssh root@72.60.10.108

# Parar container
docker stop digiurban-vps

# Remover bancos duplicados (CUIDADO!)
rm -f /root/digiurban/digiurban/backend/dev.db
rm -f /root/digiurban/remote-dev.db

# Reiniciar container
docker start digiurban-vps

# Verificar logs
docker logs -f digiurban-vps
```

---

## ✅ Verificação Pós-Deploy

Execute na VPS para confirmar que só há 1 banco:

```bash
# Encontrar todos os bancos .db
docker exec digiurban-vps find /app -name "*.db" 2>/dev/null

# Resultado esperado:
# /app/data/dev.db  ← APENAS ESTE!
```

---

## 📊 Estrutura de Diretórios Correta

```
/app/
├── backend/
│   ├── dist/           # Código compilado
│   ├── node_modules/
│   │   └── .prisma/    # Prisma Client gerado
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
├── frontend/
│   └── ...
├── data/               # ✅ LOCAL CORRETO DO BANCO
│   └── dev.db         # ✅ ÚNICO BANCO
├── uploads/
└── logs/
```

---

## 🔒 Prevenção de Regressão

### 1. Adicionar ao `.gitignore`
```gitignore
# Database files
*.db
*.db-journal
*.db-shm
*.db-wal
dev.db
prisma/dev.db

# Exceto migrations
!prisma/migrations/**/*.db
```

### 2. Script de verificação (opcional)
Criar `scripts/check-db-location.sh`:

```bash
#!/bin/bash
# Verificar se há múltiplos bancos .db

DB_COUNT=$(find . -name "*.db" ! -path "./prisma/migrations/*" ! -path "./node_modules/*" | wc -l)

if [ $DB_COUNT -gt 1 ]; then
    echo "❌ ERRO: Múltiplos bancos detectados!"
    find . -name "*.db" ! -path "./prisma/migrations/*" ! -path "./node_modules/*"
    exit 1
else
    echo "✅ OK: Apenas 1 banco encontrado"
    exit 0
fi
```

---

## 📝 Checklist de Deploy

Antes de cada deploy, verificar:

- [ ] `.env` usa `DATABASE_URL="file:./prisma/dev.db"` (local)
- [ ] `Dockerfile` define `ARG DATABASE_URL=file:/app/data/dev.db`
- [ ] `docker-compose.vps.yml` define `DATABASE_URL=file:/app/data/dev.db`
- [ ] `startup.sh` usa `DATABASE_URL="file:/app/data/dev.db"` em todos os comandos Prisma
- [ ] Não há arquivos `dev.db` fora de `backend/prisma/` ou `/app/data/`

---

## 🎓 Lições Aprendidas

1. **Caminhos relativos** em `DATABASE_URL` são **perigosos** - sempre use caminhos consistentes
2. **`prisma generate` não deve criar bancos** - é apenas para gerar tipos TypeScript
3. **Multi-stage builds** do Docker precisam de variáveis de ambiente explícitas
4. **Sempre definir DATABASE_URL** antes de executar comandos Prisma

---

## 🔗 Arquivos Modificados

1. `Dockerfile` - Linhas 22-26
2. `docker/startup.sh` - Linhas 16-24
3. `digiurban/backend/.env` - Linha 10
4. `digiurban/backend/.env.example` - Criado

---

## ✅ Status

- [x] Causa raiz identificada
- [x] Correção implementada no código
- [x] Documentação criada
- [ ] Deploy testado em staging
- [ ] Deploy aplicado em produção
- [ ] Verificação pós-deploy concluída

---

**Data da correção:** 25/10/2025
**Autor:** Claude Code + Desenvolvedor
