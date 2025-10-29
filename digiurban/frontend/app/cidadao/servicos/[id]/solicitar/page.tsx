'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { CitizenLayout } from '@/components/citizen/CitizenLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Send, Loader2, CheckCircle, FileText, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Service {
  id: string;
  name: string;
  description: string | null;
  estimatedDays: number | null;
  department: {
    name: string;
  };
  serviceType: 'INFORMATIVO' | 'COM_DADOS';
  moduleType?: string;
  formSchema?: {
    type: string;
    fields: Array<{
      id: string;
      type: string;
      label: string;
      placeholder?: string;
      required: boolean;
      options?: string[];
    }>;
    properties?: any;
  };
}

export default function SolicitarServicoPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [description, setDescription] = useState('');
  const [customFormData, setCustomFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    loadService();
  }, [serviceId]);

  const loadService = async () => {
    try {
      const tenantId = window.location.hostname.split('.')[0];
      const token = localStorage.getItem('citizenToken');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/citizen/services/${serviceId}`,
        {
          headers: {
            'X-Tenant-ID': tenantId,
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao carregar serviço');
      }

      const data = await response.json();
      setService(data.service);

      // Inicializar campos do formulário customizado (nova estrutura)
      if (data.service.formSchema?.fields) {
        const initialData: Record<string, any> = {};
        data.service.formSchema.fields.forEach((field: any) => {
          initialData[field.id] = '';
        });
        setCustomFormData(initialData);
      }
    } catch (error) {
      console.error('Erro ao carregar serviço:', error);
      toast.error('Erro ao carregar serviço');
      router.push('/cidadao/servicos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      toast.error('Por favor, descreva sua solicitação');
      return;
    }

    // Validar campos obrigatórios do formulário customizado (nova estrutura)
    if (service?.formSchema?.fields) {
      for (const field of service.formSchema.fields) {
        if (field.required && !customFormData[field.id]) {
          toast.error(`O campo "${field.label}" é obrigatório`);
          return;
        }
      }
    }

    setSubmitting(true);

    try {
      const tenantId = window.location.hostname.split('.')[0];
      const token = localStorage.getItem('citizenToken');

      const payload = {
        description,
        customFormData: service?.serviceType === 'COM_DADOS' ? customFormData : undefined,
        priority: 3,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/citizen/services/${serviceId}/request`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Tenant-ID': tenantId,
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar solicitação');
      }

      toast.success('Solicitação enviada com sucesso!', {
        description: `Protocolo ${data.protocol.number} gerado`,
      });

      router.push('/cidadao/protocolos');
    } catch (error) {
      console.error('Erro ao solicitar serviço:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Erro ao enviar solicitação. Tente novamente.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <CitizenLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Carregando serviço...</span>
        </div>
      </CitizenLayout>
    );
  }

  if (!service) {
    return (
      <CitizenLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Serviço não encontrado</p>
          <Button className="mt-4" onClick={() => router.push('/cidadao/servicos')}>
            Voltar para serviços
          </Button>
        </div>
      </CitizenLayout>
    );
  }

  return (
    <CitizenLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-4"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Solicitar Serviço</h1>
          <p className="text-gray-600 mt-1">Preencha os dados para solicitar este serviço</p>
        </div>

        {/* Informações do Serviço */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl">{service.name}</CardTitle>
                <CardDescription className="mt-1">
                  {service.department.name}
                </CardDescription>
                {service.description && (
                  <p className="text-sm text-gray-600 mt-2">{service.description}</p>
                )}
                {service.estimatedDays && (
                  <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>Prazo estimado: {service.estimatedDays} dias</span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Formulário de Solicitação */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Dados da Solicitação</CardTitle>
              <CardDescription>
                Forneça os detalhes da sua solicitação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Descrição do Problema */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Descrição do Problema *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Descreva detalhadamente sua solicitação..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={5}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500">
                  Seja o mais específico possível para agilizar o atendimento
                </p>
              </div>

              {/* Campos do Formulário Customizado (nova estrutura) */}
              {service.serviceType === 'COM_DADOS' && service.formSchema?.fields && (
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-medium text-gray-900">Informações Específicas</h3>
                  {service.formSchema.fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={field.id}>
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>

                      {field.type === 'text' && (
                        <input
                          id={field.id}
                          type="text"
                          required={field.required}
                          value={customFormData[field.id] || ''}
                          onChange={(e) =>
                            setCustomFormData({
                              ...customFormData,
                              [field.id]: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      )}

                      {field.type === 'number' && (
                        <input
                          id={field.id}
                          type="number"
                          required={field.required}
                          value={customFormData[field.id] || ''}
                          onChange={(e) =>
                            setCustomFormData({
                              ...customFormData,
                              [field.id]: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      )}

                      {field.type === 'select' && field.options && (
                        <select
                          id={field.id}
                          required={field.required}
                          value={customFormData[field.id] || ''}
                          onChange={(e) =>
                            setCustomFormData({
                              ...customFormData,
                              [field.id]: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Selecione...</option>
                          {field.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      )}

                      {field.type === 'textarea' && (
                        <Textarea
                          id={field.id}
                          required={field.required}
                          value={customFormData[field.id] || ''}
                          onChange={(e) =>
                            setCustomFormData({
                              ...customFormData,
                              [field.id]: e.target.value,
                            })
                          }
                          rows={3}
                          className="resize-none"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Botões de Ação */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={submitting}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Solicitação
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>

        {/* Avisos */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Após enviar sua solicitação:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Você receberá um número de protocolo</li>
                  <li>Poderá acompanhar o andamento na página de protocolos</li>
                  <li>Será notificado sobre atualizações</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CitizenLayout>
  );
}
