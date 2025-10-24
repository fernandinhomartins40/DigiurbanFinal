/**
 * Script para verificar integridade dos dados essenciais do banco
 * Usado pelo startup.sh para garantir que o seed foi executado corretamente
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkIntegrity() {
  try {
    // Verificar Super Admin
    const superAdminCount = await prisma.user.count({
      where: { role: 'SUPER_ADMIN' }
    });

    // Verificar UNASSIGNED_POOL
    const unassignedPool = await prisma.tenant.findUnique({
      where: { id: 'clzunassigned000000000000000' }
    });

    // Verificar Demo Tenant
    const demoTenant = await prisma.tenant.findUnique({
      where: { id: 'demo' }
    });

    const results = {
      superAdmin: superAdminCount > 0,
      superAdminCount,
      unassignedPool: !!unassignedPool,
      demoTenant: !!demoTenant,
      ok: superAdminCount > 0 && !!unassignedPool
    };

    // Output em formato que o shell script pode processar
    console.log(JSON.stringify(results));

    await prisma.$disconnect();

    // Exit code: 0 = OK, 1 = Faltam dados essenciais
    process.exit(results.ok ? 0 : 1);

  } catch (error) {
    console.error('Error checking integrity:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

checkIntegrity();
