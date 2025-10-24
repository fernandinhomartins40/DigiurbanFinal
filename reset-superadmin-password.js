const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function resetPassword() {
  try {
    const newPassword = 'Super@admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    console.log('🔄 Resetando senha do superadmin@digiurban.com...\n');

    const updated = await prisma.user.update({
      where: {
        email: 'superadmin@digiurban.com'
      },
      data: {
        password: hashedPassword
      }
    });

    console.log('✅ Senha atualizada com sucesso!');
    console.log('📧 Email:', updated.email);
    console.log('👤 Nome:', updated.name);
    console.log('🔑 Nova senha: Super@admin123');
    console.log('\n⚠️  Faça login com essas credenciais.');

  } catch (error) {
    console.error('❌ Erro ao resetar senha:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword();
