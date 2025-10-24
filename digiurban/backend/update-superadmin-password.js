const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function updateSuperAdminPassword() {
  try {
    console.log('🔐 Atualizando senha do super admin...\n');

    // Nova senha seguindo o padrão de segurança
    const newPassword = 'Super@Admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const superAdmin = await prisma.user.update({
      where: {
        email: 'superadmin@digiurban.com'
      },
      data: {
        password: hashedPassword,
        failedLoginAttempts: 0,
        lockedUntil: null
      }
    });

    console.log('✅ Senha do super admin atualizada com sucesso!\n');
    console.log('📝 Novas credenciais:');
    console.log('   Email: superadmin@digiurban.com');
    console.log('   Senha: Super@Admin123');
    console.log('\n🔒 A senha agora atende aos requisitos de segurança:');
    console.log('   ✓ Mínimo 8 caracteres');
    console.log('   ✓ Letra maiúscula');
    console.log('   ✓ Letra minúscula');
    console.log('   ✓ Número');
    console.log('   ✓ Caractere especial (@)');
    console.log('\n🌐 URL de acesso:');
    console.log('   http://localhost:3000/super-admin/login');

  } catch (error) {
    console.error('❌ Erro ao atualizar senha:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateSuperAdminPassword();
