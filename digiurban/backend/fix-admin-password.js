const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'prefeito@demo.gov.br';
  const newPassword = 'senha123';

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const updated = await prisma.user.update({
    where: { email },
    data: { password: hashedPassword }
  });

  console.log(`✅ Senha atualizada para ${email}`);
  console.log(`Email: ${email}`);
  console.log(`Senha: ${newPassword}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
