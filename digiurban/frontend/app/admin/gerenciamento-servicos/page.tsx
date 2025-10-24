'use client'

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SincronizacaoServicos from '@/components/admin/SincronizacaoServicos'
import GeracaoAutomatica from '@/components/admin/GeracaoAutomatica'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  RefreshCw,
  Brain,
  TrendingUp,
  Zap,
  CheckCircle,
  AlertCircle,
  Database
} from 'lucide-react'

export default function GerenciamentoServicosPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento Inteligente de Serviços</h1>
          <p className="text-gray-600 mt-2">
            Sistema avançado de sincronização e geração automática de serviços públicos
          </p>
        </div>
        <div className="flex space-x-2">
          <Badge variant="secondary" className="flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" />
            Sistemas Ativos
          </Badge>
        </div>
      </div>

      {/* Visão Geral */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sincronização</CardTitle>
            <RefreshCw className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Ativo</div>
            <p className="text-xs text-muted-foreground">
              Sistema bidirecional local ↔ backend
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IA Generativa</CardTitle>
            <Brain className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">Ativo</div>
            <p className="text-xs text-muted-foreground">
              Análise inteligente e sugestões automáticas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Otimização</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">100%</div>
            <p className="text-xs text-muted-foreground">
              Eficiência dos processos automatizados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Principais */}
      <Tabs defaultValue="sincronizacao" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sincronizacao" className="flex items-center">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sincronização de Serviços
          </TabsTrigger>
          <TabsTrigger value="geracao" className="flex items-center">
            <Brain className="w-4 h-4 mr-2" />
            Geração Automática IA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sincronizacao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2 text-blue-600" />
                Sistema de Sincronização Bidirecional
              </CardTitle>
              <CardDescription>
                Sincroniza automaticamente serviços entre o sistema local (frontend) e o backend centralizado.
                Mantém dados consistentes e atualizados em tempo real.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SincronizacaoServicos />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geracao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-purple-600" />
                Inteligência Artificial para Geração de Serviços
              </CardTitle>
              <CardDescription>
                Utiliza IA para analisar padrões, identificar lacunas e sugerir novos serviços públicos
                baseados em demanda real e tendências emergentes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GeracaoAutomatica />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer com Informações Técnicas */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="flex items-center text-sm">
            <AlertCircle className="w-4 h-4 mr-2" />
            Informações Técnicas do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Sistema de Sincronização:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Sincronização bidirecional automática</li>
                <li>• Detecção de conflitos inteligente</li>
                <li>• Backup automático de dados</li>
                <li>• Monitoramento em tempo real</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">IA Generativa:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Análise de padrões comportamentais</li>
                <li>• Identificação de lacunas nos serviços</li>
                <li>• Sugestões baseadas em demanda real</li>
                <li>• Aprendizado contínuo e otimização</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}