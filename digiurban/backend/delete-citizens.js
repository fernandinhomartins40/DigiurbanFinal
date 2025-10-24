const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteCitizens() {
  try {
    console.log('🗑️  Deletando todos os cidadãos e registros relacionados...');

    // Buscar todos os IDs de cidadãos
    const allCitizens = await prisma.citizen.findMany({
      select: { id: true }
    });
    const citizenIds = allCitizens.map(c => c.id);

    console.log(`📊 Encontrados ${citizenIds.length} cidadãos no banco de dados`);

    if (citizenIds.length > 0) {
      // Deletar registros relacionados primeiro
      console.log('📋 Deletando protocolos de cidadãos...');
      const protocols = await prisma.protocol.deleteMany({
        where: {
          citizenId: { in: citizenIds }
        }
      });
      console.log(`   ✓ ${protocols.count} protocolos deletados`);

      // Agora deletar os cidadãos
      console.log('👤 Deletando cidadãos...');
      const citizens = await prisma.citizen.deleteMany({});
      console.log(`   ✓ ${citizens.count} cidadãos deletados`);

      console.log('\n✅ Todos os cidadãos foram deletados com sucesso!');
      console.log('📝 Agora os cidadãos podem se recadastrar com o município informado.');
    } else {
      console.log('\n ℹ️  Nenhum cidadão encontrado no banco de dados.');
    }

  } catch (error) {
    console.error('❌ Erro ao deletar cidadãos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteCitizens();
