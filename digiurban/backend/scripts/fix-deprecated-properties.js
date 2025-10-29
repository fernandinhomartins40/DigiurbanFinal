/**
 * Script para comentar propriedades deprecated removidas dos models
 */

const fs = require('fs');
const path = require('path');

const replacements = [
  // Propriedades removidas do ServiceSimplified
  { from: /(\s+)moduleEntity:\s*true,/g, to: '$1// moduleEntity: true, // REMOVED: Propriedade deprecated' },
  { from: /(\s+)\.moduleEntity/g, to: '$1// .moduleEntity // REMOVED' },

  // Propriedades removidas do ProtocolSimplified
  { from: /(\s+)specializedPageId:/g, to: '$1// specializedPageId: // REMOVED:' },
  { from: /(\s+)specializedPage:/g, to: '$1// specializedPage: // REMOVED:' },

  // ServiceGeneration removido
  { from: /prisma\.serviceGeneration/g, to: '// prisma.serviceGeneration // REMOVED: Table dropped' },
  { from: /(\s+)generatedServices:/g, to: '$1// generatedServices: // REMOVED:' },
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
    console.log(`✅ ${path.basename(filePath)}`);
    return 1;
  }

  return 0;
}

// Processar arquivos específicos
const files = [
  'src/routes/secretarias-agricultura.ts',
  'src/routes/secretarias-genericas.ts',
  'src/routes/secretarias-assistencia-social.ts',
  'src/routes/secretarias-cultura.ts',
  'src/routes/secretarias-educacao.ts',
  'src/routes/secretarias-esporte.ts',
  'src/routes/secretarias-habitacao.ts',
];

console.log('🔧 Comentando propriedades deprecated...\n');

let count = 0;
for (const file of files) {
  const fullPath = path.join(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    count += processFile(fullPath);
  }
}

console.log(`\n✅ ${count} arquivos modificados`);
