import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const agricultureTemplates = [
  {
    code: 'AGR_ASSISTENCIA_TECNICA_001',
    name: 'Assistência Técnica Rural',
    description: 'Solicitar assistência técnica para propriedade rural',
    category: 'ASSISTENCIA',
    department: 'Agricultura',
    departmentType: 'agriculture',
    moduleType: 'agriculture',
    moduleEntity: 'TechnicalAssistance',
    formSchema: {
      fields: [
        {
          name: 'producerName',
          label: 'Nome do Produtor',
          type: 'text',
          required: true,
          placeholder: 'Nome completo do produtor',
        },
        {
          name: 'producerCpf',
          label: 'CPF do Produtor',
          type: 'text',
          required: true,
          placeholder: '000.000.000-00',
        },
        {
          name: 'producerPhone',
          label: 'Telefone',
          type: 'text',
          required: true,
          placeholder: '(00) 00000-0000',
        },
        {
          name: 'propertyLocation',
          label: 'Localização da Propriedade',
          type: 'text',
          required: true,
          placeholder: 'Endereço completo',
        },
        {
          name: 'propertyArea',
          label: 'Área da Propriedade (hectares)',
          type: 'number',
          required: false,
          placeholder: '0.00',
        },
        {
          name: 'assistanceType',
          label: 'Tipo de Assistência',
          type: 'select',
          required: true,
          options: [
            { value: 'technical', label: 'Técnica' },
            { value: 'agronomic', label: 'Agronômica' },
            { value: 'veterinary', label: 'Veterinária' },
            { value: 'soil', label: 'Análise de Solo' },
            { value: 'pest', label: 'Controle de Pragas' },
          ],
        },
        {
          name: 'subject',
          label: 'Assunto',
          type: 'text',
          required: true,
          placeholder: 'Resumo da solicitação',
        },
        {
          name: 'description',
          label: 'Descrição Detalhada',
          type: 'textarea',
          required: true,
          placeholder: 'Descreva detalhadamente sua necessidade',
        },
      ],
    },
    fieldMapping: {
      producerName: 'producerName',
      producerCpf: 'producerCpf',
      producerPhone: 'producerPhone',
      propertyLocation: 'propertyLocation',
      propertyArea: 'propertyArea',
      assistanceType: 'assistanceType',
      subject: 'subject',
      description: 'description',
    },
    defaultFields: {
      status: 'SCHEDULED',
      source: 'service',
    },
    isActive: true,
    estimatedTime: 7,
  },
  {
    code: 'AGR_SEMENTES_001',
    name: 'Distribuição de Sementes e Mudas',
    description: 'Solicitar distribuição de sementes ou mudas',
    category: 'INSUMOS',
    department: 'Agricultura',
    departmentType: 'agriculture',
    moduleType: 'agriculture',
    moduleEntity: 'SeedDistribution',
    formSchema: {
      fields: [
        {
          name: 'producerName',
          label: 'Nome do Produtor',
          type: 'text',
          required: true,
        },
        {
          name: 'producerCpf',
          label: 'CPF',
          type: 'text',
          required: true,
        },
        {
          name: 'producerPhone',
          label: 'Telefone',
          type: 'text',
          required: true,
        },
        {
          name: 'propertyLocation',
          label: 'Localização da Propriedade',
          type: 'text',
          required: true,
        },
        {
          name: 'propertyArea',
          label: 'Área de Plantio (hectares)',
          type: 'number',
          required: false,
        },
        {
          name: 'requestType',
          label: 'Tipo de Solicitação',
          type: 'select',
          required: true,
          options: [
            { value: 'seeds', label: 'Sementes' },
            { value: 'seedlings', label: 'Mudas' },
            { value: 'both', label: 'Sementes e Mudas' },
          ],
        },
        {
          name: 'purpose',
          label: 'Finalidade',
          type: 'select',
          required: true,
          options: [
            { value: 'commercial', label: 'Comercial' },
            { value: 'subsistence', label: 'Subsistência' },
            { value: 'agroforestry', label: 'Agrofloresta' },
          ],
        },
        {
          name: 'description',
          label: 'Especificar Itens (espécies e quantidades)',
          type: 'textarea',
          required: true,
          placeholder: 'Ex: Milho - 10kg, Feijão - 5kg',
        },
      ],
    },
    fieldMapping: {
      producerName: 'producerName',
      producerCpf: 'producerCpf',
      producerPhone: 'producerPhone',
      propertyLocation: 'propertyLocation',
      propertyArea: 'propertyArea',
      requestType: 'requestType',
      purpose: 'purpose',
    },
    isActive: true,
    estimatedTime: 15,
  },
  {
    code: 'AGR_ANALISE_SOLO_001',
    name: 'Análise de Solo',
    description: 'Solicitar análise de solo da propriedade',
    category: 'ANALISE',
    department: 'Agricultura',
    departmentType: 'agriculture',
    moduleType: 'agriculture',
    moduleEntity: 'SoilAnalysis',
    formSchema: {
      fields: [
        {
          name: 'producerName',
          label: 'Nome do Produtor',
          type: 'text',
          required: true,
        },
        {
          name: 'producerCpf',
          label: 'CPF',
          type: 'text',
          required: true,
        },
        {
          name: 'producerPhone',
          label: 'Telefone',
          type: 'text',
          required: true,
        },
        {
          name: 'propertyLocation',
          label: 'Localização da Propriedade',
          type: 'text',
          required: true,
        },
        {
          name: 'propertyArea',
          label: 'Área para Análise (hectares)',
          type: 'number',
          required: false,
        },
        {
          name: 'analysisType',
          label: 'Tipo de Análise',
          type: 'select',
          required: true,
          options: [
            { value: 'basic', label: 'Básica' },
            { value: 'complete', label: 'Completa' },
            { value: 'specific', label: 'Específica' },
          ],
        },
        {
          name: 'cropIntended',
          label: 'Cultura Pretendida',
          type: 'text',
          required: false,
          placeholder: 'Ex: Milho, Soja, Hortaliças',
        },
        {
          name: 'purpose',
          label: 'Objetivo da Análise',
          type: 'textarea',
          required: true,
          placeholder: 'Descreva o objetivo',
        },
      ],
    },
    fieldMapping: {
      producerName: 'producerName',
      producerCpf: 'producerCpf',
      producerPhone: 'producerPhone',
      propertyLocation: 'propertyLocation',
      propertyArea: 'propertyArea',
      analysisType: 'analysisType',
      cropIntended: 'cropIntended',
      purpose: 'purpose',
    },
    isActive: true,
    estimatedTime: 30,
  },
  {
    code: 'AGR_FEIRA_PRODUTOR_001',
    name: 'Cadastro na Feira do Produtor',
    description: 'Cadastro para participar da feira do produtor local',
    category: 'COMERCIALIZACAO',
    department: 'Agricultura',
    departmentType: 'agriculture',
    moduleType: 'agriculture',
    moduleEntity: 'FarmerMarketRegistration',
    formSchema: {
      fields: [
        {
          name: 'producerName',
          label: 'Nome do Produtor',
          type: 'text',
          required: true,
        },
        {
          name: 'producerCpf',
          label: 'CPF',
          type: 'text',
          required: true,
        },
        {
          name: 'producerPhone',
          label: 'Telefone',
          type: 'text',
          required: true,
        },
        {
          name: 'producerEmail',
          label: 'E-mail',
          type: 'email',
          required: false,
        },
        {
          name: 'propertyLocation',
          label: 'Localização da Propriedade',
          type: 'text',
          required: true,
        },
        {
          name: 'propertyArea',
          label: 'Área da Propriedade (hectares)',
          type: 'number',
          required: false,
        },
        {
          name: 'productionType',
          label: 'Tipo de Produção',
          type: 'select',
          required: true,
          options: [
            { value: 'organic', label: 'Orgânica' },
            { value: 'conventional', label: 'Convencional' },
            { value: 'agroecological', label: 'Agroecológica' },
          ],
        },
        {
          name: 'hasOrganicCert',
          label: 'Possui certificação orgânica?',
          type: 'checkbox',
          required: false,
        },
        {
          name: 'needsStall',
          label: 'Necessita de barraca?',
          type: 'checkbox',
          required: false,
        },
        {
          name: 'description',
          label: 'Produtos que pretende comercializar',
          type: 'textarea',
          required: true,
          placeholder: 'Liste os produtos',
        },
      ],
    },
    fieldMapping: {
      producerName: 'producerName',
      producerCpf: 'producerCpf',
      producerPhone: 'producerPhone',
      producerEmail: 'producerEmail',
      propertyLocation: 'propertyLocation',
      propertyArea: 'propertyArea',
      productionType: 'productionType',
      hasOrganicCert: 'hasOrganicCert',
      needsStall: 'needsStall',
    },
    isActive: true,
    estimatedTime: 5,
  },
];

async function seed() {
  try {
    const tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      console.error('❌ Nenhum tenant encontrado!');
      return;
    }

    const dept = await prisma.department.findFirst({
      where: {
        tenantId: tenant.id,
        code: 'AGRICULTURA',
      },
    });

    if (!dept) {
      console.error('❌ Department AGRICULTURA não encontrado!');
      return;
    }

    console.log('🌾 Criando templates e services de AGRICULTURA...\n');

    for (const template of agricultureTemplates) {
      // Criar template
      const createdTemplate = await prisma.serviceTemplate.upsert({
        where: { code: template.code },
        update: template as any,
        create: template as any,
      });

      console.log(`✅ Template: ${template.code}`);

      // Verificar se service já existe
      const existingService = await prisma.service.findFirst({
        where: {
          tenantId: tenant.id,
          departmentId: dept.id,
          name: template.name,
        },
      });

      if (existingService) {
        // Atualizar service existente
        await prisma.service.update({
          where: { id: existingService.id },
          data: {
            name: template.name,
            description: template.description,
            category: template.category,
            moduleType: template.moduleType,
            moduleEntity: template.moduleEntity,
            templateId: createdTemplate.id,
            isActive: template.isActive,
            estimatedDays: template.estimatedTime,
            priority: 5,
          },
        });
        console.log(`✅ Service ATUALIZADO: ${template.name}`);
      } else {
        // Criar novo service
        await prisma.service.create({
          data: {
            tenantId: tenant.id,
            departmentId: dept.id,
            name: template.name,
            description: template.description,
            category: template.category,
            moduleType: template.moduleType,
            moduleEntity: template.moduleEntity,
            templateId: createdTemplate.id,
            isActive: template.isActive,
            estimatedDays: template.estimatedTime,
            requiresDocuments: false,
            priority: 5,
          },
        });
        console.log(`✅ Service CRIADO: ${template.name}`);
      }
      console.log('');
    }

    console.log('🎉 Seed de AGRICULTURA concluído com sucesso!');
    console.log(`📊 ${agricultureTemplates.length} templates criados`);
    console.log(`📋 ${agricultureTemplates.length} services criados`);
  } catch (error) {
    console.error('❌ Erro no seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
