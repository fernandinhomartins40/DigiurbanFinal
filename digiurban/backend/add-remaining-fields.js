const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf-8');

const fieldsToAdd = [
  // TouristAttraction
  { model: 'TouristAttraction', field: 'facilities', type: 'Json?', addBefore: 'createdAt' },

  // BuildingPermit
  { model: 'BuildingPermit', field: 'constructionType', type: 'String?', addBefore: 'createdAt' },
  { model: 'BuildingPermit', field: 'validUntil', type: 'DateTime?', addBefore: 'createdAt' },

  // ServiceForm (renomear isRequired para requiresAllFields já existe, mas adicionar outros)
  { model: 'ServiceForm', field: 'isRequired', type: 'Boolean', default: 'false', addBefore: 'createdAt' },

  // ServiceLocation
  { model: 'ServiceLocation', field: 'requiresLocation', type: 'Boolean', default: 'false', addBefore: 'createdAt' },

  // ServiceScheduling
  { model: 'ServiceScheduling', field: 'allowScheduling', type: 'Boolean', default: 'true', addBefore: 'createdAt' },
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
        ? `  ${field.padEnd(20)} ${type.padEnd(16)} @default(${defaultValue})`
        : `  ${field.padEnd(20)} ${type.padEnd(16)}`;

      return `${before}${fieldDef}\n  ${beforeField}`;
    });
  } else {
    skipped.push(`${model}.${field} (modelo não encontrado)`);
  }
});

fs.writeFileSync(schemaPath, schema, 'utf-8');

console.log(`\n✅ CAMPOS ADICIONADOS (${count}):`);
added.forEach(f => console.log(`  ✓ ${f}`));

if (skipped.length > 0) {
  console.log(`\n⚠️  IGNORADOS (${skipped.length}):`);
  skipped.forEach(f => console.log(`  - ${f}`));
}

console.log(`\n✓ Schema salvo`);
