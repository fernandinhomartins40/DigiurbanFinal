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
import protocolRoutes from './routes/protocols';
import serviceRoutes from './routes/services';
import tenantRoutes from './routes/tenants';

// Fase 2 - Super Admin e SaaS
import superAdminRoutes from './routes/super-admin';

// Fase 3 - Portal do Cidadão
import citizenAuthRoutes from './routes/citizen-auth';
import citizenServicesRoutes from './routes/citizen-services';
import citizenProtocolsRoutes from './routes/citizen-protocols';
import citizenFamilyRoutes from './routes/citizen-family';
import citizenDocumentsRoutes from './routes/citizen-documents';
import citizenNotificationsRoutes from './routes/citizen-notifications';
import citizenTransferRoutes from './routes/citizen-transfer';

// Fase 4 - Rotas Administrativas Específicas
import adminAuthRoutes from './routes/admin-auth';
import adminProtocolsRoutes from './routes/admin-protocols';
import adminManagementRoutes from './routes/admin-management';
import adminChamadosRoutes from './routes/admin-chamados';
import adminReportsRoutes from './routes/admin-reports';
import adminTransferRoutes from './routes/admin-transfer';

// Fase 5 - Páginas Especializadas por Secretaria
import secretariasSaudeRoutes from './routes/secretarias-saude';
import secretariasEducacaoRoutes from './routes/secretarias-educacao';
import secretariasAssistenciaSocialRoutes from './routes/secretarias-assistencia-social';
import secretariasGenericasRoutes from './routes/secretarias-genericas';
import secretariasCulturaRoutes from './routes/secretarias-cultura';
import secretariasEsporteRoutes from './routes/secretarias-esporte';
import secretariasHabitacaoRoutes from './routes/secretarias-habitacao';

// Specialized routes
import agricultureSpecializedRoutes from './routes/specialized/agriculture';
import cultureSpecializedRoutes from './routes/specialized/culture';
import educationSpecializedRoutes from './routes/specialized/education';
import environmentSpecializedRoutes from './routes/specialized/environment';
import healthSpecializedRoutes from './routes/specialized/health';
import housingSpecializedRoutes from './routes/specialized/housing';
import publicServicesSpecializedRoutes from './routes/specialized/public-services';
import publicWorksSpecializedRoutes from './routes/specialized/public-works';
import securitySpecializedRoutes from './routes/specialized/security';
import socialAssistanceSpecializedRoutes from './routes/specialized/social-assistance';
import sportsSpecializedRoutes from './routes/specialized/sports';
import tourismSpecializedRoutes from './routes/specialized/tourism';
import urbanPlanningSpecializedRoutes from './routes/specialized/urban-planning';

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

// API Routes

// Rotas públicas (ANTES de qualquer middleware de autenticação)
app.use('/api/public', publicRoutes);

// Rotas básicas (Fase 1)
app.use('/api/protocols', protocolRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/tenants', tenantRoutes);

// Rotas Super Admin (Fase 2)
app.use('/api/super-admin', superAdminRoutes);

// Rotas do Portal do Cidadão (Fase 3)
app.use('/api/auth/citizen', citizenAuthRoutes);
app.use('/api/citizen/services', citizenServicesRoutes);
app.use('/api/citizen/protocols', citizenProtocolsRoutes);
app.use('/api/citizen/family', citizenFamilyRoutes);
app.use('/api/citizen/documents', citizenDocumentsRoutes);
app.use('/api/citizen/notifications', citizenNotificationsRoutes);
app.use('/api/citizen', citizenTransferRoutes);

// Rotas Administrativas (Fase 4)
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/protocols', adminProtocolsRoutes);
app.use('/api/admin/management', adminManagementRoutes);
app.use('/api/admin/chamados', adminChamadosRoutes);
app.use('/api/admin/relatorios', adminReportsRoutes);
app.use('/api/admin/gabinete', adminGabineteRoutes);
app.use('/api/admin', adminTransferRoutes);

// Rotas das Secretarias Especializadas (Fase 5)
app.use('/api/secretarias/saude', secretariasSaudeRoutes);
app.use('/api/secretarias/educacao', secretariasEducacaoRoutes);
app.use('/api/secretarias/assistencia-social', secretariasAssistenciaSocialRoutes);
app.use('/api/secretarias/genericas', secretariasGenericasRoutes);
app.use('/api/secretarias/cultura', secretariasCulturaRoutes);
app.use('/api/secretarias/esporte', secretariasEsporteRoutes);
app.use('/api/secretarias/habitacao', secretariasHabitacaoRoutes);

// Specialized API Routes
app.use('/api/specialized/agriculture', agricultureSpecializedRoutes);
app.use('/api/specialized/culture', cultureSpecializedRoutes);
app.use('/api/specialized/education', educationSpecializedRoutes);
app.use('/api/specialized/environment', environmentSpecializedRoutes);
app.use('/api/specialized/health', healthSpecializedRoutes);
app.use('/api/specialized/housing', housingSpecializedRoutes);
app.use('/api/specialized/public-services', publicServicesSpecializedRoutes);
app.use('/api/specialized/public-works', publicWorksSpecializedRoutes);
app.use('/api/specialized/security', securitySpecializedRoutes);
app.use('/api/specialized/social-assistance', socialAssistanceSpecializedRoutes);
app.use('/api/specialized/sports', sportsSpecializedRoutes);
app.use('/api/specialized/tourism', tourismSpecializedRoutes);
app.use('/api/specialized/urban-planning', urbanPlanningSpecializedRoutes);

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

app.listen(PORT, () => {
  console.log(`🚀 DigiUrban Backend server running on port ${PORT}`);
  console.log(`📱 API Documentation: http://localhost:${PORT}/health`);
});

