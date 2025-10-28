/**
 * ============================================================================
 * SEED - FASE 5: TEMPLATES DE SERVIÇOS CULTURAIS
 * ============================================================================
 *
 * Seeds para:
 * - 12 serviços de Cultura
 * - 10 serviços de Esporte
 * - 7 serviços de Turismo
 *
 * Total: 29 templates de serviços
 */

import { prisma } from '../lib/prisma';
import * as fs from 'fs';
import * as path from 'path';

async function seedPhase5Templates() {
  console.log('\n🎭 === FASE 5: SECRETARIAS CULTURAIS ===\n');

  // Carregar templates JSON
  const culturaPath = path.join(__dirname, '../../prisma/templates/culture.json');
  const esportePath = path.join(__dirname, '../../prisma/templates/sports.json');
  const turismoPath = path.join(__dirname, '../../prisma/templates/tourism.json');

  const culturaTemplates = JSON.parse(fs.readFileSync(culturaPath, 'utf-8'));
  const esporteTemplates = JSON.parse(fs.readFileSync(esportePath, 'utf-8'));
  const turismoTemplates = JSON.parse(fs.readFileSync(turismoPath, 'utf-8'));

  console.log(`📄 ${culturaTemplates.length} templates de Cultura carregados`);
  console.log(`🏃 ${esporteTemplates.length} templates de Esporte carregados`);
  console.log(`🗺️  ${turismoTemplates.length} templates de Turismo carregados\n`);

  // Buscar tenant padrão (ou criar um de exemplo)
  let tenant = await prisma.tenant.findFirst();

  if (!tenant) {
    console.log('⚠️  Nenhum tenant encontrado, criando tenant de exemplo...');
    tenant = await prisma.tenant.create({
      data: {
        name: 'Prefeitura Municipal de Exemplo',
        cnpj: '00.000.000/0000-00',
        plan: 'PROFESSIONAL',
        status: 'ACTIVE',
      },
    });
    console.log(`✅ Tenant criado: ${tenant.name}\n`);
  }

  let totalCreated = 0;

  // === CULTURA ===
  console.log('🎭 Processando templates de CULTURA...');
  for (const template of culturaTemplates) {
    try {
      await prisma.serviceTemplate.upsert({
        where: { code: template.code },
        update: template,
        create: template,
      });
      console.log(`  ✓ ${template.code}: ${template.name}`);
      totalCreated++;
    } catch (error) {
      console.error(`  ✗ Erro ao criar ${template.code}:`, error);
    }
  }

  // === ESPORTE ===
  console.log('\n🏃 Processando templates de ESPORTE...');
  for (const template of esporteTemplates) {
    try {
      await prisma.serviceTemplate.upsert({
        where: { code: template.code },
        update: template,
        create: template,
      });
      console.log(`  ✓ ${template.code}: ${template.name}`);
      totalCreated++;
    } catch (error) {
      console.error(`  ✗ Erro ao criar ${template.code}:`, error);
    }
  }

  // === TURISMO ===
  console.log('\n🗺️  Processando templates de TURISMO...');
  for (const template of turismoTemplates) {
    try {
      await prisma.serviceTemplate.upsert({
        where: { code: template.code },
        update: template,
        create: template,
      });
      console.log(`  ✓ ${template.code}: ${template.name}`);
      totalCreated++;
    } catch (error) {
      console.error(`  ✗ Erro ao criar ${template.code}:`, error);
    }
  }

  console.log(`\n✅ Seed concluído: ${totalCreated} templates criados!`);
  console.log('\n📊 Resumo:');
  console.log(`   - Cultura: ${culturaTemplates.length} serviços`);
  console.log(`   - Esporte: ${esporteTemplates.length} serviços`);
  console.log(`   - Turismo: ${turismoTemplates.length} serviços`);
  console.log(`   - TOTAL: ${totalCreated} serviços\n`);
}

// Executar seed
seedPhase5Templates()
  .then(() => {
    console.log('🎉 Fase 5 seed finalizado com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro no seed da Fase 5:', error);
    process.exit(1);
  });
