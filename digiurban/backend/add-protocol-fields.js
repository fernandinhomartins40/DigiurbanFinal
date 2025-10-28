const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf-8');

// Modelos que precisam do campo protocol
const modelsNeedingProtocol = [
  'CulturalProject',
  'CulturalSpace',
  'Athlete',
  'SportsTeam',
  'LocalBusiness',
  'TouristAttraction'
];

let count = 0;

modelsNeedingProtocol.forEach(modelName => {
  // Padrão para encontrar o modelo e adicionar protocol antes de createdAt
  const modelPattern = new RegExp(
    `(model ${modelName} {[\\s\\S]*?)(  createdAt\\s+DateTime)`,
    'g'
  );

  const match = schema.match(modelPattern);
  if (match) {
    schema = schema.replace(modelPattern, (fullMatch, before, createdAt) => {
      // Verificar se já tem protocol
      if (before.includes('protocol')) {
        console.log(`⚠️  ${modelName}: já possui campo protocol`);
        return fullMatch;
      }

      count++;
      console.log(`✓ ${modelName}: adicionando campo protocol`);
      return `${before}  protocol       String?          // Campo adicionado\n  ${createdAt}`;
    });
  } else {
    console.log(`❌ ${modelName}: não encontrado`);
  }
});

// Salvar
fs.writeFileSync(schemaPath, schema, 'utf-8');

console.log(`\n✓ Total de modelos atualizados: ${count}`);
console.log(`✓ Schema salvo em: ${schemaPath}`);
