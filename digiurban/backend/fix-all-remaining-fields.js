const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf-8');

const fieldsToAdd = [
  // BuildingPermit
  { model: 'BuildingPermit', field: 'neighborhood', type: 'String?', addBefore: 'createdAt' },
  { model: 'BuildingPermit', field: 'approvedAt', type: 'DateTime?', addBefore: 'createdAt' },

  // CulturalAttendance
  { model: 'CulturalAttendance', field: 'source', type: 'String', default: '"manual"', addBefore: 'createdAt' },
];

let count = 0;

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
        console.log(`⚠️  ${model}.${field} já existe`);
        return fullMatch;
      }

      count++;
      console.log(`✓ ${model}.${field} (${type})`);
      const fieldDef = defaultValue
        ? `  ${field.padEnd(20)} ${type.padEnd(16)} @default(${defaultValue})`
        : `  ${field.padEnd(20)} ${type.padEnd(16)}`;
      return `${before}${fieldDef}\n  ${beforeField}`;
    });
  } else {
    console.log(`❌ ${model} não encontrado`);
  }
});

fs.writeFileSync(schemaPath, schema, 'utf-8');
console.log(`\n✓ Total: ${count} campos`);
