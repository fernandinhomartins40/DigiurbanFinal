const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function reset() {
  await prisma.user.update({
    where: { email: 'prefeito@demo.gov.br' },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null
    }
  });
  console.log('✅ Conta resetada');
}

reset().catch(console.error).finally(() => prisma.$disconnect());
