'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, Check, Building2, User, Settings,
  FileCheck, Upload, Globe, Mail, Phone, MapPin
} from 'lucide-react';
import { getFullApiUrl } from '@/lib/api-config';
import { useSuperAdminAuth } from '@/contexts/SuperAdminAuthContext';
import { PasswordStrengthIndicator } from '@/components/ui/password-strength-indicator';
import { useToast } from '@/hooks/use-toast';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';

interface Municipio {
  codigo_ibge?: string;
  nome: string;
  uf: string;
  regiao?: string;
  populacao?: number | null;
  cnpj?: string | null;
  id?: string;
  name?: string;
  domain?: string;
}

interface TenantData {
  // Step 1 - Dados Básicos
  name: string;
  cnpj: string;
  population: number;
  domain: string;
  municipioId?: string;
  codigoIbge?: string;
  nomeMunicipio?: string;
  ufMunicipio?: string;

  // Step 2 - Configuração
  plan: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
  trialDays: number;
  features: string[];

  // Step 3 - Usuário Admin
  adminName: string;
  adminEmail: string;
  adminPassword: string;
  adminPasswordConfirm: string;
  adminPhone: string;

  // Step 4 - Endereço e Contato
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

const PLANS = [
  {
    id: 'STARTER',
    name: 'Starter',
    price: 2500,
    description: 'Ideal para municípios pequenos',
    features: ['Até 10 usuários', 'Protocolos ilimitados', 'Suporte por email', '5GB armazenamento']
  },
  {
    id: 'PROFESSIONAL',
    name: 'Professional',
    price: 5000,
    description: 'Para municípios médios',
    features: ['Até 50 usuários', 'Protocolos ilimitados', 'Suporte prioritário', '50GB armazenamento', 'API access']
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    price: 10000,
    description: 'Para grandes municípios',
    features: ['Usuários ilimitados', 'Protocolos ilimitados', 'Suporte 24/7', '500GB armazenamento', 'API access', 'White label']
  }
];

const BRAZIL_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export default function CreateTenantPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const { apiRequest } = useSuperAdminAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TenantData>({
    name: '',
    cnpj: '',
    population: 0,
    domain: '',
    plan: 'STARTER',
    trialDays: 30,
    features: [],
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    adminPasswordConfirm: '',
    adminPhone: '',
    address: '',
    city: '',
    state: 'SP',
    zipCode: ''
  });

  // Estados para seleção de município
  const [municipioSearch, setMunicipioSearch] = useState('');
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [showMunicipioDropdown, setShowMunicipioDropdown] = useState(false);
  const [selectedMunicipio, setSelectedMunicipio] = useState<Municipio | null>(null);
  const [loadingMunicipios, setLoadingMunicipios] = useState(false);
  const municipioRef = useRef<HTMLDivElement>(null);

  const totalSteps = 4;

  // Buscar municípios com debounce
  useEffect(() => {
    const searchMunicipios = async () => {
      if (municipioSearch.length < 2) {
        setMunicipios([]);
        return;
      }

      setLoadingMunicipios(true);
      try {
        const response = await fetch(
          getFullApiUrl(`/public/municipios-brasil?search=${encodeURIComponent(municipioSearch)}`)
        );
        const data = await response.json();

        if (data.success) {
          setMunicipios(data.data.municipios || []);
        }
      } catch (error) {
        console.error('Erro ao buscar municípios:', error);
      } finally {
        setLoadingMunicipios(false);
      }
    };

    const debounce = setTimeout(searchMunicipios, 300);
    return () => clearTimeout(debounce);
  }, [municipioSearch]);

  // Detectar clique fora do dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (municipioRef.current && !municipioRef.current.contains(event.target as Node)) {
        setShowMunicipioDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateField = (field: keyof TenantData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectMunicipio = (municipio: Municipio) => {
    setSelectedMunicipio(municipio);
    setMunicipioSearch(`${municipio.nome} - ${municipio.uf}`);
    setShowMunicipioDropdown(false);

    // Atualizar formData com os dados do município
    if (municipio.codigo_ibge) {
      updateField('codigoIbge', municipio.codigo_ibge);
      updateField('nomeMunicipio', municipio.nome);
      updateField('ufMunicipio', municipio.uf);
      updateField('municipioId', undefined);
    } else if (municipio.id) {
      updateField('municipioId', municipio.id);
      updateField('codigoIbge', undefined);
      updateField('nomeMunicipio', undefined);
      updateField('ufMunicipio', undefined);
    }

    // Auto-preencher nome do tenant se estiver vazio
    if (!formData.name) {
      updateField('name', `Prefeitura de ${municipio.nome}`);
    }

    // Auto-preencher população se disponível
    if (municipio.populacao) {
      updateField('population', municipio.populacao);
    }

    // Auto-preencher CNPJ se disponível
    if ((municipio as any).cnpj) {
      updateField('cnpj', (municipio as any).cnpj);
    }

    // Auto-preencher cidade e estado
    updateField('city', municipio.nome);
    updateField('state', municipio.uf);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.name &&
          formData.cnpj.length >= 14 &&
          formData.population > 0 &&
          selectedMunicipio // Município é obrigatório
        );
      case 2:
        return !!formData.plan;
      case 3:
        // Validação de senha forte
        const passwordRequirements = [
          formData.adminPassword.length >= 8,
          /[A-Z]/.test(formData.adminPassword),
          /[a-z]/.test(formData.adminPassword),
          /\d/.test(formData.adminPassword),
          /[!@#$%^&*(),.?":{}|<>]/.test(formData.adminPassword),
        ];
        const passwordValid = passwordRequirements.every(req => req);
        const passwordsMatch = formData.adminPassword === formData.adminPasswordConfirm;

        return !!(formData.adminName && formData.adminEmail && passwordValid && passwordsMatch);
      case 4:
        return true; // Opcional
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos obrigatórios antes de continuar.',
        variant: 'destructive',
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18);
  };

  const formatZipCode = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      toast({
        title: 'Revisão necessária',
        description: 'Por favor, revise os dados antes de criar o tenant.',
        variant: 'destructive',
      });
      return;
    }

    const confirmed = await confirm({
      title: 'Criar novo tenant',
      description: `Deseja criar o tenant "${formData.name}"? As credenciais serão enviadas para ${formData.adminEmail}.`,
      confirmText: 'Criar tenant',
    });

    if (!confirmed) return;

    setLoading(true);

    try {
      const payload: any = {
        name: formData.name,
        cnpj: formData.cnpj,
        population: formData.population,
        domain: formData.domain,
        plan: formData.plan
      };

      // Adicionar dados do município
      if (formData.codigoIbge) {
        payload.codigoIbge = formData.codigoIbge;
        payload.nomeMunicipio = formData.nomeMunicipio;
        payload.ufMunicipio = formData.ufMunicipio;
      }

      // Adicionar admin user (senha agora é obrigatória e validada)
      if (formData.adminName && formData.adminEmail) {
        payload.adminUser = {
          name: formData.adminName,
          email: formData.adminEmail,
          password: formData.adminPassword
        };
      }

      const result = await apiRequest('/super-admin/tenants', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      toast({
        title: 'Tenant criado com sucesso',
        description: `O tenant "${formData.name}" foi criado. Credenciais enviadas para: ${formData.adminEmail}`,
      });
      router.push(`/super-admin/dashboard/tenant/${result.tenant.id}`);
    } catch (error) {
      toast({
        title: 'Erro ao criar tenant',
        description: 'Ocorreu um erro ao criar o tenant. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/super-admin/tenants"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Criar Novo Tenant</h1>
          <p className="text-gray-600">Cadastre um novo município na plataforma</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                  step < currentStep ? 'bg-green-500 text-white' :
                  step === currentStep ? 'bg-blue-600 text-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {step < currentStep ? <Check size={20} /> : step}
                </div>
                <div className="text-xs mt-2 text-center font-medium">
                  {step === 1 && 'Dados Básicos'}
                  {step === 2 && 'Configuração'}
                  {step === 3 && 'Usuário Admin'}
                  {step === 4 && 'Revisão'}
                </div>
              </div>
              {step < 4 && (
                <div className={`h-1 flex-1 transition-colors ${
                  step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1 - Dados Básicos */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <Building2 className="text-blue-600" size={24} />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Dados Básicos do Município</h2>
                <p className="text-sm text-gray-600">Informações principais do tenant</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campo de Seleção de Município */}
              <div className="md:col-span-2" ref={municipioRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Município *
                </label>
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <MapPin size={20} className="absolute left-3 text-gray-400" />
                    <input
                      type="text"
                      value={municipioSearch}
                      onChange={(e) => {
                        setMunicipioSearch(e.target.value);
                        setShowMunicipioDropdown(true);
                      }}
                      onFocus={() => municipioSearch.length >= 2 && setShowMunicipioDropdown(true)}
                      placeholder="Digite o nome do município..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Dropdown de Municípios */}
                  {showMunicipioDropdown && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {loadingMunicipios ? (
                        <div className="p-4 text-center text-gray-500">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                          <p className="mt-2 text-sm">Buscando municípios...</p>
                        </div>
                      ) : municipios.length > 0 ? (
                        <ul>
                          {municipios.map((municipio, index) => (
                            <li
                              key={municipio.codigo_ibge || municipio.id || index}
                              onClick={() => handleSelectMunicipio(municipio)}
                              className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">{municipio.nome}</p>
                                  <p className="text-sm text-gray-500">
                                    {municipio.uf} - {municipio.regiao}
                                    {municipio.populacao && (
                                      <span className="ml-2 text-blue-600">
                                        • {municipio.populacao.toLocaleString('pt-BR')} hab.
                                      </span>
                                    )}
                                  </p>
                                  {municipio.cnpj && (
                                    <p className="text-xs text-gray-400 mt-1">
                                      CNPJ: {municipio.cnpj}
                                    </p>
                                  )}
                                </div>
                                <span className="text-xs text-gray-400 ml-2">
                                  {municipio.codigo_ibge}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : municipioSearch.length >= 2 ? (
                        <div className="p-4 text-center text-gray-500">
                          <p className="text-sm">Nenhum município encontrado</p>
                          <p className="text-xs mt-1">Tente buscar por outro nome</p>
                        </div>
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          <p className="text-sm">Digite pelo menos 2 caracteres para buscar</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {selectedMunicipio && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-green-600" />
                        <span className="text-sm font-medium text-green-900">
                          {selectedMunicipio.nome} - {selectedMunicipio.uf}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedMunicipio(null);
                          setMunicipioSearch('');
                          updateField('codigoIbge', undefined);
                          updateField('nomeMunicipio', undefined);
                          updateField('ufMunicipio', undefined);
                          updateField('municipioId', undefined);
                        }}
                        className="text-xs text-green-700 hover:text-green-900 underline"
                      >
                        Alterar
                      </button>
                    </div>
                    <div className="space-y-1 text-xs text-green-700">
                      <p>Código IBGE: {selectedMunicipio.codigo_ibge}</p>
                      {selectedMunicipio.populacao && (
                        <p>População: {selectedMunicipio.populacao.toLocaleString('pt-BR')} habitantes</p>
                      )}
                      {selectedMunicipio.cnpj && (
                        <p>CNPJ: {selectedMunicipio.cnpj}</p>
                      )}
                    </div>
                    {(selectedMunicipio.populacao || selectedMunicipio.cnpj) && (
                      <p className="text-xs text-green-600 mt-2 font-medium">
                        ✓ Dados serão preenchidos automaticamente
                      </p>
                    )}
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-1">
                  O tenant será vinculado ao município selecionado
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Tenant *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Ex: Prefeitura de São Paulo"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Será preenchido automaticamente ao selecionar o município
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CNPJ *
                </label>
                <input
                  type="text"
                  value={formData.cnpj}
                  onChange={(e) => updateField('cnpj', formatCNPJ(e.target.value))}
                  placeholder="00.000.000/0000-00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  População *
                </label>
                <input
                  type="number"
                  value={formData.population || ''}
                  onChange={(e) => updateField('population', parseInt(e.target.value) || 0)}
                  placeholder="Ex: 12000000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Domínio Personalizado (opcional)
                </label>
                <div className="flex items-center gap-2">
                  <Globe size={20} className="text-gray-400" />
                  <input
                    type="text"
                    value={formData.domain}
                    onChange={(e) => updateField('domain', e.target.value)}
                    placeholder="saopaulo.digiurban.com.br"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Se não informado, será gerado automaticamente
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 - Configuração */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <Settings className="text-blue-600" size={24} />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Configuração do Plano</h2>
                <p className="text-sm text-gray-600">Escolha o plano e período de trial</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PLANS.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => updateField('plan', plan.id)}
                  className={`p-6 border-2 rounded-lg text-left transition-all ${
                    formData.plan === plan.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                    {formData.plan === plan.id && (
                      <Check className="text-blue-600" size={20} />
                    )}
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    R$ {plan.price.toLocaleString('pt-BR')}
                    <span className="text-sm font-normal text-gray-500">/mês</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="text-xs text-gray-600 flex items-center gap-2">
                        <Check size={14} className="text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período de Trial (dias)
              </label>
              <select
                value={formData.trialDays}
                onChange={(e) => updateField('trialDays', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Sem trial (pagamento imediato)</option>
                <option value={7}>7 dias</option>
                <option value={15}>15 dias</option>
                <option value={30}>30 dias</option>
                <option value={60}>60 dias</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 3 - Usuário Admin */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <User className="text-blue-600" size={24} />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Usuário Administrador</h2>
                <p className="text-sm text-gray-600">Dados do gestor principal do município</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={formData.adminName}
                  onChange={(e) => updateField('adminName', e.target.value)}
                  placeholder="Ex: João Silva"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <div className="flex items-center gap-2">
                  <Mail size={20} className="text-gray-400" />
                  <input
                    type="email"
                    value={formData.adminEmail}
                    onChange={(e) => updateField('adminEmail', e.target.value)}
                    placeholder="joao@prefeitura.gov.br"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <div className="flex items-center gap-2">
                  <Phone size={20} className="text-gray-400" />
                  <input
                    type="tel"
                    value={formData.adminPhone}
                    onChange={(e) => updateField('adminPhone', e.target.value)}
                    placeholder="(11) 98888-8888"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Senha *
                  </label>
                  <input
                    type="password"
                    value={formData.adminPassword}
                    onChange={(e) => updateField('adminPassword', e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Senha *
                  </label>
                  <input
                    type="password"
                    value={formData.adminPasswordConfirm}
                    onChange={(e) => updateField('adminPasswordConfirm', e.target.value)}
                    placeholder="Digite a senha novamente"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Indicador de força de senha */}
                {formData.adminPassword && (
                  <PasswordStrengthIndicator
                    password={formData.adminPassword}
                    confirmPassword={formData.adminPasswordConfirm}
                    showConfirmation={true}
                  />
                )}

                <p className="text-xs text-gray-500">
                  O usuário será solicitado a trocar a senha no primeiro acesso
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">📧 Credenciais de Acesso</h4>
              <p className="text-sm text-blue-700">
                Um email será enviado automaticamente para <strong>{formData.adminEmail || 'o email informado'}</strong> com:
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• Link de acesso ao sistema</li>
                <li>• Credenciais temporárias</li>
                <li>• Guia de primeiros passos</li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 4 - Revisão */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <FileCheck className="text-blue-600" size={24} />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Revisão e Confirmação</h2>
                <p className="text-sm text-gray-600">Verifique os dados antes de criar</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Dados do Município</h3>
                <dl className="space-y-2 text-sm">
                  {selectedMunicipio && (
                    <div className="flex justify-between pb-2 mb-2 border-b border-gray-200">
                      <dt className="text-gray-600">Município:</dt>
                      <dd className="font-medium text-blue-600">
                        {selectedMunicipio.nome} - {selectedMunicipio.uf}
                      </dd>
                    </div>
                  )}
                  {selectedMunicipio?.codigo_ibge && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Código IBGE:</dt>
                      <dd className="font-medium text-gray-900">{selectedMunicipio.codigo_ibge}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Nome Tenant:</dt>
                    <dd className="font-medium text-gray-900">{formData.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">CNPJ:</dt>
                    <dd className="font-medium text-gray-900">{formData.cnpj}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">População:</dt>
                    <dd className="font-medium text-gray-900">{formData.population.toLocaleString('pt-BR')}</dd>
                  </div>
                  {formData.domain && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Domínio:</dt>
                      <dd className="font-medium text-gray-900">{formData.domain}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Configuração</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Plano:</dt>
                    <dd className="font-medium text-gray-900">{formData.plan}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Período Trial:</dt>
                    <dd className="font-medium text-gray-900">{formData.trialDays} dias</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Valor Mensal:</dt>
                    <dd className="font-medium text-green-600">
                      R$ {PLANS.find(p => p.id === formData.plan)?.price.toLocaleString('pt-BR')}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                <h3 className="font-semibold text-gray-900 mb-3">Administrador</h3>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Nome:</dt>
                    <dd className="font-medium text-gray-900">{formData.adminName}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Email:</dt>
                    <dd className="font-medium text-gray-900">{formData.adminEmail}</dd>
                  </div>
                  {formData.adminPhone && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Telefone:</dt>
                      <dd className="font-medium text-gray-900">{formData.adminPhone}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Atenção</h4>
              <p className="text-sm text-yellow-700">
                Ao confirmar, o tenant será criado e as credenciais serão enviadas por email.
                Certifique-se de que todos os dados estão corretos.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ArrowLeft size={20} />
            Voltar
          </button>

          {currentStep < totalSteps ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Próximo
              <ArrowRight size={20} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Criando...
                </>
              ) : (
                <>
                  <Check size={20} />
                  Criar Tenant
                </>
              )}
            </button>
          )}
        </div>
      </div>
      <ConfirmDialog />
    </div>
  );
}
