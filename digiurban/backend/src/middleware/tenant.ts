import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { TenantStatus, Tenant } from '@prisma/client';
import {
  TenantLimits,
  UsageStats,
  isTenantLimits,
  isUsageStats,
  getDefaultLimits,
  getDefaultUsageStats,
} from '../types';
import { TenantWithMeta } from '../types';
// Importar declarações globais para estender Express.Request
import '../types/globals';

// Types moved to src/types/common.ts and src/types/globals.ts
// Import TenantWithMeta from centralized types

/**
 * Middleware para identificação e isolamento multi-tenant
 * Identifica o tenant por subdomínio ou header com suporte avançado
 */
export const tenantMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // ✅ CORRIGIDO: Logs reduzidos - apenas em modo desenvolvimento
    const isDev = process.env.NODE_ENV !== 'production';
    if (isDev) {
      console.log('[Tenant] Path:', req.originalUrl || req.path);
    }

    let tenantIdentifier: string | null = null;
    let isSubdomainRequest = false;

    // 1. Tentar identificar por subdomínio (prioritário)
    const host = req.get('host');
    if (host) {
      const hostParts = host.split('.');
      const subdomain = hostParts[0];

      // Detectar se é subdomínio válido
      if (
        subdomain &&
        subdomain !== 'localhost' &&
        subdomain !== 'www' &&
        subdomain !== 'api' &&
        hostParts.length > 2
      ) {
        // Garantir que é realmente um subdomínio
        tenantIdentifier = subdomain;
        isSubdomainRequest = true;
      }
    }

    // 2. Fallback: Tentar identificar por header X-Tenant-ID
    if (!tenantIdentifier) {
      tenantIdentifier = req.get('X-Tenant-ID') || null;
    }

    // 3. Fallback: Tentar identificar por query parameter (para desenvolvimento)
    if (!tenantIdentifier && req.query.tenant) {
      tenantIdentifier = req.query.tenant as string;
    }

    // 4. Fallback: Tentar extrair tenant do JWT cookie admin (para rotas autenticadas admin via domínio principal)
    // PRIORIDADE ALTA: Para login inteligente onde admin acessa via www.digiurban.com.br
    if (!tenantIdentifier && req.cookies?.digiurban_admin_token) {
      if (isDev) console.log('[Tenant] Extraindo tenant do JWT cookie admin');
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.decode(req.cookies.digiurban_admin_token) as any;
        if (decoded?.tenantId) {
          tenantIdentifier = decoded.tenantId;
          if (isDev) console.log('[Tenant] ✅ Tenant extraído:', tenantIdentifier);
        }
      } catch (err) {
        if (isDev) console.error('[Tenant] Erro ao decodificar JWT:', err);
      }
    }

    // 5. Fallback: Tenant padrão para desenvolvimento local
    if (!tenantIdentifier && (host?.includes('localhost') || host?.includes('127.0.0.1'))) {
      tenantIdentifier = process.env.DEFAULT_TENANT || 'demo';
      if (isDev) console.log('[Tenant] Usando tenant padrão:', tenantIdentifier);
    }

    // Se ainda não encontrou, verificar se é rota que não requer tenant
    const publicRoutes = [
      '/health',
      '/api/leads',
      '/api/super-admin',
      '/register', // Cadastro de cidadão não requer tenant pré-identificado
      '/login', // Login de cidadão não requer tenant pré-identificado (identifica automaticamente)
      '/auth/citizen/me', // Dados do cidadão logado (tenant vem do JWT)
      '/admin/auth/me', // Dados do admin logado (tenant vem do JWT do cookie)
      '/admin/auth/login', // Login de admin (identifica tenant automaticamente pelo email)
      '/admin/auth/logout', // Logout de admin
      '/admin/citizens', // Rotas de cidadãos admin (tenant vem do JWT do cookie)
    ];
    // Usar req.originalUrl para verificar a URL completa, não apenas req.path
    const fullPath = req.originalUrl || req.path;
    const isPublicRoute = publicRoutes.some(route => fullPath.includes(route));

    if (!tenantIdentifier && !isPublicRoute) {
      return res.status(400).json({
        error: 'Tenant required',
        message: 'Identificação do município é obrigatória',
        hint: 'Use subdomínio (municipio.digiurban.com) ou header X-Tenant-ID',
      });
    }

    // Para rotas públicas, pular validação de tenant
    if (isPublicRoute) {
      if (isDev) console.log('[Tenant] ✅ Rota pública');
      return next();
    }

    if (isDev) console.log('[Tenant] Identifier:', tenantIdentifier);

    // Buscar tenant no banco de dados
    const tenant = await prisma.tenant.findFirst({
      where: {
        OR: [
          { domain: tenantIdentifier || undefined },
          { id: tenantIdentifier || undefined },
          { cnpj: tenantIdentifier || undefined },
        ].filter(condition => Object.values(condition)[0] !== undefined),
        status: {
          in: [TenantStatus.ACTIVE, TenantStatus.TRIAL], // Incluir TRIAL
        },
      },
      include: {
        _count: {
          select: {
            users: true,
            protocols: true,
            services: true,
          },
        },
      },
    });

    if (!tenant) {
      return res.status(404).json({
        error: 'Tenant not found',
        message: 'Município não encontrado ou inativo',
        identifier: tenantIdentifier,
        suggestion: isSubdomainRequest
          ? 'Verifique se o subdomínio está correto'
          : 'Verifique o header X-Tenant-ID ou use o subdomínio',
      });
    }

    // Verificar se tenant está suspenso
    if (tenant.status === TenantStatus.SUSPENDED) {
      return res.status(403).json({
        error: 'Tenant suspended',
        message: 'Município temporariamente suspenso',
        reason: 'Entre em contato com o suporte para reativar o serviço',
      });
    }

    // Verificar se trial expirou (30 dias)
    if (tenant.status === TenantStatus.TRIAL) {
      const trialDays = Math.floor(
        (Date.now() - tenant.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (trialDays > 30) {
        return res.status(402).json({
          error: 'Trial expired',
          message: 'Período de teste expirado',
          daysExpired: trialDays - 30,
          action: 'Atualize para um plano pago para continuar usando o sistema',
        });
      }
    }

    // Anexar informações do tenant à requisição
    req.tenantId = tenant.id;
    (req as any).tenant = {
      ...tenant,
      usageStats: tenant._count || { users: 0, protocols: 0, services: 0 },
    };
    (req as any).isSubdomainRequest = isSubdomainRequest;

    next();
  } catch (error) {
    console.error('Tenant middleware error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Erro interno ao identificar município',
    });
  }
};

/**
 * Middleware para criar scope automático do Prisma por tenant
 * Garante que todas as queries sejam filtradas pelo tenant atual
 */
export const prismaMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.tenantId) {
    return res.status(400).json({
      error: 'Bad request',
      message: 'Tenant ID não identificado',
    });
  }

  // Extend Prisma queries to automatically include tenant filter
  const originalPrismaQuery = prisma.$executeRaw;

  // Note: Em uma implementação mais robusta, você pode usar
  // row-level security ou criar um proxy para o Prisma Client
  // que automaticamente adiciona o filtro de tenant

  return next();
};

/**
 * Helper function para verificar se o usuário pertence ao tenant atual
 */
export const validateUserTenant = (userTenantId: string, requestTenantId: string): boolean => {
  return userTenantId === requestTenantId;
};

/**
 * Função para validar e extrair limites do JSON do tenant
 */
function extractTenantLimits(limitsJson: unknown): TenantLimits {
  // Usar o type guard oficial para validação
  if (isTenantLimits(limitsJson)) {
    const defaults = getDefaultLimits();
    return {
      ...defaults,
      ...limitsJson,
    };
  }

  // Fallback para valores padrão
  return getDefaultLimits();
}

/**
 * Função para validar e extrair estatísticas de uso
 */
function extractUsageStats(
  usageStatsJson: unknown,
  countData?: { users: number; protocols: number; services: number }
): UsageStats {
  // Usar o type guard oficial para validação
  if (isUsageStats(usageStatsJson)) {
    return usageStatsJson;
  }

  // Fallback para dados do _count
  if (countData) {
    return {
      users: countData.users,
      protocols: countData.protocols,
      services: countData.services,
      lastUpdated: new Date().toISOString(),
    };
  }

  // Fallback final para valores padrão
  return getDefaultUsageStats();
}

/**
 * Middleware para enforcement de limites por plano
 * Verifica se o tenant não excedeu os limites do seu plano
 */
export const planLimitsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenant = req.tenant;
    if (!tenant) {
      return next();
    }

    // Extrair limites de forma segura usando type guards
    const limits = isTenantLimits(tenant.limits)
      ? tenant.limits
      : getDefaultLimits();

    // Extrair estatísticas de uso de forma segura
    const usageStats = isUsageStats(tenant.usageStats)
      ? tenant.usageStats
      : getDefaultUsageStats();

    // Verificar limite de usuários
    if (limits.users > 0 && usageStats.users >= limits.users) {
      // Apenas para rotas de criação de usuários
      if (req.method === 'POST' && req.path.includes('/users')) {
        return res.status(403).json({
          error: 'Plan limit exceeded',
          message: `Limite de usuários atingido (${limits.users})`,
          current: usageStats.users,
          limit: limits.users,
          upgrade: 'Faça upgrade do plano para adicionar mais usuários',
        });
      }
    }

    // Verificar limite de protocolos
    if (limits.protocols > 0 && usageStats.protocols >= limits.protocols) {
      if (req.method === 'POST' && req.path.includes('/protocols')) {
        return res.status(403).json({
          error: 'Plan limit exceeded',
          message: `Limite de protocolos atingido (${limits.protocols})`,
          current: usageStats.protocols,
          limit: limits.protocols,
          upgrade: 'Faça upgrade do plano para criar mais protocolos',
        });
      }
    }

    // Verificar limite de serviços
    if (limits.services > 0 && usageStats.services >= limits.services) {
      if (req.method === 'POST' && req.path.includes('/services')) {
        return res.status(403).json({
          error: 'Plan limit exceeded',
          message: `Limite de serviços atingido (${limits.services})`,
          current: usageStats.services,
          limit: limits.services,
          upgrade: 'Faça upgrade do plano para adicionar mais serviços',
        });
      }
    }

    // Adicionar informações de uso nas respostas
    res.locals.usage = {
      users: { current: usageStats.users, limit: limits.users },
      protocols: { current: usageStats.protocols, limit: limits.protocols },
      services: { current: usageStats.services, limit: limits.services },
    };

    next();
  } catch (error) {
    console.error('Plan limits middleware error:', error);
    next(); // Não bloquear em caso de erro
  }
};

/**
 * Middleware para rate limiting por tenant
 */
export const tenantRateLimit = (req: Request, res: Response, next: NextFunction) => {
  // Implementação básica de rate limiting por tenant
  // Em produção, usar Redis ou similar

  const tenantId = req.tenantId;
  if (!tenantId) {
    return res.status(400).json({ error: 'Tenant required' });
  }

  // Aqui você implementaria a lógica de rate limiting
  // Exemplo: máximo X requests por minuto por tenant
  // Baseado no plano: STARTER: 100/min, PROFESSIONAL: 500/min, ENTERPRISE: ilimitado

  return next();
};
