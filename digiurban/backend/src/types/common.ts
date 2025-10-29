/**
 * Common Types and Interfaces for DigiUrban Backend
 * VERSÃO UNIFICADA E DEFINITIVA - NÃO CRIAR DEFINIÇÕES LOCAIS
 */

import { Request } from 'express';
import { User, Citizen, Tenant, Department, UserRole } from '@prisma/client';
// Type for user with relations (complete user data)
export type UserWithRelations = User & {
  department?: Department | null;
  tenant: Tenant;
};

// TenantWithMeta foi movido para src/types/middleware.ts

// TODAS as interfaces de Request foram movidas para src/types/middleware.ts
// Este arquivo contém apenas tipos de dados comuns (não relacionados a Express/middleware)

// ============================================================================
// TODAS AS INTERFACES DE REQUEST ESTÃO EM src/types/middleware.ts
// ============================================================================

// Common query interfaces
export interface PaginationQuery {
  page?: string;
  limit?: string;
  offset?: string;
}

export interface SearchQuery extends PaginationQuery {
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface StatusFilterQuery extends SearchQuery {
  status?: string;
  department?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Common response interfaces
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// File upload interfaces foram movidas para src/types/middleware.ts

// Query builder types
export interface WhereCondition {
  [key: string]: unknown;
}

export interface OrderByCondition {
  [key: string]: 'asc' | 'desc';
}

// Error types
export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}
