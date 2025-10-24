import { TenantStatus, UserRole, Plan } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { BCRYPT_ROUNDS } from '../config/security';

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // 1. Criar tenant padrão (domain='demo' alinhado com .env)
  const defaultTenant = await prisma.tenant.upsert({
    where: { cnpj: '00.000.000/0001-00' },
    update: {},
    create: {
      name: 'Prefeitura Municipal (Demo)',
      cnpj: '00.000.000/0001-00',
      domain: 'demo',
      plan: Plan.ENTERPRISE,
      status: TenantStatus.ACTIVE,
    },
  });

  console.log('✅ Tenant padrão criado:', defaultTenant.name);

  // 2. Criar departamentos padrão
  const departments = [
    'Saúde',
    'Educação',
    'Assistência Social',
    'Cultura',
    'Segurança Pública',
    'Planejamento Urbano',
    'Agricultura',
    'Esportes',
    'Turismo',
    'Habitação',
    'Meio Ambiente',
    'Obras Públicas',
    'Serviços Públicos',
  ];

  const departmentPromises = departments.map(name =>
    prisma.department.upsert({
      where: {
        tenantId_name: {
          tenantId: defaultTenant.id,
          name: name,
        },
      },
      update: {},
      create: {
        name,
        description: `Secretaria Municipal de ${name}`,
        tenantId: defaultTenant.id,
      },
    })
  );

  const createdDepartments = await Promise.all(departmentPromises);
  console.log('✅ Departamentos criados:', createdDepartments.length);

  // 3. Criar usuários de exemplo com senha padronizada (OWASP 2024)
  const hashedPassword = await bcrypt.hash('123456', BCRYPT_ROUNDS);

  // Super Admin
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@digiurban.com' },
    update: {},
    create: {
      email: 'superadmin@digiurban.com',
      name: 'Super Administrador',
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      tenantId: defaultTenant.id,
    },
  });

  // Prefeito
  const prefeito = await prisma.user.upsert({
    where: { email: 'prefeito@demo.gov.br' },
    update: {},
    create: {
      email: 'prefeito@demo.gov.br',
      name: 'Prefeito Municipal',
      password: hashedPassword,
      role: UserRole.ADMIN,
      tenantId: defaultTenant.id,
    },
  });

  // Secretário de Saúde
  const saudeDepId = createdDepartments.find(d => d.name === 'Saúde')?.id;
  const secretarioSaude = await prisma.user.upsert({
    where: { email: 'secretario.saude@demo.gov.br' },
    update: {},
    create: {
      email: 'secretario.saude@demo.gov.br',
      name: 'Secretário de Saúde',
      password: hashedPassword,
      role: UserRole.MANAGER,
      tenantId: defaultTenant.id,
      departmentId: saudeDepId,
    },
  });

  // Funcionário de Saúde
  const funcionarioSaude = await prisma.user.upsert({
    where: { email: 'funcionario.saude@demo.gov.br' },
    update: {},
    create: {
      email: 'funcionario.saude@demo.gov.br',
      name: 'Funcionário da Saúde',
      password: hashedPassword,
      role: UserRole.USER,
      tenantId: defaultTenant.id,
      departmentId: saudeDepId,
    },
  });

  console.log('✅ Usuários criados:');
  console.log('   - Super Admin:', superAdmin.email);
  console.log('   - Prefeito:', prefeito.email);
  console.log('   - Secretário Saúde:', secretarioSaude.email);
  console.log('   - Funcionário Saúde:', funcionarioSaude.email);

  // 4. Criar serviços de exemplo
  const servicosSaude = [
    {
      name: 'Agendamento de Consulta Médica',
      description: 'Agendamento de consultas médicas na rede municipal',
      requiresDocuments: true,
      estimatedDays: 7,
      priority: 5,
    },
    {
      name: 'Solicitação de Medicamentos',
      description: 'Solicitação de medicamentos da farmácia básica',
      requiresDocuments: true,
      estimatedDays: 3,
      priority: 4,
    },
    {
      name: 'Encaminhamento TFD',
      description: 'Solicitação de tratamento fora do domicílio',
      requiresDocuments: true,
      estimatedDays: 15,
      priority: 3,
    },
  ];

  const servicosPromises = servicosSaude.map(servico =>
    prisma.service.create({
      data: {
        ...servico,
        tenantId: defaultTenant.id,
        departmentId: saudeDepId!,
      },
    })
  );

  const createdServices = await Promise.all(servicosPromises);
  console.log('✅ Serviços de Saúde criados:', createdServices.length);

  // 5. Criar cidadão de exemplo
  const citizenPassword = await bcrypt.hash('senha123', BCRYPT_ROUNDS);

  // ✅ CORRIGIDO: usar compound unique key após remoção de @unique no CPF
  const cidadao = await prisma.citizen.upsert({
    where: {
      tenantId_cpf: {
        tenantId: defaultTenant.id,
        cpf: '12345678901'
      }
    },
    update: {},
    create: {
      name: 'João da Silva',
      email: 'joao.silva@email.com',
      phone: '(11) 99999-9999',
      cpf: '12345678901',
      password: citizenPassword,
      address: JSON.stringify({
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
      }),
      tenantId: defaultTenant.id,
    },
  });

  console.log('✅ Cidadão de exemplo criado:', cidadao.name);

  // 6. Criar protocolo de exemplo
  const protocoloExemplo = await prisma.protocol.create({
    data: {
      number: '2024000001',
      title: 'Agendamento de consulta médica',
      description: 'Solicitação de agendamento para consulta de rotina',
      status: 'VINCULADO',
      tenantId: defaultTenant.id,
      citizenId: cidadao.id,
      serviceId: createdServices[0].id,
      departmentId: saudeDepId!,
      createdById: funcionarioSaude.id,
    },
  });

  console.log('✅ Protocolo de exemplo criado:', protocoloExemplo.number);

  // 7. Criar histórico do protocolo
  await prisma.protocolHistory.create({
    data: {
      action: 'CREATED',
      comment: 'Protocolo criado automaticamente durante seed',
      protocolId: protocoloExemplo.id,
      userId: funcionarioSaude.id,
    },
  });

  console.log('✅ Histórico do protocolo criado');

  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('\n📋 Dados de acesso:');
  console.log('   Super Admin: superadmin@digiurban.com / 123456');
  console.log('   Prefeito: prefeito@demo.gov.br / 123456');
  console.log('   Secretário Saúde: secretario.saude@demo.gov.br / 123456');
  console.log('   Funcionário Saúde: funcionario.saude@demo.gov.br / 123456');
  console.log('\n🏛️ Tenant: default');
  console.log('📞 Protocolo exemplo: 2024000001');
}

main()
  .catch(e => {
    console.error('❌ Erro durante seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
