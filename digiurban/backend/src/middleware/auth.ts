import { Request, Response, NextFunction, RequestHandler } from 'express';
import * as jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { UserRole } from '@prisma/client';
import { validateUserTenant } from './tenant';
import { UserWithRelations, JWTPayload, AuthenticatedRequest } from '../types';

/**
 * Middleware de autenticação JWT
 */
export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        error: 'Access denied',
        message: 'Token de acesso requerido',
      });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET not configured');
      res.status(500).json({
        error: 'Internal server error',
        message: 'Configuração de segurança inválida',
      });
      return;
    }

    // ✅ SEGURANÇA: Usar JWT_SECRET obrigatório (validado no startup)
    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;

    // ✅ SEGURANÇA: Validar que o token contém o campo 'type'
    if (!decoded.type) {
      res.status(401).json({
        error: 'Access denied',
        message: 'Token inválido: tipo ausente',
      });
      return;
    }

    // ✅ SEGURANÇA: Validar que é um tipo válido de token
    const validTypes = ['admin', 'citizen', 'super_admin', 'user'];
    if (!validTypes.includes(decoded.type)) {
      res.status(401).json({
        error: 'Access denied',
        message: 'Token inválido: tipo não reconhecido',
      });
      return;
    }

    // Validar se o usuário pertence ao tenant atual
    if ((req as any).tenantId && !validateUserTenant(decoded.tenantId, (req as any).tenantId)) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Usuário não autorizado para este município',
      });
      return;
    }

    // Buscar usuário no banco para verificar se ainda está ativo
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
        tenantId: decoded.tenantId,
        isActive: true,
      },
      include: {
        department: true,
        tenant: true,
      },
    });

    if (!user) {
      res.status(401).json({
        error: 'Access denied',
        message: 'Usuário não encontrado ou inativo',
      });
      return;
    }

    // Anexar informações do usuário à requisição usando tipos seguros
    (req as any).userId = user.id;
    (req as any).user = user;
    (req as any).userRole = user.role;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Token inválido',
      });
      return;
    }

    console.error('Authentication middleware error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Erro na autenticação',
    });
  }
};

/**
 * Middleware para autorização por nível de usuário
 */
export const requireRole = (minRole: UserRole): RequestHandler => {
  return (req, res, next) => {
    if (!(req as any).userRole) {
      res.status(401).json({
        error: 'Access denied',
        message: 'Autenticação requerida',
      });
      return;
    }

    const roleHierarchy = {
      GUEST: 0,
      USER: 1,
      COORDINATOR: 2,
      MANAGER: 3,
      ADMIN: 4,
      SUPER_ADMIN: 5,
    };

    const userRole = (req as any).userRole as UserRole;
    const userLevel = roleHierarchy[userRole] || 0;
    const requiredLevel = roleHierarchy[minRole];

    if (userLevel < requiredLevel) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Nível de acesso insuficiente',
      });
      return;
    }

    next();
  };
};

/**
 * Middleware para permitir apenas Super Admin
 */
export const requireSuperAdmin = requireRole(UserRole.SUPER_ADMIN);

/**
 * Middleware para permitir Admin ou superior
 */
export const requireAdmin = requireRole(UserRole.ADMIN);

/**
 * Middleware para permitir Manager ou superior
 */
export const requireManager = requireRole(UserRole.MANAGER);

/**
 * Middleware para permitir Coordinator ou superior
 */
export const requireCoordinator = requireRole(UserRole.COORDINATOR);

/**
 * Middleware opcional de autenticação (não falha se não houver token)
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      await authenticateToken(req, res, next);
    } else {
      next();
    }
  } catch (error) {
    // Se houver erro na autenticação opcional, continua sem usuário
    next();
  }
};
