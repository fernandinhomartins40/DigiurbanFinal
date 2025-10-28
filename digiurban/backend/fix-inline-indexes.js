const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf-8');

// Remover @index inline dos campos protocol, serviceId, etc
const inlineIndexPattern = /^(\s+)(\w+)(\s+String\?)(\s+@index)/gm;

let count = 0;
schema = schema.replace(inlineIndexPattern, (match, indent, fieldName, type, indexAttr) => {
  count++;
  return `${indent}${fieldName}${type}`;
});

console.log(`✓ Removidos ${count} @index inline`);

// Salvar
fs.writeFileSync(schemaPath, schema, 'utf-8');
console.log(`✓ Schema corrigido salvo em: ${schemaPath}`);
