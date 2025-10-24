import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import * as crypto from 'crypto';
import * as dns from 'dns';
import { promisify } from 'util';

// ====================== TIPOS E INTERFACES ISOLADAS ======================

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  isActive: boolean;
  tenantId: string;
  departmentId?: string;
}

interface Tenant {
  id: string;
  name: string;
  cnpj?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SuperAdminRequest {
  user?: User;
  tenant?: Tenant;
  tenantId: string;
  params: Record<string, string>;
  query: Record<string, string | string[]>;
  body: Record<string, unknown>;
  ip?: string;
}

interface SuccessResponse<T = unknown> {
  success: true;
  data?: T;
  message?: string;
  [key: string]: unknown;
}

interface ErrorResponse {
  success: false;
  error: string;
  message?: string;
  details?: unknown;
}

// Interface para DNS Records (Integrações Externas)
interface DNSRecord {
  type: 'MX' | 'TXT' | 'CNAME';
  name: string;
  value: string;
  priority?: number;
  ttl: number;
  description: string;
}

const router = Router();
const resolveTxt = promisify(dns.resolveTxt);
const resolveMx = promisify(dns.resolveMx);

// ====================== HELPER FUNCTIONS ======================

function getStringParam(param: string | string[] | unknown): string {
  if (Array.isArray(param)) return param[0] || '';
  if (typeof param === 'string') return param;
  if (param && typeof param === 'object' && param.toString) return param.toString();
  return '';
}

function getNumberParam(param: string | string[] | unknown): number {
  if (typeof param === 'number') return param;
  if (typeof param === 'string') return parseInt(param, 10) || 0;
  return 0;
}

function createSuccessResponse<T>(data?: T, message?: string): SuccessResponse<T> {
  return {
    success: true,
    ...(data !== undefined && { data }),
    ...(message && { message })
  };
}

function createErrorResponse(error: string, message?: string, details?: unknown): ErrorResponse {
  return {
    success: false,
    error,
    ...(message && { message }),
    details
  };
}

function isValidId(id: string): boolean {
  return !!(id && id.length > 0 && id.trim() !== '');
}

function isSuperAdminRequest(req: SuperAdminRequest): boolean {
  return !!(req.user && req.user.role === 'SUPER_ADMIN');
}

function handleAsyncRoute(fn: (req: any, res: Response) => Promise<void>) {
  return (req: any, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res)).catch(next);
  };
}

// ====================== MIDDLEWARE FUNCTIONS ======================

function authenticateToken(_req: Request, _res: Response, next: NextFunction) {
  next();
}

function requireRole(_role: string) {
  return (_req: Request, _res: Response, next: NextFunction) => {
    next();
  };
}

// Middleware para autenticação de Super Admin
router.use(authenticateToken);
router.use(requireRole('SUPER_ADMIN'));

/**
 * GET /api/super-admin/email-dns
 * Listar todos os tenants com serviço de email
 */
router.get(
  '/email-dns',
  handleAsyncRoute(async (req, res) => {
    if (!isSuperAdminRequest(req)) {
      res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
      return;
    }

    try {
      const tenants = await prisma.tenant.findMany({
        where: {
          hasEmailService: true,
        },
        include: {
          emailServer: {
            include: {
              domains: {
                orderBy: { createdAt: 'desc' },
              },
              _count: {
                select: {
                  emails: true,
                  users: true,
                },
              },
            },
          },
        },
        orderBy: { name: 'asc' },
      });

      const tenantsWithStats = tenants.map(tenant => ({
        id: tenant.id,
        name: tenant.name,
        // domain removido
        plan: tenant.emailPlanType,
        status: tenant.status,
        emailServer: tenant.emailServer
          ? {
              id: tenant.emailServer.id,
              hostname: tenant.emailServer.hostname,
              isActive: tenant.emailServer.isActive,
              domainsCount: tenant.emailServer.domains.length,
              usersCount: tenant.emailServer._count.users,
              emailsCount: tenant.emailServer._count.emails,
              domains: tenant.emailServer.domains,
            }
          : null,
      }));

      res.json(createSuccessResponse(tenantsWithStats));
    } catch (error) {
      console.error('Error getting tenants with email service:', error);
      res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
    }
  })
);

/**
 * GET /api/super-admin/email-dns/:tenantId
 * Obter configuração DNS de um tenant específico
 */
router.get(
  '/email-dns/:tenantId',
  handleAsyncRoute(async (req, res) => {
    if (!isSuperAdminRequest(req)) {
      res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
      return;
    }

    try {
      const tenantId = getStringParam(req.params.tenantId);

      if (!isValidId(tenantId)) {
        res.status(400).json(createErrorResponse('INVALID_TENANT_ID', 'ID do tenant inválido'));
        return;
      }

      const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        include: {
          emailServer: {
            include: {
              domains: {
                orderBy: { createdAt: 'desc' },
              },
            },
          },
        },
      });

      if (!tenant) {
        res.status(404).json(createErrorResponse('TENANT_NOT_FOUND', 'Tenant não encontrado'));
        return;
      }

      if (!tenant.emailServer) {
        res.status(404).json(createErrorResponse('EMAIL_SERVER_NOT_FOUND', 'Servidor de email não encontrado para o tenant'));
        return;
      }

      // Gerar registros DNS para cada domínio
      const domainsWithDNS = await Promise.all(
        tenant.emailServer.domains.map(async domain => {
          const dnsRecords = generateDNSRecords(
            domain.domainName,
            tenant.emailServer!.hostname,
            domain.verificationToken || 'no-token'
          );

          // Verificar status DNS
          const dnsStatus = await checkDNSStatus(domain.domainName, dnsRecords);

          return {
            ...domain,
            dnsRecords,
            dnsStatus,
          };
        })
      );

      res.json(createSuccessResponse({
        tenant: {
          id: tenant.id,
          name: tenant.name,
          // domain removido
          plan: tenant.emailPlanType,
        },
        emailServer: {
          id: tenant.emailServer.id,
          hostname: tenant.emailServer.hostname,
          isActive: tenant.emailServer.isActive,
        },
        domains: domainsWithDNS,
      }));
    } catch (error) {
      console.error('Error getting tenant DNS config:', error);
      res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
    }
  })
);

/**
 * POST /api/super-admin/email-dns/:tenantId/generate
 * Regenerar configurações DNS para um tenant
 */
router.post(
  '/email-dns/:tenantId/generate',
  handleAsyncRoute(async (req, res) => {
    if (!isSuperAdminRequest(req)) {
      res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
      return;
    }

    try {
      const tenantId = getStringParam(req.params.tenantId);

      if (!isValidId(tenantId)) {
        res.status(400).json(createErrorResponse('INVALID_TENANT_ID', 'ID do tenant inválido'));
        return;
      }

      const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        include: {
          emailServer: {
            include: {
              domains: true,
            },
          },
        },
      });

      if (!tenant?.emailServer) {
        res.status(404).json(createErrorResponse('EMAIL_SERVER_NOT_FOUND', 'Servidor de email não encontrado'));
        return;
      }

      // Regenerar chaves DKIM e tokens de verificação
      const updatedDomains = await Promise.all(
        tenant.emailServer.domains.map(async domain => {
          const newVerificationToken = crypto.randomBytes(32).toString('hex');
          const { publicKey, privateKey } = await generateDKIMKeys(domain.domainName);

          return await prisma.emailDomain.update({
            where: { id: domain.id },
            data: {
              verificationToken: newVerificationToken,
              dkimPublicKey: publicKey,
              dkimPrivateKey: privateKey, // Em produção, criptografar
              isVerified: false, // Requer nova verificação
            },
          });
        })
      );

      // Gerar novos registros DNS
      const domainsWithDNS = updatedDomains.map(domain => ({
        ...domain,
        dnsRecords: generateDNSRecords(
          domain.domainName,
          tenant.emailServer!.hostname,
          domain.verificationToken!
        ),
      }));

      // Log da ação
      await prisma.auditLog.create({
        data: {
          tenantId,
          userId: req.user!.id,
          action: 'DNS_REGENERATED',
          resource: 'email_dns',
          details: { domainsCount: updatedDomains.length, message: `Regenerated DNS records for ${updatedDomains.length} domains` },
          ip: req.ip || 'unknown',
          success: true,
        },
      });

      res.json(createSuccessResponse({
        domains: domainsWithDNS,
      }, 'DNS records regenerated successfully'));
    } catch (error) {
      console.error('Error regenerating DNS:', error);
      res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
    }
  })
);

/**
 * POST /api/super-admin/email-dns/:tenantId/verify-all
 * Verificar DNS de todos os domínios de um tenant
 */
router.post(
  '/email-dns/:tenantId/verify-all',
  handleAsyncRoute(async (req, res) => {
    if (!isSuperAdminRequest(req)) {
      res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
      return;
    }

    try {
      const tenantId = getStringParam(req.params.tenantId);

      if (!isValidId(tenantId)) {
        res.status(400).json(createErrorResponse('INVALID_TENANT_ID', 'ID do tenant inválido'));
        return;
      }

      const emailServer = await prisma.emailServer.findUnique({
        where: { tenantId },
        include: {
          domains: true,
        },
      });

      if (!emailServer) {
        res.status(404).json(createErrorResponse('EMAIL_SERVER_NOT_FOUND', 'Servidor de email não encontrado'));
        return;
      }

      // Verificar cada domínio
      const verificationResults = await Promise.all(
        emailServer.domains.map(async domain => {
          try {
            const isVerified = await verifyDomainDNS(domain.domainName, domain.verificationToken!);

            if (isVerified) {
              await prisma.emailDomain.update({
                where: { id: domain.id },
                data: {
                  isVerified: true,
                  verificationToken: null,
                },
              });
            }

            return {
              domainId: domain.id,
              domainName: domain.domainName,
              isVerified,
              previouslyVerified: domain.isVerified,
            };
          } catch (error) {
            return {
              domainId: domain.id,
              domainName: domain.domainName,
              isVerified: false,
              error: (error as Error).message,
              previouslyVerified: domain.isVerified,
            };
          }
        })
      );

      const verifiedCount = verificationResults.filter(r => r.isVerified).length;
      const totalCount = verificationResults.length;

      res.json(createSuccessResponse({
        results: verificationResults,
      }, `Verified ${verifiedCount} of ${totalCount} domains`));
    } catch (error) {
      console.error('Error verifying all domains:', error);
      res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
    }
  })
);

/**
 * GET /api/super-admin/email-dns/global-stats
 * Estatísticas globais do sistema de email
 */
router.get(
  '/email-dns/global-stats',
  handleAsyncRoute(async (req, res) => {
    if (!isSuperAdminRequest(req)) {
      res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
      return;
    }

    try {
      const [
        totalTenants,
        activeEmailServices,
        totalDomains,
        verifiedDomains,
        totalEmails,
        emailsThisMonth,
      ] = await Promise.all([
        prisma.tenant.count(),
        prisma.tenant.count({ where: { hasEmailService: true } }),
        prisma.emailDomain.count(),
        prisma.emailDomain.count({ where: { isVerified: true } }),
        prisma.email.count(),
        prisma.email.count({
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
        }),
      ]);

      // Estatísticas por plano
      const planStats = await prisma.tenant.groupBy({
        by: ['emailPlanType'],
        where: { hasEmailService: true },
        _count: true,
      });

      // Top 5 tenants por volume de emails
      const topTenants = await prisma.email.groupBy({
        by: ['emailServerId'],
        _count: true,
        orderBy: { _count: { emailServerId: 'desc' } },
        take: 5,
      });

      const topTenantsDetails = await Promise.all(
        topTenants.map(async item => {
          const emailServer = await prisma.emailServer.findUnique({
            where: { id: item.emailServerId! },
            include: { tenant: true },
          });
          return {
            tenant: emailServer?.tenant.name,
            hostname: emailServer?.hostname,
            emailCount: item._count,
          };
        })
      );

      res.json(createSuccessResponse({
        overview: {
          totalTenants,
          activeEmailServices,
          emailServiceAdoption:
            totalTenants > 0 ? ((activeEmailServices / totalTenants) * 100).toFixed(1) + '%' : '0%',
        },
        domains: {
          total: totalDomains,
          verified: verifiedDomains,
          verificationRate:
            totalDomains > 0 ? ((verifiedDomains / totalDomains) * 100).toFixed(1) + '%' : '0%',
        },
        emails: {
          totalAllTime: totalEmails,
          thisMonth: emailsThisMonth,
        },
        plans: planStats.map(stat => ({
          plan: stat.emailPlanType,
          count: stat._count,
        })),
        topTenants: topTenantsDetails,
      }));
    } catch (error) {
      console.error('Error getting global stats:', error);
      res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
    }
  })
);

/**
 * PUT /api/super-admin/email-dns/:tenantId/server
 * Atualizar configurações do servidor de email
 */
router.put(
  '/email-dns/:tenantId/server',
  handleAsyncRoute(async (req, res) => {
    if (!isSuperAdminRequest(req)) {
      res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
      return;
    }

    try {
      const tenantId = getStringParam(req.params.tenantId);
      const hostname = getStringParam(req.body.hostname);
      const mxPort = getNumberParam(req.body.mxPort);
      const submissionPort = getNumberParam(req.body.submissionPort);
      const maxEmailsPerMonth = getNumberParam(req.body.maxEmailsPerMonth);
      const isActive = req.body.isActive;

      if (!isValidId(tenantId)) {
        res.status(400).json(createErrorResponse('INVALID_TENANT_ID', 'ID do tenant inválido'));
        return;
      }

      const emailServer = await prisma.emailServer.findUnique({
        where: { tenantId },
      });

      if (!emailServer) {
        res.status(404).json(createErrorResponse('EMAIL_SERVER_NOT_FOUND', 'Servidor de email não encontrado'));
        return;
      }

      const updatedServer = await prisma.emailServer.update({
        where: { id: emailServer.id },
        data: {
          ...(hostname && { hostname }),
          ...(mxPort && { mxPort }),
          ...(submissionPort && { submissionPort }),
          ...(maxEmailsPerMonth && { maxEmailsPerMonth }),
          ...(typeof isActive === 'boolean' && { isActive }),
        },
      });

      // Log da alteração
      await prisma.auditLog.create({
        data: {
          tenantId,
          userId: req.user!.id,
          action: 'EMAIL_SERVER_UPDATED',
          resource: 'email_server',
          details: { fields: Object.keys(req.body), message: `Updated server configuration: ${Object.keys(req.body).join(', ')}` },
          ip: req.ip || 'unknown',
          success: true,
        },
      });

      res.json(createSuccessResponse({
        emailServer: updatedServer,
      }));
    } catch (error) {
      console.error('Error updating email server:', error);
      res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
    }
  })
);

// Funções auxiliares

function generateDNSRecords(domain: string, hostname: string, verificationToken: string): DNSRecord[] {
  return [
    {
      type: 'MX',
      name: domain,
      value: hostname,
      priority: 10,
      ttl: 3600,
      description: 'Mail Exchange record - direciona emails para o servidor',
    },
    {
      type: 'TXT',
      name: domain,
      value: `v=spf1 mx include:${hostname} ~all`,
      ttl: 3600,
      description: 'SPF record - autoriza o servidor a enviar emails',
    },
    {
      type: 'TXT',
      name: `_dmarc.${domain}`,
      value: `v=DMARC1; p=quarantine; rua=mailto:dmarc@${hostname}; ruf=mailto:dmarc@${hostname}`,
      ttl: 3600,
      description: 'DMARC policy - define como tratar emails não autenticados',
    },
    {
      type: 'TXT',
      name: `digiurban-verification.${domain}`,
      value: verificationToken,
      ttl: 300,
      description: 'Token de verificação DigiUrban - confirma propriedade do domínio',
    },
    {
      type: 'CNAME',
      name: `mail.${domain}`,
      value: hostname,
      ttl: 3600,
      description: 'Alias para interface web do email',
    },
    {
      type: 'TXT',
      name: `default._domainkey.${domain}`,
      value: 'v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...', // Placeholder
      ttl: 3600,
      description: 'DKIM public key - autenticação de emails',
    },
  ];
}

async function checkDNSStatus(domain: string, expectedRecords: DNSRecord[]) {
  const status: Record<string, { configured: boolean; error?: string }> = {};

  for (const record of expectedRecords) {
    try {
      switch (record.type) {
        case 'MX':
          const mxRecords = await resolveMx(domain);
          status[`MX-${record.name}`] = {
            configured: mxRecords.some(mx => mx.exchange.includes(record.value)),
          };
          break;

        case 'TXT':
          const txtRecords = await resolveTxt(record.name);
          const searchValue = record.value.split(' ')[0] || record.value;
          status[`TXT-${record.name}`] = {
            configured: txtRecords.flat().some(txt => txt.includes(searchValue)),
          };
          break;

        case 'CNAME':
          // Verificação CNAME seria mais complexa, simplificando
          status[`CNAME-${record.name}`] = { configured: false };
          break;

        default:
          status[`${record.type}-${record.name}`] = { configured: false };
      }
    } catch (error) {
      status[`${record.type}-${record.name}`] = {
        configured: false,
        error: (error as Error).message,
      };
    }
  }

  return status;
}

async function verifyDomainDNS(domain: string, verificationToken: string): Promise<boolean> {
  try {
    const txtRecords = await resolveTxt(`digiurban-verification.${domain}`);
    return txtRecords.flat().includes(verificationToken);
  } catch (error) {
    return false;
  }
}

async function generateDKIMKeys(domain: string) {
  // Em produção, usar crypto.generateKeyPairSync para gerar chaves RSA reais
  // Por agora, retornar placeholders
  const publicKey = `v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC${Buffer.from(domain).toString('base64')}...`;
  const privateKey = `-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA${Buffer.from(domain + Date.now()).toString('base64')}...\n-----END RSA PRIVATE KEY-----`;

  return { publicKey, privateKey };
}

export default router;
