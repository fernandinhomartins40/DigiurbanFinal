# FASE 7 - Integrações e APIs Externas

## Objetivo
Implementar integrações com sistemas externos governamentais e privados para enriquecer funcionalidades e automatizar processos municipais.

## ⚠️ NOTA IMPORTANTE SOBRE VIABILIDADE
**Status baseado em pesquisa de 2024**: Algumas APIs governamentais têm restrições de acesso, requerem contratos específicos ou foram descontinuadas. Esta implementação incluirá alternativas viáveis quando necessário.

## Integrações Governamentais

### ✅ Receita Federal (VIÁVEL)
**APIs Integradas**:
- **🟢 Consulta CNPJ Oficial**: API oficial gov.br/conecta/catalogo/apis/consulta-cnpj
- **🟡 CPF**: Via serviço web oficial (não API REST direta)
- **🟢 Situação Cadastral**: Disponível via API oficial

**APIs Alternativas Comerciais** (para casos específicos):
- ReceitaWS, ConsultaAPI, CPF.CNPJ (serviços terceirizados certificados)

**Casos de Uso**:
- Validação automática no cadastro de cidadãos
- Verificação de empresas para alvarás
- Dados empresariais para tributação

### ✅ IBGE (VIÁVEL)
**APIs Integradas**:
- **🟢 Códigos de Municípios**: API oficial servicodados.ibge.gov.br/api/v1/localidades
- **🟢 Dados Demográficos**: API de agregados oficial
- **🔴 CEP**: IBGE não oferece API de CEP (usar ViaCEP ou Correios)

**APIs Disponíveis**:
- Localidades (municípios, estados, regiões)
- Dados demográficos e estimativas populacionais
- Registro de Referência de Municípios

**Casos de Uso**:
- Geolocalização de protocolos
- Relatórios demográficos
- Planejamento urbano baseado em dados

### ⚠️ Tribunal Superior Eleitoral (TSE) (LIMITADO)
**Status Real**:
- **🔴 API Pública**: Não disponível para validação externa de títulos
- **🟡 Serviços Web**: Apenas Título Net (cidadãos) e e-Título app
- **🟡 Consultas**: Limitadas a interfaces web específicas

**Alternativas Possíveis**:
- Integração via scraping controlado (não recomendado para produção)
- Validação local usando algoritmos de verificação de título
- Parcerias diretas com TSE (requer processo formal)

**Casos de Uso Revistos**:
- Validação básica de formato de título eleitor
- Programas sociais com critério declaratório

### ⚠️ TransfereGov (SICONV Atualizado) (LIMITADO)
**Status Atual 2024**:
- **🟡 SICONV**: Descontinuado em 2019, substituído por Plataforma +Brasil
- **🟢 TransfereGov**: Sistema atual para convênios federais
- **🟢 Portal da Transparência**: APIs públicas disponíveis

**APIs Disponíveis**:
- Consulta de convênios via Portal da Transparência
- Dados abertos de transferências federais

**Casos de Uso Atualizados**:
- Consulta de convênios ativos via Portal da Transparência
- Monitoramento de recursos federais (dados públicos)

## Integrações Estaduais

### Secretaria da Fazenda Estadual
**APIs Integradas**:
- **ICMS**: Consulta situação fiscal empresas
- **Inscrição Estadual**: Validação IE

**Casos de Uso**:
- Alvarás de funcionamento
- Licenças comerciais

### Detran
**APIs Integradas**:
- **Consulta Veículo**: Dados por placa
- **CNH**: Validação carteira motorista

**Casos de Uso**:
- Licenciamento de transporte
- Multas municipais
- Cadastro de motoristas

### Corpo de Bombeiros
**APIs Integradas**:
- **Auto de Vistoria**: Consulta AVCB
- **Solicitação Vistoria**: Agendamento

**Casos de Uso**:
- Alvarás condicionados a AVCB
- Licenciamento de eventos

## Integrações Bancárias

### ✅ Open Finance Brasil (VIÁVEL COM LIMITAÇÕES)
**Status Atual 2024**:
- **🟢 Sistema Ativo**: Evoluído de Open Banking para Open Finance
- **🟡 Acesso Restrito**: Requer consentimento explícito do usuário
- **🟢 APIs Padronizadas**: Bem documentadas e funcionais

**APIs Integradas**:
- **Conta Corrente**: Dados bancários COM consentimento do usuário
- **Movimentação**: Comprovação de renda COM autorização
- **Investimentos**: Dados de produtos financeiros (Fase 4)

**Limitações Importantes**:
- Consentimento obrigatório do cidadão para cada consulta
- Dados pertencem ao usuário, não ao governo
- Implementação complexa com segurança OAuth2/OpenID

**Casos de Uso Viáveis**:
- Programas sociais com consentimento do beneficiário
- Validação socioeconômica voluntary
- Auxílios emergenciais com autorização

### ✅ PIX (TOTALMENTE VIÁVEL)
**Status 2024**:
- **🟢 API Oficial**: Banco Central do Brasil - github.com/bacen/pix-api
- **🟢 Amplamente Suportado**: Todos os grandes bancos
- **🟢 Documentação Completa**: Padrão bem estabelecido

**APIs Integradas**:
- **Pagamentos Instantâneos**: Recebimento 24/7
- **QR Codes Dinâmicos**: Geração automática para taxas
- **Webhook de Confirmação**: Notificações em tempo real

**Casos de Uso Confirmados**:
- Pagamento de alvarás e taxas municipais
- Arrecadação municipal automatizada
- Multas e tributos com confirmação instantânea

## Integrações de Saúde

### ⚠️ DataSUS (REQUER CREDENCIAMENTO)
**Status Atual 2024**:
- **🟡 CNES API**: Disponível via Gateway SOA com credenciamento
- **🟡 CNS/Cartão SUS**: Requer solicitação formal via servicos-datasus.saude.gov.br
- **🟢 Dados Abertos**: Disponíveis via opendatasus.saude.gov.br

**Processo de Acesso**:
1. Solicitação formal via Portal DataSUS
2. Preenchimento de formulário de acesso
3. Aprovação pelo Ministério da Saúde
4. Geração de credenciais específicas

**APIs Disponíveis COM CREDENCIAMENTO**:
- **Cartão SUS**: Validação número CNS
- **CNES**: Estabelecimentos de saúde
- **Dados Epidemiológicos**: Via OpenDataSUS

**Casos de Uso Realistas**:
- Validação de pacientes (após credenciamento)
- Consulta a estabelecimentos de saúde
- Dados epidemiológicos públicos

### 🔴 ANVISA (LIMITADO)
**Status Real**:
- **🔴 API Pública**: Não identificada em pesquisa 2024
- **🟡 Consultas Web**: Apenas interfaces web para consulta
- **🟢 Dados Abertos**: Alguns datasets disponíveis

**Alternativas**:
- Web scraping controlado (não recomendado)
- Consultas manuais via interface web
- Parcerias diretas (processo complexo)

## Integrações de Educação

### INEP/MEC
**APIs Integradas**:
- **Censo Escolar**: Dados educacionais
- **IDEB**: Índices de qualidade
- **Escola**: Informações das unidades

**Casos de Uso**:
- Gestão educacional
- Relatórios para MEC
- Planejamento pedagógico

### FNDE
**APIs Integradas**:
- **PNAE**: Programa alimentação escolar
- **PNATE**: Transporte escolar
- **Recursos**: Transferências federais

**Casos de Uso**:
- Gestão de recursos educacionais
- Prestação de contas
- Monitoramento de programas

## Integrações de Comunicação

### ⚠️ Correios (REQUER CONTRATO COMERCIAL)
**Status Atual 2024**:
- **🔴 APIs Abertas**: Descontinuadas em 30/09/2023
- **🟡 APIs Comerciais**: Disponíveis apenas para clientes com contrato Bronze+
- **🟢 Web Services**: Disponível via cws.correios.com.br

**Processo de Acesso**:
1. Contrato comercial com Correios (pacote Bronze ou superior)
2. Credenciamento no Meu Correios
3. Geração de senha para API no Correios Web Services
4. Acesso via REST API oficial

**APIs Disponíveis COM CONTRATO**:
- **CEP**: Busca de endereços completa
- **Rastreamento**: Acompanhamento de objetos
- **Preços e Prazos**: Calculadora oficial

**Alternativas Gratuitas**:
- **ViaCEP**: API gratuita para consulta de CEP (viacep.com.br)
- **BrasilAPI**: CEP e outros dados brasileiros
- **CEP Aberto**: Serviço alternativo

**Casos de Uso Atualizados**:
- Validação de endereços (ViaCEP como alternativa)
- Entrega de documentos (se houver contrato)
- Logística municipal (requer investimento)

### ✅ SMS/WhatsApp (VIÁVEL)
**Status 2024**:
- **🟢 Totalmente Viável**: Múltiplos provedores disponíveis
- **🟢 APIs Maduras**: Bem documentadas e estáveis

**APIs Integradas**:
- **Zenvia**: Líder brasileiro em SMS/WhatsApp
- **Twilio**: Provedor global com presença no Brasil
- **WhatsApp Business API**: Oficial do Meta

**Casos de Uso Confirmados**:
- Notificações de protocolo via SMS
- Lembretes de agendamento
- Alertas emergenciais para população
- Atendimento via WhatsApp Business

### ✅ Email (TOTALMENTE VIÁVEL)
**Status 2024**:
- **🟢 Múltiplas Opções**: Provedores confiáveis disponíveis
- **🟢 APIs Robustas**: Altas taxas de entrega

**APIs Integradas**:
- **SendGrid**: Twilio SendGrid para emails transacionais
- **Amazon SES**: Serviço da AWS com excelente custo-benefício
- **Mailgun**: Especialista em APIs de email
- **Resend**: Nova opção moderna e developer-friendly

**Casos de Uso Confirmados**:
- Confirmações de protocolo
- Relatórios automáticos para gestores
- Newsletters municipais
- Notificações de sistema

---

## 🚀 SERVIDOR DE EMAIL PRÓPRIO DIGIURBAN

### 📧 UltraZend SMTP Server Integration
**Baseado na análise do servidor `ultrazend-smtp-server/`**

A DigiUrban implementará um **servidor de email SMTP completo próprio** como serviço premium, oferecendo às prefeituras total independência de provedores externos.

### ✨ FUNCIONALIDADES DO SERVIDOR PRÓPRIO

**Recursos Principais**:
- ✅ **Servidor SMTP Completo** - Portas 25 (MX) e 587 (Submission)
- ✅ **Entrega Direta** - Via MX records, sem depender de terceiros
- ✅ **Domínios Personalizados** - prefeitura.com.br, cidade.gov.br
- ✅ **Autenticação DKIM/SPF** - Reputação e autenticidade
- ✅ **Banco Prisma Integrado** - Logs, estatísticas, configurações
- ✅ **Interface de Gestão** - Painel Super Admin + Admin
- ✅ **Emails Transacionais** - Confirmações, recuperação, notificações

### 🏗️ ARQUITETURA DA IMPLEMENTAÇÃO

#### 1. **Models Prisma para Email Server**

```prisma
// Schema adicional para servidor de email próprio
model EmailServer {
  id                String    @id @default(cuid())
  tenantId          String
  hostname          String    // mail.prefeitura.com.br
  mxPort            Int       @default(25)
  submissionPort    Int       @default(587)
  isActive          Boolean   @default(false)
  isPremiumService  Boolean   @default(true)  // Serviço pago
  monthlyPrice      Decimal   @default(99.00) // R$ 99/mês
  maxEmailsPerMonth Int       @default(10000)
  tlsEnabled        Boolean   @default(true)
  certPath          String?
  keyPath           String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  // Relacionamentos
  tenant            Tenant        @relation(fields: [tenantId], references: [id])
  domains           EmailDomain[]
  users             EmailUser[]
  logs              EmailLog[]
  statistics        EmailStats[]

  @@unique([tenantId])
  @@map("email_servers")
}

model EmailDomain {
  id                String    @id @default(cuid())
  emailServerId     String
  domainName        String    // prefeitura.com.br
  isVerified        Boolean   @default(false)
  verificationToken String?
  dkimEnabled       Boolean   @default(true)
  dkimSelector      String    @default("default")
  dkimPrivateKey    String?   // Encrypted
  dkimPublicKey     String?
  spfEnabled        Boolean   @default(true)
  spfRecord         String?
  dmarcEnabled      Boolean   @default(false)
  dmarcPolicy       String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  // Relacionamentos
  emailServer       EmailServer   @relation(fields: [emailServerId], references: [id])
  sentEmails        Email[]

  @@unique([emailServerId, domainName])
  @@map("email_domains")
}

model EmailUser {
  id            String    @id @default(cuid())
  emailServerId String
  email         String    // admin@prefeitura.com.br
  passwordHash  String
  name          String
  isActive      Boolean   @default(true)
  isAdmin       Boolean   @default(false)
  dailyLimit    Int       @default(1000)
  monthlyLimit  Int       @default(10000)
  sentToday     Int       @default(0)
  sentThisMonth Int       @default(0)
  lastLoginAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relacionamentos
  emailServer   EmailServer @relation(fields: [emailServerId], references: [id])
  sentEmails    Email[]
  authAttempts  EmailAuthAttempt[]

  @@unique([emailServerId, email])
  @@map("email_users")
}

model Email {
  id            String      @id @default(cuid())
  emailServerId String?
  domainId      String?
  userId        String?
  messageId     String      @unique
  fromEmail     String
  toEmail       String
  ccEmails      Json?       // string[]
  bccEmails     Json?       // string[]
  subject       String
  textContent   String?
  htmlContent   String?
  headers       Json?       // Record<string, string>
  attachments   Json?       // attachment info

  // Status e delivery
  status        EmailStatus @default(QUEUED)
  priority      Int         @default(3)
  retryCount    Int         @default(0)
  maxRetries    Int         @default(3)
  scheduledFor  DateTime?
  sentAt        DateTime?
  deliveredAt   DateTime?
  failedAt      DateTime?
  errorMessage  String?

  // Tracking
  opens         Int         @default(0)
  clicks        Int         @default(0)
  unsubscribed  Boolean     @default(false)
  complained    Boolean     @default(false)
  bounced       Boolean     @default(false)

  // DKIM
  dkimSigned    Boolean     @default(false)
  dkimSignature String?

  // Metadata
  campaignId    String?
  tags          Json?       // string[]
  metadata      Json?

  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  // Relacionamentos
  emailServer   EmailServer? @relation(fields: [emailServerId], references: [id])
  domain        EmailDomain? @relation(fields: [domainId], references: [id])
  user          EmailUser?   @relation(fields: [userId], references: [id])
  events        EmailEvent[]

  @@map("emails")
}

enum EmailStatus {
  QUEUED      // Na fila
  PROCESSING  // Processando
  SENT        // Enviado
  DELIVERED   // Entregue
  FAILED      // Falhou
  BOUNCED     // Rejeitado
  COMPLAINED  // Spam report
  UNSUBSCRIBED // Cancelou inscrição
}

model EmailEvent {
  id        String           @id @default(cuid())
  emailId   String
  type      EmailEventType
  data      Json?
  userAgent String?
  ipAddress String?
  timestamp DateTime         @default(now())

  email     Email            @relation(fields: [emailId], references: [id])

  @@map("email_events")
}

enum EmailEventType {
  SENT
  DELIVERED
  OPENED
  CLICKED
  BOUNCED
  COMPLAINED
  UNSUBSCRIBED
  FAILED
}

model EmailLog {
  id            String      @id @default(cuid())
  emailServerId String
  level         LogLevel
  message       String
  data          Json?
  timestamp     DateTime    @default(now())

  emailServer   EmailServer @relation(fields: [emailServerId], references: [id])

  @@map("email_logs")
}

enum LogLevel {
  DEBUG
  INFO
  WARN
  ERROR
}

model EmailStats {
  id              String      @id @default(cuid())
  emailServerId   String
  date            DateTime    @db.Date
  totalSent       Int         @default(0)
  totalDelivered  Int         @default(0)
  totalFailed     Int         @default(0)
  totalBounced    Int         @default(0)
  totalComplained Int         @default(0)
  totalOpens      Int         @default(0)
  totalClicks     Int         @default(0)
  uniqueOpens     Int         @default(0)
  uniqueClicks    Int         @default(0)

  emailServer     EmailServer @relation(fields: [emailServerId], references: [id])

  @@unique([emailServerId, date])
  @@map("email_stats")
}

model EmailAuthAttempt {
  id        String      @id @default(cuid())
  userId    String?
  email     String
  ipAddress String
  userAgent String?
  success   Boolean     @default(false)
  reason    String?
  timestamp DateTime    @default(now())

  user      EmailUser?  @relation(fields: [userId], references: [id])

  @@map("email_auth_attempts")
}

model EmailTemplate {
  id            String       @id @default(cuid())
  tenantId      String
  name          String
  subject       String
  htmlContent   String
  textContent   String?
  variables     Json?        // string[]
  category      String?      // transactional, marketing, notification
  isActive      Boolean      @default(true)
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  tenant        Tenant       @relation(fields: [tenantId], references: [id])

  @@unique([tenantId, name])
  @@map("email_templates")
}

// Adicionar ao model Tenant existente
model Tenant {
  // ... campos existentes ...

  // Novos campos para email
  emailServer     EmailServer?
  emailTemplates  EmailTemplate[]
  hasEmailService Boolean      @default(false)
  emailPlanType   EmailPlan    @default(NONE)

  // ... rest of existing fields
}

enum EmailPlan {
  NONE      // Sem serviço de email
  BASIC     // 5.000 emails/mês - R$ 49
  STANDARD  // 15.000 emails/mês - R$ 99
  PREMIUM   // 50.000 emails/mês - R$ 199
  ENTERPRISE // Unlimited - R$ 399
}
```

#### 2. **Adaptação do UltraZend SMTP para Prisma**

**Arquivo: `src/email/DigiUrbanSMTPServer.ts`**

```typescript
import { PrismaClient } from '@prisma/client'
import { SMTPServer } from 'smtp-server'
import { DKIMSign } from 'node-dkim'
import nodemailer from 'nodemailer'
import bcrypt from 'bcrypt'

export interface DigiUrbanSMTPConfig {
  tenantId: string
  hostname: string
  mxPort?: number
  submissionPort?: number
  maxConnections?: number
  maxMessageSize?: number
  tlsEnabled?: boolean
  certPath?: string
  keyPath?: string
}

export class DigiUrbanSMTPServer {
  private prisma: PrismaClient
  private smtpServer?: SMTPServer
  private config: DigiUrbanSMTPConfig
  private isRunning = false

  constructor(config: DigiUrbanSMTPConfig, prisma: PrismaClient) {
    this.config = config
    this.prisma = prisma
  }

  async start(): Promise<void> {
    // Verificar se tenant tem serviço de email ativo
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: this.config.tenantId },
      include: { emailServer: true }
    })

    if (!tenant?.hasEmailService) {
      throw new Error('Email service not enabled for this tenant')
    }

    // Configurar servidor SMTP
    this.smtpServer = new SMTPServer({
      secure: false,
      authMethods: ['PLAIN', 'LOGIN'],
      maxClients: this.config.maxConnections || 100,
      maxSize: this.config.maxMessageSize || 50 * 1024 * 1024,

      // Autenticação
      onAuth: this.handleAuth.bind(this),

      // Processar emails
      onData: this.handleData.bind(this),

      // Logs de conexão
      onConnect: this.handleConnect.bind(this),
      onClose: this.handleClose.bind(this)
    })

    // Iniciar nas portas configuradas
    this.smtpServer.listen(this.config.submissionPort || 587, () => {
      console.log(`📧 DigiUrban SMTP Server running on port ${this.config.submissionPort || 587}`)
      this.isRunning = true
    })

    // Log de inicialização
    await this.logEvent('INFO', 'SMTP Server started', {
      hostname: this.config.hostname,
      ports: { mx: this.config.mxPort, submission: this.config.submissionPort }
    })
  }

  private async handleAuth(auth: any, session: any, callback: Function) {
    try {
      const emailUser = await this.prisma.emailUser.findUnique({
        where: {
          emailServerId_email: {
            emailServerId: (await this.getEmailServer()).id,
            email: auth.username
          }
        }
      })

      if (!emailUser || !emailUser.isActive) {
        await this.logAuthAttempt(auth.username, session.remoteAddress, false, 'User not found or inactive')
        return callback(new Error('Authentication failed'))
      }

      const isValidPassword = await bcrypt.compare(auth.password, emailUser.passwordHash)
      if (!isValidPassword) {
        await this.logAuthAttempt(auth.username, session.remoteAddress, false, 'Invalid password')
        return callback(new Error('Authentication failed'))
      }

      // Verificar limites diários/mensais
      const today = new Date().toISOString().split('T')[0]
      const canSend = await this.checkSendingLimits(emailUser.id)

      if (!canSend) {
        await this.logAuthAttempt(auth.username, session.remoteAddress, false, 'Sending limit exceeded')
        return callback(new Error('Sending limit exceeded'))
      }

      await this.logAuthAttempt(auth.username, session.remoteAddress, true)
      session.user = emailUser
      callback(null, { user: emailUser })

    } catch (error) {
      await this.logEvent('ERROR', 'Authentication error', { error: error.message })
      callback(error)
    }
  }

  private async handleData(stream: any, session: any, callback: Function) {
    try {
      // Parse email content
      const emailData = await this.parseEmailStream(stream)

      // Validar domínio do remetente
      const domain = emailData.from.split('@')[1]
      const emailDomain = await this.prisma.emailDomain.findFirst({
        where: {
          emailServerId: (await this.getEmailServer()).id,
          domainName: domain,
          isVerified: true
        }
      })

      if (!emailDomain) {
        await this.logEvent('WARN', 'Unauthorized domain', { from: emailData.from, domain })
        return callback(new Error(`Unauthorized domain: ${domain}`))
      }

      // Aplicar assinatura DKIM
      const signedEmail = await this.applyDKIM(emailData, emailDomain)

      // Salvar email no banco
      const email = await this.prisma.email.create({
        data: {
          emailServerId: (await this.getEmailServer()).id,
          domainId: emailDomain.id,
          userId: session.user?.id,
          messageId: signedEmail.messageId,
          fromEmail: signedEmail.from,
          toEmail: Array.isArray(signedEmail.to) ? signedEmail.to.join(',') : signedEmail.to,
          subject: signedEmail.subject,
          htmlContent: signedEmail.html,
          textContent: signedEmail.text,
          headers: signedEmail.headers,
          status: 'QUEUED',
          dkimSigned: true,
          dkimSignature: signedEmail.dkimSignature
        }
      })

      // Processar entrega em background
      this.processDelivery(email.id).catch(console.error)

      await this.logEvent('INFO', 'Email queued for delivery', {
        messageId: email.messageId,
        from: email.fromEmail,
        to: email.toEmail
      })

      callback()

    } catch (error) {
      await this.logEvent('ERROR', 'Email processing error', { error: error.message })
      callback(error)
    }
  }

  private async processDelivery(emailId: string) {
    try {
      const email = await this.prisma.email.findUnique({
        where: { id: emailId },
        include: { domain: true }
      })

      if (!email) return

      // Atualizar status para PROCESSING
      await this.prisma.email.update({
        where: { id: emailId },
        data: { status: 'PROCESSING' }
      })

      // Tentar entrega via MX records
      const delivered = await this.deliverViaMX(email)

      if (delivered) {
        await this.prisma.email.update({
          where: { id: emailId },
          data: {
            status: 'DELIVERED',
            deliveredAt: new Date()
          }
        })

        // Registrar evento
        await this.prisma.emailEvent.create({
          data: {
            emailId,
            type: 'DELIVERED',
            timestamp: new Date()
          }
        })
      } else {
        // Falha na entrega
        await this.prisma.email.update({
          where: { id: emailId },
          data: {
            status: 'FAILED',
            failedAt: new Date(),
            retryCount: { increment: 1 }
          }
        })
      }

    } catch (error) {
      await this.logEvent('ERROR', 'Delivery processing error', {
        emailId,
        error: error.message
      })
    }
  }

  // ... outros métodos para MX delivery, DKIM, etc.

  private async getEmailServer() {
    return await this.prisma.emailServer.findUniqueOrThrow({
      where: { tenantId: this.config.tenantId }
    })
  }

  private async logEvent(level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR', message: string, data?: any) {
    await this.prisma.emailLog.create({
      data: {
        emailServerId: (await this.getEmailServer()).id,
        level,
        message,
        data: data || {}
      }
    })
  }

  private async logAuthAttempt(email: string, ipAddress: string, success: boolean, reason?: string) {
    await this.prisma.emailAuthAttempt.create({
      data: {
        email,
        ipAddress,
        success,
        reason
      }
    })
  }

  // ... mais métodos
}
```

#### 3. **Painel Super Admin - DNS Management**

**Arquivo: `src/pages/super-admin/email-dns.tsx`**

```typescript
'use client'

import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'

interface DNSRecord {
  type: 'MX' | 'A' | 'TXT' | 'CNAME'
  name: string
  value: string
  priority?: number
  ttl: number
}

export default function EmailDNSManagement() {
  const [selectedTenant, setSelectedTenant] = useState<string>('')

  // Buscar configurações DNS do tenant
  const { data: dnsConfig, isLoading } = useQuery({
    queryKey: ['email-dns', selectedTenant],
    queryFn: () => fetch(`/api/super-admin/email-dns/${selectedTenant}`).then(r => r.json()),
    enabled: !!selectedTenant
  })

  // Gerar registros DNS automaticamente
  const generateDNS = useMutation({
    mutationFn: (tenantId: string) =>
      fetch(`/api/super-admin/email-dns/${tenantId}/generate`, { method: 'POST' }).then(r => r.json())
  })

  const dnsRecords: DNSRecord[] = dnsConfig?.records || []

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciamento DNS Email</h1>

        <select
          value={selectedTenant}
          onChange={(e) => setSelectedTenant(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">Selecionar Prefeitura</option>
          {/* Listar tenants com serviço de email */}
        </select>
      </div>

      {selectedTenant && (
        <div className="bg-white rounded-lg border p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Configuração DNS</h2>
            <button
              onClick={() => generateDNS.mutate(selectedTenant)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              🔄 Regenerar DNS
            </button>
          </div>

          {/* Registros DNS Necessários */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3 text-gray-700">📋 Registros DNS a Configurar</h3>

              {dnsRecords.map((record, index) => (
                <div key={index} className="mb-4 p-3 bg-white rounded border">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono mr-3">
                        {record.type}
                      </span>
                      <code className="text-sm">{record.name}</code>
                    </div>
                    <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm">
                      📋 Copiar
                    </button>
                  </div>
                  <div className="mt-2 pl-16">
                    <code className="text-sm text-gray-600 break-all">{record.value}</code>
                    {record.priority && <span className="ml-2 text-xs text-gray-500">Prioridade: {record.priority}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Status de Verificação DNS */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3 text-yellow-700">⚠️ Status de Verificação</h3>

              {dnsRecords.map((record, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <span className="text-sm">{record.type} - {record.name}</span>
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                    ❌ Não Verificado
                  </span>
                </div>
              ))}
            </div>

            {/* Instruções */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3 text-blue-700">📚 Instruções</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-600">
                <li>Acesse o painel DNS do seu provedor de domínio</li>
                <li>Adicione cada registro DNS listado acima</li>
                <li>Aguarde a propagação DNS (até 48 horas)</li>
                <li>Clique em "Verificar DNS" para validar as configurações</li>
                <li>Após verificação, o servidor de email será ativado automaticamente</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```

#### 4. **Módulo Email no Painel Admin**

**Arquivo: `src/pages/admin/email-service.tsx`**

```typescript
'use client'

import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'

interface EmailPlan {
  id: string
  name: string
  monthlyPrice: number
  emailsPerMonth: number
  features: string[]
  recommended?: boolean
}

const EMAIL_PLANS: EmailPlan[] = [
  {
    id: 'basic',
    name: 'Básico',
    monthlyPrice: 49,
    emailsPerMonth: 5000,
    features: ['5.000 emails/mês', 'Domínio personalizado', 'DKIM/SPF automático', 'Suporte básico']
  },
  {
    id: 'standard',
    name: 'Padrão',
    monthlyPrice: 99,
    emailsPerMonth: 15000,
    features: ['15.000 emails/mês', 'Múltiplos domínios', 'Templates personalizados', 'Estatísticas avançadas'],
    recommended: true
  },
  {
    id: 'premium',
    name: 'Premium',
    monthlyPrice: 199,
    emailsPerMonth: 50000,
    features: ['50.000 emails/mês', 'API completa', 'Automações avançadas', 'Suporte prioritário']
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: 399,
    emailsPerMonth: -1, // Unlimited
    features: ['Emails ilimitados', 'Servidor dedicado', 'SLA garantido', 'Suporte 24/7']
  }
]

export default function EmailServiceManagement() {
  const [activeTab, setActiveTab] = useState<'plans' | 'domains' | 'stats' | 'settings'>('plans')

  // Buscar configurações do serviço de email
  const { data: emailConfig, isLoading } = useQuery({
    queryKey: ['email-config'],
    queryFn: () => fetch('/api/admin/email-service').then(r => r.json())
  })

  // Contratar/alterar plano
  const subscribePlan = useMutation({
    mutationFn: (planId: string) =>
      fetch('/api/admin/email-service/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId })
      }).then(r => r.json())
  })

  // Configurar domínio
  const configureDomain = useMutation({
    mutationFn: (domain: string) =>
      fetch('/api/admin/email-service/domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain })
      }).then(r => r.json())
  })

  const currentPlan = emailConfig?.plan
  const hasEmailService = emailConfig?.hasEmailService
  const domains = emailConfig?.domains || []

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Serviço de Email Próprio</h1>
          <p className="text-gray-600">Gerencie seu servidor de email municipal independente</p>
        </div>

        {hasEmailService && (
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
              ✅ Serviço Ativo
            </span>
            <span className="text-sm text-gray-600">Plano: {currentPlan?.name}</span>
          </div>
        )}
      </div>

      {/* Tabs de Navegação */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'plans', label: 'Planos', icon: '💳' },
            { id: 'domains', label: 'Domínios', icon: '🌐' },
            { id: 'stats', label: 'Estatísticas', icon: '📊' },
            { id: 'settings', label: 'Configurações', icon: '⚙️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Conteúdo das Tabs */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          {!hasEmailService && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">🚀 Servidor de Email Próprio</h3>
              <p className="text-blue-800 text-sm mb-3">
                Tenha total independência com seu próprio servidor de email municipal.
                Domínio personalizado, entrega direta e controle completo.
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>✅ Domínio personalizado (prefeitura.com.br)</li>
                <li>✅ Entrega direta sem dependência de terceiros</li>
                <li>✅ DKIM/SPF automático para reputação</li>
                <li>✅ Servidor dedicado para sua prefeitura</li>
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {EMAIL_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-lg border-2 p-6 ${
                  plan.recommended
                    ? 'border-blue-500 shadow-lg'
                    : 'border-gray-200'
                } ${
                  currentPlan?.id === plan.id
                    ? 'bg-green-50 border-green-500'
                    : ''
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 text-xs font-semibold rounded-full">
                      Recomendado
                    </span>
                  </div>
                )}

                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-gray-900">R$ {plan.monthlyPrice}</span>
                    <span className="text-gray-600">/mês</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {plan.emailsPerMonth === -1
                      ? 'Emails ilimitados'
                      : `${plan.emailsPerMonth.toLocaleString()} emails/mês`
                    }
                  </p>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => subscribePlan.mutate(plan.id)}
                  disabled={subscribePlan.isLoading || currentPlan?.id === plan.id}
                  className={`w-full py-2 px-4 rounded-lg font-medium ${
                    currentPlan?.id === plan.id
                      ? 'bg-green-100 text-green-800 cursor-not-allowed'
                      : plan.recommended
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {currentPlan?.id === plan.id
                    ? '✅ Plano Atual'
                    : subscribePlan.isLoading
                    ? 'Processando...'
                    : hasEmailService
                    ? 'Alterar Plano'
                    : 'Contratar'
                  }
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'domains' && hasEmailService && (
        <div className="space-y-6">
          {/* Configurar Novo Domínio */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Configurar Domínio de Email</h2>

            <div className="flex space-x-4 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="prefeitura.com.br"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => {/* configureDomain.mutate(domain) */}}
              >
                Adicionar Domínio
              </button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">💡 Domínio Padrão Disponível</h4>
              <p className="text-yellow-700 text-sm mb-2">
                Você pode usar o domínio padrão da DigiUrban enquanto configura seu domínio personalizado:
              </p>
              <code className="bg-white px-2 py-1 rounded text-sm">
                suaprefeitura.digiurban.com.br
              </code>
            </div>
          </div>

          {/* Domínios Configurados */}
          <div className="bg-white rounded-lg border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Domínios Configurados</h2>
            </div>

            <div className="p-6">
              {domains.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhum domínio configurado ainda</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {domains.map((domain: any) => (
                    <div key={domain.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{domain.domainName}</h3>
                        <p className="text-sm text-gray-600">
                          Adicionado em {new Date(domain.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs rounded ${
                          domain.isVerified
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {domain.isVerified ? '✅ Verificado' : '⏳ Pendente'}
                        </span>

                        <button className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200">
                          Ver DNS
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'stats' && hasEmailService && (
        <div className="space-y-6">
          {/* Estatísticas do Mês */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Emails Enviados</p>
                  <p className="text-2xl font-bold text-gray-900">2.847</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  📧
                </div>
              </div>
              <div className="mt-2">
                <span className="text-xs text-gray-500">
                  {currentPlan?.emailsPerMonth === -1
                    ? 'Ilimitados'
                    : `de ${currentPlan?.emailsPerMonth.toLocaleString()}`
                  }
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taxa de Entrega</p>
                  <p className="text-2xl font-bold text-green-600">98.2%</p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                  ✅
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taxa de Abertura</p>
                  <p className="text-2xl font-bold text-blue-600">24.5%</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  👁️
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Bounces</p>
                  <p className="text-2xl font-bold text-red-600">1.1%</p>
                </div>
                <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                  ⚠️
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico de Envios (placeholder) */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Envios dos Últimos 30 Dias</h2>
            <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
              <p className="text-gray-500">📊 Gráfico de envios em desenvolvimento</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && hasEmailService && (
        <div className="space-y-6">
          {/* Configurações Gerais */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Configurações do Servidor</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Remetente Padrão
                </label>
                <input
                  type="text"
                  defaultValue="Prefeitura Municipal"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Padrão do Remetente
                </label>
                <input
                  type="email"
                  defaultValue="noreply@prefeitura.com.br"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm text-gray-700">
                    Rastrear aberturas de email
                  </span>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm text-gray-700">
                    Rastrear cliques em links
                  </span>
                </label>
              </div>

              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Salvar Configurações
              </button>
            </div>
          </div>

          {/* Usuários SMTP */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Usuários SMTP</h2>

            <div className="mb-4">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                + Adicionar Usuário SMTP
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">admin@prefeitura.com.br</p>
                  <p className="text-sm text-gray-600">Administrador principal</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    Ativo
                  </span>
                  <button className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200">
                    Editar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```

#### 5. **APIs do Sistema de Email**

**Arquivo: `src/pages/api/admin/email-service/index.ts`**

```typescript
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const tenantId = session.user.tenantId

  if (req.method === 'GET') {
    try {
      const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        include: {
          emailServer: {
            include: {
              domains: true,
              statistics: {
                where: {
                  date: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                  }
                }
              }
            }
          }
        }
      })

      const emailConfig = {
        hasEmailService: tenant?.hasEmailService || false,
        plan: {
          id: tenant?.emailPlanType,
          name: getEmailPlanName(tenant?.emailPlanType),
          emailsPerMonth: getEmailPlanLimit(tenant?.emailPlanType)
        },
        domains: tenant?.emailServer?.domains || [],
        statistics: tenant?.emailServer?.statistics || []
      }

      return res.json(emailConfig)

    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

function getEmailPlanName(planType: string) {
  const plans = {
    NONE: 'Nenhum',
    BASIC: 'Básico',
    STANDARD: 'Padrão',
    PREMIUM: 'Premium',
    ENTERPRISE: 'Enterprise'
  }
  return plans[planType as keyof typeof plans] || 'Nenhum'
}

function getEmailPlanLimit(planType: string) {
  const limits = {
    NONE: 0,
    BASIC: 5000,
    STANDARD: 15000,
    PREMIUM: 50000,
    ENTERPRISE: -1
  }
  return limits[planType as keyof typeof limits] || 0
}
```

**Arquivo: `src/pages/api/admin/email-service/subscribe.ts`**

```typescript
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]'
import { prisma } from '@/lib/prisma'
import { DigiUrbanSMTPServer } from '@/lib/email/DigiUrbanSMTPServer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const session = await getServerSession(req, res, authOptions)

  if (!session?.user || session.user.userLevel < 3) {
    return res.status(401).json({ error: 'Unauthorized - Admin access required' })
  }

  const { planId } = req.body
  const tenantId = session.user.tenantId

  try {
    // Validar plano
    const validPlans = ['basic', 'standard', 'premium', 'enterprise']
    if (!validPlans.includes(planId)) {
      return res.status(400).json({ error: 'Invalid plan' })
    }

    // Mapear plano para enum
    const planMapping = {
      basic: 'BASIC',
      standard: 'STANDARD',
      premium: 'PREMIUM',
      enterprise: 'ENTERPRISE'
    }

    // Atualizar tenant
    const updatedTenant = await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        hasEmailService: true,
        emailPlanType: planMapping[planId as keyof typeof planMapping]
      }
    })

    // Criar/atualizar servidor de email
    await prisma.emailServer.upsert({
      where: { tenantId },
      update: {
        monthlyPrice: getEmailPlanPrice(planId),
        maxEmailsPerMonth: getEmailPlanLimit(planId),
        isActive: true
      },
      create: {
        tenantId,
        hostname: `mail.${updatedTenant.subdomain}.digiurban.com.br`,
        monthlyPrice: getEmailPlanPrice(planId),
        maxEmailsPerMonth: getEmailPlanLimit(planId),
        isActive: true
      }
    })

    // Criar usuário SMTP padrão
    const emailServer = await prisma.emailServer.findUnique({
      where: { tenantId }
    })

    if (emailServer) {
      const bcrypt = require('bcrypt')
      const defaultPassword = generateSecurePassword()
      const passwordHash = await bcrypt.hash(defaultPassword, 12)

      await prisma.emailUser.create({
        data: {
          emailServerId: emailServer.id,
          email: `admin@${updatedTenant.subdomain}.digiurban.com.br`,
          passwordHash,
          name: 'Administrador',
          isActive: true,
          isAdmin: true
        }
      })

      // Adicionar domínio padrão
      await prisma.emailDomain.create({
        data: {
          emailServerId: emailServer.id,
          domainName: `${updatedTenant.subdomain}.digiurban.com.br`,
          isVerified: true, // Domínio próprio já verificado
          dkimEnabled: true,
          spfEnabled: true
        }
      })

      // Inicializar servidor SMTP (em produção isso seria um serviço separado)
      if (process.env.NODE_ENV === 'production') {
        const smtpServer = new DigiUrbanSMTPServer({
          tenantId,
          hostname: emailServer.hostname
        }, prisma)

        await smtpServer.start()
      }
    }

    // Log da contratação
    await prisma.auditLog.create({
      data: {
        tenantId,
        userId: session.user.id,
        action: 'EMAIL_SERVICE_SUBSCRIBED',
        resource: 'email_service',
        details: `Contratou plano de email: ${planId}`,
        ipAddress: req.socket.remoteAddress || 'unknown'
      }
    })

    return res.json({
      success: true,
      message: 'Serviço de email contratado com sucesso!',
      credentials: {
        email: `admin@${updatedTenant.subdomain}.digiurban.com.br`,
        password: defaultPassword,
        server: emailServer?.hostname,
        port: 587
      }
    })

  } catch (error) {
    console.error('Error subscribing to email service:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

function getEmailPlanPrice(planId: string): number {
  const prices = {
    basic: 49,
    standard: 99,
    premium: 199,
    enterprise: 399
  }
  return prices[planId as keyof typeof prices] || 0
}

function getEmailPlanLimit(planId: string): number {
  const limits = {
    basic: 5000,
    standard: 15000,
    premium: 50000,
    enterprise: 999999999
  }
  return limits[planId as keyof typeof limits] || 0
}

function generateSecurePassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  let password = ''
  for (let i = 0; i < 16; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}
```

#### 6. **Integração com Emails Transacionais**

**Arquivo: `src/lib/email/transactionalEmailService.ts`**

```typescript
import { PrismaClient } from '@prisma/client'
import nodemailer from 'nodemailer'

export class TransactionalEmailService {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async sendEmail(tenantId: string, templateName: string, to: string, variables: Record<string, any>) {
    try {
      // Buscar configurações do servidor de email do tenant
      const emailServer = await this.prisma.emailServer.findUnique({
        where: { tenantId },
        include: {
          domains: { where: { isVerified: true }, take: 1 },
          users: { where: { isAdmin: true }, take: 1 }
        }
      })

      if (!emailServer || !emailServer.isActive) {
        throw new Error('Email service not available for tenant')
      }

      // Buscar template
      const template = await this.prisma.emailTemplate.findUnique({
        where: {
          tenantId_name: {
            tenantId,
            name: templateName
          }
        }
      })

      if (!template) {
        throw new Error(`Email template '${templateName}' not found`)
      }

      // Processar variáveis no template
      const processedSubject = this.processTemplate(template.subject, variables)
      const processedHtml = this.processTemplate(template.htmlContent, variables)
      const processedText = template.textContent
        ? this.processTemplate(template.textContent, variables)
        : undefined

      // Configurar transporter para usar o servidor SMTP próprio
      const adminUser = emailServer.users[0]
      const domain = emailServer.domains[0]

      if (!adminUser || !domain) {
        throw new Error('SMTP configuration incomplete')
      }

      const transporter = nodemailer.createTransporter({
        host: emailServer.hostname,
        port: emailServer.submissionPort,
        secure: false,
        auth: {
          user: adminUser.email,
          pass: await this.decryptPassword(adminUser.passwordHash) // Implementar descriptografia
        }
      })

      // Enviar email
      const result = await transporter.sendMail({
        from: `"${variables.fromName || 'DigiUrban'}" <noreply@${domain.domainName}>`,
        to,
        subject: processedSubject,
        html: processedHtml,
        text: processedText
      })

      // Salvar na base de dados
      await this.prisma.email.create({
        data: {
          emailServerId: emailServer.id,
          domainId: domain.id,
          userId: adminUser.id,
          messageId: result.messageId,
          fromEmail: `noreply@${domain.domainName}`,
          toEmail: to,
          subject: processedSubject,
          htmlContent: processedHtml,
          textContent: processedText,
          status: 'SENT',
          sentAt: new Date(),
          campaignId: `transactional-${templateName}`,
          tags: ['transactional']
        }
      })

      return { success: true, messageId: result.messageId }

    } catch (error) {
      console.error('Error sending transactional email:', error)
      throw error
    }
  }

  private processTemplate(template: string, variables: Record<string, any>): string {
    let processed = template

    for (const [key, value] in Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g')
      processed = processed.replace(regex, String(value))
    }

    return processed
  }

  private async decryptPassword(hash: string): Promise<string> {
    // Implementar descriptografia da senha SMTP
    // Por agora, retornar uma senha temporária
    return 'temp-password'
  }

  // Templates padrão para emails transacionais
  async createDefaultTemplates(tenantId: string) {
    const defaultTemplates = [
      {
        name: 'user-confirmation',
        subject: 'Confirme seu cadastro - {{tenantName}}',
        htmlContent: `
          <h1>Bem-vindo ao {{tenantName}}!</h1>
          <p>Olá {{userName}},</p>
          <p>Para confirmar seu cadastro, clique no link abaixo:</p>
          <a href="{{confirmationUrl}}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Confirmar Cadastro
          </a>
          <p>Se não foi você quem se cadastrou, ignore este email.</p>
        `,
        category: 'transactional'
      },
      {
        name: 'password-recovery',
        subject: 'Recuperação de senha - {{tenantName}}',
        htmlContent: `
          <h1>Recuperação de Senha</h1>
          <p>Olá {{userName}},</p>
          <p>Você solicitou a recuperação de sua senha. Clique no link abaixo para criar uma nova:</p>
          <a href="{{recoveryUrl}}" style="background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Recuperar Senha
          </a>
          <p>Este link expira em 24 horas.</p>
        `,
        category: 'transactional'
      },
      {
        name: 'protocol-confirmation',
        subject: 'Protocolo {{protocolNumber}} confirmado - {{tenantName}}',
        htmlContent: `
          <h1>Protocolo Confirmado</h1>
          <p>Olá {{citizenName}},</p>
          <p>Seu protocolo foi registrado com sucesso:</p>
          <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;">
            <strong>Número:</strong> {{protocolNumber}}<br>
            <strong>Serviço:</strong> {{serviceName}}<br>
            <strong>Data:</strong> {{createdAt}}<br>
            <strong>Status:</strong> {{status}}
          </div>
          <p>Você pode acompanhar o andamento em: <a href="{{trackingUrl}}">{{trackingUrl}}</a></p>
        `,
        category: 'transactional'
      }
    ]

    for (const template of defaultTemplates) {
      await this.prisma.emailTemplate.upsert({
        where: {
          tenantId_name: {
            tenantId,
            name: template.name
          }
        },
        update: {},
        create: {
          ...template,
          tenantId
        }
      })
    }
  }
}

// Export singleton instance
export const transactionalEmail = new TransactionalEmailService(prisma)
```

### 💰 MODELO DE NEGÓCIO DO SERVIÇO DE EMAIL

#### **Planos de Serviço Email Próprio**

| Plano | Preço/Mês | Emails/Mês | Recursos |
|-------|------------|-------------|----------|
| **Básico** | R$ 49 | 5.000 | Domínio personalizado, DKIM/SPF, Suporte básico |
| **Padrão** 🌟 | R$ 99 | 15.000 | Múltiplos domínios, Templates, Estatísticas |
| **Premium** | R$ 199 | 50.000 | API completa, Automações, Suporte prioritário |
| **Enterprise** | R$ 399 | Ilimitado | Servidor dedicado, SLA, Suporte 24/7 |

#### **Implementação Comercial**

1. **Cobrança Adicional**: Serviço cobrado separadamente da mensalidade SaaS
2. **Pagamento**: Integrado com sistema de billing existente
3. **Ativação**: Imediata para domínio padrão (.digiurban.com.br)
4. **Setup Custom**: Suporte para configuração de domínio próprio
5. **Cancelamento**: Mantém dados por 30 dias para reativação

### 🎯 BENEFÍCIOS PARA AS PREFEITURAS

1. **Independência Total**: Sem dependência de SendGrid, Mailgun, etc.
2. **Domínio Próprio**: prefeitura.com.br, cidade.gov.br
3. **Reputação Controlada**: DKIM/SPF próprio, sem compartilhamento
4. **Compliance LGPD**: Dados processados na própria infraestrutura
5. **Economia Longo Prazo**: Custo fixo vs. volume crescente
6. **Branding Completo**: Emails com identidade municipal
7. **Controle Total**: Logs, estatísticas, configurações próprias

---

## 🔄 PASSO A PASSO DA IMPLEMENTAÇÃO

### **ETAPA 1: Preparação da Base** (2 semanas)

1. **Atualizar Schema Prisma**
   ```bash
   # Adicionar todos os models de email ao schema.prisma
   npx prisma migrate dev --name add-email-server
   ```

2. **Copiar UltraZend SMTP Server**
   ```bash
   # Adaptar código do ultrazend-smtp-server/ para usar Prisma
   cp -r ultrazend-smtp-server/src/server/* src/lib/email/
   # Modificar para usar PrismaClient ao invés de Knex
   ```

3. **Criar Serviços Base**
   - `DigiUrbanSMTPServer.ts` (adaptado do UltraZend)
   - `TransactionalEmailService.ts` (emails automáticos)
   - Migrations para criação de templates padrão

### **ETAPA 2: Painel Super Admin** (1 semana)

1. **Página DNS Management**
   - Criar `pages/super-admin/email-dns.tsx`
   - API para gerar registros DNS automaticamente
   - Interface para verificar status DNS

2. **Configurações Globais**
   - Pricing dos planos de email
   - Configurações de servidor (IPs, portas)
   - Monitoramento global de todos os tenants

### **ETAPA 3: Painel Admin** (2 semanas)

1. **Módulo de Serviço de Email**
   - Criar `pages/admin/email-service.tsx`
   - Tabs: Planos, Domínios, Estatísticas, Configurações
   - Interface para contratação de planos

2. **APIs de Gestão**
   - `/api/admin/email-service/` (GET configurações)
   - `/api/admin/email-service/subscribe` (POST contratar plano)
   - `/api/admin/email-service/domain` (POST adicionar domínio)
   - `/api/admin/email-service/stats` (GET estatísticas)

### **ETAPA 4: Integração Transacional** (1 semana)

1. **Templates de Email**
   - Templates padrão (confirmação, recuperação senha, protocolos)
   - Sistema de variáveis {{variableName}}
   - Interface para edição de templates

2. **Integração com Sistema Existente**
   ```typescript
   // Exemplo de uso em confirmação de usuário
   await transactionalEmail.sendEmail(tenantId, 'user-confirmation', email, {
     userName: user.name,
     confirmationUrl: `https://${tenant.subdomain}.digiurban.com.br/confirm/${token}`,
     tenantName: tenant.name
   })
   ```

### **ETAPA 5: Deploy e Configuração** (1 semana)

1. **Configuração de Infraestrutura**
   - Configurar portas 25 e 587 no servidor
   - Certificados TLS/SSL
   - Configuração de firewall

2. **Domínio Principal DigiUrban**
   - Configurar *.digiurban.com.br para subdomínios
   - DKIM/SPF para domínio principal
   - Sistema de verificação DNS automática

3. **Testes de Produção**
   - Teste de entrega para Gmail, Outlook, Yahoo
   - Teste de reputação e DKIM
   - Teste de performance e volume

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### ✅ **Backend (Prisma + Server)**
- [ ] Adicionar models de Email ao schema Prisma
- [ ] Adaptar UltraZend SMTP Server para Prisma
- [ ] Criar DigiUrbanSMTPServer class
- [ ] Implementar TransactionalEmailService
- [ ] Criar migrations para templates padrão

### ✅ **APIs**
- [ ] `/api/admin/email-service/` (configurações)
- [ ] `/api/admin/email-service/subscribe` (contratar)
- [ ] `/api/admin/email-service/domain` (domínios)
- [ ] `/api/super-admin/email-dns/` (DNS management)
- [ ] Webhook para confirmação de pagamento

### ✅ **Frontend - Super Admin**
- [ ] Página DNS Management
- [ ] Interface para configurar domínios
- [ ] Verificação automática de DNS
- [ ] Monitoramento de todos os servidores

### ✅ **Frontend - Admin**
- [ ] Módulo Email Service completo
- [ ] Tabs: Planos, Domínios, Stats, Configurações
- [ ] Interface de contratação de planos
- [ ] Dashboard de estatísticas de email

### ✅ **Integração**
- [ ] Emails transacionais (confirmação usuário)
- [ ] Emails de recuperação de senha
- [ ] Emails de confirmação de protocolo
- [ ] Emails de cobrança/faturamento
- [ ] Templates customizáveis

### ✅ **Infraestrutura**
- [ ] Configuração de portas SMTP (25, 587)
- [ ] Certificados TLS/SSL
- [ ] DNS para *.digiurban.com.br
- [ ] Monitoramento de reputação
- [ ] Backup de configurações DKIM

---

## 🚀 RESULTADO FINAL

Após a implementação completa, a DigiUrban terá:

### **Para o Super Admin**
- **Controle Total**: Gerenciar DNS e configurações de todos os tenants
- **Monitoramento Global**: Status de todos os servidores de email
- **Configuração Centralized**: Preços, limites, políticas globais

### **Para os Administradores (Prefeitos)**
- **Serviço Premium**: Planos de R$ 49 a R$ 399/mês
- **Domínio Próprio**: prefeitura.com.br com reputação independente
- **Dashboard Completo**: Estatísticas detalhadas de entrega
- **Configuração Simples**: Interface intuitiva para setup

### **Para a Aplicação**
- **Emails Transacionais**: Confirmações, recuperações, protocolos
- **Templates Personalizados**: Identidade visual municipal
- **Entrega Confiável**: Sem dependência de terceiros
- **Compliance LGPD**: Dados na própria infraestrutura

### **Modelo de Negócio**
- **Receita Adicional**: R$ 49-399/mês por prefeitura com email
- **Margem Alta**: Custo servidor compartilhado entre tenants
- **Diferencial Competitivo**: Independência total de email
- **Upsell Natural**: Planos crescentes conforme necessidade

**A implementação do servidor de email próprio posiciona a DigiUrban como a única plataforma municipal brasileira com total independência de comunicação! 🎯**

## Models Database

### Integration
```prisma
model Integration {
  id          String    @id @default(cuid())
  tenantId    String
  name        String    // Nome da integração
  type        String    // government, banking, health, etc
  provider    String    // receita-federal, datasus, etc
  config      Json      // configurações específicas
  credentials Json      // chaves e tokens (encrypted)
  isActive    Boolean   @default(true)
  lastSync    DateTime?
  createdAt   DateTime  @default(now())
  
  logs        IntegrationLog[]
  
  @@unique([tenantId, provider])
}
```

### IntegrationLog
```prisma
model IntegrationLog {
  id            String      @id @default(cuid())
  integrationId String
  entityType    String      // citizen, protocol, service
  entityId      String      // ID da entidade
  action        String      // validate, sync, update
  status        String      // success, error, pending
  request       Json?       // dados enviados
  response      Json?       // resposta recebida
  error         String?     // mensagem de erro
  createdAt     DateTime    @default(now())
  
  integration   Integration @relation(fields: [integrationId], references: [id])
}
```

## APIs de Integração

### Consultas Externas
- **POST /api/integrations/cpf/validate** - Validar CPF
- **POST /api/integrations/cnpj/validate** - Validar CNPJ
- **GET /api/integrations/cep/:cep** - Buscar endereço
- **POST /api/integrations/sus/validate** - Validar cartão SUS

### Sincronização
- **POST /api/integrations/:provider/sync** - Sincronizar dados
- **GET /api/integrations/:provider/status** - Status da integração
- **POST /api/integrations/:provider/test** - Testar conexão

### Configuração
- **GET /api/integrations** - Listar integrações ativas
- **POST /api/integrations** - Configurar nova integração
- **PUT /api/integrations/:id** - Atualizar configuração
- **DELETE /api/integrations/:id** - Desativar integração

## Serviços de Integração

### IntegrationService
```typescript
class IntegrationService {
  async validateCPF(cpf: string): Promise<ValidationResult>
  async validateCNPJ(cnpj: string): Promise<ValidationResult>
  async consultCEP(cep: string): Promise<AddressData>
  async validateSUS(susNumber: string): Promise<SUSData>
  async sendSMS(phone: string, message: string): Promise<boolean>
  async sendEmail(email: string, template: string, data: any): Promise<boolean>
}
```

### Queue System
- **Redis Queue**: Processamento assíncrono
- **Dead Letter Queue**: Falhas de integração
- **Retry Logic**: Tentativas automáticas
- **Rate Limiting**: Controle de requisições

## Componentes Frontend

### Integration Management
- **IntegrationCard** - Card de integração com status
- **ConfigModal** - Modal de configuração
- **TestConnection** - Teste de conectividade
- **LogViewer** - Visualizador de logs

### Data Validation
- **CPFValidator** - Validação CPF em tempo real
- **CNPJValidator** - Validação CNPJ automática
- **AddressLookup** - Busca de endereço por CEP
- **DocumentValidator** - Validação de documentos

## Automações

### Triggers Automáticos
- **Novo Cidadão**: Validar CPF automaticamente
- **Nova Empresa**: Consultar CNPJ na Receita
- **Novo Endereço**: Validar CEP nos Correios
- **Agendamento Saúde**: Verificar cartão SUS

### Workflows Integrados
- **Alvará Empresarial**: CPJ + IE + AVCB + Licença Ambiental
- **Programa Social**: CPF + Título Eleitor + Dados Bancários
- **Matrícula Escolar**: CPF + Comprovante Residência + Vacinas

## Fallback e Resiliência

### Circuit Breaker
- Proteção contra APIs instáveis
- Fallback para dados locais
- Monitoramento de saúde das APIs

### Cache Strategy
- Cache de consultas frequentes (CPF, CNPJ)
- TTL configurável por tipo de dados
- Invalidação automática

### Error Handling
- Log estruturado de erros
- Alertas para administradores
- Retry automático com backoff

## Compliance e Segurança

### LGPD
- Consentimento para consultas externas
- Log de acesso a dados pessoais
- Direito ao esquecimento

### Criptografia
- Credentials em repouso criptografadas
- Comunicação TLS obrigatória
- Rotation de chaves automática

## Monitoramento

### Health Checks
- Status de cada integração
- Tempo de resposta das APIs
- Taxa de sucesso/erro

### Alertas
- API indisponível
- Limite de requisições atingido
- Falhas consecutivas

## 📊 RESUMO DE VIABILIDADE (Baseado em Pesquisa 2024)

### 🟢 TOTALMENTE VIÁVEIS (Implementação Prioritária)
1. **PIX** - API oficial do Banco Central, amplamente suportado
2. **Email** - Múltiplos provedores maduros (SendGrid, SES, Mailgun)
3. **SMS/WhatsApp** - Zenvia, Twilio, WhatsApp Business API
4. **IBGE Localidades** - API oficial funcionando
5. **Receita Federal CNPJ** - API oficial gov.br

### 🟡 VIÁVEIS COM LIMITAÇÕES (Implementação Secundária)
1. **Open Finance** - Requer consentimento explícito do usuário
2. **DataSUS** - Requer credenciamento formal com Ministério da Saúde
3. **Receita Federal CPF** - Via web service, não API REST direta
4. **TransfereGov** - Dados públicos disponíveis, API limitada
5. **Correios** - Requer contrato comercial (usar ViaCEP como alternativa)

### 🔴 NÃO VIÁVEIS DIRETAMENTE (Alternativas Necessárias)
1. **TSE Título Eleitor** - Sem API pública, apenas validação local de formato
2. **ANVISA** - Sem API pública identificada
3. **APIs Estaduais** - Variam por estado, maioria sem API pública

## 🎯 ESTRATÉGIA DE IMPLEMENTAÇÃO RECOMENDADA

### **FASE 1 - Integrações Essenciais** (2-3 meses)
- PIX para pagamentos municipais
- ViaCEP para validação de endereços
- SendGrid/SES para emails transacionais
- IBGE API para códigos de municípios
- Receita Federal CNPJ para validação de empresas

### **FASE 2 - Integrações Avançadas** (3-4 meses)
- SMS via Zenvia/Twilio para notificações
- WhatsApp Business API para atendimento
- Open Finance (com consentimento do usuário)
- Portal da Transparência para dados de convênios

### **FASE 3 - Integrações Especializadas** (4-6 meses)
- DataSUS (após obter credenciamento oficial)
- Correios (se houver contrato comercial)
- Integrações estaduais específicas conforme disponibilidade

## ⚠️ CONSIDERAÇÕES TÉCNICAS E LEGAIS

### **Compliance e LGPD**
- Todas as consultas externas devem ter base legal
- Consentimento explícito para dados bancários via Open Finance
- Log de acessos obrigatório para auditoria
- Criptografia de credenciais em repouso

### **Fallbacks Obrigatórios**
- Circuit breaker para APIs instáveis
- Cache local para consultas frequentes
- Validação local quando API externa falha
- Interface manual para casos críticos

### **Monitoramento Essencial**
- Health checks para cada integração
- Alertas de falha ou indisponibilidade
- Métricas de performance e taxa de sucesso
- Logs estruturados para debugging

## Critérios de Sucesso Atualizados
1. ✅ **Integrações Fase 1** funcionando (PIX, CEP, Email, CNPJ)
2. ✅ **Validações automáticas** para casos essenciais operacionais
3. ✅ **Sistema de fallback** robusto para todas as integrações
4. ✅ **Logs e monitoramento** implementados com alertas
5. ✅ **Performance adequada** (<2s para consultas externas)
6. ✅ **Segurança e compliance** LGPD atendidos
7. ✅ **Interface de gerenciamento** para configurar integrações
8. ✅ **Automações integradas** aos fluxos municipais existentes