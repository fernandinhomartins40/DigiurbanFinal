const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf-8');

// Campos finais que ainda faltam
const fieldsToAdd = [
  // EnvironmentalComplaint
  { model: 'EnvironmentalComplaint', field: 'photos', type: 'Json?', addBefore: 'createdAt' },

  // CulturalSpace
  { model: 'CulturalSpace', field: 'source', type: 'String', default: '"manual"', addBefore: 'createdAt' },

  // Athlete
  { model: 'Athlete', field: 'source', type: 'String', default: '"manual"', addBefore: 'createdAt' },

  // TouristAttraction
  { model: 'TouristAttraction', field: 'state', type: 'String?', addBefore: 'createdAt' },

  // TourismAttendance
  { model: 'TourismAttendance', field: 'source', type: 'String', default: '"manual"', addBefore: 'createdAt' },

  // BuildingPermit
  { model: 'BuildingPermit', field: 'applicantEmail', type: 'String?', addBefore: 'createdAt' },
  { model: 'BuildingPermit', field: 'requirements', type: 'Json?', addBefore: 'createdAt' },
  { model: 'BuildingPermit', field: 'issuedDate', type: 'DateTime?', addBefore: 'createdAt' },
  { model: 'BuildingPermit', field: 'reviewedAt', type: 'DateTime?', addBefore: 'createdAt' },

  // CustomDataTable
  { model: 'CustomDataTable', field: 'moduleType', type: 'String?', addBefore: 'createdAt' },
  { model: 'CustomDataTable', field: 'schema', type: 'Json?', addBefore: 'createdAt' },
];

let count = 0;
const added = [];
const skipped = [];

fieldsToAdd.forEach(({ model, field, type, default: defaultValue, addBefore }) => {
  const modelPattern = new RegExp(
    `(model ${model} {[\\s\\S]*?)(  ${addBefore}\\s+DateTime)`,
    'g'
  );

  const match = schema.match(modelPattern);
  if (match) {
    schema = schema.replace(modelPattern, (fullMatch, before, beforeField) => {
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

console.log(`\n✅ CAMPOS FINAIS ADICIONADOS (${count}):`);
added.forEach(f => console.log(`  ✓ ${f}`));

if (skipped.length > 0) {
  console.log(`\n⚠️  IGNORADOS (${skipped.length}):`);
  skipped.forEach(f => console.log(`  - ${f}`));
}

console.log(`\n✓ Total de campos adicionados: ${count}`);
console.log(`✓ Schema salvo em: ${schemaPath}`);
