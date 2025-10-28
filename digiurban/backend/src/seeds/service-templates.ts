/**
 * ============================================================================
 * SERVICE TEMPLATES SEED - FASE 2 COMPLETA
 * ============================================================================
 *
 * Biblioteca completa de serviços padrões prontos para ativar.
 * Fase 2: 3 Secretarias Piloto
 *
 * Organização:
 * - 20 templates de EDUCAÇÃO
 * - 30 templates de SAÚDE
 * - 25 templates de ASSISTÊNCIA SOCIAL
 *
 * TOTAL: 75 templates
 *
 * @author DigiUrban Team
 * @version 2.0 - Fase 2 Completa
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

/**
 * Carregar templates dos arquivos JSON
 */
function loadTemplatesFromFiles(): any[] {
  const templatesDir = path.join(__dirname, '../../prisma/templates');
  const templates: any[] = [];

  // Carregar templates de Educação (20)
  const educationPath = path.join(templatesDir, 'education.json');
  if (fs.existsSync(educationPath)) {
    const educationTemplates = JSON.parse(fs.readFileSync(educationPath, 'utf-8'));
    templates.push(...educationTemplates);
    console.log(`✓ Carregados ${educationTemplates.length} templates de Educação`);
  }

  // Carregar templates de Saúde (30)
  const healthPath = path.join(templatesDir, 'health.json');
  if (fs.existsSync(healthPath)) {
    const healthTemplates = JSON.parse(fs.readFileSync(healthPath, 'utf-8'));
    templates.push(...healthTemplates);
    console.log(`✓ Carregados ${healthTemplates.length} templates de Saúde`);
  }

  // Carregar templates de Assistência Social (25)
  const socialPath = path.join(templatesDir, 'social-assistance.json');
  if (fs.existsSync(socialPath)) {
    const socialTemplates = JSON.parse(fs.readFileSync(socialPath, 'utf-8'));
    templates.push(...socialTemplates);
    console.log(`✓ Carregados ${socialTemplates.length} templates de Assistência Social`);
  }

  return templates;
}

export const SERVICE_TEMPLATES = loadTemplatesFromFiles();

// Manter templates antigos como fallback (caso os arquivos JSON não existam)
const LEGACY_TEMPLATES = [
  // ========================================================================
  // EDUCAÇÃO (5 templates)
  // ========================================================================
  {
    code: 'EDU_MATRICULA_001',
    name: 'Matrícula Escolar',
    category: 'Educação',
    description: 'Solicitação de matrícula em escola da rede municipal',
    icon: 'GraduationCap',
    moduleType: 'education',
    moduleEntity: 'StudentEnrollment',
    estimatedTime: '5 dias úteis',
    defaultFields: {
      fields: [
        { id: 'studentName', label: 'Nome do Aluno', type: 'text', required: true },
        { id: 'birthDate', label: 'Data de Nascimento', type: 'date', required: true },
        { id: 'parentName', label: 'Nome do Responsável', type: 'text', required: true },
        { id: 'parentCpf', label: 'CPF do Responsável', type: 'text', required: true },
        { id: 'parentPhone', label: 'Telefone', type: 'phone', required: true },
        { id: 'desiredGrade', label: 'Série Desejada', type: 'select', required: true, options: ['1º ano', '2º ano', '3º ano', '4º ano', '5º ano', '6º ano', '7º ano', '8º ano', '9º ano'] },
        { id: 'desiredShift', label: 'Turno Preferido', type: 'select', required: true, options: ['Matutino', 'Vespertino', 'Integral'] },
        { id: 'hasSpecialNeeds', label: 'Necessidades Especiais', type: 'boolean', required: false },
        { id: 'specialNeedsDescription', label: 'Descrição das Necessidades', type: 'textarea', required: false },
        { id: 'address', label: 'Endereço Residencial', type: 'text', required: true },
      ],
    },
    requiredDocs: {
      documents: [
        'Certidão de Nascimento do aluno',
        'RG e CPF do responsável',
        'Comprovante de residência',
        'Carteira de vacinação atualizada',
        'Declaração de transferência (se aplicável)',
      ],
    },
    fieldMapping: {
      studentName: 'studentName',
      birthDate: 'birthDate',
      parentName: 'parentName',
      parentCpf: 'parentCpf',
      parentPhone: 'parentPhone',
      desiredGrade: 'desiredGrade',
      desiredShift: 'desiredShift',
      hasSpecialNeeds: 'hasSpecialNeeds',
      specialNeedsDescription: 'specialNeedsDescription',
      address: 'address',
    },
  },

  {
    code: 'EDU_TRANSPORTE_001',
    name: 'Transporte Escolar',
    category: 'Educação',
    description: 'Solicitação de vaga em transporte escolar municipal',
    icon: 'Bus',
    moduleType: 'education',
    moduleEntity: 'SchoolTransport',
    estimatedTime: '7 dias úteis',
    defaultFields: {
      fields: [
        { id: 'studentName', label: 'Nome do Aluno', type: 'text', required: true },
        { id: 'schoolName', label: 'Escola', type: 'text', required: true },
        { id: 'address', label: 'Endereço Completo (Ponto de Embarque)', type: 'text', required: true },
        { id: 'shift', label: 'Turno', type: 'select', required: true, options: ['Matutino', 'Vespertino'] },
        { id: 'distance', label: 'Distância até a escola (km)', type: 'number', required: false },
      ],
    },
    requiredDocs: {
      documents: [
        'Declaração de matrícula',
        'Comprovante de residência',
        'RG do responsável',
      ],
    },
    fieldMapping: {
      studentName: 'studentName',
      schoolName: 'schoolName',
      address: 'address',
      shift: 'shift',
    },
  },

  {
    code: 'EDU_UNIFORME_001',
    name: 'Kit Uniforme Escolar',
    category: 'Educação',
    description: 'Solicitação de kit de uniformes escolares',
    icon: 'ShirtTshirt',
    moduleType: 'education',
    moduleEntity: 'SchoolMaterial',
    estimatedTime: '10 dias úteis',
    defaultFields: {
      fields: [
        { id: 'studentName', label: 'Nome do Aluno', type: 'text', required: true },
        { id: 'schoolName', label: 'Escola', type: 'text', required: true },
        { id: 'size', label: 'Tamanho', type: 'select', required: true, options: ['PP', 'P', 'M', 'G', 'GG'] },
        { id: 'shoeSize', label: 'Número do Calçado', type: 'number', required: true },
      ],
    },
    requiredDocs: {
      documents: ['Declaração de matrícula'],
    },
    fieldMapping: {},
  },

  {
    code: 'EDU_MATERIAL_001',
    name: 'Kit Material Escolar',
    category: 'Educação',
    description: 'Solicitação de kit de material escolar',
    icon: 'Backpack',
    moduleType: 'education',
    moduleEntity: 'SchoolMaterial',
    estimatedTime: '10 dias úteis',
    defaultFields: {
      fields: [
        { id: 'studentName', label: 'Nome do Aluno', type: 'text', required: true },
        { id: 'schoolName', label: 'Escola', type: 'text', required: true },
        { id: 'grade', label: 'Série', type: 'text', required: true },
      ],
    },
    requiredDocs: {
      documents: ['Declaração de matrícula'],
    },
    fieldMapping: {},
  },

  {
    code: 'EDU_HISTORICO_001',
    name: 'Histórico Escolar',
    category: 'Educação',
    description: 'Solicitação de 2ª via de histórico escolar',
    icon: 'FileText',
    moduleType: 'education',
    moduleEntity: 'DocumentRequest',
    estimatedTime: '3 dias úteis',
    defaultFields: {
      fields: [
        { id: 'studentName', label: 'Nome do Aluno', type: 'text', required: true },
        { id: 'schoolName', label: 'Escola onde estudou', type: 'text', required: true },
        { id: 'conclusionYear', label: 'Ano de Conclusão', type: 'number', required: true },
      ],
    },
    requiredDocs: {
      documents: ['RG do solicitante', 'Comprovante de pagamento da taxa'],
    },
    fieldMapping: {},
  },

  // ========================================================================
  // SAÚDE (5 templates)
  // ========================================================================
  {
    code: 'SAU_CONSULTA_001',
    name: 'Agendamento de Consulta Médica',
    category: 'Saúde',
    description: 'Agendamento de consulta médica em Unidade Básica de Saúde',
    icon: 'Stethoscope',
    moduleType: 'health',
    moduleEntity: 'Appointment',
    estimatedTime: '15 dias úteis',
    defaultFields: {
      fields: [
        { id: 'patientName', label: 'Nome do Paciente', type: 'text', required: true },
        { id: 'patientCpf', label: 'CPF do Paciente', type: 'text', required: true },
        { id: 'birthDate', label: 'Data de Nascimento', type: 'date', required: true },
        { id: 'susCard', label: 'Número do Cartão SUS', type: 'text', required: false },
        { id: 'specialty', label: 'Especialidade', type: 'select', required: true, options: ['Clínico Geral', 'Pediatria', 'Ginecologia', 'Cardiologia', 'Dermatologia', 'Ortopedia'] },
        { id: 'symptoms', label: 'Sintomas/Motivo', type: 'textarea', required: true },
        { id: 'urgency', label: 'Urgência', type: 'select', required: true, options: ['Normal', 'Urgente', 'Muito Urgente'] },
        { id: 'preferredShift', label: 'Turno Preferido', type: 'select', required: false, options: ['Manhã', 'Tarde'] },
      ],
    },
    requiredDocs: {
      documents: ['Cartão SUS', 'RG', 'Comprovante de residência'],
    },
    fieldMapping: {
      patientName: 'patientName',
      patientCpf: 'patientCpf',
      specialty: 'specialty',
      symptoms: 'symptoms',
      urgency: 'urgency',
      preferredShift: 'preferredShift',
    },
  },

  {
    code: 'SAU_MEDICAMENTO_001',
    name: 'Solicitação de Medicamento',
    category: 'Saúde',
    description: 'Solicitação de medicamento de uso contínuo na Farmácia Popular',
    icon: 'Pill',
    moduleType: 'health',
    moduleEntity: 'MedicineRequest',
    estimatedTime: '5 dias úteis',
    defaultFields: {
      fields: [
        { id: 'patientName', label: 'Nome do Paciente', type: 'text', required: true },
        { id: 'patientCpf', label: 'CPF do Paciente', type: 'text', required: true },
        { id: 'medication', label: 'Medicamento', type: 'text', required: true },
        { id: 'dosage', label: 'Dosagem', type: 'text', required: true },
        { id: 'quantity', label: 'Quantidade', type: 'number', required: true },
        { id: 'prescription', label: 'Possui receita médica?', type: 'boolean', required: true },
      ],
    },
    requiredDocs: {
      documents: ['Receita médica', 'RG', 'CPF', 'Cartão SUS'],
    },
    fieldMapping: {
      patientName: 'patientName',
      patientCpf: 'patientCpf',
      medication: 'medication',
      quantity: 'quantity',
      prescription: 'prescription',
    },
  },

  {
    code: 'SAU_EXAME_001',
    name: 'Agendamento de Exame',
    category: 'Saúde',
    description: 'Agendamento de exames laboratoriais ou de imagem',
    icon: 'Activity',
    moduleType: 'health',
    moduleEntity: 'ExamScheduling',
    estimatedTime: '20 dias úteis',
    defaultFields: {
      fields: [
        { id: 'patientName', label: 'Nome do Paciente', type: 'text', required: true },
        { id: 'examType', label: 'Tipo de Exame', type: 'select', required: true, options: ['Sangue', 'Urina', 'Raio-X', 'Ultrassom', 'Tomografia', 'Ressonância'] },
        { id: 'requestingDoctor', label: 'Médico Solicitante', type: 'text', required: true },
      ],
    },
    requiredDocs: {
      documents: ['Pedido médico', 'Cartão SUS', 'RG'],
    },
    fieldMapping: {},
  },

  {
    code: 'SAU_VACINA_001',
    name: 'Carteira de Vacinação',
    category: 'Saúde',
    description: 'Solicitação de 2ª via de carteira de vacinação',
    icon: 'Syringe',
    moduleType: 'health',
    moduleEntity: 'VaccinationCard',
    estimatedTime: '3 dias úteis',
    defaultFields: {
      fields: [
        { id: 'patientName', label: 'Nome do Paciente', type: 'text', required: true },
        { id: 'birthDate', label: 'Data de Nascimento', type: 'date', required: true },
      ],
    },
    requiredDocs: {
      documents: ['RG', 'Certidão de Nascimento (se menor)'],
    },
    fieldMapping: {},
  },

  {
    code: 'SAU_CARTAO_SUS_001',
    name: 'Cartão SUS',
    category: 'Saúde',
    description: 'Solicitação de Cartão Nacional de Saúde (SUS)',
    icon: 'CreditCard',
    moduleType: 'health',
    moduleEntity: 'SusCardRequest',
    estimatedTime: '10 dias úteis',
    defaultFields: {
      fields: [
        { id: 'citizenName', label: 'Nome Completo', type: 'text', required: true },
        { id: 'cpf', label: 'CPF', type: 'text', required: true },
        { id: 'birthDate', label: 'Data de Nascimento', type: 'date', required: true },
        { id: 'motherName', label: 'Nome da Mãe', type: 'text', required: true },
      ],
    },
    requiredDocs: {
      documents: ['RG', 'CPF', 'Comprovante de residência'],
    },
    fieldMapping: {},
  },

  // ========================================================================
  // ASSISTÊNCIA SOCIAL (4 templates)
  // ========================================================================
  {
    code: 'SOC_CESTA_BASICA_001',
    name: 'Cesta Básica',
    category: 'Assistência Social',
    description: 'Solicitação de cesta básica para família em vulnerabilidade',
    icon: 'ShoppingBasket',
    moduleType: 'social',
    moduleEntity: 'BenefitRequest',
    estimatedTime: '7 dias úteis',
    defaultFields: {
      fields: [
        { id: 'citizenName', label: 'Nome do Solicitante', type: 'text', required: true },
        { id: 'cpf', label: 'CPF', type: 'text', required: true },
        { id: 'familyMembers', label: 'Número de Pessoas na Família', type: 'number', required: true },
        { id: 'monthlyIncome', label: 'Renda Familiar Mensal', type: 'number', required: true },
        { id: 'hasNis', label: 'Possui NIS?', type: 'boolean', required: true },
        { id: 'nisNumber', label: 'Número do NIS', type: 'text', required: false },
      ],
    },
    requiredDocs: {
      documents: ['RG', 'CPF', 'Comprovante de residência', 'Comprovante de renda (se houver)'],
    },
    fieldMapping: {
      citizenName: 'citizenName',
      familyMembers: 'familyMembers',
      monthlyIncome: 'monthlyIncome',
      benefitType: 'CESTA_BASICA',
    },
  },

  {
    code: 'SOC_CADUNICO_001',
    name: 'Cadastro Único (CadÚnico)',
    category: 'Assistência Social',
    description: 'Inscrição ou atualização no Cadastro Único para Programas Sociais',
    icon: 'UserPlus',
    moduleType: 'social',
    moduleEntity: 'CadUnicoRegistration',
    estimatedTime: '5 dias úteis',
    defaultFields: {
      fields: [
        { id: 'citizenName', label: 'Nome do Responsável Familiar', type: 'text', required: true },
        { id: 'cpf', label: 'CPF', type: 'text', required: true },
        { id: 'phone', label: 'Telefone', type: 'phone', required: true },
        { id: 'address', label: 'Endereço Completo', type: 'text', required: true },
      ],
    },
    requiredDocs: {
      documents: ['RG e CPF de todos os membros', 'Comprovante de residência', 'Certidão de nascimento/casamento'],
    },
    fieldMapping: {},
  },

  {
    code: 'SOC_AUXILIO_FUNERAL_001',
    name: 'Auxílio Funeral',
    category: 'Assistência Social',
    description: 'Solicitação de auxílio funeral para famílias carentes',
    icon: 'Heart',
    moduleType: 'social',
    moduleEntity: 'FuneralAid',
    estimatedTime: '48 horas',
    defaultFields: {
      fields: [
        { id: 'applicantName', label: 'Nome do Solicitante', type: 'text', required: true },
        { id: 'deceasedName', label: 'Nome do Falecido', type: 'text', required: true },
        { id: 'deathDate', label: 'Data do Óbito', type: 'date', required: true },
        { id: 'relationship', label: 'Grau de Parentesco', type: 'text', required: true },
      ],
    },
    requiredDocs: {
      documents: ['Certidão de óbito', 'RG do solicitante', 'Comprovante de carência'],
    },
    fieldMapping: {},
  },

  {
    code: 'SOC_VISITA_DOMICILIAR_001',
    name: 'Visita Domiciliar',
    category: 'Assistência Social',
    description: 'Solicitação de visita domiciliar de assistente social',
    icon: 'Home',
    moduleType: 'social',
    moduleEntity: 'HomeVisit',
    estimatedTime: '10 dias úteis',
    defaultFields: {
      fields: [
        { id: 'citizenName', label: 'Nome Completo', type: 'text', required: true },
        { id: 'address', label: 'Endereço Completo', type: 'text', required: true },
        { id: 'phone', label: 'Telefone', type: 'phone', required: true },
        { id: 'reason', label: 'Motivo da Solicitação', type: 'textarea', required: true },
      ],
    },
    requiredDocs: {
      documents: ['RG', 'Comprovante de residência'],
    },
    fieldMapping: {},
  },

  // ========================================================================
  // HABITAÇÃO (4 templates)
  // ========================================================================
  {
    code: 'HAB_MCMV_001',
    name: 'Minha Casa Minha Vida',
    category: 'Habitação',
    description: 'Inscrição no programa Minha Casa Minha Vida',
    icon: 'House',
    moduleType: 'housing',
    moduleEntity: 'HousingApplication',
    estimatedTime: '30 dias úteis',
    defaultFields: {
      fields: [
        { id: 'applicantName', label: 'Nome do Solicitante', type: 'text', required: true },
        { id: 'applicantCpf', label: 'CPF', type: 'text', required: true },
        { id: 'familyIncome', label: 'Renda Familiar Mensal', type: 'number', required: true },
        { id: 'familyMembers', label: 'Número de Pessoas na Família', type: 'number', required: true },
        { id: 'currentAddress', label: 'Endereço Atual', type: 'text', required: true },
        { id: 'currentHousingType', label: 'Tipo de Moradia Atual', type: 'select', required: true, options: ['Aluguel', 'Cedida', 'Ocupação', 'Própria'] },
      ],
    },
    requiredDocs: {
      documents: ['RG e CPF de todos os membros maiores', 'Comprovante de renda', 'Comprovante de residência', 'Certidão de nascimento dos filhos'],
    },
    fieldMapping: {
      applicantName: 'applicantName',
      applicantCpf: 'applicantCpf',
      familyIncome: 'familyIncome',
      familyMembers: 'familyMembers',
      currentAddress: 'currentAddress',
      currentHousingType: 'currentHousingType',
    },
  },

  {
    code: 'HAB_REGULARIZACAO_001',
    name: 'Regularização Fundiária',
    category: 'Habitação',
    description: 'Solicitação de regularização de imóvel',
    icon: 'FileCheck',
    moduleType: 'housing',
    moduleEntity: 'LandRegularization',
    estimatedTime: '60 dias úteis',
    defaultFields: {
      fields: [
        { id: 'ownerName', label: 'Nome do Proprietário', type: 'text', required: true },
        { id: 'propertyAddress', label: 'Endereço do Imóvel', type: 'text', required: true },
        { id: 'occupationTime', label: 'Tempo de Ocupação (anos)', type: 'number', required: true },
      ],
    },
    requiredDocs: {
      documents: ['RG e CPF', 'Conta de luz/água', 'IPTU (se houver)', 'Declaração de posse'],
    },
    fieldMapping: {},
  },

  {
    code: 'HAB_AUXILIO_ALUGUEL_001',
    name: 'Auxílio Aluguel',
    category: 'Habitação',
    description: 'Solicitação de auxílio aluguel emergencial',
    icon: 'DollarSign',
    moduleType: 'housing',
    moduleEntity: 'RentAssistance',
    estimatedTime: '15 dias úteis',
    defaultFields: {
      fields: [
        { id: 'applicantName', label: 'Nome do Solicitante', type: 'text', required: true },
        { id: 'familyIncome', label: 'Renda Familiar', type: 'number', required: true },
        { id: 'rentValue', label: 'Valor do Aluguel', type: 'number', required: true },
        { id: 'reason', label: 'Motivo da Solicitação', type: 'textarea', required: true },
      ],
    },
    requiredDocs: {
      documents: ['Contrato de aluguel', 'Comprovante de renda', 'RG e CPF'],
    },
    fieldMapping: {},
  },

  {
    code: 'HAB_PLANTA_CASA_001',
    name: 'Planta de Casa Popular',
    category: 'Habitação',
    description: 'Solicitação de planta de casa popular para construção',
    icon: 'Building',
    moduleType: 'housing',
    moduleEntity: 'HousePlan',
    estimatedTime: '7 dias úteis',
    defaultFields: {
      fields: [
        { id: 'applicantName', label: 'Nome do Solicitante', type: 'text', required: true },
        { id: 'lotSize', label: 'Tamanho do Terreno (m²)', type: 'number', required: true },
        { id: 'familyMembers', label: 'Número de Pessoas na Família', type: 'number', required: true },
      ],
    },
    requiredDocs: {
      documents: ['RG', 'Escritura ou posse do terreno'],
    },
    fieldMapping: {},
  },

  // ========================================================================
  // OBRAS PÚBLICAS (3 templates)
  // ========================================================================
  {
    code: 'OBR_BURACO_RUA_001',
    name: 'Buraco na Rua',
    category: 'Obras Públicas',
    description: 'Reportar buraco ou defeito na via pública',
    icon: 'AlertTriangle',
    moduleType: 'public_works',
    moduleEntity: 'RoadProblem',
    estimatedTime: '15 dias úteis',
    defaultFields: {
      fields: [
        { id: 'reporterName', label: 'Seu Nome', type: 'text', required: true },
        { id: 'problemType', label: 'Tipo de Problema', type: 'select', required: true, options: ['Buraco', 'Afundamento', 'Asfalto Quebrado', 'Meio-fio Quebrado'] },
        { id: 'severity', label: 'Gravidade', type: 'select', required: true, options: ['Baixa', 'Média', 'Alta', 'Crítica'] },
      ],
    },
    requiredDocs: {
      documents: [],
    },
    fieldMapping: {
      reporterName: 'reporterName',
      problemType: 'problemType',
    },
  },

  {
    code: 'OBR_ILUMINACAO_001',
    name: 'Iluminação Pública',
    category: 'Obras Públicas',
    description: 'Reportar lâmpada queimada ou poste com defeito',
    icon: 'Lightbulb',
    moduleType: 'public_works',
    moduleEntity: 'StreetLighting',
    estimatedTime: '5 dias úteis',
    defaultFields: {
      fields: [
        { id: 'reporterName', label: 'Seu Nome', type: 'text', required: true },
        { id: 'problemType', label: 'Problema', type: 'select', required: true, options: ['Lâmpada Queimada', 'Poste Danificado', 'Fiação Exposta', 'Iluminação Intermitente'] },
      ],
    },
    requiredDocs: {
      documents: [],
    },
    fieldMapping: {},
  },

  {
    code: 'OBR_CALCADA_001',
    name: 'Manutenção de Calçada',
    category: 'Obras Públicas',
    description: 'Solicitação de manutenção ou construção de calçada pública',
    icon: 'Construction',
    moduleType: 'public_works',
    moduleEntity: 'SidewalkMaintenance',
    estimatedTime: '30 dias úteis',
    defaultFields: {
      fields: [
        { id: 'requesterName', label: 'Nome do Solicitante', type: 'text', required: true },
        { id: 'serviceType', label: 'Tipo de Serviço', type: 'select', required: true, options: ['Reparo', 'Construção Nova', 'Rampa de Acessibilidade'] },
        { id: 'length', label: 'Extensão (metros)', type: 'number', required: true },
      ],
    },
    requiredDocs: {
      documents: [],
    },
    fieldMapping: {},
  },

  // ========================================================================
  // SERVIÇOS PÚBLICOS (3 templates)
  // ========================================================================
  {
    code: 'SER_PODA_ARVORE_001',
    name: 'Poda de Árvore',
    category: 'Serviços Públicos',
    description: 'Solicitação de poda de árvore em via pública',
    icon: 'TreePine',
    moduleType: 'public_services',
    moduleEntity: 'TreePruning',
    estimatedTime: '20 dias úteis',
    defaultFields: {
      fields: [
        { id: 'requesterName', label: 'Seu Nome', type: 'text', required: true },
        { id: 'treeType', label: 'Tipo de Árvore (se souber)', type: 'text', required: false },
        { id: 'urgency', label: 'Urgência', type: 'select', required: true, options: ['Normal', 'Urgente - Risco de Queda'] },
        { id: 'reason', label: 'Motivo', type: 'textarea', required: true },
      ],
    },
    requiredDocs: {
      documents: [],
    },
    fieldMapping: {
      requesterName: 'requesterName',
      serviceType: 'PODA',
    },
  },

  {
    code: 'SER_ENTULHO_001',
    name: 'Retirada de Entulho',
    category: 'Serviços Públicos',
    description: 'Solicitação de retirada de entulho ou resíduos de construção',
    icon: 'Trash2',
    moduleType: 'public_services',
    moduleEntity: 'WasteRemoval',
    estimatedTime: '10 dias úteis',
    defaultFields: {
      fields: [
        { id: 'requesterName', label: 'Seu Nome', type: 'text', required: true },
        { id: 'wasteType', label: 'Tipo de Resíduo', type: 'select', required: true, options: ['Entulho de Construção', 'Móveis Velhos', 'Poda de Jardim', 'Eletrônicos'] },
        { id: 'estimatedVolume', label: 'Volume Estimado', type: 'select', required: true, options: ['Pequeno (até 1m³)', 'Médio (1-3m³)', 'Grande (mais de 3m³)'] },
      ],
    },
    requiredDocs: {
      documents: [],
    },
    fieldMapping: {},
  },

  {
    code: 'SER_DEDETIZACAO_001',
    name: 'Dedetização',
    category: 'Serviços Públicos',
    description: 'Solicitação de dedetização/desratização em residência',
    icon: 'Bug',
    moduleType: 'public_services',
    moduleEntity: 'PestControl',
    estimatedTime: '15 dias úteis',
    defaultFields: {
      fields: [
        { id: 'requesterName', label: 'Seu Nome', type: 'text', required: true },
        { id: 'phone', label: 'Telefone', type: 'phone', required: true },
        { id: 'problemType', label: 'Tipo de Infestação', type: 'select', required: true, options: ['Ratos', 'Baratas', 'Mosquitos', 'Escorpiões', 'Outros'] },
        { id: 'severity', label: 'Gravidade', type: 'select', required: true, options: ['Leve', 'Moderada', 'Grave'] },
      ],
    },
    requiredDocs: {
      documents: [],
    },
    fieldMapping: {},
  },

  // ========================================================================
  // CULTURA (2 templates)
  // ========================================================================
  {
    code: 'CUL_OFICINA_001',
    name: 'Inscrição em Oficina Cultural',
    category: 'Cultura',
    description: 'Inscrição em oficinas de arte, dança, música, teatro',
    icon: 'Palette',
    moduleType: 'culture',
    moduleEntity: 'WorkshopEnrollment',
    estimatedTime: '5 dias úteis',
    defaultFields: {
      fields: [
        { id: 'citizenName', label: 'Nome Completo', type: 'text', required: true },
        { id: 'age', label: 'Idade', type: 'number', required: true },
        { id: 'activityType', label: 'Oficina Desejada', type: 'select', required: true, options: ['Dança', 'Teatro', 'Música', 'Pintura', 'Artesanato', 'Capoeira'] },
        { id: 'hasExperience', label: 'Já praticou esta atividade?', type: 'boolean', required: false },
      ],
    },
    requiredDocs: {
      documents: ['RG', 'Foto 3x4'],
    },
    fieldMapping: {
      citizenName: 'citizenName',
      activityType: 'activityType',
    },
  },

  {
    code: 'CUL_ESPACO_001',
    name: 'Reserva de Espaço Cultural',
    category: 'Cultura',
    description: 'Reserva de espaço cultural para eventos',
    icon: 'Building2',
    moduleType: 'culture',
    moduleEntity: 'SpaceReservation',
    estimatedTime: '7 dias úteis',
    defaultFields: {
      fields: [
        { id: 'requesterName', label: 'Nome do Solicitante', type: 'text', required: true },
        { id: 'eventType', label: 'Tipo de Evento', type: 'text', required: true },
        { id: 'expectedAttendees', label: 'Público Esperado', type: 'number', required: true },
        { id: 'preferredDate', label: 'Data Desejada', type: 'date', required: true },
      ],
    },
    requiredDocs: {
      documents: ['RG', 'Projeto do evento'],
    },
    fieldMapping: {},
  },

  // ========================================================================
  // ESPORTE (2 templates)
  // ========================================================================
  {
    code: 'ESP_ESCOLINHA_001',
    name: 'Escolinha Esportiva',
    category: 'Esporte',
    description: 'Inscrição em escolinhas esportivas municipais',
    icon: 'Trophy',
    moduleType: 'sports',
    moduleEntity: 'SportsEnrollment',
    estimatedTime: '5 dias úteis',
    defaultFields: {
      fields: [
        { id: 'citizenName', label: 'Nome do Atleta', type: 'text', required: true },
        { id: 'birthDate', label: 'Data de Nascimento', type: 'date', required: true },
        { id: 'activityType', label: 'Modalidade', type: 'select', required: true, options: ['Futebol', 'Vôlei', 'Basquete', 'Judô', 'Natação', 'Atletismo'] },
        { id: 'shirtSize', label: 'Tamanho da Camiseta', type: 'select', required: true, options: ['PP', 'P', 'M', 'G', 'GG'] },
      ],
    },
    requiredDocs: {
      documents: ['RG', 'Atestado médico', 'Foto 3x4'],
    },
    fieldMapping: {
      citizenName: 'citizenName',
      activityType: 'activityType',
    },
  },

  {
    code: 'ESP_QUADRA_001',
    name: 'Reserva de Quadra Esportiva',
    category: 'Esporte',
    description: 'Reserva de quadra poliesportiva municipal',
    icon: 'Activity',
    moduleType: 'sports',
    moduleEntity: 'FacilityReservation',
    estimatedTime: '3 dias úteis',
    defaultFields: {
      fields: [
        { id: 'requesterName', label: 'Nome do Solicitante', type: 'text', required: true },
        { id: 'sport', label: 'Esporte', type: 'select', required: true, options: ['Futebol', 'Vôlei', 'Basquete', 'Futsal'] },
        { id: 'preferredDate', label: 'Data Desejada', type: 'date', required: true },
        { id: 'shift', label: 'Horário', type: 'select', required: true, options: ['Manhã', 'Tarde', 'Noite'] },
      ],
    },
    requiredDocs: {
      documents: ['RG'],
    },
    fieldMapping: {},
  },

  // ========================================================================
  // MEIO AMBIENTE (2 templates)
  // ========================================================================
  {
    code: 'AMB_DENUNCIA_001',
    name: 'Denúncia Ambiental',
    category: 'Meio Ambiente',
    description: 'Denunciar crime ambiental ou poluição',
    icon: 'AlertOctagon',
    moduleType: 'environment',
    moduleEntity: 'EnvironmentalComplaint',
    estimatedTime: '7 dias úteis',
    defaultFields: {
      fields: [
        { id: 'reporterName', label: 'Seu Nome (opcional para denúncia anônima)', type: 'text', required: false },
        { id: 'complaintType', label: 'Tipo de Denúncia', type: 'select', required: true, options: ['Desmatamento', 'Poluição de Rio', 'Queimada', 'Lixo Irregular', 'Maus Tratos Animal'] },
        { id: 'description', label: 'Descrição Detalhada', type: 'textarea', required: true },
      ],
    },
    requiredDocs: {
      documents: [],
    },
    fieldMapping: {
      reporterName: 'requesterName',
      complaintType: 'requestType',
    },
  },

  {
    code: 'AMB_PLANTIO_001',
    name: 'Solicitação de Plantio de Árvore',
    category: 'Meio Ambiente',
    description: 'Solicitação de plantio de árvore em calçada',
    icon: 'TreeDeciduous',
    moduleType: 'environment',
    moduleEntity: 'TreePlanting',
    estimatedTime: '30 dias úteis',
    defaultFields: {
      fields: [
        { id: 'requesterName', label: 'Seu Nome', type: 'text', required: true },
        { id: 'treePreference', label: 'Tipo de Árvore Preferida (sugestão)', type: 'text', required: false },
        { id: 'reason', label: 'Motivo da Solicitação', type: 'textarea', required: true },
      ],
    },
    requiredDocs: {
      documents: [],
    },
    fieldMapping: {},
  },
];

/**
 * Função para popular templates no banco
 */
export async function seedServiceTemplates() {
  console.log('🌱 Iniciando seed de templates de serviços - FASE 2...\n');

  try {
    const templatesToSeed = SERVICE_TEMPLATES.length > 0 ? SERVICE_TEMPLATES : LEGACY_TEMPLATES;

    console.log(`📦 Total de templates a processar: ${templatesToSeed.length}\n`);

    let created = 0;
    let updated = 0;

    for (const template of templatesToSeed) {
      const existing = await prisma.serviceTemplate.findUnique({
        where: { code: template.code }
      });

      await prisma.serviceTemplate.upsert({
        where: { code: template.code },
        update: template,
        create: {
          ...template,
          isActive: true,
          version: '1.0'
        },
      });

      if (existing) {
        updated++;
      } else {
        created++;
      }
    }

    console.log('\n✅ Seed concluído com sucesso!');
    console.log(`   📝 Templates criados: ${created}`);
    console.log(`   🔄 Templates atualizados: ${updated}`);
    console.log(`   📊 Total processado: ${templatesToSeed.length}\n`);

    // Estatísticas por categoria
    const stats = await prisma.serviceTemplate.groupBy({
      by: ['category'],
      _count: true
    });

    console.log('📊 Templates por categoria:');
    stats.forEach(stat => {
      console.log(`   - ${stat.category}: ${stat._count} templates`);
    });

  } catch (error) {
    console.error('❌ Erro ao criar templates:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar seed se chamado diretamente
if (require.main === module) {
  seedServiceTemplates()
    .then(() => {
      console.log('✅ Seed concluído!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erro no seed:', error);
      process.exit(1);
    });
}
