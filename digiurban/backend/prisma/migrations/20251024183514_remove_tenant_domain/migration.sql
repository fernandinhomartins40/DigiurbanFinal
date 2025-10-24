-- AlterTable: Remove coluna domain do model Tenant
-- Motivo: Multi-tenancy agora é feito via JWT (autenticação), não via subdomínio
-- Data: 2025-10-24

-- Remover índice único da coluna domain (se existir)
DROP INDEX IF EXISTS "Tenant_domain_key";

-- Remover coluna domain
PRAGMA foreign_keys=off;

CREATE TABLE "new_Tenant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'STARTER',
    "status" TEXT NOT NULL DEFAULT 'TRIAL',
    "trialEndsAt" DATETIME,
    "population" INTEGER,
    "billing" TEXT,
    "limits" TEXT,
    "settings" TEXT,
    "metadata" TEXT,
    "codigoIbge" TEXT,
    "nomeMunicipio" TEXT,
    "ufMunicipio" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

INSERT INTO "new_Tenant" ("id", "name", "cnpj", "plan", "status", "trialEndsAt", "population", "billing", "limits", "settings", "metadata", "codigoIbge", "nomeMunicipio", "ufMunicipio", "createdAt", "updatedAt")
SELECT "id", "name", "cnpj", "plan", "status", "trialEndsAt", "population", "billing", "limits", "settings", "metadata", "codigoIbge", "nomeMunicipio", "ufMunicipio", "createdAt", "updatedAt"
FROM "Tenant";

DROP TABLE "Tenant";
ALTER TABLE "new_Tenant" RENAME TO "Tenant";

CREATE UNIQUE INDEX "Tenant_cnpj_key" ON "Tenant"("cnpj");

PRAGMA foreign_key_check;
PRAGMA foreign_keys=on;
