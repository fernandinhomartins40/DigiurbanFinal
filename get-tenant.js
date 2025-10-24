const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const tenant = await prisma.tenant.findFirst();
    console.log('Tenant:', JSON.stringify(tenant, null, 2));
  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
})();
