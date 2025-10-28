const fs = require('fs');
const path = require('path');

const migrationPath = path.join(__dirname, 'prisma', 'migrations', '20251024221210_consolidated_schema', 'migration.sql');

console.log('🔍 Removendo duplicatas da migration consolidada...\n');

// Ler a migration
let migration = fs.readFileSync(migrationPath, 'utf-8');
const lines = migration.split('\n');

console.log(`📊 Total de linhas: ${lines.length}`);

// Encontrar onde começa a seção duplicada
// A duplicação começa após a criação da tabela housing_requests
// que termina com "CONSTRAINT "housing_requests_tenantId_fkey"..."

let duplicateStartLine = -1;
for (let i = 0; i < lines.length; i++) {
  // Procurar pelo comentário que marca o início das FASES duplicadas
  if (lines[i].includes('-- FASES 4-7: SECRETARIAS DE INFRAESTRUTURA, CULTURAIS, AMBIENTAIS E SEGURANÇA')) {
    duplicateStartLine = i;
    break;
  }
}

if (duplicateStartLine === -1) {
  console.log('❌ Não encontrei a seção duplicada com o marcador esperado.');
  console.log('🔍 Procurando por marcador alternativo...');

  // Procurar por um padrão alternativo
  for (let i = 3500; i < lines.length; i++) {
    if (lines[i].includes('-- FASE 6: SECRETARIAS AMBIENTAIS (8 tabelas faltantes)') ||
        lines[i].includes('-- FASE 4: SECRETARIAS DE INFRAESTRUTURA')) {
      duplicateStartLine = i - 3; // Pegar algumas linhas antes do comentário
      break;
    }
  }
}

if (duplicateStartLine === -1) {
  console.log('❌ Não foi possível encontrar o início da seção duplicada.');
  process.exit(1);
}

console.log(`✓ Seção duplicada encontrada na linha: ${duplicateStartLine + 1}`);
console.log(`✓ Linhas a remover: ${lines.length - duplicateStartLine}`);

// Remover as linhas duplicadas
const cleanedLines = lines.slice(0, duplicateStartLine);
const cleanedMigration = cleanedLines.join('\n');

// Salvar a migration limpa
fs.writeFileSync(migrationPath, cleanedMigration, 'utf-8');

console.log(`\n✓ Migration limpa salva!`);
console.log(`✓ Total de linhas após limpeza: ${cleanedLines.length}`);
console.log(`✓ Linhas removidas: ${lines.length - cleanedLines.length}`);
