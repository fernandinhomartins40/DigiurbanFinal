#!/bin/sh
set -e

echo "========================================="
echo "🚀 DigiUrban - Startup"
echo "========================================="

# Criar diretórios necessários
echo "📁 Criando diretórios..."
mkdir -p /app/data /app/uploads /app/logs
chmod 777 /app/data /app/uploads /app/logs

# Ir para diretório do backend
cd /app/backend

# Gerar Prisma Client (garantir que está correto)
echo "🔧 Gerando Prisma Client..."
npx prisma generate || echo "⚠️ Prisma generate falhou"

# Criar banco de dados se não existir
if [ ! -f "/app/data/dev.db" ]; then
    echo "🗄️  Criando banco de dados..."
    touch /app/data/dev.db
    chmod 666 /app/data/dev.db
fi

# Migrar banco de dados Prisma
echo "📦 Executando migrations do Prisma..."
DATABASE_URL="file:/app/data/dev.db" npx prisma migrate deploy || {
    echo "⚠️  Migrations falharam, tentando db push..."
    DATABASE_URL="file:/app/data/dev.db" npx prisma db push --skip-generate || {
        echo "❌ db push falhou, tentando migrate reset (DESTRUCTIVO)..."
        echo "⚠️  ATENÇÃO: Isto irá recriar o banco do zero!"
        DATABASE_URL="file:/app/data/dev.db" npx prisma migrate reset --force --skip-generate || {
            echo "❌ Todas as tentativas falharam. Verifique o schema."
            exit 1
        }
    }
}

# Seed inicial se necessário
# Se o banco foi resetado (.seeded não existe OU migrate reset foi executado), executar seed
if [ ! -f "/app/data/.seeded" ]; then
    echo "🌱 Executando seed inicial..."
    DATABASE_URL="file:/app/data/dev.db" npm run db:seed || {
        echo "❌ Seed falhou"
        exit 1
    }
    touch /app/data/.seeded
    echo "✅ Seed concluído e marcado"
else
    echo "ℹ️  Database já foi inicializado (arquivo .seeded existe)"
fi

echo "✅ Startup concluído!"
echo "🔍 Verificando estrutura:"
echo "  - Backend: $(ls -la /app/backend/dist/index.js 2>/dev/null && echo 'OK' || echo 'MISSING')"
echo "  - Frontend: $(ls -la /app/frontend/server.js 2>/dev/null && echo 'OK' || echo 'MISSING')"
echo "  - Prisma: $(ls -la /app/backend/node_modules/.prisma 2>/dev/null && echo 'OK' || echo 'MISSING')"
echo "========================================="

# Iniciar supervisord
exec /usr/bin/supervisord -c /etc/supervisord.conf
