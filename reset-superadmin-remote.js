const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetSuperAdmin() {
  try {
    // Buscar primeiro tenant para associar ao super admin (obrigatório no schema)
    const tenant = await prisma.tenant.findFirst();

    if (!tenant) {
      console.error('❌ Nenhum tenant encontrado. Crie um tenant primeiro.');
      return;
    }

    const hashedPassword = await bcrypt.hash('Super@admin123', 12);

    // Verificar se já existe
    const existing = await prisma.user.findFirst({
      where: { email: 'superadmin@digiurban.com' }
    });

    let user;
    if (existing) {
      // Atualizar existente
      user = await prisma.user.update({
        where: { id: existing.id },
        data: {
          password: hashedPassword,
          isActive: true,
          role: 'SUPER_ADMIN',
        },
      });
      console.log('✅ Super Admin ATUALIZADO com sucesso:');
    } else {
      // Criar novo
      user = await prisma.user.create({
        data: {
          email: 'superadmin@digiurban.com',
          name: 'Super Admin',
          password: hashedPassword,
          role: 'SUPER_ADMIN',
          isActive: true,
          tenantId: tenant.id, // Associar ao primeiro tenant
        },
      });
      console.log('✅ Super Admin CRIADO com sucesso:');
    }

    console.log('Email:', user.email);
    console.log('ID:', user.id);
    console.log('Role:', user.role);
    console.log('Ativo:', user.isActive);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

resetSuperAdmin();
