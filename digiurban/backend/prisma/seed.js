const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  try {
    // ========== CRIAR TENANT DEMO ==========
    console.log('🏛️  Criando tenant demo...');

    let demoTenant = await prisma.tenant.findFirst({
      where: { OR: [{ id: 'demo' }, { domain: 'demo' }] }
    });

    if (!demoTenant) {
      demoTenant = await prisma.tenant.create({
        data: {
          id: 'demo',
          name: 'Município Demonstração',
          cnpj: '00000000000191',
          domain: 'demo',
          status: 'ACTIVE',
          plan: 'PROFESSIONAL',
          codigoIbge: '0000000',
          nomeMunicipio: 'Demonstração',
          ufMunicipio: 'SP',
          metadata: {
            isDemoTenant: true,
            createdBySeeder: true,
            createdAt: new Date().toISOString()
          }
        }
      });
      console.log('   ✅ Tenant demo criado:', demoTenant.id);
    } else {
      console.log('   ℹ️  Tenant demo já existe:', demoTenant.id);
    }

    // ========== CRIAR SUPER ADMIN ==========
    console.log('\n👤 Criando super admin...');

    const superAdminEmail = 'superadmin@digiurban.com';
    let superAdmin = await prisma.user.findFirst({
      where: { email: superAdminEmail }
    });

    if (!superAdmin) {
      const hashedPassword = await bcrypt.hash('Admin@2025', 10);

      superAdmin = await prisma.user.create({
        data: {
          email: superAdminEmail,
          name: 'Super Administrador',
          password: hashedPassword,
          role: 'SUPER_ADMIN',
          tenantId: demoTenant.id,
          isActive: true
        }
      });
      console.log('   ✅ Super admin criado:', superAdmin.email);
      console.log('   📧 Email: superadmin@digiurban.com');
      console.log('   🔑 Senha: Admin@2025');
    } else {
      console.log('   ℹ️  Super admin já existe:', superAdmin.email);
    }

    // ========== CRIAR ADMIN DO TENANT DEMO ==========
    console.log('\n👤 Criando admin do tenant demo...');

    const adminEmail = 'admin@demo.gov.br';
    let adminUser = await prisma.user.findFirst({
      where: { email: adminEmail }
    });

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('Admin@2025', 10);

      adminUser = await prisma.user.create({
        data: {
          email: adminEmail,
          name: 'Administrador Demo',
          password: hashedPassword,
          role: 'ADMIN',
          tenantId: demoTenant.id,
          isActive: true
        }
      });
      console.log('   ✅ Admin demo criado:', adminUser.email);
      console.log('   📧 Email: admin@demo.gov.br');
      console.log('   🔑 Senha: Admin@2025');
    } else {
      console.log('   ℹ️  Admin demo já existe:', adminUser.email);
    }

    // ========== CRIAR DEPARTAMENTO ==========
    console.log('\n🏢 Criando departamento...');

    let department = await prisma.department.findFirst({
      where: {
        tenantId: demoTenant.id,
        name: 'Administração Geral'
      }
    });

    if (!department) {
      department = await prisma.department.create({
        data: {
          name: 'Administração Geral',
          tenantId: demoTenant.id,
          isActive: true
        }
      });
      console.log('   ✅ Departamento criado:', department.name);
    } else {
      console.log('   ℹ️  Departamento já existe:', department.name);
    }

    console.log('\n✅ Seed concluído com sucesso!');
    console.log('\n📋 Resumo:');
    console.log(`   Tenant: ${demoTenant.name} (${demoTenant.domain})`);
    console.log(`   Super Admin: ${superAdminEmail}`);
    console.log(`   Admin Demo: ${adminEmail}`);
    console.log(`   Senha padrão: Admin@2025`);

  } catch (error) {
    console.error('❌ Erro no seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Erro fatal no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
