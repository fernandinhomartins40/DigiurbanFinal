/**
 * ============================================================================
 * MÓDULOS DE AGRICULTURA - CONFIGURAÇÃO
 * ============================================================================
 */

import { ModuleConfig } from './types';

export const ruralProducersConfig: ModuleConfig = {
  key: 'rural-producers',
  departmentType: 'agriculture',
  entityName: 'RuralProducer',
  displayName: 'Produtores Rurais',
  displayNameSingular: 'Produtor Rural',
  description: 'Cadastro de produtores e agricultores familiares',
  icon: 'Users',
  color: 'amber',

  fields: [
    {
      name: 'name',
      label: 'Nome Completo',
      type: 'text',
      required: true,
      showInList: true,
      showInForm: true,
      showInDetails: true,
      sortable: true,
      filterable: true,
    },
    {
      name: 'document',
      label: 'CPF/CNPJ',
      type: 'text',
      required: true,
      placeholder: '000.000.000-00',
      showInList: true,
      showInForm: true,
      showInDetails: true,
      filterable: true,
    },
    {
      name: 'email',
      label: 'E-mail',
      type: 'email',
      placeholder: 'email@exemplo.com',
      showInList: true,
      showInForm: true,
      showInDetails: true,
    },
    {
      name: 'phone',
      label: 'Telefone',
      type: 'phone',
      placeholder: '(00) 00000-0000',
      showInList: true,
      showInForm: true,
      showInDetails: true,
    },
    {
      name: 'address',
      label: 'Endereço',
      type: 'textarea',
      showInForm: true,
      showInDetails: true,
    },
    {
      name: 'productionType',
      label: 'Tipo de Produção',
      type: 'select',
      options: [
        { value: 'organic', label: 'Orgânica' },
        { value: 'conventional', label: 'Convencional' },
        { value: 'agroecological', label: 'Agroecológica' },
        { value: 'mixed', label: 'Mista' },
      ],
      showInList: true,
      showInForm: true,
      showInDetails: true,
      filterable: true,
    },
    {
      name: 'mainCrop',
      label: 'Cultura Principal',
      type: 'text',
      placeholder: 'Ex: Milho, Feijão, Hortaliças',
      showInList: true,
      showInForm: true,
      showInDetails: true,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'ACTIVE', label: 'Ativo' },
        { value: 'INACTIVE', label: 'Inativo' },
      ],
      showInList: true,
      showInForm: true,
      showInDetails: true,
      filterable: true,
    },
  ],

  stats: [
    {
      key: 'total',
      label: 'Total de Produtores',
      icon: 'Users',
      color: 'blue',
      format: 'number',
    },
    {
      key: 'active',
      label: 'Ativos',
      icon: 'CheckCircle',
      color: 'green',
      format: 'number',
    },
    {
      key: 'inactive',
      label: 'Inativos',
      icon: 'XCircle',
      color: 'red',
      format: 'number',
    },
    {
      key: 'thisMonth',
      label: 'Cadastrados este Mês',
      icon: 'TrendingUp',
      color: 'amber',
      format: 'number',
    },
  ],

  filters: [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'all', label: 'Todos' },
        { value: 'ACTIVE', label: 'Ativos' },
        { value: 'INACTIVE', label: 'Inativos' },
      ],
      defaultValue: 'all',
    },
    {
      key: 'productionType',
      label: 'Tipo de Produção',
      type: 'select',
      options: [
        { value: 'all', label: 'Todos' },
        { value: 'organic', label: 'Orgânica' },
        { value: 'conventional', label: 'Convencional' },
        { value: 'agroecological', label: 'Agroecológica' },
        { value: 'mixed', label: 'Mista' },
      ],
      defaultValue: 'all',
    },
    {
      key: 'search',
      label: 'Buscar',
      type: 'text',
    },
  ],

  apiEndpoint: '/api/admin/secretarias/agricultura/produtores',

  features: {
    hasProtocol: true,
    hasSource: true,
    hasStatus: true,
    exportable: true,
    importable: true,
  },
};

export const ruralPropertiesConfig: ModuleConfig = {
  key: 'rural-properties',
  departmentType: 'agriculture',
  entityName: 'RuralProperty',
  displayName: 'Propriedades Rurais',
  displayNameSingular: 'Propriedade Rural',
  description: 'Cadastro e mapeamento de propriedades rurais',
  icon: 'MapPin',
  color: 'green',

  fields: [
    {
      name: 'name',
      label: 'Nome da Propriedade',
      type: 'text',
      required: true,
      showInList: true,
      showInForm: true,
      showInDetails: true,
      sortable: true,
      filterable: true,
    },
    {
      name: 'producerId',
      label: 'Produtor',
      type: 'select',
      required: true,
      showInList: true,
      showInForm: true,
      showInDetails: true,
      filterable: true,
    },
    {
      name: 'size',
      label: 'Área Total (hectares)',
      type: 'number',
      required: true,
      showInList: true,
      showInForm: true,
      showInDetails: true,
      sortable: true,
    },
    {
      name: 'location',
      label: 'Localização',
      type: 'text',
      required: true,
      showInList: true,
      showInForm: true,
      showInDetails: true,
    },
    {
      name: 'plantedArea',
      label: 'Área Plantada (hectares)',
      type: 'number',
      showInList: true,
      showInForm: true,
      showInDetails: true,
    },
    {
      name: 'mainCrops',
      label: 'Culturas Principais',
      type: 'json',
      showInForm: true,
      showInDetails: true,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'ACTIVE', label: 'Ativa' },
        { value: 'INACTIVE', label: 'Inativa' },
      ],
      showInList: true,
      showInForm: true,
      showInDetails: true,
      filterable: true,
    },
  ],

  stats: [
    {
      key: 'total',
      label: 'Total de Propriedades',
      icon: 'MapPin',
      color: 'blue',
      format: 'number',
    },
    {
      key: 'totalArea',
      label: 'Área Total',
      icon: 'Maximize',
      color: 'green',
      format: 'area',
    },
    {
      key: 'totalPlantedArea',
      label: 'Área Plantada',
      icon: 'Sprout',
      color: 'emerald',
      format: 'area',
    },
    {
      key: 'averageSize',
      label: 'Tamanho Médio',
      icon: 'BarChart',
      color: 'amber',
      format: 'area',
    },
  ],

  filters: [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'all', label: 'Todas' },
        { value: 'ACTIVE', label: 'Ativas' },
        { value: 'INACTIVE', label: 'Inativas' },
      ],
      defaultValue: 'all',
    },
    {
      key: 'search',
      label: 'Buscar',
      type: 'text',
    },
  ],

  apiEndpoint: '/api/admin/secretarias/agricultura/propriedades',

  features: {
    hasStatus: true,
    exportable: true,
    importable: true,
  },
};

export const ruralProgramsConfig: ModuleConfig = {
  key: 'rural-programs',
  departmentType: 'agriculture',
  entityName: 'RuralProgram',
  displayName: 'Programas Rurais',
  displayNameSingular: 'Programa Rural',
  description: 'PRONAF, crédito rural e programas especiais',
  icon: 'FileBarChart',
  color: 'blue',

  fields: [
    {
      name: 'name',
      label: 'Nome do Programa',
      type: 'text',
      required: true,
      showInList: true,
      showInForm: true,
      showInDetails: true,
      sortable: true,
    },
    {
      name: 'programType',
      label: 'Tipo de Programa',
      type: 'select',
      required: true,
      options: [
        { value: 'credit', label: 'Crédito Rural' },
        { value: 'pronaf', label: 'PRONAF' },
        { value: 'subsidy', label: 'Subsídio' },
        { value: 'incentive', label: 'Incentivo' },
        { value: 'other', label: 'Outro' },
      ],
      showInList: true,
      showInForm: true,
      showInDetails: true,
      filterable: true,
    },
    {
      name: 'description',
      label: 'Descrição',
      type: 'textarea',
      required: true,
      showInForm: true,
      showInDetails: true,
    },
    {
      name: 'startDate',
      label: 'Data de Início',
      type: 'date',
      required: true,
      showInList: true,
      showInForm: true,
      showInDetails: true,
      sortable: true,
    },
    {
      name: 'endDate',
      label: 'Data de Término',
      type: 'date',
      showInList: true,
      showInForm: true,
      showInDetails: true,
    },
    {
      name: 'budget',
      label: 'Orçamento',
      type: 'number',
      showInList: true,
      showInForm: true,
      showInDetails: true,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'PLANNED', label: 'Planejado' },
        { value: 'ACTIVE', label: 'Ativo' },
        { value: 'COMPLETED', label: 'Concluído' },
        { value: 'CANCELLED', label: 'Cancelado' },
      ],
      showInList: true,
      showInForm: true,
      showInDetails: true,
      filterable: true,
    },
  ],

  stats: [
    {
      key: 'total',
      label: 'Total de Programas',
      icon: 'FileBarChart',
      color: 'blue',
      format: 'number',
    },
    {
      key: 'active',
      label: 'Ativos',
      icon: 'CheckCircle',
      color: 'green',
      format: 'number',
    },
    {
      key: 'totalBudget',
      label: 'Orçamento Total',
      icon: 'DollarSign',
      color: 'emerald',
      format: 'currency',
    },
  ],

  filters: [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'all', label: 'Todos' },
        { value: 'PLANNED', label: 'Planejados' },
        { value: 'ACTIVE', label: 'Ativos' },
        { value: 'COMPLETED', label: 'Concluídos' },
        { value: 'CANCELLED', label: 'Cancelados' },
      ],
      defaultValue: 'all',
    },
    {
      key: 'programType',
      label: 'Tipo',
      type: 'select',
      options: [
        { value: 'all', label: 'Todos' },
        { value: 'credit', label: 'Crédito Rural' },
        { value: 'pronaf', label: 'PRONAF' },
        { value: 'subsidy', label: 'Subsídio' },
        { value: 'incentive', label: 'Incentivo' },
        { value: 'other', label: 'Outro' },
      ],
      defaultValue: 'all',
    },
  ],

  apiEndpoint: '/api/admin/secretarias/agricultura/programas',

  features: {
    hasStatus: true,
    exportable: true,
  },
};

export const ruralTrainingsConfig: ModuleConfig = {
  key: 'rural-trainings',
  departmentType: 'agriculture',
  entityName: 'RuralTraining',
  displayName: 'Capacitações',
  displayNameSingular: 'Capacitação',
  description: 'Cursos, treinamentos e assistência técnica',
  icon: 'FileText',
  color: 'purple',

  fields: [
    {
      name: 'title',
      label: 'Título',
      type: 'text',
      required: true,
      showInList: true,
      showInForm: true,
      showInDetails: true,
      sortable: true,
    },
    {
      name: 'trainingType',
      label: 'Tipo',
      type: 'select',
      required: true,
      options: [
        { value: 'course', label: 'Curso' },
        { value: 'workshop', label: 'Oficina' },
        { value: 'lecture', label: 'Palestra' },
        { value: 'field_day', label: 'Dia de Campo' },
        { value: 'other', label: 'Outro' },
      ],
      showInList: true,
      showInForm: true,
      showInDetails: true,
      filterable: true,
    },
    {
      name: 'description',
      label: 'Descrição',
      type: 'textarea',
      required: true,
      showInForm: true,
      showInDetails: true,
    },
    {
      name: 'instructor',
      label: 'Instrutor',
      type: 'text',
      required: true,
      showInList: true,
      showInForm: true,
      showInDetails: true,
    },
    {
      name: 'startDate',
      label: 'Data de Início',
      type: 'date',
      required: true,
      showInList: true,
      showInForm: true,
      showInDetails: true,
      sortable: true,
    },
    {
      name: 'duration',
      label: 'Duração (horas)',
      type: 'number',
      required: true,
      showInList: true,
      showInForm: true,
      showInDetails: true,
    },
    {
      name: 'maxParticipants',
      label: 'Vagas',
      type: 'number',
      required: true,
      showInList: true,
      showInForm: true,
      showInDetails: true,
    },
    {
      name: 'location',
      label: 'Local',
      type: 'text',
      required: true,
      showInForm: true,
      showInDetails: true,
    },
  ],

  stats: [
    {
      key: 'total',
      label: 'Total de Capacitações',
      icon: 'FileText',
      color: 'blue',
      format: 'number',
    },
    {
      key: 'upcoming',
      label: 'Próximas',
      icon: 'Calendar',
      color: 'purple',
      format: 'number',
    },
    {
      key: 'totalParticipants',
      label: 'Participantes',
      icon: 'Users',
      color: 'green',
      format: 'number',
    },
  ],

  filters: [
    {
      key: 'trainingType',
      label: 'Tipo',
      type: 'select',
      options: [
        { value: 'all', label: 'Todos' },
        { value: 'course', label: 'Cursos' },
        { value: 'workshop', label: 'Oficinas' },
        { value: 'lecture', label: 'Palestras' },
        { value: 'field_day', label: 'Dia de Campo' },
        { value: 'other', label: 'Outros' },
      ],
      defaultValue: 'all',
    },
  ],

  apiEndpoint: '/api/admin/secretarias/agricultura/capacitacoes',

  features: {
    exportable: true,
  },
};

// Exportar todas as configurações de agricultura
export const agricultureModules = {
  'rural-producers': ruralProducersConfig,
  'rural-properties': ruralPropertiesConfig,
  'rural-programs': ruralProgramsConfig,
  'rural-trainings': ruralTrainingsConfig,
};
