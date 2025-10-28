/**
 * TEMPLATES DE AGRICULTURA
 *
 * Templates pré-configurados para serviços da Secretaria de Agricultura
 * vinculados aos Module Handlers
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedAgricultureTemplates() {
  console.log('🌾 Criando templates de Agricultura...');

  const templates = [
    // 1. Assistência Técnica Rural
    {
      code: 'AGR_ASSISTENCIA_TECNICA_001',
      name: 'Assistência Técnica Rural',
      description: 'Solicite visita técnica de agrônomo para orientação agrícola',
      category: 'Apoio ao Produtor',
      department: 'Agricultura',
      departmentType: 'AGRICULTURA',
      icon: 'Tractor',
      color: '#10b981',
      isActive: true,
      version: 1,
      moduleType: 'agriculture',
      moduleEntity: 'TechnicalAssistance',
      estimatedTime: 10,
      requiredDocs: ['Cadastro de produtor rural', 'Documento de identificação'],
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
            label: 'CPF do Produtor',
            type: 'text',
            required: true,
            mask: '000.000.000-00',
          },
          {
            name: 'producerPhone',
            label: 'Telefone',
            type: 'text',
            required: true,
            mask: '(00) 00000-0000',
          },
          {
            name: 'propertyName',
            label: 'Nome da Propriedade',
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
            label: 'Área (hectares)',
            type: 'number',
            required: false,
          },
          {
            name: 'assistanceType',
            label: 'Tipo de Assistência',
            type: 'select',
            required: true,
            options: [
              { value: 'plantio', label: 'Orientação de Plantio' },
              { value: 'pragas', label: 'Controle de Pragas' },
              { value: 'solo', label: 'Análise de Solo' },
              { value: 'irrigacao', label: 'Sistema de Irrigação' },
              { value: 'outros', label: 'Outros' },
            ],
          },
          {
            name: 'description',
            label: 'Descrição da Necessidade',
            type: 'textarea',
            required: true,
          },
          {
            name: 'cropTypes',
            label: 'Culturas Plantadas',
            type: 'text',
            required: false,
          },
        ],
      },
      fieldMapping: {
        producerName: 'producerName',
        producerCpf: 'producerCpf',
        producerPhone: 'producerPhone',
        propertyName: 'propertyName',
        propertyLocation: 'propertyLocation',
        propertyArea: 'propertyArea',
        assistanceType: 'assistanceType',
        description: 'description',
        cropTypes: 'cropTypes',
      },
    },

    // 2. Distribuição de Sementes
    {
      code: 'AGR_SEMENTES_001',
      name: 'Programa de Distribuição de Sementes',
      description: 'Solicite sementes subsidiadas pela prefeitura para plantio',
      category: 'Fomento',
      department: 'Agricultura',
      departmentType: 'AGRICULTURA',
      icon: 'Sprout',
      color: '#10b981',
      isActive: true,
      version: 1,
      moduleType: 'agriculture',
      moduleEntity: 'SeedDistribution',
      estimatedTime: 15,
      requiredDocs: ['Cadastro de produtor rural', 'Projeto de plantio'],
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
            name: 'seedType',
            label: 'Tipo de Semente',
            type: 'select',
            required: true,
            options: [
              { value: 'milho', label: 'Milho' },
              { value: 'feijao', label: 'Feijão' },
              { value: 'soja', label: 'Soja' },
              { value: 'hortalicas', label: 'Hortaliças' },
            ],
          },
          {
            name: 'plantingArea',
            label: 'Área de Plantio (hectares)',
            type: 'number',
            required: true,
          },
          {
            name: 'requestedAmount',
            label: 'Quantidade Solicitada (kg)',
            type: 'number',
            required: true,
          },
          {
            name: 'purpose',
            label: 'Finalidade',
            type: 'select',
            required: true,
            options: [
              { value: 'subsistencia', label: 'Subsistência' },
              { value: 'comercial', label: 'Comercial' },
              { value: 'ambos', label: 'Ambos' },
            ],
          },
        ],
      },
      fieldMapping: {
        producerName: 'producerName',
        producerCpf: 'producerCpf',
        producerPhone: 'producerPhone',
        seedType: 'seedType',
        plantingArea: 'plantingArea',
        requestedAmount: 'requestedAmount',
        purpose: 'purpose',
      },
    },

    // 3. Análise de Solo
    {
      code: 'AGR_ANALISE_SOLO_001',
      name: 'Análise de Solo',
      description: 'Solicite análise de solo para orientação de plantio e correção',
      category: 'Apoio ao Produtor',
      department: 'Agricultura',
      departmentType: 'AGRICULTURA',
      icon: 'TestTube',
      color: '#8b5cf6',
      isActive: true,
      version: 1,
      moduleType: 'agriculture',
      moduleEntity: 'SoilAnalysis',
      estimatedTime: 20,
      requiredDocs: ['Cadastro de produtor rural', 'Amostra de solo'],
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
            name: 'propertyLocation',
            label: 'Localização da Propriedade',
            type: 'text',
            required: true,
          },
          {
            name: 'sampleArea',
            label: 'Área da Amostra (hectares)',
            type: 'number',
            required: true,
          },
          {
            name: 'analysisType',
            label: 'Tipo de Análise',
            type: 'select',
            required: true,
            options: [
              { value: 'completa', label: 'Análise Completa' },
              { value: 'ph', label: 'pH do Solo' },
              { value: 'nutrientes', label: 'Nutrientes' },
              { value: 'fertilidade', label: 'Fertilidade' },
            ],
          },
          {
            name: 'intendedCrop',
            label: 'Cultura Pretendida',
            type: 'text',
            required: false,
          },
        ],
      },
      fieldMapping: {
        producerName: 'producerName',
        producerCpf: 'producerCpf',
        propertyLocation: 'propertyLocation',
        sampleArea: 'sampleArea',
        analysisType: 'analysisType',
        intendedCrop: 'intendedCrop',
      },
    },

    // 4. Feira do Produtor
    {
      code: 'AGR_FEIRA_PRODUTOR_001',
      name: 'Feira do Produtor - Reserva de Banca',
      description: 'Reserve banca na feira do produtor para venda direta ao consumidor',
      category: 'Fomento',
      department: 'Agricultura',
      departmentType: 'AGRICULTURA',
      icon: 'Store',
      color: '#f59e0b',
      isActive: true,
      version: 1,
      moduleType: 'agriculture',
      moduleEntity: 'FarmerMarketRegistration',
      estimatedTime: 7,
      requiredDocs: ['Cadastro de produtor rural', 'Alvará sanitário'],
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
            name: 'productTypes',
            label: 'Tipos de Produtos',
            type: 'multiselect',
            required: true,
            options: [
              { value: 'hortalicas', label: 'Hortaliças' },
              { value: 'frutas', label: 'Frutas' },
              { value: 'graos', label: 'Grãos' },
              { value: 'derivados', label: 'Derivados (queijo, doces, etc)' },
            ],
          },
          {
            name: 'standSize',
            label: 'Tamanho da Banca',
            type: 'select',
            required: true,
            options: [
              { value: 'pequena', label: 'Pequena (2m²)' },
              { value: 'media', label: 'Média (4m²)' },
              { value: 'grande', label: 'Grande (6m²)' },
            ],
          },
          {
            name: 'preferredDay',
            label: 'Dia Preferido',
            type: 'select',
            required: true,
            options: [
              { value: 'quarta', label: 'Quarta-feira' },
              { value: 'sabado', label: 'Sábado' },
              { value: 'ambos', label: 'Ambos' },
            ],
          },
        ],
      },
      fieldMapping: {
        producerName: 'producerName',
        producerCpf: 'producerCpf',
        producerPhone: 'producerPhone',
        productTypes: 'productTypes',
        standSize: 'standSize',
        preferredDay: 'preferredDay',
      },
    },
  ];

  let count = 0;
  for (const template of templates) {
    const existing = await prisma.serviceTemplate.findUnique({
      where: { code: template.code },
    });

    if (!existing) {
      await prisma.serviceTemplate.create({
        data: template as any,
      });
      count++;
      console.log(`  ✅ Template criado: ${template.name}`);
    } else {
      console.log(`  ⏭️  Template já existe: ${template.name}`);
    }
  }

  console.log(`✅ ${count} templates de agricultura criados\n`);
}

// Se executado diretamente
if (require.main === module) {
  seedAgricultureTemplates()
    .then(() => {
      console.log('Seed completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed failed:', error);
      process.exit(1);
    });
}
