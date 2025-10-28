const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf-8');

// Lista de campos obrigatórios que estão faltando baseado nos erros de TypeScript
const fieldsToAdd = [
  // TechnicalAssistance - faltam 7 campos obrigatórios
  {
    model: 'TechnicalAssistance',
    afterField: 'source',
    fields: `
  propertyName      String          // Nome da propriedade
  propertySize      Float           // Tamanho da propriedade em hectares
  location          String          // Localização da propriedade
  subject           String          // Assunto da assistência
  requestDate       DateTime        @default(now()) // Data da solicitação
  scheduledVisit    DateTime?       // Data da visita agendada
  completedAt       DateTime?       // Data de conclusão`
  },

  // EnvironmentalComplaint - faltam 2 campos obrigatórios
  {
    model: 'EnvironmentalComplaint',
    afterField: 'source',
    fields: `
  severity          String          // Gravidade da denúncia (baixa, média, alta, crítica)
  occurrenceDate    DateTime        @default(now()) // Data da ocorrência`
  },

  // EnvironmentalLicense - faltam 3 campos obrigatórios
  {
    model: 'EnvironmentalLicense',
    afterField: 'source',
    fields: `
  licenseNumber     String          @unique // Número da licença
  activity          String          // Atividade licenciada
  applicationDate   DateTime        @default(now()) // Data da solicitação`
  },

  // Athlete - falta 1 campo obrigatório
  {
    model: 'Athlete',
    afterField: 'source',
    fields: `
  category          String          // Categoria do atleta (infantil, juvenil, adulto, etc)`
  },

  // SportsAttendance - faltam 3 campos obrigatórios
  {
    model: 'SportsAttendance',
    afterField: 'source',
    fields: `
  citizenName       String          // Nome do cidadão
  contact           String          // Contato do cidadão
  type              String          // Tipo de atendimento`
  },

  // TourismAttendance - falta 1 campo obrigatório
  {
    model: 'TourismAttendance',
    afterField: 'source',
    fields: `
  visitorName       String          // Nome do visitante`
  },

  // CustomDataTable - falta 1 campo obrigatório
  {
    model: 'CustomDataTable',
    afterField: 'schema',
    fields: `
  fields            Json            // Definição dos campos da tabela`
  },

  // CulturalSpace - falta 1 campo obrigatório
  {
    model: 'CulturalSpace',
    afterField: 'source',
    fields: `
  operatingHours    String          // Horário de funcionamento`
  },

  // ServiceForm - adicionar campos faltantes
  {
    model: 'ServiceForm',
    afterField: 'conditional',
    fields: `
  hasGeofencing     Boolean         @default(false) // Se tem geofencing
  workingHours      Json?           // Horário de funcionamento
  timing            String?         // Momento de aplicação da pesquisa`
  },

  // ServiceNotification - adicionar campos faltantes
  {
    model: 'ServiceNotification',
    afterField: 'schedule',
    fields: `
  templates         Json?           // Templates de notificação
  triggers          Json?           // Gatilhos de notificação`
  },

  // ServiceWorkflow - adicionar campo name
  {
    model: 'ServiceWorkflow',
    afterField: 'serviceId',
    fields: `
  name              String?         // Nome do workflow`
  },

  // ServiceTemplate - adicionar campo code
  {
    model: 'ServiceTemplate',
    afterField: 'name',
    fields: `
  code              String          @unique // Código único do template`
  },

  // BuildingPermit - adicionar campos approvedAt e neighborhood
  {
    model: 'BuildingPermit',
    afterField: 'approvedBy',
    fields: `
  approvedAt        DateTime?       // Data de aprovação
  neighborhood      String?         // Bairro da obra`
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

  // Verifica se o campo afterField existe
  const afterFieldRegex = new RegExp(`(\\s+${afterField}\\s+[^\\n]+)`, 'g');
  const afterFieldMatch = afterFieldRegex.exec(modelContent);

  if (!afterFieldMatch) {
    console.log(`❌ Campo '${afterField}' não encontrado no modelo ${modelName}`);
    return schema;
  }

  // Verifica se os campos já existem
  const firstFieldName = fieldsToAdd.trim().split(/\s+/)[0];
  if (modelContent.includes(firstFieldName)) {
    console.log(`⏭️  Campo '${firstFieldName}' já existe no modelo ${modelName}`);
    return schema;
  }

  // Adiciona os novos campos após o campo especificado
  const newModelContent = modelContent.replace(
    afterFieldRegex,
    `$1${fieldsToAdd}`
  );

  // Substitui o conteúdo do modelo
  const newSchema = schema.replace(modelRegex, `model ${modelName} {${newModelContent}}`);

  console.log(`✅ Campos adicionados ao modelo ${modelName}`);
  return newSchema;
}

// Adiciona todos os campos
fieldsToAdd.forEach(({ model, afterField, fields }) => {
  schema = addFieldsToModel(schema, model, afterField, fields);
});

// Salva o schema atualizado
fs.writeFileSync(schemaPath, schema);
console.log('\n✅ Schema atualizado com sucesso!');
