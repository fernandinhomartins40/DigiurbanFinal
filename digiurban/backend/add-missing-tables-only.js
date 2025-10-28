const fs = require('fs');
const path = require('path');

const migrationPath = path.join(__dirname, 'prisma', 'migrations', '20251024221210_consolidated_schema', 'migration.sql');

console.log('🔍 Analisando migration consolidada...\n');

// Ler a migration atual
let migration = fs.readFileSync(migrationPath, 'utf-8');

// Lista de tabelas que DEVEM existir das FASES 4-7
const requiredTables = [
  // FASE 4
  'infrastructure_problems',
  'urban_maintenance_requests',
  'housing_requests',
  // FASE 6
  'tree_authorizations',
  'organic_certifications',
  'seed_distributions',
  'soil_analyses',
  'farmer_market_registrations',
  'property_numbering',
  'urban_certificates',
  'lot_subdivisions',
  // FASE 7
  'police_reports',
  'patrol_requests',
  'camera_requests',
  'anonymous_tips',
  'event_authorizations',
  'lost_and_found'
];

// Verificar quais tabelas já existem
const existingTables = new Set();
const missingTables = [];

requiredTables.forEach(tableName => {
  const pattern = new RegExp(`CREATE TABLE "${tableName}"`, 'g');
  const matches = migration.match(pattern);

  if (matches && matches.length > 0) {
    existingTables.add(tableName);
    if (matches.length > 1) {
      console.log(`⚠️  Duplicata encontrada: ${tableName} (${matches.length}x)`);
    }
  } else {
    missingTables.push(tableName);
  }
});

console.log(`✓ Tabelas existentes: ${existingTables.size}`);
console.log(`❌ Tabelas faltantes: ${missingTables.length}`);

if (missingTables.length > 0) {
  console.log('\n📋 Tabelas que precisam ser adicionadas:');
  missingTables.forEach(t => console.log(`   - ${t}`));
} else {
  console.log('\n✓ Todas as tabelas necessárias já estão presentes!');
}

// Verificar duplicatas
const allCreateTableStatements = migration.match(/CREATE TABLE "([^"]+)"/g) || [];
const tableCounts = {};
allCreateTableStatements.forEach(stmt => {
  const match = stmt.match(/CREATE TABLE "([^"]+)"/);
  if (match) {
    const tableName = match[1];
    tableCounts[tableName] = (tableCounts[tableName] || 0) + 1;
  }
});

const duplicates = Object.entries(tableCounts).filter(([name, count]) => count > 1);
if (duplicates.length > 0) {
  console.log('\n⚠️  DUPLICATAS ENCONTRADAS:');
  duplicates.forEach(([name, count]) => {
    console.log(`   - ${name}: ${count}x`);
  });
}

console.log(`\n📊 Estatísticas da Migration:`);
console.log(`   - Total de CREATE TABLE: ${allCreateTableStatements.length}`);
console.log(`   - Tabelas únicas: ${Object.keys(tableCounts).length}`);
console.log(`   - Tabelas duplicadas: ${duplicates.length}`);
