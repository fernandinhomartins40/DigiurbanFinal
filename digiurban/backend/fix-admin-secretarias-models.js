/**
 * Script para corrigir nomes de modelos no admin-secretarias.ts
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/routes/admin-secretarias.ts');

const replacements = [
  // Material escolar não existe como modelo separado - remover rota
  { from: /\/\/.*MATERIAL.*[\s\S]*?}\s*\);\s*\n/gm, to: '' },

  // HealthExam não existe - usar HealthAppointment
  { from: /prisma\.healthExam/g, to: 'prisma.healthAppointment' },

  // SocialBenefit não existe - usar SocialProgram
  { from: /prisma\.socialBenefit/g, to: 'prisma.socialProgram' },

  // SportsEnrollment não existe - usar SportsAttendance
  { from: /prisma\.sportsEnrollment/g, to: 'prisma.sportsAttendance' },

  // SportsReservation não existe - usar SportsAttendance
  { from: /prisma\.sportsReservation/g, to: 'prisma.sportsAttendance' },

  // TourismEvent não existe - usar TourismAttendance
  { from: /prisma\.tourismEvent/g, to: 'prisma.tourismAttendance' },

  // HousingLot não existe - usar HousingApplication
  { from: /prisma\.housingLot/g, to: 'prisma.housingApplication' },

  // McmvEnrollment não existe - usar HousingApplication
  { from: /prisma\.mcmvEnrollment/g, to: 'prisma.housingApplication' },

  // InfrastructureIssue não existe - usar PublicWorksAttendance
  { from: /prisma\.infrastructureIssue/g, to: 'prisma.publicWorksAttendance' },

  // PublicWorksMaintenance não existe - usar PublicWorksAttendance
  { from: /prisma\.publicWorksMaintenance/g, to: 'prisma.publicWorksAttendance' },

  // PublicCleaning não existe - usar PublicServicesAttendance
  { from: /prisma\.publicCleaning/g, to: 'prisma.publicServicesAttendance' },

  // TreePruning não existe - usar PublicServicesAttendance
  { from: /prisma\.treePruning/g, to: 'prisma.publicServicesAttendance' },

  // DebrisRemoval não existe - usar PublicServicesAttendance
  { from: /prisma\.debrisRemoval/g, to: 'prisma.publicServicesAttendance' },

  // SecurityReport não existe - usar SecurityOccurrence
  { from: /prisma\.securityReport/g, to: 'prisma.securityOccurrence' }
];

let content = fs.readFileSync(filePath, 'utf8');
let totalReplacements = 0;

replacements.forEach(({ from, to }) => {
  const before = content;
  content = content.replace(from, to);
  if (content !== before) {
    const count = (before.match(from) || []).length;
    totalReplacements += count;
    console.log(`✅ Substituição: ${from} → ${to} (${count}x)`);
  }
});

// Remover rota de material que não existe
content = content.replace(/router\.get\('\/educacao\/material'[\s\S]*?\);\s*\n/m, '');

fs.writeFileSync(filePath, content, 'utf8');

console.log('\n' + '='.repeat(60));
console.log(`✅ Processamento concluído!`);
console.log(`🔄 ${totalReplacements} substituições realizadas`);
console.log('='.repeat(60));
