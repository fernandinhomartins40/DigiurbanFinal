/**
 * SEED DE SERVIÇOS INICIAIS
 *
 * Este arquivo popula o banco de dados com 52 serviços padrão,
 * baseados nas páginas especializadas do sistema.
 *
 * Estrutura:
 * - 20 serviços de Saúde (10 páginas)
 * - 14 serviços de Educação (8 páginas)
 * - 18 serviços de Serviços Públicos (7 páginas)
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ServiceSeedData {
  name: string;
  description: string;
  category: string;
  departmentCode: string; // Código do departamento (ex: 'SAUDE', 'EDUCACAO')
  requiresDocuments: boolean;
  requiredDocuments?: string[];
  estimatedDays: number | null;
  priority: number; // 1-5
  requirements?: string[];
  icon?: string;
  color?: string;
}

// Mapeamento de códigos de departamento
const DEPARTMENT_CODES = {
  SAUDE: 'SAUDE',
  EDUCACAO: 'EDUCACAO',
  SERVICOS_PUBLICOS: 'SERVICOS_PUBLICOS',
} as const;

const SERVICES_DATA: ServiceSeedData[] = [
  // ============ SAÚDE (20 serviços) ============
  {
    name: 'Agendamento de Consulta Geral',
    description: 'Agende consultas médicas em unidades básicas de saúde do município',
    category: 'Consultas Médicas',
    departmentCode: DEPARTMENT_CODES.SAUDE,
    requiresDocuments: true,
    requiredDocuments: ['RG', 'CPF', 'Cartão SUS'],
    estimatedDays: 3,
    priority: 4,
    icon: 'Calendar',
    color: '#10b981',
  },
  {
    name: 'Atendimento de Emergência',
    description: 'Acesso prioritário para casos de emergência médica nas unidades de saúde',
    category: 'Emergência',
    departmentCode: DEPARTMENT_CODES.SAUDE,
    requiresDocuments: true,
    requiredDocuments: ['Documento de identidade'],
    estimatedDays: 0,
    priority: 5,
    icon: 'AlertCircle',
    color: '#ef4444',
  },
  {
    name: 'Consulta Especializada',
    description: 'Agendamento para consultas com médicos especialistas mediante encaminhamento',
    category: 'Especialidades',
    departmentCode: DEPARTMENT_CODES.SAUDE,
    requiresDocuments: true,
    requiredDocuments: ['RG', 'CPF', 'Cartão SUS', 'Encaminhamento médico'],
    estimatedDays: 7,
    priority: 4,
    icon: 'Stethoscope',
    color: '#3b82f6',
  },
  {
    name: 'Agendamento Online de Consultas',
    description: 'Sistema online para agendamento de consultas médicas em unidades de saúde',
    category: 'Agendamentos',
    departmentCode: DEPARTMENT_CODES.SAUDE,
    requiresDocuments: true,
    requiredDocuments: ['Cartão SUS'],
    estimatedDays: 0,
    priority: 5,
    icon: 'Smartphone',
    color: '#8b5cf6',
  },
  {
    name: 'Reagendamento de Consulta',
    description: 'Altere data e horário de consultas já agendadas de forma rápida e fácil',
    category: 'Reagendamentos',
    departmentCode: DEPARTMENT_CODES.SAUDE,
    requiresDocuments: true,
    requiredDocuments: ['Número do agendamento'],
    estimatedDays: 0,
    priority: 3,
    icon: 'RefreshCw',
    color: '#f59e0b',
  },
  {
    name: 'Dispensação de Medicamentos',
    description: 'Retirada de medicamentos na farmácia básica municipal mediante receita médica',
    category: 'Farmácia',
    departmentCode: DEPARTMENT_CODES.SAUDE,
    requiresDocuments: true,
    requiredDocuments: ['RG', 'Receita médica', 'Cartão SUS'],
    estimatedDays: 1,
    priority: 4,
    icon: 'Pill',
    color: '#10b981',
  },
  {
    name: 'Consulta de Estoque de Medicamentos',
    description: 'Verifique a disponibilidade de medicamentos nas farmácias municipais em tempo real',
    category: 'Consultas',
    departmentCode: DEPARTMENT_CODES.SAUDE,
    requiresDocuments: false,
    estimatedDays: 0,
    priority: 3,
    icon: 'Package',
    color: '#3b82f6',
  },
  {
    name: 'Inscrição em Campanhas de Vacinação',
    description: 'Cadastre-se nas campanhas de imunização promovidas pelo município',
    category: 'Prevenção',
    departmentCode: DEPARTMENT_CODES.SAUDE,
    requiresDocuments: true,
    requiredDocuments: ['RG', 'CPF', 'Cartão de vacinação'],
    estimatedDays: 2,
    priority: 4,
    icon: 'Syringe',
    color: '#06b6d4',
  },
  {
    name: 'Certificado de Vacinação',
    description: 'Emita certificados e comprovantes de vacinação digital ou físico',
    category: 'Certificados',
    departmentCode: DEPARTMENT_CODES.SAUDE,
    requiresDocuments: true,
    requiredDocuments: ['RG', 'CPF', 'Cartão de vacinação'],
    estimatedDays: 1,
    priority: 4,
    icon: 'FileText',
    color: '#10b981',
  },
  {
    name: 'Inscrição no Programa Hiperdia',
    description: 'Cadastro no programa de acompanhamento de diabetes e hipertensão arterial',
    category: 'Programas de Saúde',
    departmentCode: DEPARTMENT_CODES.SAUDE,
    requiresDocuments: true,
    requiredDocuments: ['RG', 'CPF', 'Cartão SUS', 'Exames recentes'],
    estimatedDays: 3,
    priority: 3,
    icon: 'Heart',
    color: '#ef4444',
  },
  {
    name: 'Acompanhamento Pré-Natal',
    description: 'Cadastro e acompanhamento no programa de saúde para gestantes',
    category: 'Saúde da Mulher',
    departmentCode: DEPARTMENT_CODES.SAUDE,
    requiresDocuments: true,
    requiredDocuments: ['RG', 'CPF', 'Cartão SUS', 'Comprovante de gravidez'],
    estimatedDays: 2,
    priority: 5,
    icon: 'Baby',
    color: '#ec4899',
  },
  {
    name: 'Solicitação de TFD',
    description: 'Tratamento Fora de Domicílio para especialidades não disponíveis no município',
    category: 'TFD',
    departmentCode: DEPARTMENT_CODES.SAUDE,
    requiresDocuments: true,
    requiredDocuments: ['RG', 'CPF', 'Cartão SUS', 'Relatório médico', 'Laudo especializado'],
    estimatedDays: 15,
    priority: 4,
    icon: 'Plane',
    color: '#3b82f6',
  },
  {
    name: 'Acompanhamento de Solicitação TFD',
    description: 'Consulte o andamento de sua solicitação de Tratamento Fora de Domicílio',
    category: 'Consultas',
    departmentCode: DEPARTMENT_CODES.SAUDE,
    requiresDocuments: true,
    requiredDocuments: ['Número do protocolo'],
    estimatedDays: 0,
    priority: 2,
    icon: 'MapPin',
    color: '#8b5cf6',
  },
  {
    name: 'Agendamento de Exames Laboratoriais',
    description: 'Agende exames de sangue, urina e outros laboratoriais na rede municipal',
    category: 'Exames',
    departmentCode: DEPARTMENT_CODES.SAUDE,
    requiresDocuments: true,
    requiredDocuments: ['RG', 'Cartão SUS', 'Solicitação médica'],
    estimatedDays: 5,
    priority: 4,
    icon: 'TestTube',
    color: '#14b8a6',
  },
  {
    name: 'Agendamento de Exames de Imagem',
    description: 'Agende ultrassom, raio-X e outros exames de imagem nas unidades de saúde',
    category: 'Diagnóstico',
    departmentCode: DEPARTMENT_CODES.SAUDE,
    requiresDocuments: true,
    requiredDocuments: ['RG', 'Cartão SUS', 'Solicitação médica'],
    estimatedDays: 7,
    priority: 4,
    icon: 'Scan',
    color: '#3b82f6',
  },
  {
    name: 'Consulta de Resultados de Exames',
    description: 'Acesse os resultados de seus exames laboratoriais e de imagem online',
    category: 'Resultados',
    departmentCode: DEPARTMENT_CODES.SAUDE,
    requiresDocuments: true,
    requiredDocuments: ['RG', 'Número do exame'],
    estimatedDays: 0,
    priority: 3,
    icon: 'FileSearch',
    color: '#10b981',
  },
  {
    name: 'Solicitação de Visita Domiciliar',
    description: 'Agende visita do Agente Comunitário de Saúde em sua residência',
    category: 'Visitas',
    departmentCode: DEPARTMENT_CODES.SAUDE,
    requiresDocuments: true,
    requiredDocuments: ['RG', 'Comprovante de residência'],
    estimatedDays: 7,
    priority: 3,
    icon: 'Home',
    color: '#f59e0b',
  },
  {
    name: 'Cadastro Familiar no PSF',
    description: 'Registre sua família no Programa Saúde da Família para acompanhamento contínuo',
    category: 'Cadastros',
    departmentCode: DEPARTMENT_CODES.SAUDE,
    requiresDocuments: true,
    requiredDocuments: ['RG de todos os membros', 'Comprovante de residência'],
    estimatedDays: 5,
    priority: 3,
    icon: 'Users',
    color: '#8b5cf6',
  },
  {
    name: 'Solicitação de Transporte para Consultas',
    description: 'Solicite transporte municipal para consultas médicas em outras cidades',
    category: 'Transporte',
    departmentCode: DEPARTMENT_CODES.SAUDE,
    requiresDocuments: true,
    requiredDocuments: ['RG', 'Comprovante de agendamento', 'Declaração de carência'],
    estimatedDays: 3,
    priority: 3,
    icon: 'Bus',
    color: '#06b6d4',
  },
  {
    name: 'Transporte para Exames Especializados',
    description: 'Transporte municipal para exames de alta complexidade em outras cidades',
    category: 'Transporte Especializado',
    departmentCode: DEPARTMENT_CODES.SAUDE,
    requiresDocuments: true,
    requiredDocuments: ['RG', 'Solicitação médica', 'Comprovante do exame'],
    estimatedDays: 7,
    priority: 3,
    icon: 'Ambulance',
    color: '#ef4444',
  },

  // ============ EDUCAÇÃO (14 serviços) ============
  {
    name: 'Justificativa de Falta Escolar',
    description: 'Justifique faltas dos estudantes com documentação médica ou declaração',
    category: 'Frequência Escolar',
    departmentCode: DEPARTMENT_CODES.EDUCACAO,
    requiresDocuments: true,
    requiredDocuments: ['Atestado médico', 'RG do responsável'],
    estimatedDays: 2,
    priority: 3,
    icon: 'FileCheck',
    color: '#f59e0b',
  },
  {
    name: 'Consulta de Frequência do Aluno',
    description: 'Acompanhe a frequência escolar do seu filho em tempo real',
    category: 'Consultas Acadêmicas',
    departmentCode: DEPARTMENT_CODES.EDUCACAO,
    requiresDocuments: false,
    estimatedDays: 0,
    priority: 2,
    icon: 'Calendar',
    color: '#3b82f6',
  },
  {
    name: 'Matrícula Escolar Online',
    description: 'Realize a matrícula de novos alunos no sistema municipal de ensino',
    category: 'Matrículas',
    departmentCode: DEPARTMENT_CODES.EDUCACAO,
    requiresDocuments: true,
    requiredDocuments: ['Certidão de nascimento', 'RG responsável', 'CPF', 'Comprovante residência', 'Cartão vacinação'],
    estimatedDays: 5,
    priority: 5,
    icon: 'UserPlus',
    color: '#10b981',
  },
  {
    name: 'Transferência Escolar',
    description: 'Solicite transferência entre escolas municipais ou para outras redes',
    category: 'Transferências',
    departmentCode: DEPARTMENT_CODES.EDUCACAO,
    requiresDocuments: true,
    requiredDocuments: ['Histórico escolar', 'Declaração de transferência', 'Justificativa'],
    estimatedDays: 3,
    priority: 4,
    icon: 'RefreshCw',
    color: '#3b82f6',
  },
  {
    name: 'Segunda Via de Histórico Escolar',
    description: 'Solicite segunda via do histórico escolar por perda ou dano',
    category: 'Documentos',
    departmentCode: DEPARTMENT_CODES.EDUCACAO,
    requiresDocuments: true,
    requiredDocuments: ['RG do aluno', 'Comprovante de matrícula'],
    estimatedDays: 7,
    priority: 3,
    icon: 'FileText',
    color: '#8b5cf6',
  },
  {
    name: 'Consulta de Vagas Escolares',
    description: 'Verifique a disponibilidade de vagas nas escolas municipais por região',
    category: 'Informações',
    departmentCode: DEPARTMENT_CODES.EDUCACAO,
    requiresDocuments: false,
    estimatedDays: 0,
    priority: 4,
    icon: 'School',
    color: '#10b981',
  },
  {
    name: 'Solicitação de Reunião com Coordenação',
    description: 'Agende reunião com a coordenação pedagógica para tratar assuntos escolares',
    category: 'Atendimento',
    departmentCode: DEPARTMENT_CODES.EDUCACAO,
    requiresDocuments: false,
    estimatedDays: 3,
    priority: 2,
    icon: 'MessageSquare',
    color: '#f59e0b',
  },
  {
    name: 'Solicitação de Transporte Escolar',
    description: 'Solicite vaga no transporte escolar municipal para o seu filho',
    category: 'Transporte',
    departmentCode: DEPARTMENT_CODES.EDUCACAO,
    requiresDocuments: true,
    requiredDocuments: ['Comprovante matrícula', 'Comprovante residência', 'RG responsável'],
    estimatedDays: 10,
    priority: 4,
    icon: 'Bus',
    color: '#f59e0b',
  },
  {
    name: 'Consulta de Rotas de Transporte',
    description: 'Consulte as rotas e horários do transporte escolar por escola ou região',
    category: 'Informações',
    departmentCode: DEPARTMENT_CODES.EDUCACAO,
    requiresDocuments: false,
    estimatedDays: 0,
    priority: 2,
    icon: 'Map',
    color: '#06b6d4',
  },
  {
    name: 'Cardápio da Merenda Escolar',
    description: 'Consulte o cardápio semanal/mensal da merenda escolar das escolas municipais',
    category: 'Alimentação',
    departmentCode: DEPARTMENT_CODES.EDUCACAO,
    requiresDocuments: false,
    estimatedDays: 0,
    priority: 2,
    icon: 'UtensilsCrossed',
    color: '#10b981',
  },
  {
    name: 'Solicitação de Dieta Especial',
    description: 'Solicite dieta especial para alunos com restrições alimentares ou alergias',
    category: 'Alimentação Especial',
    departmentCode: DEPARTMENT_CODES.EDUCACAO,
    requiresDocuments: true,
    requiredDocuments: ['Laudo médico', 'RG responsável', 'Comprovante matrícula'],
    estimatedDays: 5,
    priority: 4,
    icon: 'Salad',
    color: '#ec4899',
  },
  {
    name: 'Registro de Ocorrência Escolar',
    description: 'Registre ocorrências disciplinares ou pedagógicas para acompanhamento',
    category: 'Disciplina',
    departmentCode: DEPARTMENT_CODES.EDUCACAO,
    requiresDocuments: false,
    estimatedDays: 1,
    priority: 3,
    icon: 'AlertTriangle',
    color: '#ef4444',
  },
  {
    name: 'Acompanhamento Pedagógico',
    description: 'Solicite acompanhamento pedagógico especializado para o aluno',
    category: 'Apoio Pedagógico',
    departmentCode: DEPARTMENT_CODES.EDUCACAO,
    requiresDocuments: true,
    requiredDocuments: ['Relatório escolar', 'RG responsável'],
    estimatedDays: 7,
    priority: 3,
    icon: 'BookOpen',
    color: '#8b5cf6',
  },
  {
    name: 'Consulta do Calendário Escolar',
    description: 'Consulte o calendário oficial das escolas municipais com eventos e feriados',
    category: 'Calendário',
    departmentCode: DEPARTMENT_CODES.EDUCACAO,
    requiresDocuments: false,
    estimatedDays: 0,
    priority: 2,
    icon: 'Calendar',
    color: '#3b82f6',
  },

  // ============ SERVIÇOS PÚBLICOS (18 serviços) ============
  {
    name: 'Solicitação de Serviços Urbanos',
    description: 'Solicite serviços de infraestrutura, limpeza e manutenção urbana',
    category: 'Serviços Urbanos',
    departmentCode: DEPARTMENT_CODES.SERVICOS_PUBLICOS,
    requiresDocuments: false,
    estimatedDays: 5,
    priority: 3,
    icon: 'Wrench',
    color: '#f59e0b',
  },
  {
    name: 'Acompanhamento de Protocolo Urbano',
    description: 'Consulte o andamento de solicitações de serviços urbanos pelo número do protocolo',
    category: 'Consultas',
    departmentCode: DEPARTMENT_CODES.SERVICOS_PUBLICOS,
    requiresDocuments: true,
    requiredDocuments: ['Número do protocolo'],
    estimatedDays: 0,
    priority: 2,
    icon: 'Search',
    color: '#3b82f6',
  },
  {
    name: 'Consulta de Cronograma de Coleta',
    description: 'Verifique os dias e horários de coleta de lixo em sua rua',
    category: 'Informações',
    departmentCode: DEPARTMENT_CODES.SERVICOS_PUBLICOS,
    requiresDocuments: false,
    estimatedDays: 0,
    priority: 3,
    icon: 'Trash2',
    color: '#10b981',
  },
  {
    name: 'Denúncia de Descarte Irregular',
    description: 'Denuncie descarte irregular de lixo, entulho e outros resíduos',
    category: 'Denúncias',
    departmentCode: DEPARTMENT_CODES.SERVICOS_PUBLICOS,
    requiresDocuments: false,
    estimatedDays: 1,
    priority: 4,
    icon: 'AlertOctagon',
    color: '#ef4444',
  },
  {
    name: 'Solicitação de Reparo de Iluminação',
    description: 'Reporte problemas na iluminação pública para manutenção',
    category: 'Manutenção',
    departmentCode: DEPARTMENT_CODES.SERVICOS_PUBLICOS,
    requiresDocuments: false,
    estimatedDays: 5,
    priority: 3,
    icon: 'Lightbulb',
    color: '#f59e0b',
  },
  {
    name: 'Solicitação de Nova Iluminação',
    description: 'Solicite instalação de novos pontos de iluminação pública',
    category: 'Instalação',
    departmentCode: DEPARTMENT_CODES.SERVICOS_PUBLICOS,
    requiresDocuments: false,
    estimatedDays: 15,
    priority: 2,
    icon: 'Zap',
    color: '#3b82f6',
  },
  {
    name: 'Agendamento de Coleta de Resíduos Especiais',
    description: 'Agende coleta de eletrônicos, óleo, baterias e medicamentos vencidos',
    category: 'Coleta Especial',
    departmentCode: DEPARTMENT_CODES.SERVICOS_PUBLICOS,
    requiresDocuments: false,
    estimatedDays: 7,
    priority: 3,
    icon: 'Recycle',
    color: '#10b981',
  },
  {
    name: 'Certificado de Destinação de Resíduos',
    description: 'Obtenha certificado de destinação ambientalmente correta de resíduos',
    category: 'Certificados',
    departmentCode: DEPARTMENT_CODES.SERVICOS_PUBLICOS,
    requiresDocuments: true,
    requiredDocuments: ['Comprovante de entrega', 'Tipo de resíduo'],
    estimatedDays: 3,
    priority: 2,
    icon: 'Award',
    color: '#10b981',
  },
  {
    name: 'Consulta de Pontos de Coleta',
    description: 'Encontre pontos de coleta de resíduos especiais próximos à sua região',
    category: 'Informações',
    departmentCode: DEPARTMENT_CODES.SERVICOS_PUBLICOS,
    requiresDocuments: false,
    estimatedDays: 0,
    priority: 2,
    icon: 'MapPin',
    color: '#06b6d4',
  },
  {
    name: 'Relatório de Problema Urbano com Foto',
    description: 'Reporte problemas de infraestrutura urbana anexando fotos para agilizar',
    category: 'Denúncias',
    departmentCode: DEPARTMENT_CODES.SERVICOS_PUBLICOS,
    requiresDocuments: false,
    estimatedDays: 5,
    priority: 3,
    icon: 'Camera',
    color: '#8b5cf6',
  },
  {
    name: 'Solicitação de Vistoria Técnica',
    description: 'Solicite vistoria técnica especializada para problemas urbanos complexos',
    category: 'Vistorias',
    departmentCode: DEPARTMENT_CODES.SERVICOS_PUBLICOS,
    requiresDocuments: false,
    estimatedDays: 3,
    priority: 3,
    icon: 'ClipboardCheck',
    color: '#f59e0b',
  },
  {
    name: 'Agendamento de Serviços Urbanos',
    description: 'Agende serviços de limpeza, manutenção e infraestrutura programados',
    category: 'Agendamentos',
    departmentCode: DEPARTMENT_CODES.SERVICOS_PUBLICOS,
    requiresDocuments: false,
    estimatedDays: 3,
    priority: 3,
    icon: 'CalendarClock',
    color: '#3b82f6',
  },
  {
    name: 'Acompanhamento de Equipes',
    description: 'Consulte o cronograma e localização das equipes de trabalho em tempo real',
    category: 'Informações',
    departmentCode: DEPARTMENT_CODES.SERVICOS_PUBLICOS,
    requiresDocuments: false,
    estimatedDays: 0,
    priority: 2,
    icon: 'Users',
    color: '#10b981',
  },
  {
    name: 'Solicitação de Serviço Emergencial',
    description: 'Solicite atendimento emergencial para problemas urbanos urgentes',
    category: 'Emergência',
    departmentCode: DEPARTMENT_CODES.SERVICOS_PUBLICOS,
    requiresDocuments: false,
    estimatedDays: 0,
    priority: 5,
    icon: 'Siren',
    color: '#ef4444',
  },
  {
    name: 'Consulta de Serviços Urbanos',
    description: 'Consulte status e histórico de todos os serviços urbanos solicitados',
    category: 'Relatórios',
    departmentCode: DEPARTMENT_CODES.SERVICOS_PUBLICOS,
    requiresDocuments: false,
    estimatedDays: 0,
    priority: 2,
    icon: 'BarChart',
    color: '#8b5cf6',
  },
  {
    name: 'Relatório de Serviços Públicos',
    description: 'Solicite relatórios detalhados sobre serviços executados em sua região',
    category: 'Relatórios',
    departmentCode: DEPARTMENT_CODES.SERVICOS_PUBLICOS,
    requiresDocuments: false,
    estimatedDays: 5,
    priority: 2,
    icon: 'FileBarChart',
    color: '#3b82f6',
  },
  {
    name: 'Solicitação de Limpeza Especial',
    description: 'Solicite limpeza especial para eventos, terrenos ou situações específicas',
    category: 'Limpeza Especial',
    departmentCode: DEPARTMENT_CODES.SERVICOS_PUBLICOS,
    requiresDocuments: false,
    estimatedDays: 3,
    priority: 2,
    icon: 'Sparkles',
    color: '#06b6d4',
  },
  {
    name: 'Agendamento Integrado de Serviços',
    description: 'Agende múltiplos serviços urbanos de forma integrada e otimizada',
    category: 'Agendamentos',
    departmentCode: DEPARTMENT_CODES.SERVICOS_PUBLICOS,
    requiresDocuments: false,
    estimatedDays: 3,
    priority: 2,
    icon: 'ListTodo',
    color: '#8b5cf6',
  },
];

/**
 * Seed dos serviços iniciais para um tenant específico
 */
export async function seedInitialServices(tenantId: string) {
  console.log(`\n📋 Populando serviços para tenant ${tenantId}...`);

  try {
    // Buscar departamentos do tenant
    const departments = await prisma.department.findMany({
      where: { tenantId, isActive: true },
      select: { id: true, code: true, name: true },
    });

    if (departments.length === 0) {
      console.warn('   ⚠️  Nenhum departamento encontrado. Crie departamentos antes de popular serviços.');
      return { created: 0, skipped: SERVICES_DATA.length };
    }

    console.log(`   📁 ${departments.length} departamentos encontrados`);

    // Criar mapa de código -> departmentId
    const departmentMap = new Map<string, string>();
    departments.forEach((dept) => {
      if (dept.code) {
        departmentMap.set(dept.code, dept.id);
      }
    });

    let created = 0;
    let skipped = 0;
    let errors = 0;

    for (const serviceData of SERVICES_DATA) {
      try {
        // Buscar departmentId pelo código
        const departmentId = departmentMap.get(serviceData.departmentCode);

        if (!departmentId) {
          console.warn(`   ⚠️  Departamento ${serviceData.departmentCode} não encontrado. Pulando "${serviceData.name}"`);
          skipped++;
          continue;
        }

        // Verificar se serviço já existe
        const existing = await prisma.service.findFirst({
          where: {
            name: serviceData.name,
            tenantId,
          },
        });

        if (existing) {
          skipped++;
          continue;
        }

        // Criar serviço
        await prisma.service.create({
          data: {
            name: serviceData.name,
            description: serviceData.description,
            category: serviceData.category,
            tenantId,
            departmentId,
            requiresDocuments: serviceData.requiresDocuments,
            requiredDocuments: serviceData.requiredDocuments || [],
            estimatedDays: serviceData.estimatedDays,
            priority: serviceData.priority,
            requirements: serviceData.requirements || [],
            icon: serviceData.icon,
            color: serviceData.color,
            isActive: true,
          },
        });

        created++;
      } catch (error) {
        console.error(`   ❌ Erro ao criar serviço "${serviceData.name}":`, error);
        errors++;
      }
    }

    console.log(`   ✅ ${created} serviços criados`);
    if (skipped > 0) console.log(`   ⏭️  ${skipped} serviços já existentes (pulados)`);
    if (errors > 0) console.log(`   ❌ ${errors} erros`);

    return { created, skipped, errors };
  } catch (error) {
    console.error('   ❌ Erro ao popular serviços:', error);
    throw error;
  }
}

/**
 * Execução standalone para testes
 */
async function main() {
  const DEMO_TENANT_ID = 'demo';

  await seedInitialServices(DEMO_TENANT_ID);

  console.log('\n✅ Seed de serviços concluído!');
}

// Executar se chamado diretamente
if (require.main === module) {
  main()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
