-- CreateTable
CREATE TABLE "business_licenses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "applicantName" TEXT NOT NULL,
    "applicantCpfCnpj" TEXT NOT NULL,
    "applicantPhone" TEXT,
    "applicantEmail" TEXT,
    "businessName" TEXT NOT NULL,
    "businessType" TEXT NOT NULL,
    "businessActivity" TEXT NOT NULL,
    "propertyAddress" TEXT NOT NULL,
    "propertyNumber" TEXT,
    "neighborhood" TEXT,
    "licenseType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "submissionDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvalDate" DATETIME,
    "validUntil" DATETIME,
    "licenseNumber" TEXT,
    "observations" TEXT,
    "documents" JSONB,
    "technicalAnalysis" JSONB,
    "reviewedBy" TEXT,
    "reviewedAt" DATETIME,
    "issuedDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "business_licenses_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "business_licenses_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "certificate_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "applicantName" TEXT NOT NULL,
    "applicantCpfCnpj" TEXT NOT NULL,
    "applicantPhone" TEXT,
    "applicantEmail" TEXT,
    "certificateType" TEXT NOT NULL,
    "purpose" TEXT,
    "propertyAddress" TEXT,
    "propertyNumber" TEXT,
    "neighborhood" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "submissionDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "issuedDate" DATETIME,
    "validUntil" DATETIME,
    "certificateNumber" TEXT,
    "observations" TEXT,
    "documents" JSONB,
    "reviewedBy" TEXT,
    "reviewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "certificate_requests_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "certificate_requests_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "urban_infractions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "complainantName" TEXT,
    "complainantPhone" TEXT,
    "complainantEmail" TEXT,
    "infractionType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "propertyAddress" TEXT NOT NULL,
    "propertyNumber" TEXT,
    "neighborhood" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "photos" JSONB,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "submissionDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inspectionDate" DATETIME,
    "resolutionDate" DATETIME,
    "assignedTo" TEXT,
    "observations" TEXT,
    "documents" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "urban_infractions_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "urban_infractions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_building_permits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "applicantName" TEXT NOT NULL,
    "applicantCpf" TEXT,
    "applicantCpfCnpj" TEXT,
    "applicantPhone" TEXT,
    "propertyAddress" TEXT NOT NULL,
    "property" JSONB,
    "construction" JSONB,
    "permitType" TEXT NOT NULL,
    "requestedBy" TEXT,
    "observations" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "submissionDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvalDate" DATETIME,
    "description" TEXT,
    "documents" JSONB,
    "technicalAnalysis" JSONB,
    "permitNumber" TEXT,
    "reviewedBy" TEXT,
    "applicantEmail" TEXT,
    "requirements" JSONB,
    "issuedDate" DATETIME,
    "reviewedAt" DATETIME,
    "constructionType" TEXT,
    "validUntil" DATETIME,
    "propertyNumber" TEXT,
    "approvedBy" TEXT,
    "neighborhood" TEXT,
    "lotNumber" TEXT,
    "blockNumber" TEXT,
    "totalArea" REAL,
    "builtArea" REAL,
    "floors" INTEGER,
    "projectValue" REAL,
    "approvedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "building_permits_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "building_permits_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_building_permits" ("applicantCpf", "applicantCpfCnpj", "applicantEmail", "applicantName", "applicantPhone", "approvalDate", "approvedAt", "approvedBy", "blockNumber", "builtArea", "construction", "constructionType", "createdAt", "description", "documents", "floors", "id", "issuedDate", "lotNumber", "neighborhood", "observations", "permitNumber", "permitType", "projectValue", "property", "propertyAddress", "propertyNumber", "requestedBy", "requirements", "reviewedAt", "reviewedBy", "status", "submissionDate", "technicalAnalysis", "tenantId", "totalArea", "updatedAt", "validUntil") SELECT "applicantCpf", "applicantCpfCnpj", "applicantEmail", "applicantName", "applicantPhone", "approvalDate", "approvedAt", "approvedBy", "blockNumber", "builtArea", "construction", "constructionType", "createdAt", "description", "documents", "floors", "id", "issuedDate", "lotNumber", "neighborhood", "observations", "permitNumber", "permitType", "projectValue", "property", "propertyAddress", "propertyNumber", "requestedBy", "requirements", "reviewedAt", "reviewedBy", "status", "submissionDate", "technicalAnalysis", "tenantId", "totalArea", "updatedAt", "validUntil" FROM "building_permits";
DROP TABLE "building_permits";
ALTER TABLE "new_building_permits" RENAME TO "building_permits";
CREATE TABLE "new_project_approvals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "projectName" TEXT NOT NULL,
    "applicantName" TEXT NOT NULL,
    "projectType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'UNDER_REVIEW',
    "submissionDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvalDate" DATETIME,
    "description" TEXT,
    "documents" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "project_approvals_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "project_approvals_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_project_approvals" ("applicantName", "approvalDate", "createdAt", "description", "documents", "id", "projectName", "projectType", "status", "submissionDate", "tenantId", "updatedAt") SELECT "applicantName", "approvalDate", "createdAt", "description", "documents", "id", "projectName", "projectType", "status", "submissionDate", "tenantId", "updatedAt" FROM "project_approvals";
DROP TABLE "project_approvals";
ALTER TABLE "new_project_approvals" RENAME TO "project_approvals";
CREATE TABLE "new_urban_planning_attendances" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "citizenId" TEXT,
    "citizenName" TEXT NOT NULL,
    "contactInfo" TEXT,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "attendanceDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedDate" DATETIME,
    "assignedTo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "urban_planning_attendances_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "urban_planning_attendances_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "citizens" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "urban_planning_attendances_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_urban_planning_attendances" ("assignedTo", "attendanceDate", "citizenId", "citizenName", "contactInfo", "createdAt", "description", "id", "resolvedDate", "status", "subject", "tenantId", "updatedAt") SELECT "assignedTo", "attendanceDate", "citizenId", "citizenName", "contactInfo", "createdAt", "description", "id", "resolvedDate", "status", "subject", "tenantId", "updatedAt" FROM "urban_planning_attendances";
DROP TABLE "urban_planning_attendances";
ALTER TABLE "new_urban_planning_attendances" RENAME TO "urban_planning_attendances";
CREATE TABLE "new_urban_zoning" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "name" TEXT,
    "zoneName" TEXT NOT NULL,
    "code" TEXT,
    "type" TEXT,
    "zoneType" TEXT NOT NULL,
    "description" TEXT,
    "regulations" JSONB,
    "permitedUses" JSONB,
    "restrictions" JSONB,
    "coordinates" JSONB,
    "boundaries" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "urban_zoning_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "urban_zoning_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_urban_zoning" ("boundaries", "code", "coordinates", "createdAt", "description", "id", "isActive", "name", "permitedUses", "regulations", "restrictions", "tenantId", "type", "updatedAt", "zoneName", "zoneType") SELECT "boundaries", "code", "coordinates", "createdAt", "description", "id", "isActive", "name", "permitedUses", "regulations", "restrictions", "tenantId", "type", "updatedAt", "zoneName", "zoneType" FROM "urban_zoning";
DROP TABLE "urban_zoning";
ALTER TABLE "new_urban_zoning" RENAME TO "urban_zoning";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
