import { PrismaClient } from '@prisma/client';
import '../types/globals'; // Importar tipos globais

// Prevent multiple instances of Prisma Client in development
// Global declaration in src/types/globals.ts
export const prisma =
  globalThis.__prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}
