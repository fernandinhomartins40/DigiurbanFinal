/**
 * ============================================================================
 * MODULE CONFIGURATIONS INDEX
 * ============================================================================
 *
 * Centralizador de configurações de todos os módulos
 */

import { ModuleConfig } from './types';
import { agricultureModules } from './agriculture';
import { educacaoModuleConfigs } from './educacao';

// Registry de todas as configurações de módulos
const moduleRegistry: Record<string, Record<string, ModuleConfig>> = {
  agriculture: agricultureModules,
  education: educacaoModuleConfigs,
};

/**
 * Busca configuração de um módulo específico
 */
export function getModuleConfig(
  departmentType: string,
  moduleKey: string
): ModuleConfig | null {
  const departmentModules = moduleRegistry[departmentType];
  if (!departmentModules) return null;

  return departmentModules[moduleKey] || null;
}

/**
 * Lista todos os módulos de um departamento
 */
export function getDepartmentModules(departmentType: string): ModuleConfig[] {
  const departmentModules = moduleRegistry[departmentType];
  if (!departmentModules) return [];

  return Object.values(departmentModules);
}

/**
 * Verifica se um módulo existe
 */
export function hasModule(departmentType: string, moduleKey: string): boolean {
  return getModuleConfig(departmentType, moduleKey) !== null;
}

// Re-exportar tipos
export * from './types';
export { agricultureModules } from './agriculture';
export { educacaoModuleConfigs } from './educacao';
