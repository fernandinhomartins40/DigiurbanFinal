'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Plus, X, Info } from 'lucide-react'

interface DocumentsStepProps {
  formData: {
    requiresDocuments: boolean
    requiredDocuments: string[]
  }
  onChange: (field: string, value: any) => void
}

export function DocumentsStep({ formData, onChange }: DocumentsStepProps) {
  const [documentInput, setDocumentInput] = useState('')

  const addDocument = () => {
    if (documentInput.trim()) {
      onChange('requiredDocuments', [...formData.requiredDocuments, documentInput.trim()])
      setDocumentInput('')
    }
  }

  const removeDocument = (index: number) => {
    onChange(
      'requiredDocuments',
      formData.requiredDocuments.filter((_, i) => i !== index)
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addDocument()
    }
  }

  const commonDocuments = [
    'RG',
    'CPF',
    'Comprovante de Residência',
    'Certidão de Nascimento',
    'Certidão de Casamento',
    'Título de Eleitor',
    'Carteira de Trabalho',
    'Comprovante de Renda',
    'Foto 3x4',
    'Certidão Negativa de Débitos',
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <FileText className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-amber-900">Documentação Necessária</p>
          <p className="text-xs text-amber-700 mt-1">
            Configure quais documentos os cidadãos precisam apresentar para solicitar este serviço.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="requiresDocuments"
            checked={formData.requiresDocuments}
            onCheckedChange={(checked) => onChange('requiresDocuments', checked)}
          />
          <Label htmlFor="requiresDocuments" className="cursor-pointer font-medium">
            Este serviço requer documentos
          </Label>
        </div>

        {formData.requiresDocuments && (
          <div className="space-y-4 pl-6 border-l-2 border-amber-200">
            <div>
              <Label htmlFor="documentInput" className="text-sm font-medium">
                Adicionar Documento
              </Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="documentInput"
                  value={documentInput}
                  onChange={(e) => setDocumentInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ex: RG, CPF, Comprovante de residência"
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={addDocument}
                  disabled={!documentInput.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Pressione Enter ou clique no + para adicionar
              </p>
            </div>

            {/* Documentos Comuns */}
            {commonDocuments.filter(doc => !formData.requiredDocuments.includes(doc)).length > 0 && (
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Documentos Comuns (clique para adicionar)
                </Label>
                <div className="flex flex-wrap gap-2">
                  {commonDocuments
                    .filter(doc => !formData.requiredDocuments.includes(doc))
                    .map((doc) => (
                      <Badge
                        key={doc}
                        variant="outline"
                        className="cursor-pointer hover:bg-amber-50 hover:border-amber-300 transition-colors"
                        onClick={() => {
                          onChange('requiredDocuments', [...formData.requiredDocuments, doc])
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {doc}
                      </Badge>
                    ))}
                </div>
              </div>
            )}

            {/* Lista de Documentos Adicionados */}
            {formData.requiredDocuments.length > 0 && (
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Documentos Necessários ({formData.requiredDocuments.length})
                </Label>
                <div className="flex flex-wrap gap-2">
                  {formData.requiredDocuments.map((doc, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-50 hover:border-red-300 transition-colors"
                      onClick={() => removeDocument(index)}
                    >
                      {doc}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Clique em um documento para removê-lo
                </p>
              </div>
            )}

            {formData.requiredDocuments.length > 0 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-xs text-blue-800">
                  <strong>Dica:</strong> Na seção "Recursos Avançados" você poderá configurar
                  validação automática com IA, OCR e outras funcionalidades para os documentos.
                </p>
              </div>
            )}
          </div>
        )}

        {!formData.requiresDocuments && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md text-center">
            <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              Este serviço não requer documentos
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Marque a opção acima se o cidadão precisar enviar documentos
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
