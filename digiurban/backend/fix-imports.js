const fs = require('fs');
const path = require('path');

// Arquivos para corrigir
const files = [
  'src/modules/handlers/agriculture/seed-distribution-handler.ts',
  'src/modules/handlers/agriculture/soil-analysis-handler.ts',
  'src/modules/handlers/agriculture/technical-assistance-handler.ts',
  'src/modules/handlers/agriculture/index.ts',
  'src/modules/handlers/environment/environmental-license-handler.ts',
  'src/modules/handlers/environment/tree-authorization-handler.ts',
  'src/modules/handlers/environment/environmental-complaint-handler.ts',
  'src/modules/handlers/environment/organic-certification-handler.ts',
  'src/modules/handlers/environment/index.ts',
  'src/modules/handlers/urban-planning/building-permit-handler.ts',
  'src/modules/handlers/urban-planning/certificate-handler.ts',
  'src/modules/handlers/urban-planning/property-numbering-handler.ts',
  'src/modules/handlers/urban-planning/lot-subdivision-handler.ts',
  'src/modules/handlers/urban-planning/index.ts',
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Arquivo não encontrado: ${file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Substituir o import errado
  const updated = content.replace(
    /from ['"]\.\.\/\.\.\/\.\.\/core\/module-handler['"]/g,
    "from '../../../types/module-handler'"
  );

  if (content !== updated) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`✅ Corrigido: ${file}`);
  } else {
    console.log(`ℹ️  Sem mudanças: ${file}`);
  }
});

console.log('\n✅ Correção de imports concluída!');
