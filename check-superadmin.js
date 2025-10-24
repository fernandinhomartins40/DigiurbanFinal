const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSuperAdmin() {
  try {
    const superAdmin = await prisma.superAdmin.findUnique({
      where: { email: 'superadmin@digiurban.com' }
    });

    if (superAdmin) {
      console.log('✓ SuperAdmin encontrado:');
      console.log('  ID:', superAdmin.id);
      console.log('  Email:', superAdmin.email);
      console.log('  Nome:', superAdmin.name);
      console.log('  Ativo:', superAdmin.isActive);
      console.log('  Hash:', superAdmin.password.substring(0, 30) + '...');
      console.log('  Último login:', superAdmin.lastLogin);
    } else {
      console.log('✗ SuperAdmin NÃO encontrado: superadmin@digiurban.com');

      const allSuperAdmins = await prisma.superAdmin.findMany();
      console.log('\n📋 Total de SuperAdmins:', allSuperAdmins.length);
      allSuperAdmins.forEach((sa, i) => {
        console.log(`\n${i+1}. Email: ${sa.email}`);
        console.log(`   Nome: ${sa.name}`);
        console.log(`   Ativo: ${sa.isActive}`);
      });
    }
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkSuperAdmin();
