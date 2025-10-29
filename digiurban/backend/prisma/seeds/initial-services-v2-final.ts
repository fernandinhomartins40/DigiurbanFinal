/**
 * SEED DE SERVIÇOS - VERSÃO 2.0 COMPLETA
 *
 * Este arquivo popula o banco com 108 serviços otimizados e alinhados com a arquitetura simplificada.
 *
 * Estrutura:
 * - 95 serviços COM_DADOS (com formSchema completo)
 * - 13 serviços INFORMATIVOS
 *
 * Distribuição por secretaria:
 * - Saúde: 11 serviços
 * - Educação: 11 serviços
 * - Assistência Social: 10 serviços
 * - Agricultura: 6 serviços
 * - Cultura: 9 serviços
 * - Esportes: 9 serviços
 * - Habitação: 7 serviços
 * - Meio Ambiente: 7 serviços
 * - Obras Públicas: 7 serviços
 * - Planejamento Urbano: 9 serviços
 * - Segurança Pública: 11 serviços
 * - Serviços Públicos: 9 serviços
 * - Turismo: 9 serviços
 *
 * TOTAL: 115 serviços (ajustado para cobrir todas as necessidades)
 */

import { PrismaClient } from '@prisma/client';
import SERVICES_COMPLETE_DATA from './services-complete-data';

const prisma = new PrismaClient();

export async function seedServices() {
  console.log('🌱 Iniciando seed de serviços...');

  // 1. Buscar todos os departamentos
  const departments = await prisma.department.findMany();
  console.log(`✓ ${departments.length} departamentos encontrados`);

  if (departments.length === 0) {
    throw new Error('❌ Nenhum departamento encontrado. Execute o seed de departamentos primeiro.');
  }

  // 2. Criar mapa de departamentos por código
  const deptMap = new Map(
    departments.map((d) => [d.code, d.id])
  );

  // 3. Iterar sobre os serviços e criar
  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const service of SERVICES_COMPLETE_DATA) {
    try {
      // Verificar se departamento existe
      const departmentId = deptMap.get(service.departmentCode);

      if (!departmentId) {
        console.warn(`⚠️  Departamento não encontrado: ${service.departmentCode} (${service.name})`);
        skipped++;
        continue;
      }

      // Verificar se já existe (evitar duplicação)
      const existing = await prisma.serviceSimplified.findFirst({
        where: {
          name: service.name,
          departmentId,
        },
      });

      if (existing) {
        console.log(`⏭️  Serviço já existe: ${service.name}`);
        skipped++;
        continue;
      }

      // Criar serviço
      await prisma.serviceSimplified.create({
        data: {
          name: service.name,
          description: service.description,
          category: service.category,
          departmentId,
          serviceType: service.serviceType,
          moduleType: service.moduleType || null,
          formSchema: service.formSchema || null,
          requiresDocuments: service.requiresDocuments,
          requiredDocuments: service.requiredDocuments || null,
          estimatedDays: service.estimatedDays,
          priority: service.priority,
          icon: service.icon || null,
          color: service.color || null,
          isActive: true,
        },
      });

      created++;
      console.log(`✓ Criado: ${service.name} (${service.departmentCode})`);
    } catch (error) {
      console.error(`❌ Erro ao criar serviço "${service.name}":`, error);
      errors++;
    }
  }

  console.log('\n📊 Resumo do Seed:');
  console.log(`   ✓ Criados: ${created}`);
  console.log(`   ⏭️  Ignorados: ${skipped}`);
  console.log(`   ❌ Erros: ${errors}`);
  console.log(`   📦 Total: ${SERVICES_COMPLETE_DATA.length} serviços no seed`);

  return { created, skipped, errors };
}

// Executar seed se chamado diretamente
if (require.main === module) {
  seedServices()
    .then(() => {
      console.log('✅ Seed de serviços concluído com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erro fatal no seed:', error);
      process.exit(1);
    })
    .finally(() => {
      prisma.$disconnect();
    });
}

export default seedServices;
