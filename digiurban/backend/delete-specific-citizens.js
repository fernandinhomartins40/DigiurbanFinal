const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteSpecificCitizens() {
  try {
    console.log('=== DELETAR CIDADÃOS ESPECÍFICOS ===\n');

    // CPFs sem formatação
    const cpfs = ['05282248913', '10184359996'];

    for (const cpf of cpfs) {
      const citizen = await prisma.citizen.findFirst({
        where: { cpf },
        include: { tenant: true }
      });

      if (citizen) {
        console.log(`📍 Encontrado: ${citizen.name}`);
        console.log(`   CPF: ${citizen.cpf}`);
        console.log(`   Email: ${citizen.email}`);
        console.log(`   Tenant: ${citizen.tenant.name}`);

        // Deletar protocolos relacionados primeiro
        const protocols = await prisma.protocol.deleteMany({
          where: { citizenId: citizen.id }
        });
        console.log(`   Protocolos deletados: ${protocols.count}`);

        // Deletar composições familiares
        await prisma.familyComposition.deleteMany({
          where: {
            OR: [
              { headId: citizen.id },
              { memberId: citizen.id }
            ]
          }
        });

        // Deletar notificações
        await prisma.notification.deleteMany({
          where: { citizenId: citizen.id }
        });

        // Deletar cidadão
        await prisma.citizen.delete({
          where: { id: citizen.id }
        });

        console.log(`✅ Cidadão deletado com sucesso!\n`);
      } else {
        console.log(`❌ CPF ${cpf} não encontrado no banco de dados\n`);
      }
    }

    console.log('✅ Processo concluído!');

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteSpecificCitizens();
