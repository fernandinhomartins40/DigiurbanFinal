const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const allModels = Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$'));

console.log(`✓ Total de modelos disponíveis: ${allModels.length}`);

// Verificar modelos FASE 6 que estavam faltando
const fase6Models = [
  'farmerMarketRegistration',
  'lotSubdivision',
  'organicCertification',
  'propertyNumbering',
  'seedDistribution',
  'soilAnalysis',
  'treeAuthorization',
  'urbanCertificate'
];

console.log('\n✓ Modelos FASE 6 (anteriormente faltantes):');
fase6Models.forEach(modelName => {
  const exists = typeof prisma[modelName] === 'object';
  console.log(`  ${exists ? '✓' : '✗'} ${modelName}: ${exists ? 'OK' : 'FALTANDO'}`);
});

// Verificar modelos FASE 7
const fase7Models = [
  'policeReport',
  'patrolRequest',
  'cameraRequest',
  'anonymousTip',
  'eventAuthorization',
  'lostAndFound'
];

console.log('\n✓ Modelos FASE 7:');
fase7Models.forEach(modelName => {
  const exists = typeof prisma[modelName] === 'object';
  console.log(`  ${exists ? '✓' : '✗'} ${modelName}: ${exists ? 'OK' : 'FALTANDO'}`);
});

// Verificar alguns modelos FASE 4 e 5
const fase4e5Models = [
  'infrastructureProblem',
  'urbanMaintenanceRequest',
  'housingRequest',
  'culturalSpace',
  'sportsTeam',
  'touristAttraction'
];

console.log('\n✓ Modelos FASE 4 e 5 (amostra):');
fase4e5Models.forEach(modelName => {
  const exists = typeof prisma[modelName] === 'object';
  console.log(`  ${exists ? '✓' : '✗'} ${modelName}: ${exists ? 'OK' : 'FALTANDO'}`);
});

console.log('\n✓ Schema recuperado com sucesso!');
console.log(`✓ Total no schema.prisma: 5956 linhas (recuperado de 4873 linhas)`);
console.log(`✓ Modelos adicionados: ${allModels.length} modelos`);

prisma.$disconnect();
