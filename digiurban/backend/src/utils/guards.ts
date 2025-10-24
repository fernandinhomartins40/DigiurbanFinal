// ============================================================================
// FASE 1 - TYPE GUARDS ROBUSTOS - PADRÃO MODERNO 2024
// ============================================================================

import { Request } from 'express';
import { UserRole } from '@prisma/client';
import type { UserWithRelations, TenantWithMeta } from '../types';

// Type guard para verificar se o request é autenticado
export function isAuthenticatedRequest(
  req: Request
): req is Request & Required<Pick<Request, 'userId' | 'user' | 'userRole'>> {
  return !!(
    req.userId &&
    req.user &&
    req.userRole &&
    typeof req.userId === 'string' &&
    typeof req.user === 'object' &&
    Object.values(UserRole).includes(req.userRole)
  );
}

// Type guard para verificar se o request tem tenant
export function hasTenantRequest(
  req: Request
): req is Request & Required<Pick<Request, 'tenantId' | 'tenant'>> {
  return !!(
    req.tenantId &&
    req.tenant &&
    typeof req.tenantId === 'string' &&
    typeof req.tenant === 'object' &&
    req.tenant.id === req.tenantId
  );
}

// Type guard para request completamente autenticado (com tenant)
export function isFullyAuthenticatedRequest(
  req: Request
): req is Request &
  Required<Pick<Request, 'userId' | 'user' | 'userRole' | 'tenantId' | 'tenant'>> {
  return isAuthenticatedRequest(req) && hasTenantRequest(req);
}

// Type guards para roles específicos
export function isAdminRequest(req: Request): req is Request &
  Required<Pick<Request, 'userId' | 'user' | 'userRole' | 'tenantId' | 'tenant'>> & {
    userRole: 'ADMIN' | 'SUPER_ADMIN';
  } {
  return (
    isFullyAuthenticatedRequest(req) && (req.userRole === 'ADMIN' || req.userRole === 'SUPER_ADMIN')
  );
}

export function isManagerRequest(req: Request): req is Request &
  Required<Pick<Request, 'userId' | 'user' | 'userRole' | 'tenantId' | 'tenant'>> & {
    userRole: 'MANAGER' | 'ADMIN' | 'SUPER_ADMIN';
  } {
  return (
    isFullyAuthenticatedRequest(req) &&
    (req.userRole === 'MANAGER' || req.userRole === 'ADMIN' || req.userRole === 'SUPER_ADMIN')
  );
}

export function isSuperAdminRequest(req: Request): req is Request &
  Required<Pick<Request, 'userId' | 'user' | 'userRole' | 'tenantId' | 'tenant'>> & {
    userRole: 'SUPER_ADMIN';
  } {
  return isFullyAuthenticatedRequest(req) && req.userRole === 'SUPER_ADMIN';
}

// Type guards para validação de dados
export function isValidUser(user: unknown): user is UserWithRelations {
  if (!user || typeof user !== 'object') return false;

  const u = user as Record<string, unknown>;
  return !!(
    typeof u.id === 'string' &&
    typeof u.email === 'string' &&
    typeof u.name === 'string' &&
    typeof u.role === 'string' &&
    Object.values(UserRole).includes(u.role as UserRole) &&
    typeof u.isActive === 'boolean' &&
    typeof u.tenantId === 'string'
  );
}

export function isValidTenant(tenant: unknown): tenant is TenantWithMeta {
  if (!tenant || typeof tenant !== 'object') return false;

  const t = tenant as Record<string, unknown>;
  return !!(
    typeof t.id === 'string' &&
    typeof t.name === 'string' &&
    (typeof t.cnpj === 'string' || t.cnpj === null || t.cnpj === undefined) &&
    typeof t.status === 'string' &&
    t.createdAt instanceof Date &&
    t.updatedAt instanceof Date
  );
}

// Type guards para verificar permissões específicas
export function hasPermission(
  req: Request,
  requiredRole: UserRole | UserRole[]
): req is Request &
  Required<Pick<Request, 'userId' | 'user' | 'userRole' | 'tenantId' | 'tenant'>> {
  if (!isFullyAuthenticatedRequest(req)) {
    return false;
  }

  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  return roles.includes(req.userRole);
}

// Hierarchy check - se o usuário tem permissão baseada em hierarquia
export function hasMinimumRole(
  req: Request,
  minimumRole: UserRole
): req is Request &
  Required<Pick<Request, 'userId' | 'user' | 'userRole' | 'tenantId' | 'tenant'>> {
  if (!isFullyAuthenticatedRequest(req)) {
    return false;
  }

  const roleHierarchy: Record<UserRole, number> = {
    GUEST: 0,
    USER: 1,
    COORDINATOR: 2,
    MANAGER: 3,
    ADMIN: 4,
    SUPER_ADMIN: 5,
  };

  return roleHierarchy[req.userRole] >= roleHierarchy[minimumRole];
}

// Type guard para verificar se o usuário pertence ao mesmo tenant
export function belongsToSameTenant(
  req: Request,
  resourceTenantId: string
): req is Request & Required<Pick<Request, 'tenantId'>> {
  return !!(req.tenantId && req.tenantId === resourceTenantId);
}

// Type guard genérico para objetos com propriedades obrigatórias
export function hasRequiredProperties<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  properties: K[]
): obj is T & Required<Pick<T, K>> {
  return properties.every(prop => obj[prop] !== undefined && obj[prop] !== null);
}

// Type guard para verificar se um valor é um ID válido (CUID)
export function isValidId(id: unknown): id is string {
  return typeof id === 'string' && id.length >= 20 && /^c[a-z0-9]+$/.test(id);
}

// Type guard para verificar arrays não vazios
export function isNonEmptyArray<T>(arr: T[]): arr is [T, ...T[]] {
  return Array.isArray(arr) && arr.length > 0;
}

// Type guard para verificar se um objeto tem pelo menos uma propriedade
export function hasAtLeastOneProperty<T extends Record<string, unknown>>(
  obj: T
): obj is T & { [K in keyof T]: T[K] } {
  return typeof obj === 'object' && obj !== null && Object.keys(obj).length > 0;
}
