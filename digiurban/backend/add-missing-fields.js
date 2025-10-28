const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf-8');

// Lista de campos a adicionar: {model: campo}
const fieldsToAdd = [
  {
    model: 'TourismProgram',
    field: 'currentParticipants',
    type: 'Int?',
    addBefore: 'createdAt'
  },
  {
    model: 'CulturalProject',
    field: 'contact',
    type: 'Json?',
    addBefore: 'createdAt'
  },
  {
    model: 'SportsAttendance',
    field: 'serviceId',
    type: 'String?',
    addBefore: 'createdAt'
  },
  {
    model: 'TourismAttendance',
    field: 'touristProfile',
    type: 'Json?',
    addBefore: 'createdAt'
  }
];

let count = 0;

fieldsToAdd.forEach(({ model, field, type, addBefore }) => {
  // Padrão para encontrar o modelo e adicionar o campo
  const modelPattern = new RegExp(
    `(model ${model} {[\\s\\S]*?)(  ${addBefore}\\s+DateTime)`,
    'g'
  );

  const match = schema.match(modelPattern);
  if (match) {
    schema = schema.replace(modelPattern, (fullMatch, before, beforeField) => {
      // Verificar se já tem o campo
      if (before.includes(`${field}`) && before.includes(field)) {
        console.log(`⚠️  ${model}.${field}: já existe`);
        return fullMatch;
      }

      count++;
      console.log(`✓ ${model}.${field}: adicionado (${type})`);
      return `${before}  ${field.padEnd(20)} ${type.padEnd(16)} // Campo adicionado\n  ${beforeField}`;
    });
  } else {
    console.log(`❌ ${model}: não encontrado`);
  }
});

// Salvar
fs.writeFileSync(schemaPath, schema, 'utf-8');

console.log(`\n✓ Total de campos adicionados: ${count}`);
console.log(`✓ Schema salvo em: ${schemaPath}`);
