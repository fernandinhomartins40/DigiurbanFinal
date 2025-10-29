const fs = require('fs');
const path = require('path');

// Lista de arquivos para atualizar
const filesToUpdate = [
  'src/routes/secretarias-saude.ts',
  'src/routes/secretarias-educacao.ts',
  'src/routes/secretarias-assistencia-social.ts',
  'src/routes/secretarias-cultura.ts',
  'src/routes/secretarias-esporte.ts',
  'src/routes/secretarias-habitacao.ts',
  'src/routes/secretarias-genericas.ts',
  'src/routes/secretarias-agricultura.ts',
];

const basePath = path.join(__dirname, '..');

filesToUpdate.forEach(file => {
  const filePath = path.join(basePath, file);

  if (!fs.existsSync(filePath)) {
    console.log(`⏭️  Arquivo não encontrado: ${file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Substituir import
  if (content.includes("from '../utils/protocol-helpers'")) {
    content = content.replace(
      /import\s+{[^}]*getNextProtocolNumber[^}]*}\s+from\s+['"]..\/utils\/protocol-helpers['"]/g,
      "import { generateProtocolNumber } from '../utils/protocol-number-generator'"
    );
    modified = true;
    console.log(`✅ Import atualizado: ${file}`);
  }

  // Substituir chamadas await getNextProtocolNumber(tenantId)
  if (content.includes('await getNextProtocolNumber')) {
    content = content.replace(
      /await\s+getNextProtocolNumber\([^)]+\)/g,
      'generateProtocolNumber()'
    );
    modified = true;
    console.log(`✅ Chamadas atualizadas: ${file}`);
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`💾 Arquivo salvo: ${file}\n`);
  } else {
    console.log(`⚪ Nenhuma modificação necessária: ${file}\n`);
  }
});

console.log('✅ Atualização completa!');
