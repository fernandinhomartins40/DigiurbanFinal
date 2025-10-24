const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function updatePassword() {
  const email = 'prefeito@demo.gov.br';
  const newPassword = 'Admin@123'; // Senha que o usuário está digitando

  console.log('🔐 Atualizando senha para:', newPassword);

  // Gerar novo hash
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // Atualizar usuário
  const updated = await prisma.user.update({
    where: { email },
    data: {
      password: hashedPassword,
      failedLoginAttempts: 0,
      lockedUntil: null
    }
  });

  console.log('✅ Senha atualizada com sucesso!');
  console.log('');
  console.log('═══════════════════════════════════');
  console.log('📝 CREDENCIAIS DE LOGIN');
  console.log('═══════════════════════════════════');
  console.log('Email:', email);
  console.log('Senha:', newPassword);
  console.log('═══════════════════════════════════');
  console.log('');

  // Verificar se a senha foi salva corretamente
  const test = await bcrypt.compare(newPassword, hashedPassword);
  console.log('✓ Verificação:', test ? 'Senha válida' : 'Erro no hash');
}

updatePassword()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
