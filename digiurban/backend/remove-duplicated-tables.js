const fs = require('fs');
const path = require('path');

const migrationPath = path.join(__dirname, 'prisma', 'migrations', '20251024221210_consolidated_schema', 'migration.sql');

console.log('🔧 Removendo tabelas duplicadas da migration...\n');

// Ler a migration
let migration = fs.readFileSync(migrationPath, 'utf-8');
const originalLength = migration.length;

// Lista de tabelas duplicadas a remover (manter apenas a primeira ocorrência)
const duplicatedTables = [
  'building_permits',
  'environmental_licenses',
  'environmental_complaints'
];

duplicatedTables.forEach(tableName => {
  console.log(`🔍 Processando: ${tableName}`);

  // Encontrar todas as ocorrências de CREATE TABLE para esta tabela
  const pattern = new RegExp(`(-- CreateTable\\s+CREATE TABLE "${tableName}"[\\s\\S]*?\\);)`, 'g');
  const matches = [...migration.matchAll(pattern)];

  console.log(`   Encontradas ${matches.length} ocorrências`);

  if (matches.length > 1) {
    // Remover a segunda ocorrência (manter a primeira)
    const secondOccurrence = matches[1][0];
    migration = migration.replace(secondOccurrence, '');
    console.log(`   ✓ Removida duplicata`);
  }
});

// Também remover índices duplicados para essas tabelas
console.log('\n🔍 Removendo índices duplicados...');

duplicatedTables.forEach(tableName => {
  // Padrão para índices
  const indexPattern = new RegExp(`CREATE (UNIQUE )?INDEX "[^"]*" ON "${tableName}"[^;]+;`, 'g');
  const indexMatches = [...migration.matchAll(indexPattern)];

  if (indexMatches.length > 0) {
    const seen = new Set();
    indexMatches.forEach((match, idx) => {
      const indexDef = match[0];
      if (seen.has(indexDef)) {
        // É uma duplicata, remover
        migration = migration.replace(indexDef, '');
        console.log(`   ✓ Removido índice duplicado de ${tableName}`);
      } else {
        seen.add(indexDef);
      }
    });
  }
});

// Salvar
fs.writeFileSync(migrationPath, migration, 'utf-8');

const saved = migration.length;
const removed = originalLength - saved;

console.log(`\n✓ Migration limpa salva!`);
console.log(`✓ Tamanho original: ${originalLength} bytes`);
console.log(`✓ Tamanho final: ${saved} bytes`);
console.log(`✓ Bytes removidos: ${removed} bytes`);
