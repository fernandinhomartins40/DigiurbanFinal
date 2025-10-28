const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf-8');

// Remover @db.Text (SQLite não suporta, usa String por padrão)
let count1 = 0;
schema = schema.replace(/\s+@db\.Text/g, () => {
  count1++;
  return '';
});

// Substituir Decimal? @db.Decimal(10, 2) por Float?
let count2 = 0;
schema = schema.replace(/Decimal\?\s+@db\.Decimal\(\d+,\s*\d+\)/g, () => {
  count2++;
  return 'Float?';
});

console.log(`✓ Removidos ${count1} @db.Text`);
console.log(`✓ Substituídos ${count2} Decimal por Float`);

// Salvar
fs.writeFileSync(schemaPath, schema, 'utf-8');
console.log(`✓ Schema corrigido para SQLite salvo em: ${schemaPath}`);
