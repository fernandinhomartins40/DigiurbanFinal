const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf-8');

const fieldsToAdd = [
  // ServiceForm
  { model: 'ServiceForm', field: 'validation', type: 'Json?', addBefore: 'createdAt' },

  // ServiceLocation
  { model: 'ServiceLocation', field: 'locationType', type: 'String?', addBefore: 'createdAt' },

  // ServiceScheduling
  { model: 'ServiceScheduling', field: 'type', type: 'String?', addBefore: 'createdAt' },

  // ServiceSurvey
  { model: 'ServiceSurvey', field: 'type', type: 'String?', addBefore: 'createdAt' },

  // ServiceTemplate
  { model: 'ServiceTemplate', field: 'estimatedTime', type: 'Int?', addBefore: 'createdAt' },
  { model: 'ServiceTemplate', field: 'moduleEntity', type: 'String?', addBefore: 'createdAt' },
  { model: 'ServiceTemplate', field: 'fieldMapping', type: 'Json?', addBefore: 'createdAt' },
  { model: 'ServiceTemplate', field: 'defaultFields', type: 'Json?', addBefore: 'createdAt' },

  // BuildingPermit
  { model: 'BuildingPermit', field: 'propertyNumber', type: 'String?', addBefore: 'createdAt' },
  { model: 'BuildingPermit', field: 'approvedBy', type: 'String?', addBefore: 'createdAt' },

  // CulturalAttendance
  { model: 'CulturalAttendance', field: 'serviceId', type: 'String?', addBefore: 'createdAt' },
];

let count = 0;

fieldsToAdd.forEach(({ model, field, type, addBefore }) => {
  const modelPattern = new RegExp(
    `(model ${model} {[\\s\\S]*?)(  ${addBefore}\\s+DateTime)`,
    'g'
  );

  const match = schema.match(modelPattern);
  if (match) {
    schema = schema.replace(modelPattern, (fullMatch, before, beforeField) => {
      const fieldExists = new RegExp(`^\\s+${field}\\s+`, 'm').test(before);
      if (fieldExists) return fullMatch;

      count++;
      console.log(`✓ ${model}.${field} (${type})`);
      return `${before}  ${field.padEnd(20)} ${type.padEnd(16)}\n  ${beforeField}`;
    });
  }
});

fs.writeFileSync(schemaPath, schema, 'utf-8');
console.log(`\n✓ Total: ${count} campos adicionados`);
