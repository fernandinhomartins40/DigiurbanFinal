/**
 * Script para adicionar campos faltantes identificados na compilação TypeScript
 */

const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma/schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

const fixes = [
  {
    model: 'TechnicalAssistance',
    after: 'scheduledDate    DateTime?',
    add: '  scheduledVisit   DateTime?    // Data da visita agendada'
  },
  {
    model: 'CulturalProject',
    after: 'funding          Json?',
    add: '  targetAudience   String?      // Público-alvo do projeto'
  },
  {
    model: 'CulturalSpace',
    after: 'operatingHours   Json',
    add: '  operatingSchedule String?     // Horário de funcionamento (texto)'
  },
  {
    model: 'SportsTeam',
    after: 'source           String',
    add: '  serviceId        String?      // ID do serviço que criou'
  },
  {
    model: 'LocalBusiness',
    after: 'address          String',
    add: '  neighborhood     String?      // Bairro do estabelecimento'
  },
  {
    model: 'TouristAttraction',
    after: 'isActive         Boolean',
    add: '  freeEntry        Boolean      @default(false) // Entrada gratuita'
  },
  {
    model: 'BuildingPermit',
    after: 'totalArea         Float?',
    add: '  builtArea        Float?       // Área construída'
  },
  {
    model: 'Service',
    after: 'hasCustomForm        Boolean',
    add: '  serviceType      String?      // Tipo de serviço (REQUEST, etc.)'
  },
  {
    model: 'ServiceLocation',
    after: 'allowedRadius    Float?',
    add: '  centerLat        Float?       // Latitude do centro\\n  centerLng        Float?       // Longitude do centro'
  },
  {
    model: 'ServiceScheduling',
    after: 'slotDuration  Int?',
    add: '  bufferTime    Int?          // Tempo de buffer entre slots (minutos)'
  },
  {
    model: 'ServiceTemplate',
    after: 'isActive       Boolean',
    add: '  version        Int?          @default(1) // Versão do template'
  },
];

let count = 0;

fixes.forEach(({ model, after, add }) => {
  const modelRegex = new RegExp(`model ${model} \\{[\\s\\S]*?${after.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'm');

  if (modelRegex.test(schema)) {
    schema = schema.replace(modelRegex, (match) => {
      if (!match.includes(add.trim().split(/\s+/)[0])) {
        count++;
        console.log(`✅ Adicionando campo em ${model}`);
        return match + '\n' + add;
      }
      console.log(`⏭️  Campo já existe em ${model}`);
      return match;
    });
  } else {
    console.log(`❌ Não encontrado: ${model} -> ${after}`);
  }
});

fs.writeFileSync(schemaPath, schema, 'utf8');

console.log('\n' + '='.repeat(60));
console.log(`✅ ${count} campos adicionados com sucesso!`);
console.log('='.repeat(60));
