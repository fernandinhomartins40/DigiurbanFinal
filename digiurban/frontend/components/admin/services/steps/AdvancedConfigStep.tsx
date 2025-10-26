'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Info, Settings } from 'lucide-react'

interface AdvancedConfigStepProps {
  formData: {
    hasCustomForm: boolean
    hasLocation: boolean
    hasScheduling: boolean
    hasSurvey: boolean
    hasCustomWorkflow: boolean
    hasCustomFields: boolean
    hasAdvancedDocs: boolean
    hasNotifications: boolean
  }
}

export function AdvancedConfigStep({ formData }: AdvancedConfigStepProps) {
  const activeFeatures = Object.entries(formData).filter(([key, value]) => key.startsWith('has') && value)

  const featureNames: Record<string, string> = {
    hasCustomForm: 'Formulário Customizado',
    hasLocation: 'Captura de Localização',
    hasScheduling: 'Sistema de Agendamento',
    hasSurvey: 'Pesquisa de Satisfação',
    hasCustomWorkflow: 'Workflow Customizado',
    hasCustomFields: 'Campos Personalizados',
    hasAdvancedDocs: 'Documentos Inteligentes',
    hasNotifications: 'Sistema de Notificações',
  }

  if (activeFeatures.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-900">Configurações Avançadas</p>
            <p className="text-xs text-blue-700 mt-1">
              Configure detalhadamente os recursos ativados para este serviço.
            </p>
          </div>
        </div>

        <div className="p-12 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600 font-medium">Nenhum recurso para configurar</p>
          <p className="text-xs text-gray-500 mt-2">
            Volte à etapa anterior e ative alguns recursos para poder configurá-los aqui.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <Settings className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-purple-900">Configurações Detalhadas</p>
          <p className="text-xs text-purple-700 mt-1">
            Configure os {activeFeatures.length} recurso{activeFeatures.length > 1 ? 's' : ''} ativado{activeFeatures.length > 1 ? 's' : ''}.
            Estas configurações podem ser editadas posteriormente na página de edição do serviço.
          </p>
        </div>
        <Badge className="bg-purple-600 text-white">
          {activeFeatures.length} recurso{activeFeatures.length > 1 ? 's' : ''}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recursos Ativados</CardTitle>
          <CardDescription>
            Configuração avançada disponível após a criação do serviço
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeFeatures.map(([key]) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{featureNames[key]}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Configure detalhadamente na página de edição
                  </p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                  Ativo
                </Badge>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-blue-900">
                  Configuração Pós-Criação
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Para simplificar o processo de criação, as configurações detalhadas de cada recurso
                  (formulários, workflows, notificações, etc.) estão disponíveis na página de edição
                  do serviço. Após criar o serviço, você será direcionado para configurar cada recurso
                  individualmente.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="text-base text-amber-900">Próximos Passos</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 text-sm text-amber-800">
            <li className="flex items-start gap-2">
              <span className="font-semibold">1.</span>
              <span>Clique em "Criar Serviço" para salvar as informações básicas</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold">2.</span>
              <span>Você será redirecionado para a página de edição do serviço</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold">3.</span>
              <span>Configure detalhadamente cada recurso ativado</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold">4.</span>
              <span>Ative o serviço quando tudo estiver configurado</span>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
