const { execSync } = require('child_process');

// Definir a variável de ambiente com o consentimento do usuário
process.env.PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION = 'sim';

console.log('⚠️  Resetando banco de dados de desenvolvimento...\n');

try {
  // Executar o reset
  execSync('npx prisma migrate reset --force --skip-seed', {
    stdio: 'inherit',
    env: process.env
  });

  console.log('\n✓ Banco de dados resetado com sucesso!');
} catch (error) {
  console.error('❌ Erro ao resetar banco:', error.message);
  process.exit(1);
}
