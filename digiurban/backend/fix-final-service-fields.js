const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf-8');

// Lista de campos faltantes baseado nos erros mais recentes
const fieldsToAdd = [
  // ServiceForm - linha 260
  {
    model: 'ServiceForm',
    afterField: 'conditional',
    fields: `
  isMultiStep      Boolean  @default(false) // Se é formulário multi-etapa`
  },

  // ServiceLocation - linha 274
  {
    model: 'ServiceLocation',
    afterField: 'locationType',
    fields: `
  hasGeofencing    Boolean  @default(false) // Se requer geofencing`
  },

  // ServiceScheduling - linha 297
  {
    model: 'ServiceScheduling',
    afterField: 'workingHours',
    fields: `
  blockouts        Json?    // Bloqueios de horário`
  },

  // ServiceSurvey - linha 324
  {
    model: 'ServiceSurvey',
    afterField: 'timing',
    fields: `
  isRequired       Boolean  @default(false) // Se a pesquisa é obrigatória`
  },

  // ServiceWorkflow - linha 340
  {
    model: 'ServiceWorkflow',
    afterField: 'name',
    fields: `
  description      String?  // Descrição do workflow`
  },

  // BuildingPermit - lotNumber (linha 59)
  {
    model: 'BuildingPermit',
    afterField: 'neighborhood',
    fields: `
  lotNumber        String?  // Número do lote`
  },

  // Service - moduleEntity
  {
    model: 'Service',
    afterField: 'moduleType',
    fields: `
  moduleEntity     String?             // Entidade do módulo customizado`
  }
];

// Função para adicionar campos em um modelo
function addFieldsToModel(schema, modelName, afterField, fieldsToAdd) {
  // Encontra o modelo
  const modelRegex = new RegExp(`model\\s+${modelName}\\s*{([\\s\\S]*?)}`, 'g');
  const match = modelRegex.exec(schema);

  if (!match) {
    console.log(`❌ Modelo ${modelName} não encontrado`);
    return schema;
  }

  const modelContent = match[1];

  // Verifica se o primeiro campo já existe
  const firstFieldName = fieldsToAdd.trim().split(/\s+/)[0];
  if (modelContent.includes(firstFieldName)) {
    console.log(`⏭️  Campo '${firstFieldName}' já existe no modelo ${modelName}`);
    return schema;
  }

  // Verifica se o campo afterField existe
  const afterFieldRegex = new RegExp(`(\\s+${afterField}[\\s\\S]*?\\n)`, 'g');
  const afterFieldMatch = afterFieldRegex.exec(modelContent);

  if (!afterFieldMatch) {
    console.log(`❌ Campo '${afterField}' não encontrado no modelo ${modelName}`);
    return schema;
  }

  // Adiciona os novos campos após o campo especificado
  const newModelContent = modelContent.replace(
    afterFieldRegex,
    `$1${fieldsToAdd}`
  );

  // Substitui o conteúdo do modelo
  const newSchema = schema.replace(modelRegex, `model ${modelName} {${newModelContent}}`);

  console.log(`✅ Campo adicionado ao modelo ${modelName}`);
  return newSchema;
}

// Adiciona todos os campos
fieldsToAdd.forEach(({ model, afterField, fields }) => {
  schema = addFieldsToModel(schema, model, afterField, fields);
});

// Salva o schema atualizado
fs.writeFileSync(schemaPath, schema);
console.log('\n✅ Schema atualizado com sucesso!');
