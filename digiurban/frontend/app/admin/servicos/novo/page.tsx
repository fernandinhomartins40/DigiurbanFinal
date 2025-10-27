'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { useToast } from '@/hooks/use-toast'
import { ServiceFormWizard, WizardStep } from '@/components/admin/services/ServiceFormWizard'
import { BasicInfoStep } from '@/components/admin/services/steps/BasicInfoStep'
import { DocumentsStep } from '@/components/admin/services/steps/DocumentsStep'
import { FeaturesStep } from '@/components/admin/services/steps/FeaturesStep'
import { AdvancedConfigStep } from '@/components/admin/services/steps/AdvancedConfigStep'
import {
  FileText,
  Settings,
  Sparkles,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Department {
  id: string
  name: string
  code?: string
}

interface ServiceFormData {
  // Básico
  name: string
  description: string
  category: string
  departmentId: string
  estimatedDays: string
  priority: number
  icon: string
  color: string

  // Documentos
  requiresDocuments: boolean
  requiredDocuments: string[]

  // Feature Flags
  hasCustomForm: boolean
  hasLocation: boolean
  hasScheduling: boolean
  hasSurvey: boolean
  hasCustomWorkflow: boolean
  hasCustomFields: boolean
  hasAdvancedDocs: boolean
  hasNotifications: boolean

  // Configurações dos Recursos
  customFormConfig?: any
  locationConfig?: any
  schedulingConfig?: any
  surveyConfig?: any
  workflowConfig?: any
  customFieldsConfig?: any
  advancedDocsConfig?: any
  notificationsConfig?: any
}

export default function NewServicePage() {
  const router = useRouter()
  const { apiRequest } = useAdminAuth()
  const { toast } = useToast()

  const [currentStep, setCurrentStep] = useState(0)
  const [departments, setDepartments] = useState<Department[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    description: '',
    category: '',
    departmentId: '',
    estimatedDays: '',
    priority: 3,
    icon: '',
    color: '#3b82f6',
    requiresDocuments: false,
    requiredDocuments: [],
    hasCustomForm: false,
    hasLocation: false,
    hasScheduling: false,
    hasSurvey: false,
    hasCustomWorkflow: false,
    hasCustomFields: false,
    hasAdvancedDocs: false,
    hasNotifications: false,
  })

  const validateBasicStep = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }

    if (!formData.departmentId) {
      newErrors.departmentId = 'Departamento é obrigatório'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const steps: WizardStep[] = [
    {
      id: 'basic',
      title: 'Informações',
      description: 'Dados básicos do serviço',
      icon: <FileText className="h-5 w-5" />,
      isValid: () => {
        return formData.name.trim() !== '' && formData.departmentId !== ''
      },
    },
    {
      id: 'documents',
      title: 'Documentos',
      description: 'Documentação necessária',
      icon: <FileText className="h-5 w-5" />,
      isOptional: true,
    },
    {
      id: 'features',
      title: 'Recursos',
      description: 'Funcionalidades avançadas',
      icon: <Sparkles className="h-5 w-5" />,
      isOptional: true,
    },
    {
      id: 'advanced',
      title: 'Revisão',
      description: 'Revisar e finalizar',
      icon: <CheckCircle className="h-5 w-5" />,
    },
  ]

  // Carregar departamentos
  const loadDepartments = async () => {
    try {
      const response = await apiRequest('/api/admin/management/departments')
      setDepartments(response.departments || response.data?.departments || [])
    } catch (error) {
      console.error('Erro ao carregar departamentos:', error)
      toast({
        title: 'Erro ao carregar departamentos',
        description: 'Não foi possível carregar a lista de departamentos.',
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    loadDepartments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Limpar erro do campo se existir
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleStepChange = (step: number) => {
    // Validar step atual antes de avançar
    if (step > currentStep) {
      // Validar step básico
      if (currentStep === 0 && !validateBasicStep()) {
        toast({
          title: 'Campos obrigatórios',
          description: 'Preencha todos os campos obrigatórios antes de continuar.',
          variant: 'destructive',
        })
        return
      }
    }

    setCurrentStep(step)
  }

  const handleSubmit = async () => {
    // Validação final
    if (!formData.name || !formData.departmentId) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Nome e departamento são obrigatórios.',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await apiRequest('/api/services', {
        method: 'POST',
        body: JSON.stringify({
          // Básico
          name: formData.name,
          description: formData.description || null,
          category: formData.category || null,
          departmentId: formData.departmentId,
          requiresDocuments: formData.requiresDocuments,
          requiredDocuments: formData.requiredDocuments.length > 0 ? formData.requiredDocuments : null,
          estimatedDays: formData.estimatedDays ? parseInt(formData.estimatedDays) : null,
          priority: formData.priority,
          icon: formData.icon || null,
          color: formData.color || null,

          // Feature Flags
          hasCustomForm: formData.hasCustomForm,
          hasLocation: formData.hasLocation,
          hasScheduling: formData.hasScheduling,
          hasSurvey: formData.hasSurvey,
          hasCustomWorkflow: formData.hasCustomWorkflow,
          hasCustomFields: formData.hasCustomFields,
          hasAdvancedDocs: formData.hasAdvancedDocs,
          hasNotifications: formData.hasNotifications,
        }),
      })

      toast({
        title: 'Serviço criado com sucesso!',
        description: 'O serviço foi criado. Configure agora os recursos ativados.',
      })

      // Redirecionar para edição se houver recursos ativos
      const hasActiveFeatures = Object.entries(formData)
        .filter(([key]) => key.startsWith('has'))
        .some(([, value]) => value === true)

      if (hasActiveFeatures && response.service?.id) {
        router.push(`/admin/servicos/${response.service.id}/editar`)
      } else {
        router.push('/admin/servicos')
      }
    } catch (error: any) {
      console.error('Erro ao criar serviço:', error)
      toast({
        title: 'Erro ao criar serviço',
        description: error?.message || 'Ocorreu um erro ao criar o serviço.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const canGoNext = () => {
    const currentStepData = steps[currentStep]
    if (currentStepData.isValid) {
      return currentStepData.isValid()
    }
    return true
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Link href="/admin/servicos">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Criar Novo Serviço</h1>
          <p className="text-gray-600 mt-1">
            Configure todas as informações e recursos do serviço em um único lugar
          </p>
        </div>
      </div>

      {/* Wizard */}
      <ServiceFormWizard
        steps={steps}
        currentStep={currentStep}
        onStepChange={handleStepChange}
        onSubmit={handleSubmit}
        onCancel={() => router.push('/admin/servicos')}
        isSubmitting={isSubmitting}
        canGoNext={canGoNext()}
      >
        {/* Step 1: Informações Básicas */}
        <BasicInfoStep
          formData={formData}
          departments={departments}
          onChange={handleFieldChange}
          errors={errors}
        />

        {/* Step 2: Documentos */}
        <DocumentsStep
          formData={formData}
          onChange={handleFieldChange}
        />

        {/* Step 3: Recursos */}
        <FeaturesStep
          formData={formData}
          onChange={handleFieldChange}
        />

        {/* Step 4: Configurações Avançadas */}
        <AdvancedConfigStep
          formData={formData}
          onChange={handleFieldChange}
        />
      </ServiceFormWizard>
    </div>
  )
}
