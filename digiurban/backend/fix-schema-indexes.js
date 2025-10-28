const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let content = fs.readFileSync(schemaPath, 'utf8');

// Remover @index inline de campos protocol String?
// SQLite não suporta essa sintaxe, os índices devem estar em @@index([field])
content = content.replace(/protocol\s+String\?\s+@index/g, 'protocol        String?');

fs.writeFileSync(schemaPath, content, 'utf8');
console.log('✅ Schema corrigido: @index inline removidos');
console.log('   Nota: Índices devem usar @@index([protocol]) no final do model');
