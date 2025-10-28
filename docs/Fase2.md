# FASE 2 - Landing Page e Gestão de Tenants

## Objetivo
Implementar landing page comercial e sistema completo de gestão de prefeituras no painel Super Admin.

## Landing Page
### Seções Principais
- **Hero**: "Transforme a Gestão Municipal com DigiUrban"
- **Features**: 3 pontos de entrada, 174 páginas, motor unificado
- **Pricing**: STARTER (R$ 1.200), PROFESSIONAL (R$ 4.500), ENTERPRISE (R$ 12.500)
- **Social Proof**: Depoimentos e números de sucesso
- **CTAs**: "Solicitar Demo" e "Trial Grátis"

### Formulários de Conversão
- Demo request (nome, email, cargo, município)
- Trial signup (dados prefeitura + admin)
- Newsletter e contato

## Painel Super Admin
### Dashboard Principal
- **KPIs Financeiros**: MRR, ARR, Churn Rate, CAC/LTV
- **Métricas Crescimento**: Novos tenants, expansão, retenção
- **Usage Metrics**: Protocolos processados, usuários ativos
- **Mapa Geográfico**: Distribuição por estado

### Gestão de Tenants
- **Lista Tenants**: Tabela com filtros e busca
- **Status Management**: Ativo, Trial, Suspenso, Cancelado
- **Usage Monitoring**: Limites vs. uso atual
- **Actions**: Editar, suspender, upgrade/downgrade

### Billing Automático
- **Faturamento Mensal**: Geração automática
- **Invoice Management**: Status pagamento, download
- **Dunning Process**: Gestão inadimplência
- **Payment History**: Histórico completo

## Models Backend
### Tenant Extended
```prisma
model Tenant {
  id         String      @id @default(cuid())
  name       String      // Nome da Prefeitura
  cnpj       String      @unique
  domain     String?     @unique
  plan       Plan        @default(STARTER)
  status     TenantStatus @default(TRIAL)
  population Int?
  billing    Json?       // dados cobrança
  limits     Json?       // limites do plano
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
}
```

### Invoice System
```prisma
model Invoice {
  id        String        @id @default(cuid())
  tenantId  String
  amount    Float
  plan      Plan
  period    String        // 2024-01
  status    InvoiceStatus @default(PENDING)
  dueDate   DateTime
  paidAt    DateTime?
  createdAt DateTime      @default(now())
}
```

## APIs Super Admin
- **GET /api/super-admin/tenants**: Listar todos
- **POST /api/super-admin/tenants**: Criar tenant
- **PUT /api/super-admin/tenants/:id**: Atualizar
- **POST /api/super-admin/billing/generate**: Gerar faturas
- **GET /api/super-admin/analytics**: KPIs dashboard

## Multi-tenant Setup
### Subdomain Resolution
- **Identificação**: contagem.digiurban.com → tenant "contagem"
- **Middleware**: Resolver tenant por host header
- **Data Isolation**: Filtrar todas queries por tenant_id
- **Plan Enforcement**: Verificar limites do plano

### nginx Configuration
```nginx
server {
    server_name *.digiurban.com;
    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Tenant $1;
    }
}
```

## Billing Integration
### Payment Gateway
- **Stripe/PagSeguro**: Integração para pagamentos
- **Webhooks**: Atualização status pagamento
- **Cron Jobs**: Geração automática faturas mensais
- **Suspension Logic**: Suspender por inadimplência

## Frontend Components
### Landing Page
- **PricingCard**: Card de plano com features
- **TestimonialCarousel**: Depoimentos rotativos
- **StatsCounter**: Números animados
- **ContactForm**: Formulários de conversão

### Super Admin
- **DataTable**: Tabela com filtros avançados
- **KPICard**: Cards de métricas
- **Charts**: Gráficos Recharts
- **TenantModal**: Modal criação tenant

## Environment Variables
```env
# Multi-tenant
MULTI_TENANT_MODE=subdomain
DEFAULT_DOMAIN=digiurban.com

# Billing
STRIPE_SECRET_KEY=sk_...
SMTP_HOST=smtp.mailgun.org

# Database
DATABASE_URL="file:./dev.db"
```

## Critérios de Sucesso
1. Landing page responsiva funcionando
2. Formulários de conversão operacionais
3. Multi-tenancy por subdomínio
4. Dashboard Super Admin completo
5. Sistema billing automático
6. Provisioning automático de tenants
7. Enforcement de limites por plano
8. Analytics e KPIs funcionando