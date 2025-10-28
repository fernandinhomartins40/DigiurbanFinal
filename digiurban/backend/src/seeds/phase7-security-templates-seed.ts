import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

/**
 * Seed de Templates de Segurança Pública - FASE 7
 * 8 templates especializados
 */
async function seedSecurityTemplates() {
  console.log('🔐 Iniciando seed de templates de Segurança Pública...');

  try {
    // Ler templates do arquivo JSON
    const templatesPath = path.join(
      __dirname,
      '../../prisma/templates/security.json'
    );

    const templatesData = fs.readFileSync(templatesPath, 'utf-8');
    const templates = JSON.parse(templatesData);

    let created = 0;
    let updated = 0;

    for (const template of templates) {
      const existing = await prisma.serviceTemplate.findUnique({
        where: { code: template.code },
      });

      if (existing) {
        await prisma.serviceTemplate.update({
          where: { code: template.code },
          data: {
            name: template.name,
            category: template.category,
            description: template.description,
            icon: template.icon,
            defaultFields: template.defaultFields,
            requiredDocs: template.requiredDocs,
            estimatedTime: template.estimatedTime,
            moduleType: template.moduleType || null,
            moduleEntity: template.moduleEntity || null,
            fieldMapping: template.fieldMapping || null,
            isActive: true,
            version: 1, // Int ao invés de String
          },
        });
        updated++;
      } else {
        await prisma.serviceTemplate.create({
          data: {
            code: template.code,
            name: template.name,
            category: template.category,
            departmentType: template.departmentType || 'seguranca-publica',
            description: template.description,
            icon: template.icon,
            defaultFields: template.defaultFields,
            requiredDocs: template.requiredDocs,
            estimatedTime: template.estimatedTime,
            moduleType: template.moduleType || null,
            moduleEntity: template.moduleEntity || null,
            fieldMapping: template.fieldMapping || null,
            isActive: true,
            version: 1, // Int ao invés de String
          },
        });
        created++;
      }
    }

    console.log(`✓ Templates de Segurança Pública processados:`);
    console.log(`  - Criados: ${created}`);
    console.log(`  - Atualizados: ${updated}`);
    console.log(`  - Total: ${templates.length}`);
  } catch (error) {
    console.error('❌ Erro ao criar templates de Segurança:', error);
    throw error;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  seedSecurityTemplates()
    .then(() => {
      console.log('✓ Seed concluído com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erro no seed:', error);
      process.exit(1);
    });
}

export { seedSecurityTemplates };
