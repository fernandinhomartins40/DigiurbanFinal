const fs = require('fs');
const path = require('path');

// Arquivos index.ts que precisam corrigir o import
const files = [
  'src/modules/handlers/agriculture/index.ts',
  'src/modules/handlers/environment/index.ts',
  'src/modules/handlers/urban-planning/index.ts',
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Arquivo não encontrado: ${file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Substituir o import de types/module-handler para core/module-handler
  const updated = content.replace(
    /import \{ moduleHandlerRegistry \} from ['"]\.\.\/\.\.\/\.\.\/types\/module-handler['"]/g,
    "import { moduleHandlerRegistry } from '../../../core/module-handler'"
  );

  if (content !== updated) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`✅ Corrigido: ${file}`);
  } else {
    console.log(`ℹ️  Sem mudanças: ${file}`);
  }
});

console.log('\n✅ Correção de imports do registry concluída!');
