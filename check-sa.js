process.env.DATABASE_URL = 'file:./remote-dev.db';
const { PrismaClient } = require('./digiurban/backend/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const sa = await prisma.superAdmin.findUnique({
      where: { email: 'superadmin@digiurban.com' }
    });

    if (sa) {
      console.log('✓ SuperAdmin:', sa.email, sa.name, 'Ativo:', sa.isActive);
      console.log('  Hash:', sa.password.substring(0, 40));
    } else {
      console.log('✗ NÃO encontrado');
      const all = await prisma.superAdmin.findMany();
      console.log('Total:', all.length);
      all.forEach(x => console.log(' -', x.email, x.name));
    }
  } finally {
    await prisma.$disconnect();
  }
}

check();
