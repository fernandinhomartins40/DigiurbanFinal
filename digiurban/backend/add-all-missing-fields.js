const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf-8');

// Lista completa de campos que faltam baseado nos erros TypeScript
const fieldsToAdd = [
  // TechnicalAssistance
  { model: 'TechnicalAssistance', field: 'propertyLocation', type: 'String?', addBefore: 'createdAt' },
  { model: 'TechnicalAssistance', field: 'technicianId', type: 'String?', addBefore: 'createdAt' },
  { model: 'TechnicalAssistance', field: 'followUpRequired', type: 'Boolean', default: 'false', addBefore: 'createdAt' },
  { model: 'TechnicalAssistance', field: 'propertyArea', type: 'Float?', addBefore: 'createdAt' },
  { model: 'TechnicalAssistance', field: 'cropTypes', type: 'Json?', addBefore: 'createdAt' },
  { model: 'TechnicalAssistance', field: 'priority', type: 'String', default: '"normal"', addBefore: 'createdAt' },
  { model: 'TechnicalAssistance', field: 'serviceId', type: 'String?', addBefore: 'createdAt' },
  { model: 'TechnicalAssistance', field: 'source', type: 'String', default: '"manual"', addBefore: 'createdAt' },
  { model: 'TechnicalAssistance', field: 'completedBy', type: 'String?', addBefore: 'createdAt' },
  { model: 'TechnicalAssistance', field: 'completedAt', type: 'DateTime?', addBefore: 'createdAt' },
  { model: 'TechnicalAssistance', field: 'followUpDate', type: 'DateTime?', addBefore: 'createdAt' },
  { model: 'TechnicalAssistance', field: 'followUpNotes', type: 'String?', addBefore: 'createdAt' },

  // EnvironmentalComplaint
  { model: 'EnvironmentalComplaint', field: 'complainantPhone', type: 'String?', addBefore: 'createdAt' },
  { model: 'EnvironmentalComplaint', field: 'complainantEmail', type: 'String?', addBefore: 'createdAt' },
  { model: 'EnvironmentalComplaint', field: 'investigationDate', type: 'DateTime?', addBefore: 'createdAt' },
  { model: 'EnvironmentalComplaint', field: 'investigatorId', type: 'String?', addBefore: 'createdAt' },
  { model: 'EnvironmentalComplaint', field: 'investigationReport', type: 'Json?', addBefore: 'createdAt' },
  { model: 'EnvironmentalComplaint', field: 'resolvedBy', type: 'String?', addBefore: 'createdAt' },
  { model: 'EnvironmentalComplaint', field: 'resolvedAt', type: 'DateTime?', addBefore: 'createdAt' },
  { model: 'EnvironmentalComplaint', field: 'priority', type: 'String', default: '"normal"', addBefore: 'createdAt' },
  { model: 'EnvironmentalComplaint', field: 'serviceId', type: 'String?', addBefore: 'createdAt' },
  { model: 'EnvironmentalComplaint', field: 'source', type: 'String', default: '"manual"', addBefore: 'createdAt' },

  // EnvironmentalLicense
  { model: 'EnvironmentalLicense', field: 'applicantEmail', type: 'String?', addBefore: 'createdAt' },
  { model: 'EnvironmentalLicense', field: 'validUntil', type: 'DateTime?', addBefore: 'createdAt' },
  { model: 'EnvironmentalLicense', field: 'activityType', type: 'String?', addBefore: 'createdAt' },
  { model: 'EnvironmentalLicense', field: 'technicalReport', type: 'Json?', addBefore: 'createdAt' },
  { model: 'EnvironmentalLicense', field: 'reviewedBy', type: 'String?', addBefore: 'createdAt' },
  { model: 'EnvironmentalLicense', field: 'reviewedAt', type: 'DateTime?', addBefore: 'createdAt' },
  { model: 'EnvironmentalLicense', field: 'approvedBy', type: 'String?', addBefore: 'createdAt' },
  { model: 'EnvironmentalLicense', field: 'approvedAt', type: 'DateTime?', addBefore: 'createdAt' },
  { model: 'EnvironmentalLicense', field: 'protocol', type: 'String?', addBefore: 'createdAt' },
  { model: 'EnvironmentalLicense', field: 'serviceId', type: 'String?', addBefore: 'createdAt' },
  { model: 'EnvironmentalLicense', field: 'source', type: 'String', default: '"manual"', addBefore: 'createdAt' },

  // CulturalProject
  { model: 'CulturalProject', field: 'funding', type: 'Json?', addBefore: 'createdAt' },
  { model: 'CulturalProject', field: 'serviceId', type: 'String?', addBefore: 'createdAt' },

  // CulturalSpace
  { model: 'CulturalSpace', field: 'serviceId', type: 'String?', addBefore: 'createdAt' },

  // Athlete
  { model: 'Athlete', field: 'serviceId', type: 'String?', addBefore: 'createdAt' },

  // SportsAttendance
  { model: 'SportsAttendance', field: 'source', type: 'String', default: '"manual"', addBefore: 'createdAt' },

  // TouristAttraction
  { model: 'TouristAttraction', field: 'city', type: 'String?', addBefore: 'createdAt' },
  { model: 'TouristAttraction', field: 'serviceId', type: 'String?', addBefore: 'createdAt' },

  // TourismAttendance
  { model: 'TourismAttendance', field: 'serviceId', type: 'String?', addBefore: 'createdAt' },
];

let count = 0;
const added = [];
const skipped = [];

fieldsToAdd.forEach(({ model, field, type, default: defaultValue, addBefore }) => {
  // Padrão para encontrar o modelo
  const modelPattern = new RegExp(
    `(model ${model} {[\\s\\S]*?)(  ${addBefore}\\s+DateTime)`,
    'g'
  );

  const match = schema.match(modelPattern);
  if (match) {
    schema = schema.replace(modelPattern, (fullMatch, before, beforeField) => {
      // Verificar se já tem o campo (procurar pelo nome do campo seguido de espaços/tipo)
      const fieldExists = new RegExp(`^\\s+${field}\\s+`, 'm').test(before);

      if (fieldExists) {
        skipped.push(`${model}.${field}`);
        return fullMatch;
      }

      count++;
      added.push(`${model}.${field} (${type})`);

      const fieldDef = defaultValue
        ? `  ${field.padEnd(20)} ${type.padEnd(16)} @default(${defaultValue}) // Campo adicionado`
        : `  ${field.padEnd(20)} ${type.padEnd(16)} // Campo adicionado`;

      return `${before}${fieldDef}\n  ${beforeField}`;
    });
  } else {
    skipped.push(`${model}.${field} (modelo não encontrado)`);
  }
});

// Salvar
fs.writeFileSync(schemaPath, schema, 'utf-8');

console.log(`\n✅ CAMPOS ADICIONADOS (${count}):`);
added.forEach(f => console.log(`  ✓ ${f}`));

if (skipped.length > 0) {
  console.log(`\n⚠️  IGNORADOS (${skipped.length}):`);
  skipped.forEach(f => console.log(`  - ${f}`));
}

console.log(`\n✓ Total de campos adicionados: ${count}`);
console.log(`✓ Schema salvo em: ${schemaPath}`);
