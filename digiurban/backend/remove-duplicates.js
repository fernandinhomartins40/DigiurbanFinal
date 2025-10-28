const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let lines = fs.readFileSync(schemaPath, 'utf8').split('\n');

// Modelos para remover (duplicatas no final do arquivo)
const duplicatesToRemove = [
  { start: 6037, name: 'EnvironmentalComplaint' },  // Segunda ocorrência
  { start: 6149, name: 'TechnicalAssistance' },      // Segunda ocorrência
  { start: 6367, name: 'BuildingPermit' },           // Segunda ocorrência
];

// Ordenar por linha decrescente para remover de trás para frente
duplicatesToRemove.sort((a, b) => b.start - a.start);

duplicatesToRemove.forEach(dup => {
  // Encontrar o final do model (próxima linha que começa com "model" ou fim do arquivo)
  let endLine = dup.start;
  for (let i = dup.start; i < lines.length; i++) {
    if (i > dup.start && lines[i].startsWith('model ')) {
      endLine = i - 1;
      break;
    }
    if (i === lines.length - 1) {
      endLine = i;
    }
  }

  console.log(`Removendo ${dup.name} das linhas ${dup.start}-${endLine}`);
  lines.splice(dup.start - 1, endLine - dup.start + 2);
});

fs.writeFileSync(schemaPath, lines.join('\n'), 'utf8');
console.log('✅ Duplicatas removidas com sucesso');
