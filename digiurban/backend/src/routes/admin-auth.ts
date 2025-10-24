import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { tenantMiddleware } from '../middleware/tenant';
import { prisma } from '../lib/prisma';
import { BCRYPT_ROUNDS, JWT as JWT_CONFIG } from '../config/security';
import { loginRateLimiter } from '../middleware/rate-limit';
import { accountLockoutMiddleware, recordFailedLogin, resetFailedAttempts } from '../middleware/account-lockout';
import { logLoginSuccess, logLoginFailed, AUDIT_EVENTS, logAuditEvent } from '../utils/audit-logger';
import { sanitizeForLog } from '../utils/logger';

// ===== TIPOS LOCAIS ISOLADOS - COMPATÍVEIS COM PRISMA REAL =====

// Interface para filtros de protocolos compatível com Prisma
interface ProtocolFilterInput {
  tenantId: string;
  assignedUserId?: string;
  departmentId?: string;
  status?: string;
}

// Interface para resultado do groupBy de protocolos por status
interface ProtocolStatusGroupResult {
  status: string;
  _count: {
    _all: number;
  };
}

// Interface para dados de login JWT tipados
interface AdminJwtPayload extends jwt.JwtPayload {
  userId: string;
  tenantId: string;
  role: string;
  departmentId?: string;
  type: string;
}

// Interface para permissões por role
interface RolePermissions {
  [key: string]: string[];
}

// Utilitários tipados para validação
function validateAuthHeader(authHeader: unknown): string | null {
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

function isZodError(error: unknown): error is z.ZodError {
  return error instanceof z.ZodError;
}

function isJwtError(error: unknown): boolean {
  return error instanceof Error && (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError');
}

// Handler wrapper para async routes
function handleAsyncRoute(
  fn: (req: Request & TenantRequest, res: Response) => Promise<void>
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req as Request & TenantRequest, res)).catch(next);
  };
}
import {
  TenantRequest,
  AuthenticatedRequest,
  SuccessResponse,
  ErrorResponse,
} from '../types';

const router = Router();

// Schemas de validação alinhados com Prisma e segurança
const loginSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

// Schema para criação/alteração de senha (usar em rotas futuras de reset/change password)
const strongPasswordSchema = z.string()
  .min(8, 'Senha deve ter pelo menos 8 caracteres')
  .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
  .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
  .regex(/\d/, 'Senha deve conter pelo menos um número')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Senha deve conter pelo menos um caractere especial');

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: strongPasswordSchema,
});

// Middleware para verificar tenant em todas as rotas
router.use(tenantMiddleware);

// POST /api/auth/admin/login - Login de administradores (com rate limiting e account lockout)
router.post(
  '/login',
  loginRateLimiter,
  accountLockoutMiddleware('user'),
  handleAsyncRoute(async (req, res) => {
    try {
      const data = loginSchema.parse(req.body);

      // BUSCA INTELIGENTE: Encontrar usuário em QUALQUER tenant pelo email
      // Isso permite login automático sem precisar especificar o tenant
      const user = await prisma.user.findFirst({
        where: {
          email: data.email,
          isActive: true,
        },
        select: {
          id: true,
          name: true, // ✅ ADICIONADO
          email: true,
          password: true,
          role: true,
          tenantId: true,
          departmentId: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
          mustChangePassword: true, // ✅ SEGURANÇA: Verificar se deve trocar senha
          department: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          tenant: {
            select: {
              id: true,
              name: true,
              // ❌ REMOVIDO: domain
              status: true,
            },
          },
        },
      });

      if (!user) {
        // Login falhou - usuário não encontrado
        await logAuditEvent({
          action: AUDIT_EVENTS.LOGIN_FAILED,
          resource: '/api/admin/auth/login',
          method: 'POST',
          tenantId: 'unknown', // Não sabemos o tenant quando usuário não existe
          ip: req.ip || req.socket.remoteAddress,
          userAgent: req.headers['user-agent'],
          success: false,
          details: { email: data.email, reason: 'Usuário não encontrado' },
        });
        res.status(401).json({
          success: false,
          error: 'Authentication failed',
          message: 'Credenciais inválidas',
        });
        return;
      }

      // Verificar se o tenant do usuário está ativo
      if (user.tenant.status !== 'ACTIVE' && user.tenant.status !== 'TRIAL') {
        res.status(403).json({
          success: false,
          error: 'Tenant inactive',
          message: 'Prefeitura inativa ou suspensa',
        });
        return;
      }

      // Verificar senha
      const validPassword = await bcrypt.compare(data.password, user.password);
      if (!validPassword) {
        // Registrar tentativa falhada
        await recordFailedLogin('user', data.email, user.tenantId);
        await logLoginFailed(req, data.email, user.tenantId, 'Senha incorreta');
        res.status(401).json({
          success: false,
          error: 'Authentication failed',
          message: 'Credenciais inválidas',
        });
        return;
      }

      // Resetar contador de tentativas falhadas após sucesso
      await resetFailedAttempts('user', user.id);

      // Log de auditoria: login bem-sucedido
      await logLoginSuccess(req, 'user', user.id, user.tenantId);

      // Atualizar último login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });

      // Gerar token JWT com payload tipado - USAR O TENANT DO USUÁRIO
      const jwtPayload: Omit<AdminJwtPayload, 'iat' | 'exp'> = {
        userId: user.id,
        tenantId: user.tenantId, // Usar o tenantId do usuário, não do req
        role: user.role,
        departmentId: user.departmentId || undefined,
        type: 'admin',
      };

      const jwtSecret = process.env.JWT_SECRET!; // TypeScript non-null assertion
      const token = jwt.sign(
        jwtPayload,
        jwtSecret,
        { expiresIn: JWT_CONFIG.ADMIN_EXPIRES_IN }
      );

      // Setar cookie httpOnly com o token
      res.cookie('digiurban_admin_token', token, {
        httpOnly: true,      // Não acessível via JavaScript
        secure: process.env.NODE_ENV === 'production', // HTTPS apenas em produção
        sameSite: 'lax',     // Permite envio em navegação top-level (mudado de 'strict' para 'lax')
        maxAge: 3600000,     // 1 hora (mesmo que JWT)
        path: '/',           // Disponível em todas as rotas
        domain: process.env.NODE_ENV === 'production' ? '.digiurban.com.br' : undefined, // Permitir em subdomínios
      });

      // Remover senha da resposta
      const { password: _, ...userData } = user;

      res.json({
        success: true,
        data: {
          message: 'Login realizado com sucesso',
          user: userData,
          permissions: getRolePermissions(user.role),
          // RETORNAR O TENANT ID PARA O FRONTEND ARMAZENAR
          tenantId: user.tenantId,
          // ✅ SEGURANÇA: Informar frontend se usuário precisa trocar senha
          mustChangePassword: user.mustChangePassword,
        },
      });
    } catch (error: unknown) {
      console.error('Erro no login admin:', sanitizeForLog(error));

      if (isZodError(error)) {
        res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: 'Dados inválidos',
          details: error.issues,
        });
        return;
      }

      throw error;
    }
  })
);

// GET /api/auth/admin/me - Dados do administrador logado
router.get('/me', handleAsyncRoute(async (req, res) => {
  try {
    // Tentar obter token do cookie primeiro, depois do header (fallback)
    let token = req.cookies?.digiurban_admin_token;

    // Se não tiver token no cookie, tentar header Authorization (retrocompatibilidade)
    if (!token) {
      token = validateAuthHeader(req.headers.authorization);
    }

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Authentication failed',
        message: 'Token não fornecido',
      });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, jwtSecret) as AdminJwtPayload;

    if (decoded.type !== 'admin') {
      res.status(401).json({
        success: false,
        error: 'Authentication failed',
        message: 'Token inválido para admin',
      });
      return;
    }

    // Usar tenantId do token decodificado
    if (!decoded.tenantId) {
      res.status(400).json({
        success: false,
        error: 'Tenant required',
        message: 'Tenant não identificado no token',
      });
      return;
    }

    // Operação Prisma com campos explicitamente definidos
    const user = await prisma.user.findFirst({
      where: {
        id: decoded.userId,
        tenantId: decoded.tenantId,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        departmentId: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        department: {
          select: {
            id: true,
            name: true,
            code: true,
            description: true,
          },
        },
        assignedProtocols: {
          where: {
            status: { notIn: ['CONCLUIDO'] },
          },
          select: {
            id: true,
            number: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'Usuário não encontrado',
      });
      return;
    }

    // Dados já vem sem senha devido ao select explícito
    const userData = user;

    res.json({
      success: true,
      data: {
        user: userData,
        permissions: getRolePermissions(user.role),
        tenantId: decoded.tenantId, // ✅ ADICIONADO: Retornar tenantId para o frontend
        stats: await getUserStats(
          user.id,
          decoded.tenantId,
          user.role,
          user.departmentId || undefined
        ),
      },
    });
  } catch (error: unknown) {
    console.error('Erro ao buscar dados do admin:', error);

    if (isJwtError(error)) {
      // Diferenciar entre token expirado e inválido
      const isExpired = error instanceof Error && error.name === 'TokenExpiredError';

      res.status(401).json({
        success: false,
        error: 'Authentication failed',
        message: isExpired ? 'Token expirado' : 'Token inválido',
        code: isExpired ? 'TOKEN_EXPIRED' : 'TOKEN_INVALID',
      });
      return;
    }

    throw error;
  }
}));

// GET /api/auth/admin/permissions - Listar permissões do usuário
router.get(
  '/permissions',
  handleAsyncRoute(async (req, res) => {
    try {
      // Tentar obter token do cookie primeiro, depois do header (fallback)
      let token = req.cookies?.digiurban_admin_token;

      if (!token) {
        token = validateAuthHeader(req.headers.authorization);
      }

      if (!token) {
        res.status(401).json({
          success: false,
          error: 'Authentication failed',
          message: 'Token não fornecido',
        });
        return;
      }

      const jwtSecret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, jwtSecret) as AdminJwtPayload;

      if (decoded.type !== 'admin') {
        res.status(401).json({
          success: false,
          error: 'Authentication failed',
          message: 'Token inválido para admin',
        });
        return;
      }

      res.json({
        success: true,
        data: {
          role: decoded.role,
          permissions: getRolePermissions(decoded.role),
          departmentId: decoded.departmentId,
        },
      });
    } catch (error: unknown) {
      console.error('Erro ao buscar permissões:', error);

      if (isJwtError(error)) {
        res.status(401).json({
          success: false,
          error: 'Authentication failed',
          message: 'Token inválido',
        });
        return;
      }

      throw error;
    }
  })
);

// POST /api/auth/admin/change-password - Trocar senha do administrador
router.post('/change-password', handleAsyncRoute(async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Token não fornecido',
      });
      return;
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, jwtSecret) as AdminJwtPayload;

    if (decoded.type !== 'admin') {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Token inválido para administrador',
      });
      return;
    }

    const data = changePasswordSchema.parse(req.body);

    // Usar tenantId do token decodificado
    if (!decoded.tenantId) {
      res.status(400).json({
        success: false,
        error: 'Bad request',
        message: 'Tenant não identificado no token',
      });
      return;
    }

    // Buscar usuário
    const user = await prisma.user.findFirst({
      where: {
        id: decoded.userId,
        tenantId: decoded.tenantId,
        isActive: true,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'Usuário não encontrado',
      });
      return;
    }

    // Verificar senha atual
    const validPassword = await bcrypt.compare(data.currentPassword, user.password);
    if (!validPassword) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Senha atual incorreta',
      });
      return;
    }

    // Verificar se a nova senha é diferente da atual
    const isSamePassword = await bcrypt.compare(data.newPassword, user.password);
    if (isSamePassword) {
      res.status(400).json({
        success: false,
        error: 'Bad request',
        message: 'A nova senha deve ser diferente da senha atual',
      });
      return;
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(data.newPassword, BCRYPT_ROUNDS);

    // Atualizar senha
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Log de auditoria: troca de senha
    await logAuditEvent({
      userId: user.id,
      tenantId: decoded.tenantId,
      action: AUDIT_EVENTS.PASSWORD_CHANGE,
      resource: '/api/auth/admin/change-password',
      method: 'POST',
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
      success: true,
    });

    res.json({
      success: true,
      data: {
        message: 'Senha alterada com sucesso',
      },
    });
  } catch (error: unknown) {
    console.error('Erro ao trocar senha:', error);

    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error,
      });
      return;
    }

    if (error && typeof error === 'object' && 'name' in error && error.name === 'JsonWebTokenError') {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Token inválido',
      });
      return;
    }

    throw error;
  }
}));

// POST /api/auth/admin/logout - Logout (limpar cookie)
router.post('/logout', handleAsyncRoute(async (req, res) => {
  try {
    // Limpar cookie httpOnly
    res.clearCookie('digiurban_admin_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Mesmo valor do login
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? '.digiurban.com.br' : undefined,
    });

    res.json({
      success: true,
      data: {
        message: 'Logout realizado com sucesso',
      },
    });
  } catch (error: unknown) {
    console.error('Erro no logout:', error);
    throw error;
  }
}));

// Função tipada para obter permissões baseadas na função
function getRolePermissions(role: string): string[] {
  const rolePermissions: RolePermissions = {
    USER: [
      'protocols:read',
      'protocols:update',
      'protocols:comment',
      'department:read'
    ],
    COORDINATOR: [
      'protocols:read',
      'protocols:update',
      'protocols:assign',
      'protocols:comment',
      'team:read',
      'team:metrics',
      'department:read',
    ],
    MANAGER: [
      'protocols:read',
      'protocols:update',
      'protocols:assign',
      'protocols:comment',
      'services:create',
      'services:update',
      'team:read',
      'team:manage',
      'reports:department',
      'department:manage',
    ],
    ADMIN: [
      'protocols:read',
      'protocols:update',
      'protocols:assign',
      'protocols:comment',
      'protocols:create',
      'services:create',
      'services:update',
      'services:delete',
      'team:read',
      'team:manage',
      'citizens:read',
      'citizens:manage',
      'chamados:create',
      'reports:full',
      'departments:read',
      'analytics:full',
    ],
  };

  return rolePermissions[role as keyof RolePermissions] || [];
}

// Função tipada para obter estatísticas do usuário
async function getUserStats(
  userId: string,
  tenantId: string,
  role: string,
  departmentId?: string
): Promise<{
  totalProtocols: number;
  pendingProtocols: number;
  completedProtocols: number;
  protocolsByStatus: ProtocolStatusGroupResult[];
  pendingCitizens: number;
}> {
  try {
    let protocolFilter: ProtocolFilterInput = { tenantId };

    // Filtrar protocolos baseado na função
    switch (role) {
      case 'USER':
        protocolFilter.assignedUserId = userId;
        break;
      case 'COORDINATOR':
      case 'MANAGER':
        if (departmentId) {
          protocolFilter.departmentId = departmentId;
        }
        break;
      case 'ADMIN':
        // ADMIN vê todos os protocolos do tenant
        break;
    }

    // Operações Prisma com where clause tipada
    const whereAll = {
      tenantId: protocolFilter.tenantId,
      ...(protocolFilter.assignedUserId && { assignedUserId: protocolFilter.assignedUserId }),
      ...(protocolFilter.departmentId && { departmentId: protocolFilter.departmentId }),
    };

    const whereNotCompleted = {
      ...whereAll,
      status: { notIn: ['CONCLUIDO' as const] },
    };

    const whereCompleted = {
      ...whereAll,
      status: 'CONCLUIDO' as const,
    };

    const [totalProtocols, pendingProtocols, completedProtocols] = await Promise.all([
      prisma.protocol.count({ where: whereAll }),
      prisma.protocol.count({ where: whereNotCompleted }),
      prisma.protocol.count({ where: whereCompleted }),
    ]);

    // Protocolos por status
    const protocolsByStatus = await prisma.protocol.groupBy({
      by: ['status'],
      where: whereAll,
      _count: {
        _all: true,
      },
    });

    // Cidadãos pendentes de verificação
    const pendingCitizens = await prisma.citizen.count({
      where: {
        tenantId,
        verificationStatus: 'PENDING',
        isActive: true,
      },
    });

    return {
      totalProtocols,
      pendingProtocols,
      completedProtocols,
      protocolsByStatus,
      pendingCitizens,
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return {
      totalProtocols: 0,
      pendingProtocols: 0,
      completedProtocols: 0,
      protocolsByStatus: [],
      pendingCitizens: 0,
    };
  }
}

export default router;
