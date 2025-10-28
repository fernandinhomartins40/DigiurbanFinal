const fs = require('fs');
const path = require('path');

// Ler o schema atual
const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf-8');

// Ler os arquivos phase
const phase4 = fs.readFileSync(path.join(__dirname, 'prisma', 'phase4-models.prisma'), 'utf-8');
const phase5 = fs.readFileSync(path.join(__dirname, 'prisma', 'phase5-models.prisma'), 'utf-8');
const phase6 = fs.readFileSync(path.join(__dirname, 'prisma', 'phase6-models.prisma'), 'utf-8');
const phase7 = fs.readFileSync(path.join(__dirname, 'prisma', 'phase7-models.prisma'), 'utf-8');

// Extrair nomes dos modelos do schema atual
const existingModels = new Set();
const modelRegex = /^model\s+(\w+)\s*{/gm;
let match;
while ((match = modelRegex.exec(schema)) !== null) {
  existingModels.add(match[1]);
}

console.log(`✓ Schema atual tem ${existingModels.size} modelos`);

// Função para adicionar modelos de um phase se não existirem
function addPhaseModels(phaseContent, phaseName) {
  const newModels = [];
  const phaseModels = new Set();

  // Extrair modelos do phase
  const modelRegex = /^(model\s+\w+\s*{[\s\S]*?^})/gm;
  let match;

  while ((match = modelRegex.exec(phaseContent)) !== null) {
    const modelBlock = match[1];
    const modelNameMatch = modelBlock.match(/^model\s+(\w+)\s*{/);

    if (modelNameMatch) {
      const modelName = modelNameMatch[1];
      phaseModels.add(modelName);

      if (!existingModels.has(modelName)) {
        newModels.push(modelBlock);
        existingModels.add(modelName);
      }
    }
  }

  console.log(`✓ ${phaseName}: ${phaseModels.size} modelos (${newModels.length} novos adicionados)`);
  return newModels;
}

// Adicionar relações ao Tenant para os novos modelos
const tenantRelations = [];

// Processar cada phase
const phase4Models = addPhaseModels(phase4, 'FASE 4');
const phase5Models = addPhaseModels(phase5, 'FASE 5');
const phase6Models = addPhaseModels(phase6, 'FASE 6');
const phase7Models = addPhaseModels(phase7, 'FASE 7');

// Adicionar relações ao Tenant
const modelsNeedingTenantRelation = [
  'InfrastructureProblem',
  'UrbanMaintenanceRequest',
  'HousingRequest',
  'CulturalSpace',
  'CulturalProject',
  'CulturalEvent',
  'ArtisticGroup',
  'CulturalWorkshop',
  'CulturalAttendance',
  'SportsTeam',
  'SportsModality',
  'Athlete',
  'Competition',
  'SportsEvent',
  'SportsInfrastructure',
  'SportsSchool',
  'SportsAttendance',
  'TouristAttraction',
  'LocalBusiness',
  'TourismProgram',
  'TourismInfo',
  'TourismAttendance'
];

// Encontrar onde adicionar as novas relações no model Tenant
const tenantModelMatch = schema.match(/(model Tenant\s*{[\s\S]*?)(  \/\/ Novos campos para email \(Fase 7\)[\s\S]*?^})/m);

if (tenantModelMatch) {
  const beforeEmail = tenantModelMatch[1];
  const afterEmail = tenantModelMatch[2];

  // Construir novas relações
  const newRelations = [];
  modelsNeedingTenantRelation.forEach(modelName => {
    if (existingModels.has(modelName) && !schema.includes(`${modelName}[]`)) {
      // Converter para snake_case para o nome da relação
      const relationName = modelName
        .replace(/([A-Z])/g, (m) => `_${m.toLowerCase()}`)
        .substring(1) + 's';
      newRelations.push(`  ${relationName}    ${modelName}[]`);
    }
  });

  if (newRelations.length > 0) {
    const updatedTenant = beforeEmail +
      '\n  // Relacionamentos FASE 4-7\n' +
      newRelations.join('\n') + '\n\n' +
      afterEmail;
    schema = schema.replace(tenantModelMatch[0], updatedTenant);
    console.log(`✓ Adicionadas ${newRelations.length} relações ao Tenant`);
  }
}

// Adicionar os novos modelos ao final do schema
if (phase4Models.length > 0) {
  schema += '\n\n// ============================================================================\n';
  schema += '// FASE 4: SECRETARIAS DE INFRAESTRUTURA\n';
  schema += '// ============================================================================\n\n';
  schema += phase4Models.join('\n\n');
}

if (phase5Models.length > 0) {
  schema += '\n\n// ============================================================================\n';
  schema += '// FASE 5: SECRETARIAS CULTURAIS\n';
  schema += '// ============================================================================\n\n';
  schema += phase5Models.join('\n\n');
}

if (phase6Models.length > 0) {
  schema += '\n\n// ============================================================================\n';
  schema += '// FASE 6: SECRETARIAS AMBIENTAIS\n';
  schema += '// ============================================================================\n\n';
  schema += phase6Models.join('\n\n');
}

if (phase7Models.length > 0) {
  schema += '\n\n// ============================================================================\n';
  schema += '// FASE 7: SECRETARIA DE SEGURANÇA PÚBLICA\n';
  schema += '// ============================================================================\n\n';
  schema += phase7Models.join('\n\n');
}

// Salvar o schema consolidado
fs.writeFileSync(schemaPath, schema, 'utf-8');

// Contar linhas finais
const finalLines = schema.split('\n').length;
console.log(`\n✓ Schema consolidado com sucesso!`);
console.log(`✓ Total de modelos: ${existingModels.size}`);
console.log(`✓ Total de linhas: ${finalLines}`);
console.log(`✓ Arquivo salvo em: ${schemaPath}`);
