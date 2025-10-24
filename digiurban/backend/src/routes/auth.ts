import { Router, Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { tenantMiddleware } from '../middleware/tenant';
import { AuthenticatedRequest, SuccessResponse, ErrorResponse } from '../types';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

// ⚠️ ROTA LEGADA DEPRECADA - Redirecionamento para novas rotas
// Este arquivo será removido em versões futuras

/**
 * POST /api/auth/login
 * ⚠️ DEPRECADA: Use /api/admin/auth/login ou /api/auth/citizen/login
 */
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  // Deprecation warning
  console.warn('[DEPRECATED] Rota /api/auth/login está deprecada. Use /api/admin/auth/login ou /api/auth/citizen/login');

  res.status(410).json({
    error: 'Deprecated',
    message: 'Esta rota está deprecada. Use /api/admin/auth/login para admins ou /api/auth/citizen/login para cidadãos',
    migration: {
      admin: '/api/admin/auth/login',
      citizen: '/api/auth/citizen/login'
    }
  });
  return;

  // Código antigo comentado (removido por segurança)
  // Esta função nunca é executada devido ao return acima
});

/**
 * POST /api/auth/register
 * ⚠️ DEPRECADA: Use rotas específicas
 */
router.post('/register', async (req, res) => {
  console.warn('[DEPRECATED] Rota /api/auth/register está deprecada');

  res.status(410).json({
    error: 'Deprecated',
    message: 'Esta rota está deprecada. Use as rotas específicas de cada sistema',
    migration: {
      citizen: '/api/auth/citizen/register'
    }
  });
  return;

  // Código antigo comentado (removido)
  // Esta função nunca é executada devido ao return acima
});

/**
 * GET /api/auth/me
 * ⚠️ DEPRECADA: Use rotas específicas
 */
router.get('/me', async (req, res) => {
  console.warn('[DEPRECATED] Rota /api/auth/me está deprecada');

  res.status(410).json({
    error: 'Deprecated',
    message: 'Esta rota está deprecada. Use as rotas específicas de cada sistema',
    migration: {
      admin: '/api/admin/auth/me',
      citizen: '/api/auth/citizen/me',
      super_admin: '/api/super-admin/auth/me'
    }
  });
  return;

  // Código antigo comentado (removido)
  // Esta função nunca é executada devido ao return acima
});

/**
 * POST /api/auth/refresh
 * ⚠️ DEPRECADA: Tokens são renovados automaticamente via cookies
 */
router.post('/refresh', async (req, res) => {
  console.warn('[DEPRECATED] Rota /api/auth/refresh está deprecada');

  res.status(410).json({
    error: 'Deprecated',
    message: 'Esta rota está deprecada. Tokens são renovados automaticamente via cookies httpOnly'
  });
  return;

  // Código antigo comentado (removido)
  // Esta função nunca é executada devido ao return acima
});

export default router;
