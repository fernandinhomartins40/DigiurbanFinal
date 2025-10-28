const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const migrationDir = path.join(__dirname, 'prisma', 'migrations', '20251024221210_consolidated_schema');
const migrationPath = path.join(migrationDir, 'migration.sql');

console.log('📝 Adicionando tabelas FASE 4-7 à migration consolidada...\n');

// Ler a migration atual
let migration = fs.readFileSync(migrationPath, 'utf-8');

// SQL para as tabelas FASE 4-7
const phase4to7SQL = `

-- =====================================================
-- FASES 4-7: SECRETARIAS DE INFRAESTRUTURA, CULTURAIS, AMBIENTAIS E SEGURANÇA
-- Data: 2025-10-27
-- Descrição: Adiciona modelos das fases 4, 5, 6 e 7
-- =====================================================

-- ============================================================================
-- FASE 4: SECRETARIAS DE INFRAESTRUTURA
-- ============================================================================

-- CreateTable
CREATE TABLE "infrastructure_problems" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "coordinates" JSONB,
    "photos" JSONB,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "protocol" TEXT,
    "serviceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "resolvedAt" DATETIME,
    "resolvedBy" TEXT,
    "resolutionNotes" TEXT,
    "metadata" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "infrastructure_problems_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "urban_maintenance_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "coordinates" JSONB,
    "photos" JSONB,
    "details" JSONB,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "protocol" TEXT,
    "serviceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "scheduledFor" DATETIME,
    "completedAt" DATETIME,
    "completedBy" TEXT,
    "completionNotes" TEXT,
    "assignedTeam" TEXT,
    "assignedTo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "urban_maintenance_requests_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "housing_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "citizenName" TEXT NOT NULL,
    "citizenCpf" TEXT NOT NULL,
    "citizenRg" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "familySize" INTEGER NOT NULL,
    "monthlyIncome" REAL,
    "familyData" JSONB,
    "currentAddress" TEXT,
    "currentSituation" TEXT,
    "requestDetails" JSONB,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "analysisNotes" TEXT,
    "protocol" TEXT,
    "serviceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "reviewedAt" DATETIME,
    "reviewedBy" TEXT,
    "rejectionReason" TEXT,
    "documents" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "housing_requests_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================================
-- FASE 6: SECRETARIAS AMBIENTAIS (8 tabelas faltantes)
-- ============================================================================

-- CreateTable
CREATE TABLE "environmental_licenses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "applicantName" TEXT NOT NULL,
    "applicantCpf" TEXT NOT NULL,
    "applicantPhone" TEXT NOT NULL,
    "applicantEmail" TEXT,
    "licenseType" TEXT NOT NULL,
    "activityType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "coordinates" JSONB,
    "area" REAL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "validFrom" DATETIME,
    "validUntil" DATETIME,
    "technicalReport" JSONB,
    "conditions" JSONB,
    "observations" TEXT,
    "documents" JSONB,
    "protocol" TEXT,
    "serviceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "reviewedBy" TEXT,
    "reviewedAt" DATETIME,
    "approvedBy" TEXT,
    "approvedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "tree_authorizations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "applicantName" TEXT NOT NULL,
    "applicantCpf" TEXT NOT NULL,
    "applicantPhone" TEXT NOT NULL,
    "authorizationType" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "coordinates" JSONB,
    "photos" JSONB,
    "treeCount" INTEGER NOT NULL DEFAULT 1,
    "treeSpecies" JSONB,
    "treeData" JSONB,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "inspectionDate" DATETIME,
    "technicalReport" JSONB,
    "inspectorId" TEXT,
    "requiresCompensation" BOOLEAN NOT NULL DEFAULT false,
    "compensationPlan" JSONB,
    "protocol" TEXT,
    "serviceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "approvedBy" TEXT,
    "approvedAt" DATETIME,
    "executedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "environmental_complaints" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "complainantName" TEXT,
    "complainantPhone" TEXT,
    "complainantEmail" TEXT,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "complaintType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "coordinates" JSONB,
    "photos" JSONB,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "investigationDate" DATETIME,
    "investigatorId" TEXT,
    "investigationReport" JSONB,
    "actionsTaken" JSONB,
    "evidences" JSONB,
    "protocol" TEXT,
    "serviceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "assignedTo" TEXT,
    "resolvedBy" TEXT,
    "resolvedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "organic_certifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "producerName" TEXT NOT NULL,
    "producerCpf" TEXT NOT NULL,
    "producerPhone" TEXT NOT NULL,
    "producerEmail" TEXT,
    "propertyName" TEXT,
    "propertyLocation" TEXT NOT NULL,
    "propertyArea" REAL NOT NULL,
    "coordinates" JSONB,
    "products" JSONB NOT NULL,
    "productionSystem" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "certificationNumber" TEXT,
    "validFrom" DATETIME,
    "validUntil" DATETIME,
    "inspections" JSONB,
    "lastInspectionDate" DATETIME,
    "nextInspectionDate" DATETIME,
    "documents" JSONB,
    "technicalReport" JSONB,
    "protocol" TEXT,
    "serviceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "inspectorId" TEXT,
    "approvedBy" TEXT,
    "approvedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "technical_assistance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "producerName" TEXT NOT NULL,
    "producerCpf" TEXT NOT NULL,
    "producerPhone" TEXT NOT NULL,
    "propertyLocation" TEXT NOT NULL,
    "propertyArea" REAL,
    "assistanceType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cropTypes" JSONB,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "scheduledDate" DATETIME,
    "technicianId" TEXT,
    "visitDate" DATETIME,
    "visitReport" JSONB,
    "recommendations" JSONB,
    "photos" JSONB,
    "followUpRequired" BOOLEAN NOT NULL DEFAULT false,
    "followUpDate" DATETIME,
    "followUpNotes" TEXT,
    "protocol" TEXT,
    "serviceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "completedBy" TEXT,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "seed_distributions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "producerName" TEXT NOT NULL,
    "producerCpf" TEXT NOT NULL,
    "producerPhone" TEXT NOT NULL,
    "propertyLocation" TEXT NOT NULL,
    "propertyArea" REAL,
    "requestType" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "purpose" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "approvedQuantity" JSONB,
    "approvalNotes" TEXT,
    "deliveryDate" DATETIME,
    "deliveredBy" TEXT,
    "deliveredItems" JSONB,
    "receivedBy" TEXT,
    "protocol" TEXT,
    "serviceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "approvedBy" TEXT,
    "approvedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "soil_analyses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "producerName" TEXT NOT NULL,
    "producerCpf" TEXT NOT NULL,
    "producerPhone" TEXT NOT NULL,
    "propertyLocation" TEXT NOT NULL,
    "propertyArea" REAL,
    "coordinates" JSONB,
    "analysisType" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "cropIntended" TEXT,
    "sampleCount" INTEGER NOT NULL DEFAULT 1,
    "collectionDate" DATETIME,
    "collectedBy" TEXT,
    "sampleLocations" JSONB,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "labId" TEXT,
    "labSentDate" DATETIME,
    "resultsDate" DATETIME,
    "results" JSONB,
    "recommendations" JSONB,
    "technicalReport" TEXT,
    "protocol" TEXT,
    "serviceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "analyzedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "farmer_market_registrations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "producerName" TEXT NOT NULL,
    "producerCpf" TEXT NOT NULL,
    "producerPhone" TEXT NOT NULL,
    "producerEmail" TEXT,
    "propertyLocation" TEXT NOT NULL,
    "propertyArea" REAL,
    "products" JSONB NOT NULL,
    "productionType" TEXT NOT NULL,
    "hasOrganicCert" BOOLEAN NOT NULL DEFAULT false,
    "certificationId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "registrationNumber" TEXT,
    "needsStall" BOOLEAN NOT NULL DEFAULT false,
    "stallPreference" TEXT,
    "documents" JSONB,
    "validFrom" DATETIME,
    "validUntil" DATETIME,
    "protocol" TEXT,
    "serviceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "inspectedBy" TEXT,
    "inspectionDate" DATETIME,
    "approvedBy" TEXT,
    "approvedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "building_permits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "applicantName" TEXT NOT NULL,
    "applicantCpf" TEXT NOT NULL,
    "applicantPhone" TEXT NOT NULL,
    "applicantEmail" TEXT,
    "permitType" TEXT NOT NULL,
    "constructionType" TEXT NOT NULL,
    "propertyAddress" TEXT NOT NULL,
    "propertyNumber" TEXT,
    "neighborhood" TEXT NOT NULL,
    "lotNumber" TEXT,
    "blockNumber" TEXT,
    "totalArea" REAL NOT NULL,
    "builtArea" REAL NOT NULL,
    "floors" INTEGER NOT NULL DEFAULT 1,
    "projectValue" REAL,
    "engineerName" TEXT,
    "engineerCrea" TEXT,
    "architectName" TEXT,
    "architectCau" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "permitNumber" TEXT,
    "technicalAnalysis" JSONB,
    "observations" TEXT,
    "requirements" JSONB,
    "documents" JSONB,
    "projectFiles" JSONB,
    "issuedDate" DATETIME,
    "validUntil" DATETIME,
    "protocol" TEXT,
    "serviceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "reviewedBy" TEXT,
    "reviewedAt" DATETIME,
    "approvedBy" TEXT,
    "approvedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "urban_certificates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "applicantName" TEXT NOT NULL,
    "applicantCpf" TEXT NOT NULL,
    "applicantPhone" TEXT NOT NULL,
    "applicantEmail" TEXT,
    "certificateType" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "propertyAddress" TEXT NOT NULL,
    "propertyNumber" TEXT,
    "neighborhood" TEXT NOT NULL,
    "lotNumber" TEXT,
    "blockNumber" TEXT,
    "cadastralNumber" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "certificateNumber" TEXT,
    "zoning" TEXT,
    "landUse" TEXT,
    "restrictions" JSONB,
    "observations" TEXT,
    "issuedDate" DATETIME,
    "validUntil" DATETIME,
    "documents" JSONB,
    "protocol" TEXT,
    "serviceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "issuedBy" TEXT,
    "verifiedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "property_numbering" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "applicantName" TEXT NOT NULL,
    "applicantCpf" TEXT NOT NULL,
    "applicantPhone" TEXT NOT NULL,
    "propertyAddress" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "reference" TEXT,
    "coordinates" JSONB,
    "numberingType" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "currentNumber" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "inspectionDate" DATETIME,
    "inspectorId" TEXT,
    "inspectionReport" JSONB,
    "photos" JSONB,
    "assignedNumber" TEXT,
    "assignmentDate" DATETIME,
    "protocol" TEXT,
    "serviceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "approvedBy" TEXT,
    "approvedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "lot_subdivisions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "ownerCpf" TEXT NOT NULL,
    "ownerPhone" TEXT NOT NULL,
    "ownerEmail" TEXT,
    "originalAddress" TEXT NOT NULL,
    "originalLotNumber" TEXT,
    "originalBlockNumber" TEXT,
    "originalArea" REAL NOT NULL,
    "cadastralNumber" TEXT,
    "newLotsCount" INTEGER NOT NULL,
    "newLotsData" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "technicalAnalysis" JSONB,
    "meetsRequirements" BOOLEAN,
    "observations" TEXT,
    "documents" JSONB,
    "surveyPlans" JSONB,
    "surveyorName" TEXT,
    "surveyorCrea" TEXT,
    "approvalNumber" TEXT,
    "approvedDate" DATETIME,
    "registryNumber" TEXT,
    "registryDate" DATETIME,
    "protocol" TEXT,
    "serviceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "reviewedBy" TEXT,
    "reviewedAt" DATETIME,
    "approvedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- ============================================================================
-- FASE 7: SECRETARIA DE SEGURANÇA PÚBLICA
-- ============================================================================

-- CreateTable
CREATE TABLE "police_reports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "coordinates" JSONB,
    "occurrenceDate" DATETIME NOT NULL,
    "occurrenceTime" TEXT,
    "reporterName" TEXT,
    "reporterPhone" TEXT,
    "reporterEmail" TEXT,
    "witnessInfo" JSONB,
    "suspectInfo" JSONB,
    "photos" JSONB,
    "videos" JSONB,
    "documents" JSONB,
    "reportNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'registered',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "category" TEXT,
    "assignedTo" TEXT,
    "assignedAt" DATETIME,
    "investigationNotes" JSONB,
    "resolution" TEXT,
    "resolvedAt" DATETIME,
    "protocol" TEXT,
    "serviceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "metadata" JSONB,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "patrol_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "coordinates" JSONB,
    "area" TEXT,
    "requestedDate" DATETIME,
    "requestedTime" TEXT,
    "frequency" TEXT,
    "duration" TEXT,
    "requesterName" TEXT NOT NULL,
    "requesterPhone" TEXT NOT NULL,
    "requesterEmail" TEXT,
    "requesterAddress" TEXT,
    "description" TEXT NOT NULL,
    "concerns" JSONB,
    "additionalInfo" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "scheduledDate" DATETIME,
    "scheduledTime" TEXT,
    "assignedUnit" TEXT,
    "assignedOfficers" JSONB,
    "patrolLog" JSONB,
    "observations" TEXT,
    "completedAt" DATETIME,
    "protocol" TEXT,
    "serviceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "metadata" JSONB,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "camera_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "coordinates" JSONB,
    "area" TEXT,
    "address" TEXT,
    "cameraType" TEXT,
    "quantity" INTEGER DEFAULT 1,
    "justification" TEXT NOT NULL,
    "incidentDate" DATETIME,
    "incidentTime" TEXT,
    "timeRange" JSONB,
    "incidentDescription" TEXT,
    "feasibilityStatus" TEXT,
    "technicalNotes" TEXT,
    "estimatedCost" REAL,
    "requesterName" TEXT NOT NULL,
    "requesterPhone" TEXT NOT NULL,
    "requesterEmail" TEXT,
    "requesterDocument" TEXT,
    "requesterType" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "scheduledDate" DATETIME,
    "installedDate" DATETIME,
    "installationTeam" TEXT,
    "cameraIds" JSONB,
    "footageDelivered" BOOLEAN DEFAULT false,
    "footageDeliveryDate" DATETIME,
    "footageNotes" TEXT,
    "protocol" TEXT,
    "serviceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "metadata" JSONB,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "anonymous_tips" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT NOT NULL,
    "location" TEXT,
    "coordinates" JSONB,
    "suspectInfo" JSONB,
    "vehicleInfo" JSONB,
    "timeframe" TEXT,
    "frequency" TEXT,
    "hasEvidence" BOOLEAN NOT NULL DEFAULT false,
    "evidenceType" JSONB,
    "evidenceNotes" TEXT,
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    "dangerLevel" TEXT,
    "tipNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'received',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "assignedTo" TEXT,
    "assignedAt" DATETIME,
    "investigationLog" JSONB,
    "actionTaken" TEXT,
    "outcome" TEXT,
    "closedAt" DATETIME,
    "feedbackCode" TEXT,
    "publicUpdates" JSONB,
    "protocol" TEXT,
    "serviceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "isAnonymous" BOOLEAN NOT NULL DEFAULT true,
    "anonymityLevel" TEXT NOT NULL DEFAULT 'full',
    "ipHash" TEXT,
    "metadata" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "event_authorizations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "eventDate" DATETIME NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "setupDate" DATETIME,
    "setupTime" TEXT,
    "teardownTime" TEXT,
    "location" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "coordinates" JSONB,
    "venue" TEXT,
    "isPublicSpace" BOOLEAN NOT NULL DEFAULT true,
    "expectedAttendees" INTEGER,
    "hasAlcohol" BOOLEAN NOT NULL DEFAULT false,
    "hasSound" BOOLEAN NOT NULL DEFAULT false,
    "soundLevel" TEXT,
    "organizerName" TEXT NOT NULL,
    "organizerDocument" TEXT NOT NULL,
    "organizerPhone" TEXT NOT NULL,
    "organizerEmail" TEXT,
    "organizerType" TEXT,
    "securityPlan" TEXT,
    "privateSecurityCount" INTEGER DEFAULT 0,
    "needsPoliceSupport" BOOLEAN NOT NULL DEFAULT false,
    "requestedOfficers" INTEGER DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "analysisNotes" TEXT,
    "requirements" JSONB,
    "conditions" TEXT,
    "assignedOfficers" INTEGER DEFAULT 0,
    "assignedUnits" JSONB,
    "coordinatorOfficer" TEXT,
    "documents" JSONB,
    "insurance" JSONB,
    "protocol" TEXT,
    "serviceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "approvedBy" TEXT,
    "approvedAt" DATETIME,
    "deniedReason" TEXT,
    "metadata" JSONB,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "lost_and_found" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "itemDescription" TEXT NOT NULL,
    "brand" TEXT,
    "model" TEXT,
    "color" TEXT,
    "distinctiveMarks" TEXT,
    "location" TEXT NOT NULL,
    "lostFoundDate" DATETIME NOT NULL,
    "lostFoundTime" TEXT,
    "photos" JSONB,
    "personName" TEXT NOT NULL,
    "personDocument" TEXT,
    "personPhone" TEXT NOT NULL,
    "personEmail" TEXT,
    "personAddress" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "matchedWith" TEXT,
    "matchedAt" DATETIME,
    "returnedTo" TEXT,
    "returnedAt" DATETIME,
    "returnNotes" TEXT,
    "storageLocation" TEXT,
    "storedBy" TEXT,
    "storedAt" DATETIME,
    "protocol" TEXT,
    "serviceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "metadata" JSONB,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- ============================================================================
-- ÍNDICES PARA AS NOVAS TABELAS
-- ============================================================================

-- FASE 4
CREATE INDEX "infrastructure_problems_tenantId_idx" ON "infrastructure_problems"("tenantId");
CREATE INDEX "infrastructure_problems_type_idx" ON "infrastructure_problems"("type");
CREATE INDEX "infrastructure_problems_status_idx" ON "infrastructure_problems"("status");

CREATE INDEX "urban_maintenance_requests_tenantId_idx" ON "urban_maintenance_requests"("tenantId");
CREATE INDEX "urban_maintenance_requests_type_idx" ON "urban_maintenance_requests"("type");
CREATE INDEX "urban_maintenance_requests_status_idx" ON "urban_maintenance_requests"("status");

CREATE INDEX "housing_requests_tenantId_idx" ON "housing_requests"("tenantId");
CREATE INDEX "housing_requests_type_idx" ON "housing_requests"("type");
CREATE INDEX "housing_requests_status_idx" ON "housing_requests"("status");
CREATE INDEX "housing_requests_citizenCpf_idx" ON "housing_requests"("citizenCpf");

-- FASE 6
CREATE INDEX "environmental_licenses_tenantId_idx" ON "environmental_licenses"("tenantId");
CREATE INDEX "environmental_licenses_status_idx" ON "environmental_licenses"("status");

CREATE INDEX "tree_authorizations_tenantId_idx" ON "tree_authorizations"("tenantId");
CREATE INDEX "tree_authorizations_status_idx" ON "tree_authorizations"("status");

CREATE INDEX "environmental_complaints_tenantId_idx" ON "environmental_complaints"("tenantId");
CREATE INDEX "environmental_complaints_status_idx" ON "environmental_complaints"("status");
CREATE INDEX "environmental_complaints_complaintType_idx" ON "environmental_complaints"("complaintType");

CREATE INDEX "organic_certifications_tenantId_idx" ON "organic_certifications"("tenantId");
CREATE INDEX "organic_certifications_status_idx" ON "organic_certifications"("status");
CREATE UNIQUE INDEX "organic_certifications_certificationNumber_key" ON "organic_certifications"("certificationNumber");

CREATE INDEX "technical_assistance_tenantId_idx" ON "technical_assistance"("tenantId");
CREATE INDEX "technical_assistance_status_idx" ON "technical_assistance"("status");

CREATE INDEX "seed_distributions_tenantId_idx" ON "seed_distributions"("tenantId");
CREATE INDEX "seed_distributions_status_idx" ON "seed_distributions"("status");

CREATE INDEX "soil_analyses_tenantId_idx" ON "soil_analyses"("tenantId");
CREATE INDEX "soil_analyses_status_idx" ON "soil_analyses"("status");

CREATE INDEX "farmer_market_registrations_tenantId_idx" ON "farmer_market_registrations"("tenantId");
CREATE INDEX "farmer_market_registrations_status_idx" ON "farmer_market_registrations"("status");
CREATE UNIQUE INDEX "farmer_market_registrations_registrationNumber_key" ON "farmer_market_registrations"("registrationNumber");

CREATE INDEX "building_permits_tenantId_idx" ON "building_permits"("tenantId");
CREATE INDEX "building_permits_status_idx" ON "building_permits"("status");
CREATE UNIQUE INDEX "building_permits_permitNumber_key" ON "building_permits"("permitNumber");

CREATE INDEX "urban_certificates_tenantId_idx" ON "urban_certificates"("tenantId");
CREATE INDEX "urban_certificates_status_idx" ON "urban_certificates"("status");
CREATE INDEX "urban_certificates_certificateType_idx" ON "urban_certificates"("certificateType");
CREATE UNIQUE INDEX "urban_certificates_certificateNumber_key" ON "urban_certificates"("certificateNumber");

CREATE INDEX "property_numbering_tenantId_idx" ON "property_numbering"("tenantId");
CREATE INDEX "property_numbering_status_idx" ON "property_numbering"("status");

CREATE INDEX "lot_subdivisions_tenantId_idx" ON "lot_subdivisions"("tenantId");
CREATE INDEX "lot_subdivisions_status_idx" ON "lot_subdivisions"("status");

-- FASE 7
CREATE INDEX "police_reports_tenantId_idx" ON "police_reports"("tenantId");
CREATE INDEX "police_reports_status_idx" ON "police_reports"("status");
CREATE INDEX "police_reports_type_idx" ON "police_reports"("type");
CREATE INDEX "police_reports_occurrenceDate_idx" ON "police_reports"("occurrenceDate");
CREATE UNIQUE INDEX "police_reports_reportNumber_key" ON "police_reports"("reportNumber");

CREATE INDEX "patrol_requests_tenantId_idx" ON "patrol_requests"("tenantId");
CREATE INDEX "patrol_requests_status_idx" ON "patrol_requests"("status");
CREATE INDEX "patrol_requests_type_idx" ON "patrol_requests"("type");
CREATE INDEX "patrol_requests_requestedDate_idx" ON "patrol_requests"("requestedDate");

CREATE INDEX "camera_requests_tenantId_idx" ON "camera_requests"("tenantId");
CREATE INDEX "camera_requests_status_idx" ON "camera_requests"("status");
CREATE INDEX "camera_requests_type_idx" ON "camera_requests"("type");

CREATE INDEX "anonymous_tips_tenantId_idx" ON "anonymous_tips"("tenantId");
CREATE INDEX "anonymous_tips_status_idx" ON "anonymous_tips"("status");
CREATE INDEX "anonymous_tips_type_idx" ON "anonymous_tips"("type");
CREATE UNIQUE INDEX "anonymous_tips_tipNumber_key" ON "anonymous_tips"("tipNumber");
CREATE UNIQUE INDEX "anonymous_tips_feedbackCode_key" ON "anonymous_tips"("feedbackCode");

CREATE INDEX "event_authorizations_tenantId_idx" ON "event_authorizations"("tenantId");
CREATE INDEX "event_authorizations_status_idx" ON "event_authorizations"("status");
CREATE INDEX "event_authorizations_eventDate_idx" ON "event_authorizations"("eventDate");

CREATE INDEX "lost_and_found_tenantId_idx" ON "lost_and_found"("tenantId");
CREATE INDEX "lost_and_found_type_idx" ON "lost_and_found"("type");
CREATE INDEX "lost_and_found_status_idx" ON "lost_and_found"("status");
CREATE INDEX "lost_and_found_itemType_idx" ON "lost_and_found"("itemType");
CREATE INDEX "lost_and_found_lostFoundDate_idx" ON "lost_and_found"("lostFoundDate");
`;

// Adicionar ao final da migration
migration += phase4to7SQL;

// Salvar a migration atualizada
fs.writeFileSync(migrationPath, migration, 'utf-8');

console.log('✓ Tabelas FASE 4-7 adicionadas à migration consolidada!');
console.log(`✓ Migration atualizada em: ${migrationPath}`);
console.log('\n📊 Estatísticas:');
console.log('  - FASE 4: 3 tabelas (infrastructure_problems, urban_maintenance_requests, housing_requests)');
console.log('  - FASE 6: 12 tabelas (environmental_licenses, tree_authorizations, etc.)');
console.log('  - FASE 7: 6 tabelas (police_reports, patrol_requests, camera_requests, etc.)');
console.log('  - Total: 21 novas tabelas + índices');
