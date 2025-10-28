'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, FileText } from 'lucide-react';
import { AgricultureService } from '@/hooks/api/agriculture/useAgricultureServices';

interface NewProtocolModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  services: AgricultureService[];
  onSuccess?: () => void;
}

export function NewProtocolModal({
  open,
  onOpenChange,
  services,
  onSuccess,
}: NewProtocolModalProps) {
  const [selectedService, setSelectedService] = useState<string>('');
  const [formData, setFormData] = useState<Record<string, any>>({
    citizenName: '',
    citizenCpf: '',
    citizenEmail: '',
    citizenPhone: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const selectedServiceData = services.find((s) => s.id === selectedService);

  useEffect(() => {
    if (!open) {
      setSelectedService('');
      setFormData({
        citizenName: '',
        citizenCpf: '',
        citizenEmail: '',
        citizenPhone: '',
        description: '',
      });
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedService) {
      toast({
        title: 'Erro',
        description: 'Selecione um serviço',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // TODO: Implementar chamada à API para criar protocolo
      // const response = await api.post('/admin/protocols', {
      //   serviceId: selectedService,
      //   ...formData,
      // });

      toast({
        title: 'Protocolo Criado',
        description: 'O protocolo foi criado com sucesso',
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Erro ao criar protocolo',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Novo Protocolo - Agricultura
          </DialogTitle>
          <DialogDescription>
            Crie um novo protocolo para a Secretaria de Agricultura
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Seleção de Serviço */}
          <div className="space-y-2">
            <Label htmlFor="service">Serviço *</Label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um serviço" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    <div className="flex items-center gap-2">
                      <span>{service.name}</span>
                      {service.moduleType && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                          Motor
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedServiceData && (
              <p className="text-sm text-muted-foreground">
                {selectedServiceData.description}
              </p>
            )}
          </div>

          {/* Dados do Cidadão */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="citizenName">Nome do Cidadão *</Label>
              <Input
                id="citizenName"
                value={formData.citizenName}
                onChange={(e) =>
                  setFormData({ ...formData, citizenName: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="citizenCpf">CPF *</Label>
              <Input
                id="citizenCpf"
                value={formData.citizenCpf}
                onChange={(e) =>
                  setFormData({ ...formData, citizenCpf: e.target.value })
                }
                placeholder="000.000.000-00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="citizenEmail">E-mail</Label>
              <Input
                id="citizenEmail"
                type="email"
                value={formData.citizenEmail}
                onChange={(e) =>
                  setFormData({ ...formData, citizenEmail: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="citizenPhone">Telefone *</Label>
              <Input
                id="citizenPhone"
                value={formData.citizenPhone}
                onChange={(e) =>
                  setFormData({ ...formData, citizenPhone: e.target.value })
                }
                placeholder="(00) 00000-0000"
                required
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição da Solicitação *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              placeholder="Descreva os detalhes da solicitação..."
              required
            />
          </div>

          {selectedServiceData?.requiresDocuments && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm font-medium text-yellow-800 mb-2">
                📎 Documentos Necessários:
              </p>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• RG e CPF</li>
                <li>• Comprovante de residência</li>
                <li>• Documentação específica do serviço</li>
              </ul>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Protocolo'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
