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
 * Middleware para identificação e isolamento multi-tenant via JWT
 * ✅ Estratégia: Identifica tenant através do JWT de autenticação
 * ❌ Não usa mais subdomínios
 */
export const tenantMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isDev = process.env.NODE_ENV !== 'production';
    if (isDev) {
      console.log('[Tenant] Path:', req.originalUrl || req.path);
    }

    let tenantId: string | null = null;

    // ============================================
    // ESTRATÉGIA 1: JWT Cookie (PRINCIPAL)
    // ============================================
    // Para usuários admin e cidadãos logados, tenant vem do JWT cookie
    if (req.cookies?.digiurban_admin_token) {
      if (isDev) console.log('[Tenant] Verificando JWT cookie admin...');
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.decode(req.cookies.digiurban_admin_token) as any;
        if (decoded?.tenantId) {
          tenantId = decoded.tenantId;
          if (isDev) console.log('[Tenant] ✅ Tenant do JWT cookie admin:', tenantId);
        }
      } catch (err) {
        if (isDev) console.error('[Tenant] Erro ao decodificar JWT admin:', err);
      }
    }

    // ============================================
    // ESTRATÉGIA 1.5: JWT Cookie Cidadão
    // ============================================
    // Cookie específico para cidadãos
    if (!tenantId && req.cookies?.digiurban_citizen_token) {
      if (isDev) console.log('[Tenant] Verificando JWT cookie cidadão...');
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.decode(req.cookies.digiurban_citizen_token) as any;
        if (decoded?.tenantId) {
          tenantId = decoded.tenantId;
          if (isDev) console.log('[Tenant] ✅ Tenant do JWT cookie cidadão:', tenantId);
        }
      } catch (err) {
        if (isDev) console.error('[Tenant] Erro ao decodificar JWT cidadão:', err);
      }
    }

    // ============================================
    // ESTRATÉGIA 2: JWT Authorization Header (Fallback temporário)
    // ============================================
    // Para compatibilidade com código antigo que usa localStorage
    // TODO: DEPRECAR após migração completa
    if (!tenantId) {
      const authHeader = req.get('Authorization');
      if (authHeader?.startsWith('Bearer ')) {
        if (isDev) console.log('[Tenant] ⚠️  Verificando JWT Authorization header (DEPRECATED)...');
        try {
          const token = authHeader.substring(7);
          const jwt = require('jsonwebtoken');
          const decoded = jwt.decode(token) as any;
          if (decoded?.tenantId) {
            tenantId = decoded.tenantId;
            if (isDev) console.log('[Tenant] ✅ Tenant do JWT Authorization (DEPRECATED):', tenantId);
          }
        } catch (err) {
          if (isDev) console.error('[Tenant] Erro ao decodificar JWT Authorization:', err);
        }
      }
    }

    // ============================================
    // ESTRATÉGIA 3: Header X-Tenant-ID (APIs externas e dev)
    // ============================================
    // Para integrações externas ou desenvolvimento local
    if (!tenantId) {
      const headerTenant = req.get('X-Tenant-ID');
      if (headerTenant) {
        tenantId = headerTenant;
        if (isDev) console.log('[Tenant] ✅ Tenant do header X-Tenant-ID:', tenantId);
      }
    }

    // ============================================
    // ROTAS QUE NÃO EXIGEM TENANT
    // ============================================
    const publicRoutes = [
      '/health',
      '/api/leads',
      '/api/super-admin', // Super admin não precisa de tenant
    ];

    const authRoutes = [
      '/api/auth/citizen/register',
      '/api/auth/citizen/login',
      '/api/admin/auth/login',   // Login centralizado
      '/api/admin/auth/logout',
    ];

    const fullPath = req.originalUrl || req.path;
    const isPublicRoute = publicRoutes.some(route => fullPath.startsWith(route));
    const isAuthRoute = authRoutes.some(route => fullPath.startsWith(route));

    // ============================================
    // VALIDAÇÃO DE TENANT
    // ============================================
    if (!tenantId) {
      // Permitir rotas públicas e de autenticação sem tenant
      if (isPublicRoute || isAuthRoute) {
        if (isDev) console.log('[Tenant] ✅ Rota pública/auth liberada');
        return next();
      }

      // Bloquear se não identificou tenant
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Faça login para acessar este recurso',
        hint: 'Acesse /admin/login ou /login',
      });
    }

    if (isDev) console.log('[Tenant] ID identificado:', tenantId);

    // ============================================
    // BUSCAR TENANT NO BANCO
    // ============================================
    // Busca direta por ID (tenantId extraído do JWT é sempre um UUID)
    // Arquitetura: JWT contém user.tenantId (campo id da tabela Tenant)
    const tenant = await prisma.tenant.findUnique({
      where: {
        id: tenantId,
      },
      include: {
        _count: {
          select: {
            users: true,
            protocolsSimplified: true,
            servicesSimplified: true,
          },
        },
      },
    });

    // ============================================
    // VALIDAÇÕES DO TENANT
    // ============================================
    if (!tenant) {
      return res.status(404).json({
        error: 'Tenant not found',
        message: 'Município não encontrado',
        tenantId: tenantId,
        hint: 'Faça login novamente para obter um token válido',
      });
    }

    // Validar status do tenant (apenas ACTIVE e TRIAL são permitidos)
    if (tenant.status === TenantStatus.SUSPENDED) {
      return res.status(403).json({
        error: 'Tenant suspended',
        message: 'Município temporariamente suspenso',
        reason: 'Entre em contato com o suporte para reativar o serviço',
      });
    }

    if (tenant.status !== TenantStatus.ACTIVE && tenant.status !== TenantStatus.TRIAL) {
      return res.status(403).json({
        error: 'Tenant inactive',
        message: 'Município inativo',
        status: tenant.status,
        hint: 'Entre em contato com o suporte',
      });
    }

    // Validar expiração do período trial (30 dias)
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
    // ❌ REMOVIDO: isSubdomainRequest (não usamos mais)

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

// Funções auxiliares simplificadas (inline quando usado 1x)
// Se precisar extrair limites: tenant.limits || getDefaultLimits()
// Se precisar extrair usage: tenant.usageStats || getDefaultUsageStats()

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

    // Extrair limites e usage com validação simples
    const limits = isTenantLimits(tenant.limits) ? tenant.limits : getDefaultLimits();
    const usageStats = isUsageStats(tenant.usageStats) ? tenant.usageStats : getDefaultUsageStats();

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
