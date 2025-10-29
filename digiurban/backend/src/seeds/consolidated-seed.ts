/**
 * SEED CONSOLIDADO - DIGIURBAN
 *
 * Popula o banco de dados com dados iniciais:
 * 1. Tenant de demonstração
 * 2. Usuários administrativos
 * 3. Departamentos (13 secretarias)
 * 4. Templates de serviços de todas as secretarias
 */

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed consolidado do DigiUrban...\n');

  try {
    // ============================================================
    // 1. CRIAR TENANT DE DEMONSTRAÇÃO
    // ============================================================
    console.log('📋 Criando tenant de demonstração...');

    const tenant = await prisma.tenant.upsert({
      where: { cnpj: '00.000.000/0000-00' },
      update: {},
      create: {
        name: 'Prefeitura Municipal Demo',
        cnpj: '00.000.000/0000-00',
        plan: 'PROFESSIONAL',
        status: 'ACTIVE',
        nomeMunicipio: 'Cidade Demo',
        ufMunicipio: 'SP'
      }
    });

    console.log(`✅ Tenant criado: ${tenant.name} (ID: ${tenant.id})\n`);

    // ============================================================
    // 2. CRIAR USUÁRIOS ADMINISTRATIVOS
    // ============================================================
    console.log('👤 Criando usuários administrativos...');

    // Super Admin (acesso global)
    const superAdmin = await prisma.user.upsert({
      where: { email: 'superadmin@digiurban.com' },
      update: {},
      create: {
        name: 'Super Administrador',
        email: 'superadmin@digiurban.com',
        password: '$2b$10$mJU0zTJBGKOKVrFM02nzreBVb8ass/LJB5VYqnN.IIj0NnU5/VYP.', // senha: Admin@123
        role: 'SUPER_ADMIN',
        tenantId: tenant.id
      }
    });

    // Admin do Tenant
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@demo.gov.br' },
      update: {},
      create: {
        name: 'Administrador',
        email: 'admin@demo.gov.br',
        password: '$2b$10$mJU0zTJBGKOKVrFM02nzreBVb8ass/LJB5VYqnN.IIj0NnU5/VYP.', // senha: Admin@123
        role: 'ADMIN',
        tenantId: tenant.id
      }
    });

    console.log(`✅ Super Admin criado: ${superAdmin.email}`);
    console.log(`✅ Admin criado: ${adminUser.email}\n`);

    // ============================================================
    // 3. CRIAR DEPARTAMENTOS (13 SECRETARIAS)
    // ============================================================
    console.log('🏛️  Criando departamentos/secretarias...');

    const departments = [
      {
        code: 'SAUDE',
        name: 'Secretaria de Saúde',
        description: 'Responsável pelos serviços de saúde pública'
      },
      {
        code: 'EDUCACAO',
        name: 'Secretaria de Educação',
        description: 'Responsável pela educação municipal'
      },
      {
        code: 'ASSISTENCIA_SOCIAL',
        name: 'Secretaria de Assistência Social',
        description: 'Atendimento e programas sociais'
      },
      {
        code: 'CULTURA',
        name: 'Secretaria de Cultura',
        description: 'Eventos e espaços culturais'
      },
      {
        code: 'ESPORTE',
        name: 'Secretaria de Esporte',
        description: 'Esporte e lazer'
      },
      {
        code: 'TURISMO',
        name: 'Secretaria de Turismo',
        description: 'Turismo e desenvolvimento econômico'
      },
      {
        code: 'MEIO_AMBIENTE',
        name: 'Secretaria de Meio Ambiente',
        description: 'Proteção ambiental e sustentabilidade'
      },
      {
        code: 'OBRAS_PUBLICAS',
        name: 'Secretaria de Obras Públicas',
        description: 'Infraestrutura e manutenção urbana'
      },
      {
        code: 'SERVICOS_PUBLICOS',
        name: 'Secretaria de Serviços Públicos',
        description: 'Limpeza, iluminação e serviços gerais'
      },
      {
        code: 'HABITACAO',
        name: 'Secretaria de Habitação',
        description: 'Moradia e regularização fundiária'
      },
      {
        code: 'PLANEJAMENTO_URBANO',
        name: 'Secretaria de Planejamento Urbano',
        description: 'Alvarás e licenças urbanas'
      },
      {
        code: 'AGRICULTURA',
        name: 'Secretaria de Agricultura',
        description: 'Apoio ao produtor rural'
      },
      {
        code: 'SEGURANCA_PUBLICA',
        name: 'Secretaria de Segurança Pública',
        description: 'Segurança e Guarda Municipal'
      }
    ];

    let deptCount = 0;
    for (const dept of departments) {
      const existing = await prisma.department.findFirst({
        where: {
          tenantId: tenant.id,
          code: dept.code
        }
      });

      if (!existing) {
        await prisma.department.create({
          data: {
            ...dept,
            tenantId: tenant.id,
            isActive: true
          }
        });
      }
      deptCount++;
    }

    console.log(`✅ ${deptCount} departamentos criados\n`);

    // ============================================================
    // 4. CRIAR ALGUNS SERVIÇOS DE EXEMPLO
    // ============================================================
    console.log('📝 Criando serviços de exemplo...');

    const saudeDept = await prisma.department.findFirst({
      where: { tenantId: tenant.id, code: 'SAUDE' }
    });

    const educacaoDept = await prisma.department.findFirst({
      where: { tenantId: tenant.id, code: 'EDUCACAO' }
    });

    if (saudeDept) {
      const existing1 = await prisma.serviceSimplified.findFirst({
        where: {
          tenantId: tenant.id,
          name: 'Agendamento de Consulta'
        }
      });

      if (!existing1) {
        await prisma.serviceSimplified.create({
          data: {
            name: 'Agendamento de Consulta',
            description: 'Agendar consulta médica nas UBS e clínicas municipais',
            category: 'Saúde',
            departmentId: saudeDept.id,
            tenantId: tenant.id,
            isActive: true,
            requiresDocuments: true,
            estimatedDays: 7,
            icon: 'CalendarCheck',
            color: '#DC2626'
          }
        });
      }

      const existing2 = await prisma.serviceSimplified.findFirst({
        where: {
          tenantId: tenant.id,
          name: 'Solicitação de Cartão SUS'
        }
      });

      if (!existing2) {
        await prisma.serviceSimplified.create({
          data: {
            name: 'Solicitação de Cartão SUS',
            description: 'Primeira via ou segunda via do Cartão Nacional de Saúde',
            category: 'Saúde',
            departmentId: saudeDept.id,
            tenantId: tenant.id,
            isActive: true,
            requiresDocuments: true,
            estimatedDays: 3,
            icon: 'IdCard',
            color: '#DC2626'
          }
        });
      }
    }

    if (educacaoDept) {
      const existing3 = await prisma.serviceSimplified.findFirst({
        where: {
          tenantId: tenant.id,
          name: 'Matrícula Escolar'
        }
      });

      if (!existing3) {
        await prisma.serviceSimplified.create({
          data: {
            name: 'Matrícula Escolar',
            description: 'Solicitação de matrícula em escola da rede municipal',
            category: 'Educação',
            departmentId: educacaoDept.id,
            tenantId: tenant.id,
            isActive: true,
            requiresDocuments: true,
            estimatedDays: 15,
            icon: 'GraduationCap',
            color: '#2563EB'
          }
        });
      }

      const existing4 = await prisma.serviceSimplified.findFirst({
        where: {
          tenantId: tenant.id,
          name: 'Transporte Escolar'
        }
      });

      if (!existing4) {
        await prisma.serviceSimplified.create({
          data: {
            name: 'Transporte Escolar',
            description: 'Solicitação de transporte escolar gratuito',
            category: 'Educação',
            departmentId: educacaoDept.id,
            tenantId: tenant.id,
            isActive: true,
            requiresDocuments: true,
            estimatedDays: 10,
            icon: 'Bus',
            color: '#2563EB'
          }
        });
      }
    }

    console.log(`✅ Serviços de exemplo criados\n`);

    // ============================================================
    // RESUMO FINAL
    // ============================================================
    console.log('\n✅ === SEED CONSOLIDADO CONCLUÍDO COM SUCESSO! ===\n');
    console.log('📊 Resumo:');
    console.log(`   • 1 Tenant: ${tenant.name}`);
    console.log(`   • 2 Usuários: Super Admin + Admin`);
    console.log(`   • ${deptCount} Departamentos/Secretarias`);
    console.log(`   • 4 Serviços de exemplo`);
    console.log('\n🔐 Credenciais de acesso (senha forte):');
    console.log(`   \n   SUPER ADMIN (acesso global):`);
    console.log(`   Email: ${superAdmin.email}`);
    console.log(`   Senha: Admin@123`);
    console.log(`   \n   ADMIN (tenant demo):`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Senha: Admin@123`);
    console.log('\n🌐 URLs:');
    console.log(`   Frontend: http://localhost:3000`);
    console.log(`   Backend:  http://localhost:3001`);
    console.log('\n');

  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
