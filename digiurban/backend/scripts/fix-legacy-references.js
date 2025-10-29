const fs = require('fs');
const path = require('path');

/**
 * Script para substituir todas as referências aos models legados pelos simplificados
 */

const replacements = [
  // Prisma client calls
  { from: /prisma\.protocol\./g, to: 'prisma.protocolSimplified.' },
  { from: /prisma\.service\./g, to: 'prisma.serviceSimplified.' },
  { from: /prisma\.protocolHistory\./g, to: 'prisma.protocolHistorySimplified.' },
  { from: /prisma\.serviceTemplate\./g, to: 'prisma.serviceSimplified.' },

  // Type imports
  { from: /import\s+\{([^}]*)\bProtocol\b([^}]*)\}\s+from\s+['"]@prisma\/client['"]/g, to: 'import {$1ProtocolSimplified$2} from \'@prisma/client\'' },
  { from: /import\s+\{([^}]*)\bService\b([^}]*)\}\s+from\s+['"]@prisma\/client['"]/g, to: 'import {$1ServiceSimplified$2} from \'@prisma/client\'' },

  // Type references in code
  { from: /:\s*Protocol\b/g, to: ': ProtocolSimplified' },
  { from: /:\s*Service\b/g, to: ': ServiceSimplified' },
  { from: /<Protocol>/g, to: '<ProtocolSimplified>' },
  { from: /<Service>/g, to: '<ServiceSimplified>' },

  // Count relations
  { from: /protocols:\s*true/g, to: 'protocolsSimplified: true' },
  { from: /services:\s*true/g, to: 'servicesSimplified: true' },
  { from: /assignedProtocols:/g, to: 'assignedProtocolsSimplified:' },
  { from: /createdProtocols:/g, to: 'createdProtocolsSimplified:' },
];

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  for (const { from, to } of replacements) {
    const newContent = content.replace(from, to);
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${filePath}`);
    return 1;
  }

  return 0;
}

function processDirectory(dir, extensions = ['.ts', '.tsx']) {
  let count = 0;

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules and dist
      if (file !== 'node_modules' && file !== 'dist' && file !== 'prisma') {
        count += processDirectory(filePath, extensions);
      }
    } else if (extensions.some(ext => file.endsWith(ext))) {
      count += replaceInFile(filePath);
    }
  }

  return count;
}

// Execute
const srcDir = path.join(__dirname, '..', 'src');
console.log('🔄 Substituindo referências aos models legados...\n');

const filesModified = processDirectory(srcDir);

console.log(`\n✅ Concluído! ${filesModified} arquivos modificados.`);
