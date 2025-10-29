/**
 * Script para substituir chamadas Prisma legadas por simplificadas
 * Abordagem conservadora: apenas substitui chamadas diretas ao prisma client
 */

const fs = require('fs');
const path = require('path');

// Padrões de substituição
const replacements = [
  // Chamadas ao Prisma Client
  { from: /prisma\.protocol\b/g, to: 'prisma.protocolSimplified' },
  { from: /prisma\.service\b/g, to: 'prisma.serviceSimplified' },
  { from: /prisma\.protocolHistory\b/g, to: 'prisma.protocolHistorySimplified' },

  // Imports de tipos
  { from: /import \{ Protocol \}/g, to: 'import { ProtocolSimplified as Protocol }' },
  { from: /import \{ Service \}/g, to: 'import { ServiceSimplified as Service }' },
  { from: /from '@prisma\/client';\s*$/gm, to: 'from \'@prisma/client\';' },

  // Propriedades em selects e includes
  { from: /protocols:\s*true/g, to: 'protocolsSimplified: true' },
  { from: /services:\s*true/g, to: 'servicesSimplified: true' },
  { from: /assignedProtocols:\s*true/g, to: 'assignedProtocolsSimplified: true' },
  { from: /createdProtocols:\s*true/g, to: 'createdProtocolsSimplified: true' },

  // Contadores _count
  { from: /_count:\s*\{\s*protocols:/g, to: '_count: { protocolsSimplified:' },
  { from: /_count:\s*\{\s*services:/g, to: '_count: { servicesSimplified:' },

  // Contadores em objetos retornados
  { from: /\._count\.protocols\b/g, to: '._count.protocolsSimplified' },
  { from: /\._count\.services\b/g, to: '._count.servicesSimplified' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  for (const { from, to } of replacements) {
    if (from.test(content)) {
      content = content.replace(from, to);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${filePath}`);
    return 1;
  }

  return 0;
}

function processDirectory(dir, extensions = ['.ts']) {
  let count = 0;
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      count += processDirectory(fullPath, extensions);
    } else if (extensions.some(ext => file.name.endsWith(ext))) {
      count += processFile(fullPath);
    }
  }

  return count;
}

// Executar
const srcDir = path.join(__dirname, '..', 'src');
console.log('🔧 Corrigindo chamadas Prisma...\n');

const count = processDirectory(srcDir);

console.log(`\n✅ ${count} arquivos modificados`);
