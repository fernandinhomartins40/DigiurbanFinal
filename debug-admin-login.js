const { PrismaClient } = require("@prisma/client");
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL || "file:/app/data/dev.db" } }
});

async function debugAdminLogin() {
  try {
    console.log("\n========================================");
    console.log("🔍 DEBUG: Login e Autenticação do Admin");
    console.log("========================================\n");

    const email = "prefeito@palmital.gov.br";
    const password = "Admin@123";

    // 1. Buscar admin
    console.log("📋 1. Buscando admin no banco...\n");

    const admin = await prisma.user.findFirst({
      where: { email },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            status: true,
            domain: true
          }
        }
      }
    });

    if (!admin) {
      console.log("❌ Admin não encontrado!");
      await prisma.$disconnect();
      process.exit(1);
    }

    console.log("✅ Admin encontrado:");
    console.log(`   ID: ${admin.id}`);
    console.log(`   Nome: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   TenantId: ${admin.tenantId}`);
    console.log(`   Tenant: ${admin.tenant.name}`);
    console.log(`   Tenant Status: ${admin.tenant.status}`);
    console.log(`   Tenant Domain: ${admin.tenant.domain || 'N/A'}`);
    console.log(`   isActive: ${admin.isActive}`);

    // 2. Verificar senha
    console.log("\n📋 2. Verificando senha...\n");

    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (passwordMatch) {
      console.log("✅ Senha correta!");
    } else {
      console.log("❌ Senha incorreta!");
      console.log(`   Hash armazenado: ${admin.password.substring(0, 20)}...`);
    }

    // 3. Verificar permissões
    console.log("\n📋 3. Verificando permissões...\n");

    const department = await prisma.department.findFirst({
      where: {
        tenantId: admin.tenantId,
        users: {
          some: { id: admin.id }
        }
      }
    });

    if (department) {
      console.log(`   Departamento: ${department.name}`);
    } else {
      console.log(`   ⚠️  Admin não está vinculado a nenhum departamento`);
    }

    // 4. Testar query de cidadãos novamente
    console.log("\n📋 4. Testando query de cidadãos...\n");

    const citizens = await prisma.citizen.findMany({
      where: { tenantId: admin.tenantId },
      select: {
        id: true,
        name: true,
        cpf: true,
        email: true,
        isActive: true,
        verificationStatus: true
      }
    });

    console.log(`   Cidadãos encontrados: ${citizens.length}`);

    if (citizens.length > 0) {
      console.log("\n   Lista:");
      citizens.forEach((c, i) => {
        console.log(`   ${i + 1}. ${c.name} (CPF: ${c.cpf}, Status: ${c.verificationStatus})`);
      });
    }

    // 5. Verificar se há algum problema com o endpoint
    console.log("\n📋 5. Simulando resposta do endpoint...\n");

    const response = {
      success: true,
      citizens: citizens,
      pagination: {
        page: 1,
        limit: 50,
        total: citizens.length,
        totalPages: 1
      }
    };

    console.log("   Resposta que o endpoint deveria retornar:");
    console.log(JSON.stringify(response, null, 2));

    console.log("\n========================================");
    console.log("✅ Debug concluído!");
    console.log("========================================\n");

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro:", error.message);
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

debugAdminLogin();
