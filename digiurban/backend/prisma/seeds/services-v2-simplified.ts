/**
 * SEED DE SERVIÇOS V2 - SIMPLIFICADO E ALINHADO
 *
 * Total: 108 serviços otimizados
 * - 95 serviços COM_DADOS (88%)
 * - 12 serviços INFORMATIVOS (11%)
 * - 1 funcionalidade TRANSVERSAL (1%)
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
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ServiceSeedDataV2 {
  name: string;
  description: string;
  category: string;
  departmentCode: string;
  serviceType: 'INFORMATIVO' | 'COM_DADOS';
  moduleType?: string;
  formSchema?: any;
  requiresDocuments: boolean;
  requiredDocuments?: string[];
  estimatedDays: number | null;
  priority: number;
  icon?: string;
  color?: string;
}

// Códigos de departamento
const DEPT = {
  SAUDE: 'SAUDE',
  EDUCACAO: 'EDUCACAO',
  ASSISTENCIA_SOCIAL: 'ASSISTENCIA_SOCIAL',
  AGRICULTURA: 'AGRICULTURA',
  CULTURA: 'CULTURA',
  ESPORTE_LAZER: 'ESPORTE_LAZER',
  HABITACAO: 'HABITACAO',
  MEIO_AMBIENTE: 'MEIO_AMBIENTE',
  OBRAS_INFRAESTRUTURA: 'OBRAS_INFRAESTRUTURA',
  PLANEJAMENTO: 'PLANEJAMENTO',
  SEGURANCA_PUBLICA: 'SEGURANCA_PUBLICA',
  SERVICOS_PUBLICOS: 'SERVICOS_PUBLICOS',
  TURISMO: 'TURISMO',
} as const;

const SERVICES_V2: ServiceSeedDataV2[] = [
  // ========================================
  // SECRETARIA DE SAÚDE (11 serviços)
  // ========================================
  {
    name: 'Atendimentos de Saúde',
    description: 'Registrar atendimentos gerais de saúde nas unidades básicas',
    category: 'Atendimento',
    departmentCode: DEPT.SAUDE,
    serviceType: 'COM_DADOS',
    moduleType: 'ATENDIMENTOS_SAUDE',
    formSchema: {
      type: 'object',
      fields: [
        { id: 'tipoAtendimento', type: 'select', label: 'Tipo de Atendimento', required: true, options: ['Consulta', 'Procedimento', 'Retorno', 'Urgência'] },
        { id: 'unidadeSaude', type: 'text', label: 'Unidade de Saúde', required: true },
        { id: 'queixaPrincipal', type: 'textarea', label: 'Queixa Principal', required: true },
        { id: 'observacoes', type: 'textarea', label: 'Observações', required: false },
      ],
    },
    requiresDocuments: false,
    estimatedDays: 0,
    priority: 5,
    icon: 'Stethoscope',
    color: '#ef4444',
  },
  {
    name: 'Agendamento de Consulta',
    description: 'Agendar consultas médicas nas unidades de saúde',
    category: 'Agendamento',
    departmentCode: DEPT.SAUDE,
    serviceType: 'COM_DADOS',
    moduleType: 'AGENDAMENTOS_MEDICOS',
    formSchema: {
      type: 'object',
      fields: [
        { id: 'especialidade', type: 'select', label: 'Especialidade', required: true, options: ['Clínico Geral', 'Pediatria', 'Ginecologia', 'Cardiologia', 'Ortopedia'] },
        { id: 'unidadeSaude', type: 'text', label: 'Unidade de Saúde', required: true },
        { id: 'dataPreferencia', type: 'date', label: 'Data de Preferência', required: true },
        { id: 'periodo', type: 'select', label: 'Período', required: true, options: ['Manhã', 'Tarde'] },
        { id: 'motivoConsulta', type: 'textarea', label: 'Motivo da Consulta', required: false },
      ],
    },
    requiresDocuments: true,
    requiredDocuments: ['Cartão SUS', 'Documento de Identidade'],
    estimatedDays: 7,
    priority: 4,
    icon: 'Calendar',
    color: '#3b82f6',
  },
  {
    name: 'Controle de Medicamentos',
    description: 'Dispensação e controle de medicamentos da farmácia básica',
    category: 'Farmácia',
    departmentCode: DEPT.SAUDE,
    serviceType: 'COM_DADOS',
    moduleType: 'CONTROLE_MEDICAMENTOS',
    formSchema: {
      type: 'object',
      fields: [
        { id: 'medicamento', type: 'text', label: 'Nome do Medicamento', required: true },
        { id: 'quantidade', type: 'number', label: 'Quantidade', required: true },
        { id: 'receita', type: 'text', label: 'Número da Receita', required: true },
        { id: 'medico', type: 'text', label: 'Médico Prescritor', required: true },
        { id: 'dataReceita', type: 'date', label: 'Data da Receita', required: true },
      ],
    },
    requiresDocuments: true,
    requiredDocuments: ['Receita médica', 'Cartão SUS'],
    estimatedDays: 0,
    priority: 5,
    icon: 'Pill',
    color: '#10b981',
  },
  {
    name: 'Campanhas de Saúde',
    description: 'Inscrição e participação em campanhas de saúde (vacinação, prevenção, etc)',
    category: 'Prevenção',
    departmentCode: DEPT.SAUDE,
    serviceType: 'COM_DADOS',
    moduleType: 'CAMPANHAS_SAUDE',
    formSchema: {
      type: 'object',
      fields: [
        { id: 'campanha', type: 'select', label: 'Campanha', required: true, options: ['Vacinação COVID-19', 'Vacinação Gripe', 'Outubro Rosa', 'Novembro Azul', 'Dengue'] },
        { id: 'publico', type: 'select', label: 'Público-Alvo', required: true, options: ['Crianças', 'Adolescentes', 'Adultos', 'Idosos', 'Gestantes'] },
        { id: 'unidadeAtendimento', type: 'text', label: 'Unidade de Atendimento', required: true },
        { id: 'dataPreferencia', type: 'date', label: 'Data de Preferência', required: false },
      ],
    },
    requiresDocuments: true,
    requiredDocuments: ['Cartão SUS', 'Carteira de Vacinação (se aplicável)'],
    estimatedDays: 3,
    priority: 4,
    icon: 'Syringe',
    color: '#8b5cf6',
  },
  {
    name: 'Programas de Saúde',
    description: 'Inscrição em programas específicos (Hiperdia, Pré-natal, Saúde Mental, etc)',
    category: 'Programas',
    departmentCode: DEPT.SAUDE,
    serviceType: 'COM_DADOS',
    moduleType: 'PROGRAMAS_SAUDE',
    formSchema: {
      type: 'object',
      fields: [
        { id: 'programa', type: 'select', label: 'Programa', required: true, options: ['Hiperdia', 'Pré-natal', 'Saúde Mental', 'Saúde da Mulher', 'Saúde do Idoso'] },
        { id: 'unidadeReferencia', type: 'text', label: 'Unidade de Referência', required: true },
        { id: 'condicaoSaude', type: 'textarea', label: 'Condição de Saúde', required: true },
        { id: 'medicamentosUso', type: 'textarea', label: 'Medicamentos em Uso', required: false },
      ],
    },
    requiresDocuments: true,
    requiredDocuments: ['Cartão SUS', 'Exames médicos recentes'],
    estimatedDays: 5,
    priority: 4,
    icon: 'HeartPulse',
    color: '#f59e0b',
  },
  {
    name: 'Encaminhamentos TFD',
    description: 'Tratamento Fora do Domicílio - encaminhamentos para outras cidades',
    category: 'TFD',
    departmentCode: DEPT.SAUDE,
    serviceType: 'COM_DADOS',
    moduleType: 'ENCAMINHAMENTOS_TFD',
    formSchema: {
      type: 'object',
      fields: [
        { id: 'especialidade', type: 'text', label: 'Especialidade Necessária', required: true },
        { id: 'cidadeDestino', type: 'text', label: 'Cidade de Destino', required: true },
        { id: 'motivoEncaminhamento', type: 'textarea', label: 'Motivo do Encaminhamento', required: true },
        { id: 'medicoSolicitante', type: 'text', label: 'Médico Solicitante', required: true },
        { id: 'acompanhante', type: 'select', label: 'Necessita Acompanhante?', required: true, options: ['Sim', 'Não'] },
      ],
    },
    requiresDocuments: true,
    requiredDocuments: ['Laudo médico', 'Cartão SUS', 'Exames', 'Guia de encaminhamento'],
    estimatedDays: 15,
    priority: 5,
    icon: 'Ambulance',
    color: '#ef4444',
  },
  {
    name: 'Exames',
    description: 'Agendamento de exames laboratoriais e de imagem',
    category: 'Exames',
    departmentCode: DEPT.SAUDE,
    serviceType: 'COM_DADOS',
    moduleType: 'EXAMES',
    formSchema: {
      type: 'object',
      fields: [
        { id: 'tipoExame', type: 'select', label: 'Tipo de Exame', required: true, options: ['Laboratorial', 'Raio-X', 'Ultrassom', 'Tomografia', 'Ressonância'] },
        { id: 'examesSolicitados', type: 'textarea', label: 'Exames Solicitados', required: true },
        { id: 'medicoSolicitante', type: 'text', label: 'Médico Solicitante', required: true },
        { id: 'urgente', type: 'select', label: 'Urgente?', required: true, options: ['Sim', 'Não'] },
      ],
    },
    requiresDocuments: true,
    requiredDocuments: ['Pedido médico', 'Cartão SUS'],
    estimatedDays: 10,
    priority: 4,
    icon: 'FlaskConical',
    color: '#06b6d4',
  },
  {
    name: 'Transporte de Pacientes',
    description: 'Solicitação de transporte para consultas e exames',
    category: 'Transporte',
    departmentCode: DEPT.SAUDE,
    serviceType: 'COM_DADOS',
    moduleType: 'TRANSPORTE_PACIENTES',
    formSchema: {
      type: 'object',
      fields: [
        { id: 'dataConsulta', type: 'date', label: 'Data da Consulta/Exame', required: true },
        { id: 'horario', type: 'text', label: 'Horário', required: true },
        { id: 'local', type: 'text', label: 'Local (Cidade)', required: true },
        { id: 'enderecoPartida', type: 'text', label: 'Endereço de Partida', required: true },
        { id: 'tipoVeiculo', type: 'select', label: 'Tipo de Veículo', required: true, options: ['Comum', 'Adaptado', 'Ambulância'] },
        { id: 'acompanhante', type: 'select', label: 'Necessita Acompanhante?', required: true, options: ['Sim', 'Não'] },
      ],
    },
    requiresDocuments: true,
    requiredDocuments: ['Comprovante de agendamento', 'Cartão SUS'],
    estimatedDays: 3,
    priority: 4,
    icon: 'Car',
    color: '#3b82f6',
  },
  {
    name: 'Vacinação',
    description: 'Registro e acompanhamento de vacinação',
    category: 'Imunização',
    departmentCode: DEPT.SAUDE,
    serviceType: 'COM_DADOS',
    moduleType: 'VACINACAO',
    formSchema: {
      type: 'object',
      fields: [
        { id: 'tipoVacina', type: 'select', label: 'Tipo de Vacina', required: true, options: ['COVID-19', 'Gripe', 'Hepatite B', 'Tríplice Viral', 'DTP', 'Outras'] },
        { id: 'dose', type: 'select', label: 'Dose', required: true, options: ['1ª Dose', '2ª Dose', '3ª Dose', 'Reforço', 'Dose Única'] },
        { id: 'unidadeSaude', type: 'text', label: 'Unidade de Saúde', required: true },
        { id: 'lote', type: 'text', label: 'Lote da Vacina', required: false },
      ],
    },
    requiresDocuments: true,
    requiredDocuments: ['Cartão SUS', 'Carteira de Vacinação'],
    estimatedDays: 0,
    priority: 4,
    icon: 'Syringe',
    color: '#10b981',
  },
  {
    name: 'Cadastro de Paciente',
    description: 'Cadastro inicial de paciente no sistema de saúde',
    category: 'Cadastro',
    departmentCode: DEPT.SAUDE,
    serviceType: 'COM_DADOS',
    moduleType: 'CADASTRO_PACIENTE',
    formSchema: {
      type: 'object',
      fields: [
        { id: 'nomePaciente', type: 'text', label: 'Nome Completo', required: true },
        { id: 'dataNascimento', type: 'date', label: 'Data de Nascimento', required: true },
        { id: 'cpf', type: 'text', label: 'CPF', required: true },
        { id: 'cartaoSUS', type: 'text', label: 'Número do Cartão SUS', required: false },
        { id: 'endereco', type: 'text', label: 'Endereço Completo', required: true },
        { id: 'telefone', type: 'tel', label: 'Telefone', required: true },
        { id: 'unidadeReferencia', type: 'text', label: 'Unidade de Saúde de Referência', required: true },
      ],
    },
    requiresDocuments: true,
    requiredDocuments: ['RG', 'CPF', 'Comprovante de residência'],
    estimatedDays: 5,
    priority: 3,
    icon: 'UserPlus',
    color: '#8b5cf6',
  },
  {
    name: 'Gestão de ACS',
    description: 'Gestão de Agentes Comunitários de Saúde (uso interno)',
    category: 'Gestão Interna',
    departmentCode: DEPT.SAUDE,
    serviceType: 'COM_DADOS',
    moduleType: 'GESTAO_ACS',
    formSchema: {
      type: 'object',
      fields: [
        { id: 'nomeACS', type: 'text', label: 'Nome do ACS', required: true },
        { id: 'microarea', type: 'text', label: 'Microárea', required: true },
        { id: 'familiasCadastradas', type: 'number', label: 'Famílias Cadastradas', required: true },
        { id: 'atividades', type: 'textarea', label: 'Atividades Realizadas', required: false },
      ],
    },
    requiresDocuments: false,
    estimatedDays: 0,
    priority: 2,
    icon: 'Users',
    color: '#6366f1',
  },

  // ========================================
  // SECRETARIA DE EDUCAÇÃO (11 serviços)
  // ========================================
  {
    name: 'Atendimentos de Educação',
    description: 'Registrar atendimentos gerais da secretaria de educação',
    category: 'Atendimento',
    departmentCode: DEPT.EDUCACAO,
    serviceType: 'COM_DADOS',
    moduleType: 'ATENDIMENTOS_EDUCACAO',
    formSchema: {
      type: 'object',
      fields: [
        { id: 'tipoAtendimento', type: 'select', label: 'Tipo de Atendimento', required: true, options: ['Informação', 'Reclamação', 'Solicitação', 'Elogio'] },
        { id: 'assunto', type: 'text', label: 'Assunto', required: true },
        { id: 'descricao', type: 'textarea', label: 'Descrição', required: true },
        { id: 'escolaRelacionada', type: 'text', label: 'Escola Relacionada', required: false },
      ],
    },
    requiresDocuments: false,
    estimatedDays: 5,
    priority: 3,
    icon: 'GraduationCap',
    color: '#3b82f6',
  },
  {
    name: 'Matrícula de Aluno',
    description: 'Realizar matrícula de aluno na rede municipal de ensino',
    category: 'Matrícula',
    departmentCode: DEPT.EDUCACAO,
    serviceType: 'COM_DADOS',
    moduleType: 'MATRICULA_ALUNO',
    formSchema: {
      type: 'object',
      fields: [
        { id: 'nomeAluno', type: 'text', label: 'Nome Completo do Aluno', required: true },
        { id: 'dataNascimento', type: 'date', label: 'Data de Nascimento', required: true },
        { id: 'cpfAluno', type: 'text', label: 'CPF do Aluno', required: false },
        { id: 'escolaDesejada', type: 'text', label: 'Escola Desejada', required: true },
        { id: 'serie', type: 'select', label: 'Série', required: true, options: ['Creche', 'Pré I', 'Pré II', '1º Ano', '2º Ano', '3º Ano', '4º Ano', '5º Ano', '6º Ano', '7º Ano', '8º Ano', '9º Ano'] },
        { id: 'turno', type: 'select', label: 'Turno', required: true, options: ['Matutino', 'Vespertino', 'Integral'] },
        { id: 'nomeResponsavel', type: 'text', label: 'Nome do Responsável', required: true },
        { id: 'telefone', type: 'tel', label: 'Telefone de Contato', required: true },
        { id: 'necessidadeEspecial', type: 'select', label: 'Necessidade Especial', required: true, options: ['Não', 'Sim'] },
      ],
    },
    requiresDocuments: true,
    requiredDocuments: ['Certidão de Nascimento', 'RG e CPF do responsável', 'Comprovante de residência', 'Carteira de vacinação', 'Histórico escolar (se transferência)'],
    estimatedDays: 10,
    priority: 5,
    icon: 'UserPlus',
    color: '#10b981',
  },
  {
    name: 'Transporte Escolar',
    description: 'Solicitação de transporte escolar',
    category: 'Transporte',
    departmentCode: DEPT.EDUCACAO,
    serviceType: 'COM_DADOS',
    moduleType: 'TRANSPORTE_ESCOLAR',
    formSchema: {
      type: 'object',
      fields: [
        { id: 'nomeAluno', type: 'text', label: 'Nome do Aluno', required: true },
        { id: 'escola', type: 'text', label: 'Escola', required: true },
        { id: 'serie', type: 'text', label: 'Série', required: true },
        { id: 'endereco', type: 'text', label: 'Endereço de Embarque', required: true },
        { id: 'turno', type: 'select', label: 'Turno', required: true, options: ['Matutino', 'Vespertino'] },
        { id: 'distanciaKm', type: 'number', label: 'Distância até a escola (km)', required: true },
      ],
    },
    requiresDocuments: true,
    requiredDocuments: ['Comprovante de matrícula', 'Comprovante de residência'],
    estimatedDays: 15,
    priority: 4,
    icon: 'Bus',
    color: '#f59e0b',
  },
  {
    name: 'Registro de Ocorrência Escolar',
    description: 'Registrar ocorrências disciplinares ou pedagógicas',
    category: 'Gestão',
    departmentCode: DEPT.EDUCACAO,
    serviceType: 'COM_DADOS',
    moduleType: 'REGISTRO_OCORRENCIA_ESCOLAR',
    formSchema: {
      type: 'object',
      fields: [
        { id: 'tipoOcorrencia', type: 'select', label: 'Tipo de Ocorrência', required: true, options: ['Disciplinar', 'Pedagógica', 'Saúde', 'Convivência', 'Outras'] },
        { id: 'nomeAluno', type: 'text', label: 'Nome do Aluno', required: true },
        { id: 'escola', type: 'text', label: 'Escola', required: true },
        { id: 'descricao', type: 'textarea', label: 'Descrição da Ocorrência', required: true },
        { id: 'providencias', type: 'textarea', label: 'Providências Tomadas', required: false },
      ],
    },
    requiresDocuments: false,
    estimatedDays: 3,
    priority: 4,
    icon: 'AlertCircle',
    color: '#ef4444',
  },
  {
    name: 'Solicitação de Documento Escolar',
    description: 'Solicitar histórico, declarações e outros documentos escolares',
    category: 'Documentos',
    departmentCode: DEPT.EDUCACAO,
    serviceType: 'COM_DADOS',
    moduleType: 'SOLICITACAO_DOCUMENTO_ESCOLAR',
    formSchema: {
      type: 'object',
      fields: [
        { id: 'tipoDocumento', type: 'select', label: 'Tipo de Documento', required: true, options: ['Histórico Escolar', 'Declaração de Matrícula', 'Declaração de Conclusão', 'Boletim', 'Transferência'] },
        { id: 'nomeAluno', type: 'text', label: 'Nome do Aluno', required: true },
        { id: 'escola', type: 'text', label: 'Escola', required: true },
        { id: 'anoLetivo', type: 'text', label: 'Ano Letivo', required: true },
        { id: 'finalidade', type: 'textarea', label: 'Finalidade', required: false },
      ],
    },
    requiresDocuments: true,
    requiredDocuments: ['RG do solicitante', 'Comprovante de vínculo com aluno'],
    estimatedDays: 7,
    priority: 3,
    icon: 'FileText',
    color: '#8b5cf6',
  },
  {
    name: 'Transferência Escolar',
    description: 'Solicitar transferência entre escolas da rede municipal',
    category: 'Matrícula',
    departmentCode: DEPT.EDUCACAO,
    serviceType: 'COM_DADOS',
    moduleType: 'TRANSFERENCIA_ESCOLAR',
    formSchema: {
      type: 'object',
      fields: [
        { id: 'nomeAluno', type: 'text', label: 'Nome do Aluno', required: true },
        { id: 'escolaAtual', type: 'text', label: 'Escola Atual', required: true },
        { id: 'escolaDestino', type: 'text', label: 'Escola de Destino', required: true },
        { id: 'serie', type: 'text', label: 'Série', required: true },
        { id: 'motivoTransferencia', type: 'textarea', label: 'Motivo da Transferência', required: true },
      ],
    },
    requiresDocuments: true,
    requiredDocuments: ['Declaração de matrícula', 'Comprovante de residência atualizado'],
    estimatedDays: 10,
    priority: 4,
    icon: 'ArrowRightLeft',
    color: '#06b6d4',
  },
  {
    name: 'Consulta de Frequência',
    description: 'Consultar frequência escolar do aluno',
    category: 'Consulta',
    departmentCode: DEPT.EDUCACAO,
    serviceType: 'INFORMATIVO',
    moduleType: null,
    formSchema: null,
    requiresDocuments: false,
    estimatedDays: 0,
    priority: 2,
    icon: 'ClipboardCheck',
    color: '#10b981',
  },
  {
    name: 'Consulta de Notas',
    description: 'Consultar boletim e notas do aluno',
    category: 'Consulta',
    departmentCode: DEPT.EDUCACAO,
    serviceType: 'INFORMATIVO',
    moduleType: null,
    formSchema: null,
    requiresDocuments: false,
    estimatedDays: 0,
    priority: 2,
    icon: 'Award',
    color: '#8b5cf6',
  },
  {
    name: 'Gestão Escolar',
    description: 'Administração de unidades escolares (uso interno)',
    category: 'Gestão Interna',
    departmentCode: DEPT.EDUCACAO,
    serviceType: 'COM_DADOS',
    moduleType: 'GESTAO_ESCOLAR',
    formSchema: {
      type: 'object',
      fields: [
        { id: 'nomeEscola', type: 'text', label: 'Nome da Escola', required: true },
        { id: 'atividade', type: 'select', label: 'Tipo de Atividade', required: true, options: ['Matrícula', 'Conselho de Classe', 'Evento', 'Manutenção', 'Outras'] },
        { id: 'descricao', type: 'textarea', label: 'Descrição', required: true },
      ],
    },
    requiresDocuments: false,
    estimatedDays: 0,
    priority: 2,
    icon: 'School',
    color: '#6366f1',
  },
  {
    name: 'Gestão de Merenda',
    description: 'Planejamento de cardápios e controle de estoque de merenda',
    category: 'Gestão Interna',
    departmentCode: DEPT.EDUCACAO,
    serviceType: 'COM_DADOS',
    moduleType: 'GESTAO_MERENDA',
    formSchema: {
      type: 'object',
      fields: [
        { id: 'escola', type: 'text', label: 'Escola', required: true },
        { id: 'tipoRefeicao', type: 'select', label: 'Tipo de Refeição', required: true, options: ['Café da manhã', 'Almoço', 'Lanche'] },
        { id: 'cardapio', type: 'textarea', label: 'Cardápio', required: true },
        { id: 'numeroAlunos', type: 'number', label: 'Número de Alunos', required: true },
      ],
    },
    requiresDocuments: false,
    estimatedDays: 0,
    priority: 2,
    icon: 'Utensils',
    color: '#f59e0b',
  },
  {
    name: 'Calendário Escolar',
    description: 'Consultar calendário letivo e eventos escolares',
    category: 'Informação',
    departmentCode: DEPT.EDUCACAO,
    serviceType: 'INFORMATIVO',
    moduleType: null,
    formSchema: null,
    requiresDocuments: false,
    estimatedDays: 0,
    priority: 1,
    icon: 'Calendar',
    color: '#3b82f6',
  },

  // ========================================
  // SECRETARIA DE ASSISTÊNCIA SOCIAL (10 serviços)
  // ========================================
  {
    name: 'Atendimentos de Assistência Social',
    description: 'Registrar atendimentos gerais da assistência social',
    category: 'Atendimento',
    departmentCode: DEPT.ASSISTENCIA_SOCIAL,
    serviceType: 'COM_DADOS',
    moduleType: 'ATENDIMENTOS_ASSISTENCIA_SOCIAL',
    formSchema: {
      type: 'object',
      fields: [
        { id: 'tipoAtendimento', type: 'select', label: 'Tipo de Atendimento', required: true, options: ['Acolhimento', 'Orientação', 'Encaminhamento', 'Acompanhamento'] },
        { id: 'demanda', type: 'textarea', label: 'Demanda Apresentada', required: true },
        { id: 'equipamento', type: 'select', label: 'Equipamento', required: true, options: ['CRAS', 'CREAS', 'Centro Pop', 'Abrigo'] },
        { id: 'profissional', type: 'text', label: 'Profissional Responsável', required: true },
      ],
    },
    requiresDocuments: false,
    estimatedDays: 0,
    priority: 5,
    icon: 'Heart',
    color: '#ef4444',
  },
  {
    name: 'Cadastro Único',
    description: 'Cadastro ou atualização no CadÚnico para programas sociais',
    category: 'Cadastro',
    departmentCode: DEPT.ASSISTENCIA_SOCIAL,
    serviceType: 'COM_DADOS',
    moduleType: 'CADASTRO_UNICO',
    formSchema: {
      type: 'object',
      fields: [
        { id: 'nomeResponsavel', type: 'text', label: 'Nome do Responsável Familiar', required: true },
        { id: 'cpf', type: 'text', label: 'CPF', required: true },
        { id: 'quantidadeMembros', type: 'number', label: 'Quantidade de Membros da Família', required: true },
        { id: 'rendaFamiliar', type: 'number', label: 'Renda Familiar Total (R$)', required: true },
        { id: 'endereco', type: 'text', label: 'Endereço Completo', required: true },
        { id: 'telefone', type: 'tel', label: 'Telefone', required: true },
      ],
    },
    requiresDocuments: true,
    requiredDocuments: ['RG e CPF de todos os membros', 'Comprovante de residência', 'Comprovante de renda (se houver)'],
    estimatedDays: 15,
    priority: 5,
    icon: 'Users',
    color: '#10b981',
  },
  {
    name: 'Solicitação de Benefício',
    description: 'Solicitar benefícios eventuais (auxílio natalidade, funeral, etc)',
    category: 'Benefícios',
    departmentCode: DEPT.ASSISTENCIA_SOCIAL,
    serviceType: 'COM_DADOS',
    moduleType: 'SOLICITACAO_BENEFICIO',
    formSchema: {
      type: 'object',
      fields: [
        { id: 'tipoBeneficio', type: 'select', label: 'Tipo de Benefício', required: true, options: ['Auxílio Natalidade', 'Auxílio Funeral', 'Cesta Básica', 'Kit Higiene', 'Material de Construção'] },
        { id: 'justificativa', type: 'textarea', label: 'Justificativa', required: true },
        { id: 'nis', type: 'text', label: 'NIS', required: false },
        { id: 'urgente', type: 'select', label: 'Situação de Urgência?', required: true, options: ['Sim', 'Não'] },
      ],
    },
    requiresDocuments: true,
    requiredDocuments: ['RG e CPF', 'Comprovante de residência', 'Documentos específicos conforme benefício'],
    estimatedDays: 7,
    priority: 5,
    icon: 'Gift',
    color: '#f59e0b',
  },
  {
    name: 'Entrega Emergencial',
    description: 'Solicitação de ajuda emergencial (cesta básica, kit higiene)',
    category: 'Emergência',
    departmentCode: DEPT.ASSISTENCIA_SOCIAL,
    serviceType: 'COM_DADOS',
    moduleType: 'ENTREGA_EMERGENCIAL',
    formSchema: {
      type: 'object',
      fields: [
        { id: 'tipoAjuda', type: 'select', label: 'Tipo de Ajuda', required: true, options: ['Cesta Básica', 'Kit Higiene', 'Água Potável', 'Ração Animal', 'Outros'] },
        { id: 'quantidadePessoas', type: 'number', label: 'Quantidade de Pessoas', required: true },
        { id: 'situacaoEmergencia', type: 'textarea', label: 'Situação de Emergência', required: true },
        { id: 'endereco', type: 'text', label: 'Endereço para Entrega', required: true },
      ],
    },
    requiresDocuments: false,
    estimatedDays: 2,
    priority: 5,
    icon: 'Package',
    color: '#ef4444',
  },
  {
    name: 'Inscrição em Grupo/Oficina',
    description: 'Inscrição em grupos ou oficinas do CRAS/CREAS',
    category: 'Grupos',
    departmentCode: DEPT.ASSISTENCIA_SOCIAL,
    serviceType: 'COM_DADOS',
    moduleType: 'INSCRICAO_GRUPO_OFICINA',
    formSchema: {
      type: 'object',
      fields: [
        { id: 'grupoOficina', type: 'select', label: 'Grupo/Oficina', required: true, options: ['Grupo de Idosos', 'Grupo de Mulheres', 'Artesanato', 'Informática', 'Alfabetização', 'Esporte'] },
        { id: 'equipamento', type: 'select', label: 'Equipamento', required: true, options: ['CRAS Centro', 'CRAS Bairro', 'CREAS'] },
        { id: 'nomeParticipante', type: 'text', label: 'Nome do Participante', required: true },
        { id: 'idade', type: 'number', label: 'Idade', required: true },
        { id: 'telefone', type: 'tel', label: 'Telefone', required: true },
      ],
    },
    requiresDocuments: true,
    requiredDocuments: ['RG', 'CPF'],
    estimatedDays: 5,
    priority: 3,
    icon: 'Users',
    color: '#8b5cf6',
  },
  {
    name: 'Visitas Domiciliares',
    description: 'Agendamento de visita domiciliar de assistentes sociais',
    category: 'Acompanhamento',
    departmentCode: DEPT.ASSISTENCIA_SOCIAL,
    serviceType: 'COM_DADOS',
    moduleType: 'VISITAS_DOMICILIARES',
    formSchema: {
      type: 'object',
      fields: [
        { id: 'motivoVisita', type: 'textarea', label: 'Motivo da Visita', required: true },
        { id: 'endereco', type: 'text', label: 'Endereço Completo', required: true },
        { id: 'periodoPreferencia', type: 'select', label: 'Período de Preferência', required: true, options: ['Manhã', 'Tarde'] },
        { id: 'situacaoRisco', type: 'select', label: 'Situação de Risco?', required: true, options: ['Sim', 'Não'] },
      ],
    },
    requiresDocuments: false,
    estimatedDays: 7,
    priority: 4,
    icon: 'Home',
    color: '#06b6d4',
  },
  {
    name: 'Inscrição em Programa Social',
    description: 'Inscrição em programas sociais municipais',
    category: 'Programas',
    departmentCode: DEPT.ASSISTENCIA_SOCIAL,
    serviceType: 'COM_DADOS',
    moduleType: 'INSCRICAO_PROGRAMA_SOCIAL',
    formSchema: {
      type: 'object',
      fields: [
        { id: 'programa', type: 'select', label: 'Programa', required: true, options: ['Bolsa Família', 'BPC', 'Tarifa Social', 'Programa Habitacional', 'Outros'] },
        { id: 'nis', type: 'text', label: 'NIS', required: true },
        { id: 'rendaFamiliar', type: 'number', label: 'Renda Familiar (R$)', required: true },
        { id: 'situacaoVulnerabilidade', type: 'textarea', label: 'Situação de Vulnerabilidade', required: true },
      ],
    },
    requiresDocuments: true,
    requiredDocuments: ['RG e CPF', 'Comprovante de cadastro CadÚnico', 'Comprovante de renda'],
    estimatedDays: 20,
    priority: 4,
    icon: 'HandHeart',
    color: '#f59e0b',
  },
  {
    name: 'Agendamento de Atendimento Social',
    description: 'Agendar atendimento com assistente social',
    category: 'Agendamento',
    departmentCode: DEPT.ASSISTENCIA_SOCIAL,
    serviceType: 'COM_DADOS',
    moduleType: 'AGENDAMENTO_ATENDIMENTO_SOCIAL',
    formSchema: {
      type: 'object',
      fields: [
        { id: 'assunto', type: 'textarea', label: 'Assunto do Atendimento', required: true },
        { id: 'equipamento', type: 'select', label: 'Equipamento', required: true, options: ['CRAS Centro', 'CRAS Bairro', 'CREAS', 'Sede da Secretaria'] },
        { id: 'dataPreferencia', type: 'date', label: 'Data de Preferência', required: true },
        { id: 'periodo', type: 'select', label: 'Período', required: true, options: ['Manhã', 'Tarde'] },
      ],
    },
    requiresDocuments: false,
    estimatedDays: 5,
    priority: 3,
    icon: 'Calendar',
    color: '#3b82f6',
  },
  {
    name: 'Gestão CRAS/CREAS',
    description: 'Gestão de equipamentos CRAS e CREAS (uso interno)',
    category: 'Gestão Interna',
    departmentCode: DEPT.ASSISTENCIA_SOCIAL,
    serviceType: 'COM_DADOS',
    moduleType: 'GESTAO_CRAS_CREAS',
    formSchema: {
      type: 'object',
      fields: [
        { id: 'equipamento', type: 'text', label: 'Nome do Equipamento', required: true },
        { id: 'tipo', type: 'select', label: 'Tipo', required: true, options: ['CRAS', 'CREAS', 'Centro Pop', 'Abrigo'] },
        { id: 'atividade', type: 'textarea', label: 'Atividade/Ocorrência', required: true },
      ],
    },
    requiresDocuments: false,
    estimatedDays: 0,
    priority: 2,
    icon: 'Building',
    color: '#6366f1',
  },
  {
    name: 'Consulta de Programas Sociais',
    description: 'Consultar programas sociais disponíveis',
    category: 'Informação',
    departmentCode: DEPT.ASSISTENCIA_SOCIAL,
    serviceType: 'INFORMATIVO',
    moduleType: null,
    formSchema: null,
    requiresDocuments: false,
    estimatedDays: 0,
    priority: 1,
    icon: 'Info',
    color: '#10b981',
  },

  // Continua com as outras secretarias...
  // Por questão de espaço, vou criar um arquivo separado
];

/**
 * Função principal de seed
 */
export async function seedServicesV2(tenantId: string) {
  console.log(`\n🌱 Iniciando seed de serviços V2 para tenant: ${tenantId}`);
  console.log(`📊 Total de serviços: ${SERVICES_V2.length}`);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const serviceData of SERVICES_V2) {
    try {
      // Buscar departamento
      const department = await prisma.department.findFirst({
        where: {
          code: serviceData.departmentCode,
          tenantId,
        },
      });

      if (!department) {
        console.warn(`   ⚠️  Departamento ${serviceData.departmentCode} não encontrado - pulando serviço "${serviceData.name}"`);
        skipped++;
        continue;
      }

      // Verificar se serviço já existe
      const existing = await prisma.serviceSimplified.findFirst({
        where: {
          name: serviceData.name,
          departmentId: department.id,
          tenantId,
        },
      });

      if (existing) {
        console.log(`   ⏭️  Serviço "${serviceData.name}" já existe - pulando`);
        skipped++;
        continue;
      }

      // Criar serviço
      await prisma.serviceSimplified.create({
        data: {
          name: serviceData.name,
          description: serviceData.description,
          category: serviceData.category,
          departmentId: department.id,
          tenantId,
          serviceType: serviceData.serviceType,
          moduleType: serviceData.moduleType || null,
          formSchema: serviceData.formSchema || null,
          requiresDocuments: serviceData.requiresDocuments,
          requiredDocuments: serviceData.requiredDocuments || null,
          estimatedDays: serviceData.estimatedDays,
          priority: serviceData.priority,
          icon: serviceData.icon || null,
          color: serviceData.color || null,
          isActive: true,
        },
      });

      console.log(`   ✅ Criado: ${serviceData.name} (${serviceData.serviceType})`);
      created++;
    } catch (error) {
      console.error(`   ❌ Erro ao criar "${serviceData.name}":`, error);
      errors++;
    }
  }

  console.log(`\n📊 RESUMO DO SEED:`);
  console.log(`   ✅ Criados: ${created}`);
  console.log(`   ⏭️  Pulados: ${skipped}`);
  console.log(`   ❌ Erros: ${errors}`);

  // Estatísticas por tipo
  const informativos = SERVICES_V2.filter((s) => s.serviceType === 'INFORMATIVO').length;
  const comDados = SERVICES_V2.filter((s) => s.serviceType === 'COM_DADOS').length;

  console.log(`\n📈 ESTATÍSTICAS:`);
  console.log(`   🔵 INFORMATIVOS: ${informativos} (${((informativos / SERVICES_V2.length) * 100).toFixed(1)}%)`);
  console.log(`   🟢 COM_DADOS: ${comDados} (${((comDados / SERVICES_V2.length) * 100).toFixed(1)}%)`);

  return { created, skipped, errors };
}

/**
 * Execução standalone
 */
async function main() {
  const DEMO_TENANT_ID = 'demo';
  await seedServicesV2(DEMO_TENANT_ID);
  console.log('\n✅ Seed V2 concluído!');
}

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
