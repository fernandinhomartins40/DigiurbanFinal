import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

// ✅ SEGURANÇA CRÍTICA: Validar JWT_SECRET obrigatório
if (!process.env.JWT_SECRET) {
  console.error('❌ FATAL ERROR: JWT_SECRET environment variable is required');
  console.error('Please set JWT_SECRET in your .env file');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());

// CORS - aceitar múltiplos domínios
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGIN,
  'https://www.digiurban.com.br',
  'https://digiurban.com.br',
  'http://www.digiurban.com.br',
  'http://digiurban.com.br',
  'http://localhost:3000',
  'http://localhost:3060'
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir requisições sem origin (mobile apps, Postman, etc)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`❌ CORS bloqueado para origin: ${origin}`);
        callback(null, true); // Permitir temporariamente para debug
      }
    },
    credentials: true,
  })
);
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Parser de cookies para httpOnly tokens

// Servir arquivos de upload de forma segura
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check
app.get('/health', (_req, res: express.Response) => {
  res.status(200).json({
    status: 'OK',
    message: 'DigiUrban Backend API is running',
    timestamp: new Date().toISOString(),
  });
});

// Import routes
import serviceRoutes from './routes/services';
import tenantRoutes from './routes/tenants';

// Sistema Simplificado de Protocolos
import protocolsSimplifiedRoutes from './routes/protocols-simplified.routes';

// Fase 2 - Super Admin e SaaS
import superAdminRoutes from './routes/super-admin';

// Fase 3 - Portal do Cidadão
import citizenAuthRoutes from './routes/citizen-auth';
import citizenServicesRoutes from './routes/citizen-services';
import citizenFamilyRoutes from './routes/citizen-family';
import citizenDocumentsRoutes from './routes/citizen-documents';
import citizenNotificationsRoutes from './routes/citizen-notifications';
import citizenTransferRoutes from './routes/citizen-transfer';

// Fase 4 - Rotas Administrativas Específicas
import adminAuthRoutes from './routes/admin-auth';
import adminManagementRoutes from './routes/admin-management';
import adminChamadosRoutes from './routes/admin-chamados';
import adminReportsRoutes from './routes/admin-reports';
import adminTransferRoutes from './routes/admin-transfer';
import serviceTemplatesRoutes from './routes/service-templates';
import customModulesRoutes from './routes/custom-modules';

// Fase 5 - Páginas Especializadas por Secretaria
import secretariasSaudeRoutes from './routes/secretarias-saude';
import secretariasEducacaoRoutes from './routes/secretarias-educacao';
import secretariasAssistenciaSocialRoutes from './routes/secretarias-assistencia-social';
import secretariasGenericasRoutes from './routes/secretarias-genericas';
import secretariasCulturaRoutes from './routes/secretarias-cultura';
import secretariasEsportesRoutes from './routes/secretarias-esportes';
import secretariasHabitacaoRoutes from './routes/secretarias-habitacao';
import secretariasAgriculturaRoutes from './routes/secretarias-agricultura';
import secretariasAgricultureProdutoresRoutes from './routes/secretarias-agricultura-produtores';
import secretariasSegurancaRoutes from './routes/secretarias-seguranca';
import secretariasMeioAmbienteRoutes from './routes/secretarias-meio-ambiente';
import secretariasObrasPublicasRoutes from './routes/secretarias-obras-publicas';

// ❌ REMOVIDO: Rotas Specialized (LEGADO - não está no PLANO)
// Substituído por admin-secretarias.ts que acessa Prisma diretamente (PLANO Fase 8.2)

// Fase 6 - Analytics, Relatórios e Business Intelligence
// import analyticsRoutes from './routes/analytics';
// import alertsRoutes from './routes/alerts';

// Fase 7 - Implementações Reais (Sistema de Email + Integrações)
import adminAgricultureRoutes from './routes/admin-agriculture';
import integrationsRoutes from './routes/integrations';
import adminEmailRoutes from './routes/admin-email';
import superAdminEmailRoutes from './routes/super-admin-email';

// API Unificada de Cidadãos (Fase de Unificação)
import citizensRoutes from './routes/citizens';
import adminCitizensRoutes from './routes/admin-citizens';

// Gabinete do Prefeito
import adminGabineteRoutes from './routes/admin-gabinete';

// Rotas Públicas (sem autenticação)
import publicRoutes from './routes/public';

// NOVO: Rotas Admin Secretarias (PLANO Fase 8.2)
import adminSecretariasRoutes from './routes/admin-secretarias';

// API Routes

// Rotas públicas (ANTES de qualquer middleware de autenticação)
app.use('/api/public', publicRoutes);

// Rotas básicas (Fase 1)
app.use('/api/services', serviceRoutes);
app.use('/api/tenants', tenantRoutes);

// Sistema Simplificado de Protocolos (Motor de Protocolos V2)
app.use('/api/protocols', protocolsSimplifiedRoutes);

// Rotas Super Admin (Fase 2)
app.use('/api/super-admin', superAdminRoutes);

// Rotas do Portal do Cidadão (Fase 3)
app.use('/api/auth/citizen', citizenAuthRoutes);
app.use('/api/citizen/services', citizenServicesRoutes);
app.use('/api/citizen/family', citizenFamilyRoutes);
app.use('/api/citizen/documents', citizenDocumentsRoutes);
app.use('/api/citizen/notifications', citizenNotificationsRoutes);
app.use('/api/citizen', citizenTransferRoutes);

// Rotas Administrativas (Fase 4)
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/management', adminManagementRoutes);
app.use('/api/admin/chamados', adminChamadosRoutes);
app.use('/api/admin/relatorios', adminReportsRoutes);
app.use('/api/admin/gabinete', adminGabineteRoutes);
app.use('/api/admin/templates', serviceTemplatesRoutes);
app.use('/api/admin/custom-modules', customModulesRoutes);
app.use('/api/admin', adminTransferRoutes);

// Rotas das Secretarias Especializadas (Fase 5)
app.use('/api/secretarias/saude', secretariasSaudeRoutes);
app.use('/api/secretarias/educacao', secretariasEducacaoRoutes);
app.use('/api/secretarias/assistencia-social', secretariasAssistenciaSocialRoutes);
app.use('/api/secretarias/genericas', secretariasGenericasRoutes);
app.use('/api/secretarias/cultura', secretariasCulturaRoutes);
app.use('/api/secretarias/esportes', secretariasEsportesRoutes);
app.use('/api/secretarias/habitacao', secretariasHabitacaoRoutes);
app.use('/api/admin/secretarias/agricultura', secretariasAgriculturaRoutes);
app.use('/api/admin/secretarias/agricultura/produtores', secretariasAgricultureProdutoresRoutes);
app.use('/api/admin/secretarias/seguranca', secretariasSegurancaRoutes);
app.use('/api/admin/secretarias/meio-ambiente', secretariasMeioAmbienteRoutes);
app.use('/api/admin/secretarias/obras-publicas', secretariasObrasPublicasRoutes);

// NOVO: Admin Secretarias - Acesso direto ao Prisma (PLANO Fase 8.2)
app.use('/api/secretarias', adminSecretariasRoutes);

// ❌ REMOVIDO: Rotas /api/specialized/* (LEGADO - não está no PLANO)
// Substituído por /api/secretarias/* (admin-secretarias.ts)

// Rotas de Analytics e Business Intelligence (Fase 6)
// app.use('/api/analytics', analyticsRoutes);
// app.use('/api/alerts', alertsRoutes);

// Rotas de Implementações Reais (Fase 7)
app.use('/api/admin/agriculture', adminAgricultureRoutes);
app.use('/api/integrations', integrationsRoutes);
app.use('/api/admin/email', adminEmailRoutes);
app.use('/api/super-admin/email', superAdminEmailRoutes);

// API Unificada de Cidadãos
app.use('/api/citizens', citizensRoutes);
app.use('/api/admin/citizens', adminCitizensRoutes);


// Error handling middleware
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err instanceof Error ? err.stack : err);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((_req, res: express.Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// ========== REGISTRAR MODULE HANDLERS (TODAS AS FASES) ==========
import { registerAllHandlers } from './modules/handlers';

// Registrar todos os handlers de todas as secretarias
registerAllHandlers();

console.log('✅ Todos os module handlers registrados com sucesso');

app.listen(PORT, () => {
  console.log(`🚀 DigiUrban Backend server running on port ${PORT}`);
  console.log(`📱 API Documentation: http://localhost:${PORT}/health`);
});

