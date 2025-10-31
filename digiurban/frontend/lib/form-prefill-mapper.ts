/**
 * ============================================================================
 * MAPEADOR DE PRÉ-PREENCHIMENTO DE FORMULÁRIOS
 * ============================================================================
 *
 * Sistema inteligente que mapeia automaticamente dados do cidadão para
 * os campos dos formulários de serviços, melhorando a UX ao evitar
 * reentrada de informações já conhecidas.
 *
 * Características:
 * - Mapeamento automático por nome de campo (name, cpf, email, phone)
 * - Suporte a campos aninhados (address.street, address.city)
 * - Type-safe com TypeScript
 * - Extensível para novos tipos de campos
 */

interface CitizenData {
  id: string;
  cpf: string;
  name: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  verificationStatus: 'PENDING' | 'VERIFIED' | 'GOLD' | 'REJECTED';
  createdAt: string;
}

interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

/**
 * Mapeamento de IDs de campos para propriedades do cidadão
 * Suporta múltiplas variações de nomenclatura de campos
 */
const FIELD_MAPPINGS: Record<string, (citizen: CitizenData) => any> = {
  // Nome completo
  'nome': (c) => c.name,
  'name': (c) => c.name,
  'nome_completo': (c) => c.name,
  'full_name': (c) => c.name,
  'nomeCompleto': (c) => c.name,
  'solicitante': (c) => c.name,
  'responsavel': (c) => c.name,
  'requerente': (c) => c.name,

  // CPF
  'cpf': (c) => c.cpf,
  'documento': (c) => c.cpf,
  'cpf_solicitante': (c) => c.cpf,
  'cpf_requerente': (c) => c.cpf,

  // Email
  'email': (c) => c.email,
  'e-mail': (c) => c.email,
  'email_contato': (c) => c.email,
  'email_solicitante': (c) => c.email,

  // Telefone
  'telefone': (c) => c.phone || '',
  'phone': (c) => c.phone || '',
  'celular': (c) => c.phone || '',
  'contato': (c) => c.phone || '',
  'telefone_contato': (c) => c.phone || '',
  'telefone_celular': (c) => c.phone || '',

  // Endereço - Rua
  'rua': (c) => c.address?.street || '',
  'logradouro': (c) => c.address?.street || '',
  'endereco': (c) => c.address?.street || '',
  'street': (c) => c.address?.street || '',
  'endereco_rua': (c) => c.address?.street || '',

  // Endereço - Número
  'numero': (c) => c.address?.number || '',
  'number': (c) => c.address?.number || '',
  'endereco_numero': (c) => c.address?.number || '',

  // Endereço - Complemento
  'complemento': (c) => c.address?.complement || '',
  'complement': (c) => c.address?.complement || '',
  'endereco_complemento': (c) => c.address?.complement || '',

  // Endereço - Bairro
  'bairro': (c) => c.address?.neighborhood || '',
  'neighborhood': (c) => c.address?.neighborhood || '',
  'endereco_bairro': (c) => c.address?.neighborhood || '',

  // Endereço - Cidade
  'cidade': (c) => c.address?.city || '',
  'city': (c) => c.address?.city || '',
  'municipio': (c) => c.address?.city || '',
  'endereco_cidade': (c) => c.address?.city || '',

  // Endereço - Estado
  'estado': (c) => c.address?.state || '',
  'state': (c) => c.address?.state || '',
  'uf': (c) => c.address?.state || '',
  'endereco_estado': (c) => c.address?.state || '',

  // Endereço - CEP
  'cep': (c) => c.address?.zipCode || '',
  'zipCode': (c) => c.address?.zipCode || '',
  'zip_code': (c) => c.address?.zipCode || '',
  'codigo_postal': (c) => c.address?.zipCode || '',
  'endereco_cep': (c) => c.address?.zipCode || '',

  // Endereço completo formatado
  'endereco_completo': (c) => {
    if (!c.address) return '';
    const parts = [
      c.address.street,
      c.address.number,
      c.address.complement,
      c.address.neighborhood,
      c.address.city,
      c.address.state,
      c.address.zipCode
    ].filter(Boolean);
    return parts.join(', ');
  },
};

/**
 * Pré-preenche os dados do formulário com informações do cidadão
 *
 * @param fields - Array de campos do formulário
 * @param citizenData - Dados do cidadão autenticado
 * @returns Objeto com valores pré-preenchidos
 */
export function prefillFormData(
  fields: FormField[],
  citizenData: CitizenData | null
): Record<string, any> {
  if (!citizenData) {
    return initializeEmptyForm(fields);
  }

  const formData: Record<string, any> = {};

  fields.forEach(field => {
    // Normalizar o ID do campo para lowercase e remover acentos
    const normalizedId = normalizeFieldId(field.id);

    // Tentar encontrar um mapeamento correspondente
    const mapper = FIELD_MAPPINGS[normalizedId];

    if (mapper) {
      // Aplicar o mapeamento
      const value = mapper(citizenData);

      // Apenas preencher se houver valor
      if (value !== undefined && value !== null && value !== '') {
        formData[field.id] = value;
      } else {
        formData[field.id] = getDefaultValueForType(field.type);
      }
    } else {
      // Campo sem mapeamento - inicializar vazio
      formData[field.id] = getDefaultValueForType(field.type);
    }
  });

  return formData;
}

/**
 * Inicializa formulário vazio para cidadão não autenticado
 */
function initializeEmptyForm(fields: FormField[]): Record<string, any> {
  const formData: Record<string, any> = {};

  fields.forEach(field => {
    formData[field.id] = getDefaultValueForType(field.type);
  });

  return formData;
}

/**
 * Normaliza ID do campo para facilitar mapeamento
 * Remove acentos, converte para lowercase e remove caracteres especiais
 */
function normalizeFieldId(fieldId: string): string {
  return fieldId
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9_]/g, '_') // Substitui caracteres especiais por _
    .replace(/_+/g, '_') // Remove underscores duplicados
    .replace(/^_|_$/g, ''); // Remove underscores no início e fim
}

/**
 * Retorna valor padrão baseado no tipo do campo
 */
function getDefaultValueForType(type: string): any {
  switch (type) {
    case 'number':
      return 0;
    case 'boolean':
    case 'checkbox':
      return false;
    case 'select':
      return '';
    default:
      return '';
  }
}

/**
 * Verifica quais campos foram pré-preenchidos
 * Útil para feedback visual ao usuário
 */
export function getPrefilledFields(
  fields: FormField[],
  formData: Record<string, any>
): string[] {
  return fields
    .filter(field => {
      const value = formData[field.id];
      return value !== undefined &&
             value !== null &&
             value !== '' &&
             value !== 0 &&
             value !== false;
    })
    .map(field => field.id);
}

/**
 * Gera mensagem de feedback sobre campos pré-preenchidos
 */
export function getPrefilledMessage(prefilledCount: number, totalCount: number): string {
  if (prefilledCount === 0) {
    return 'Preencha todos os campos abaixo';
  }

  if (prefilledCount === totalCount) {
    return '✓ Todos os campos foram pré-preenchidos com seus dados. Revise e confirme.';
  }

  return `✓ ${prefilledCount} de ${totalCount} campos foram pré-preenchidos. Complete os campos restantes.`;
}

/**
 * Valida se os dados pré-preenchidos ainda são válidos
 * Útil para detectar mudanças no perfil do usuário
 */
export function validatePrefilledData(
  formData: Record<string, any>,
  citizenData: CitizenData
): { isValid: boolean; outdatedFields: string[] } {
  const outdatedFields: string[] = [];

  Object.keys(formData).forEach(fieldId => {
    const normalizedId = normalizeFieldId(fieldId);
    const mapper = FIELD_MAPPINGS[normalizedId];

    if (mapper) {
      const currentValue = mapper(citizenData);
      const formValue = formData[fieldId];

      if (currentValue !== formValue && currentValue !== '') {
        outdatedFields.push(fieldId);
      }
    }
  });

  return {
    isValid: outdatedFields.length === 0,
    outdatedFields
  };
}
