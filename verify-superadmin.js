const bcrypt = require('./digiurban/backend/node_modules/bcryptjs');
const Database = require('better-sqlite3');
const db = new Database('./remote-dev.db', { readonly: true });

try {
  // Buscar usuários com role SUPER_ADMIN na tabela users
  const superAdmins = db.prepare("SELECT * FROM users WHERE role = 'SUPER_ADMIN'").all();

  console.log('=== USUÁRIOS COM ROLE SUPER_ADMIN ===\n');
  console.log('Total:', superAdmins.length);

  superAdmins.forEach((sa, i) => {
    console.log(`\n${i + 1}. SuperAdmin:`);
    console.log('   Email:', sa.email);
    console.log('   Nome:', sa.name);
    console.log('   Ativo:', sa.isActive ? '✓' : '✗');
    console.log('   Hash senha:', sa.password.substring(0, 40) + '...');
    console.log('   Último login:', sa.lastLogin);
    console.log('   Criado em:', sa.createdAt);

    // Testar senha Super@admin123
    const testPassword = 'Super@admin123';
    const isMatch = bcrypt.compareSync(testPassword, sa.password);
    console.log(`   Senha "${testPassword}" válida:`, isMatch ? '✓ SIM' : '✗ NÃO');
  });

  // Verificar especificamente superadmin@digiurban.com
  console.log('\n\n=== VERIFICAÇÃO ESPECÍFICA ===');
  const specific = db.prepare("SELECT * FROM users WHERE email = ? AND role = 'SUPER_ADMIN'")
    .get('superadmin@digiurban.com');

  if (specific) {
    console.log('✓ superadmin@digiurban.com ENCONTRADO');
    console.log('  Ativo:', specific.isActive ? 'SIM' : 'NÃO');
    const passwordWorks = bcrypt.compareSync('Super@admin123', specific.password);
    console.log('  Senha Super@admin123:', passwordWorks ? '✓ VÁLIDA' : '✗ INVÁLIDA');
  } else {
    console.log('✗ superadmin@digiurban.com NÃO ENCONTRADO');
  }

} catch (error) {
  console.error('Erro:', error.message);
} finally {
  db.close();
}
