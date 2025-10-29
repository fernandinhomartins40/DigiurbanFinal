const fs = require('fs');
const path = require('path');

/**
 * Script para remover propriedades legadas que não existem mais
 */

function removeProperty(content, propertyPattern) {
  // Remove linhas individuais com a propriedade
  const lineRemoval = content.replace(new RegExp(`^\\s*${propertyPattern}\\s*:.*,?\\s*$`, 'gm'), '');

  // Remove propriedades inline em objetos (ex: { protocols: true, ... })
  const inlineRemoval = lineRemoval.replace(new RegExp(`[,\\s]*${propertyPattern}\\s*:\\s*[^,}]+`, 'g'), '');

  return inlineRemoval;
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Propriedades específicas para remover
  const propertiesToRemove = [
    'protocols',        // substituído por protocolsSimplified
    'services',         // substituído por servicesSimplified
    'assignedProtocols', // substituído por assignedProtocolsSimplified
    'createdProtocols',  // substituído por createdProtocolsSimplified
    'endereco',          // não existe no modelo
    'requirements',      // não existe no ServiceSimplified
    'customForm',        // não existe no ServiceSimplified
    'hasLocation',       // não existe no ServiceSimplified
    'locationConfig',    // não existe no ServiceSimplified
    'tenant',            // usar tenantId
  ];

  for (const prop of propertiesToRemove) {
    content = removeProperty(content, prop);
  }

  // Fix specific patterns
  // Fix: _count.services -> _count.servicesSimplified
  content = content.replace(/_count\.services\b/g, '_count.servicesSimplified');

  // Fix: _count.protocols -> _count.protocolsSimplified
  content = content.replace(/_count\.protocols\b/g, '_count.protocolsSimplified');

  // Fix: .service -> .serviceId (quando usado como propriedade)
  // Apenas em contextos específicos para não quebrar coisas válidas
  content = content.replace(/(\w+)\.service\b(?!\w)/g, '$1.serviceId');

  // Remove vírgulas duplas ou finais órfãs
  content = content.replace(/,\s*,/g, ',');
  content = content.replace(/,\s*}/g, '}');
  content = content.replace(/,\s*]/g, ']');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
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
      if (file !== 'node_modules' && file !== 'dist' && file !== 'prisma') {
        count += processDirectory(filePath, extensions);
      }
    } else if (extensions.some(ext => file.endsWith(ext))) {
      count += fixFile(filePath);
    }
  }

  return count;
}

// Execute
const srcDir = path.join(__dirname, '..', 'src');
console.log('🔄 Removendo propriedades legadas...\n');

const filesModified = processDirectory(srcDir);

console.log(`\n✅ Concluído! ${filesModified} arquivos modificados.`);
