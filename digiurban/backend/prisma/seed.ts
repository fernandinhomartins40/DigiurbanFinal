import { PrismaClient, TenantStatus, Plan } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { seedInitialServices } from '../src/seeds/initial-services';

const prisma = new PrismaClient();

// IDs fixos para tenants especiais
const UNASSIGNED_POOL_ID = 'clzunassigned000000000000000';
const DEMO_TENANT_ID = 'demo';

async function main() {
  console.log('🌱 Iniciando seed consolidado do banco de dados...\n');

  try {
    // ========== 0. CRIAR UNASSIGNED_POOL (CRÍTICO!) ==========
    console.log('🏛️  Criando UNASSIGNED_POOL (tenant especial)...');

    const unassignedPool = await prisma.tenant.upsert({
      where: { id: UNASSIGNED_POOL_ID },
      update: {},
      create: {
        id: UNASSIGNED_POOL_ID,
        name: 'Pool Global - Municípios Não Cadastrados',
        cnpj: '00.000.000/0000-00',
        // ❌ SEM domain - login centralizado via JWT
        plan: 'ENTERPRISE',
        status: 'ACTIVE',
        metadata: {
          isSystemTenant: true,
          isUnassignedPool: true,
          description: 'Tenant especial para cidadãos de municípios sem tenant ativo',
          createdBy: 'SYSTEM',
          readOnly: true,
          cannotBeDeleted: true,
        }
      }
    });
    console.log('   ✅ UNASSIGNED_POOL criado:', unassignedPool.id);

    // ========== 1. CRIAR TENANT DEMO ==========
    console.log('\n🏛️  Criando tenant demo...');

    const demoTenant = await prisma.tenant.upsert({
      where: { id: DEMO_TENANT_ID },
      update: {},
      create: {
        id: DEMO_TENANT_ID,
        name: 'Município Demonstração',
        cnpj: '00000000000191',
        // ❌ SEM domain - login centralizado via JWT
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

    // ========== 2. CRIAR SUPER ADMIN ==========
    console.log('\n👤 Criando super admin...');

    const superAdminEmail = 'super@admin.com';
    const superAdminPassword = 'Super@123';

    let superAdmin = await prisma.user.findFirst({
      where: { email: superAdminEmail }
    });

    const hashedSuperPassword = await bcrypt.hash(superAdminPassword, 12);

    if (!superAdmin) {
      superAdmin = await prisma.user.create({
        data: {
          email: superAdminEmail,
          name: 'Super Administrador',
          password: hashedSuperPassword,
          role: 'SUPER_ADMIN',
          tenantId: demoTenant.id,
          isActive: true,
          mustChangePassword: false
        }
      });
      console.log('   ✅ Super admin criado:', superAdmin.email);
    } else {
      await prisma.user.update({
        where: { id: superAdmin.id },
        data: {
          password: hashedSuperPassword,
          isActive: true,
          role: 'SUPER_ADMIN',
          mustChangePassword: false
        }
      });
      console.log('   ℹ️  Super admin já existe (senha atualizada):', superAdmin.email);
    }

    // ========== 3. CRIAR ADMIN DO TENANT DEMO ==========
    console.log('\n👤 Criando admin do tenant demo...');

    const adminEmail = 'admin@demo.gov.br';
    const adminPassword = 'Admin@123';

    let adminUser = await prisma.user.findFirst({
      where: { email: adminEmail }
    });

    const hashedAdminPassword = await bcrypt.hash(adminPassword, 12);

    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          email: adminEmail,
          name: 'Administrador Demo',
          password: hashedAdminPassword,
          role: 'ADMIN',
          tenantId: demoTenant.id,
          isActive: true,
          mustChangePassword: false
        }
      });
      console.log('   ✅ Admin demo criado:', adminUser.email);
    } else {
      await prisma.user.update({
        where: { id: adminUser.id },
        data: {
          password: hashedAdminPassword,
          isActive: true,
          role: 'ADMIN',
          mustChangePassword: false
        }
      });
      console.log('   ℹ️  Admin demo já existe (senha atualizada):', adminUser.email);
    }

    // ========== 4. CRIAR DEPARTAMENTO ==========
    console.log('\n🏢 Criando departamento...');

    const department = await prisma.department.upsert({
      where: {
        tenantId_name: {
          tenantId: demoTenant.id,
          name: 'Administração Geral'
        }
      },
      update: {},
      create: {
        name: 'Administração Geral',
        code: 'ADM',
        tenantId: demoTenant.id,
        isActive: true
      }
    });
    console.log('   ✅ Departamento criado:', department.name);

    // ========== 5. CRIAR DEPARTAMENTOS PRINCIPAIS ==========
    console.log('\n🏢 Criando departamentos principais...');

    const mainDepartments = [
      { name: 'Secretaria de Saúde', code: 'SAUDE' },
      { name: 'Secretaria de Educação', code: 'EDUCACAO' },
      { name: 'Secretaria de Serviços Públicos', code: 'SERVICOS_PUBLICOS' },
    ];

    for (const dept of mainDepartments) {
      await prisma.department.upsert({
        where: {
          tenantId_name: {
            tenantId: demoTenant.id,
            name: dept.name
          }
        },
        update: { code: dept.code, isActive: true },
        create: {
          name: dept.name,
          code: dept.code,
          tenantId: demoTenant.id,
          isActive: true
        }
      });
      console.log(`   ✅ ${dept.name} (${dept.code})`);
    }

    // ========== 6. POPULAR SERVIÇOS INICIAIS ==========
    await seedInitialServices(demoTenant.id);

    // ========== RESUMO FINAL ==========
    console.log('\n✅ Seed concluído com sucesso!');
    console.log('\n📋 ========================================');
    console.log('📋 CREDENCIAIS DE ACESSO - DigiUrban');
    console.log('📋 ========================================\n');

    console.log('🏛️  TENANTS CRIADOS:');
    console.log(`   1. ${unassignedPool.name} (ID: ${unassignedPool.id})`);
    console.log(`   2. ${demoTenant.name} (ID: ${demoTenant.id})`);
    console.log(`      CNPJ: ${demoTenant.cnpj}`);
    console.log(`      Status: ${demoTenant.status}\n`);

    console.log('👤 SUPER ADMIN (Gestão Global SaaS):');
    console.log(`   📧 Email: ${superAdminEmail}`);
    console.log(`   🔑 Senha: ${superAdminPassword}`);
    console.log(`   🌐 URL: https://digiurban.com.br/super-admin/login\n`);

    console.log('👤 ADMIN TENANT DEMO (Gestão Municipal):');
    console.log(`   📧 Email: ${adminEmail}`);
    console.log(`   🔑 Senha: ${adminPassword}`);
    console.log(`   🌐 URL: https://digiurban.com.br/admin/login\n`);

    console.log('📋 ========================================');
    console.log('✅ Login centralizado - sem subdomínios!');
    console.log('✅ Identificação via JWT (autenticação)');
    console.log('📋 ========================================\n');

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
