/*
  Warnings:

  - You are about to drop the `technical_assistance` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "building_permits_status_idx";

-- DropIndex
DROP INDEX "building_permits_tenantId_idx";

-- DropIndex
DROP INDEX "technical_assistance_status_idx";

-- DropIndex
DROP INDEX "technical_assistance_tenantId_idx";

-- AlterTable
ALTER TABLE "building_permits" ADD COLUMN "applicantCpf" TEXT;
ALTER TABLE "building_permits" ADD COLUMN "applicantEmail" TEXT;
ALTER TABLE "building_permits" ADD COLUMN "applicantPhone" TEXT;
ALTER TABLE "building_permits" ADD COLUMN "approvedAt" DATETIME;
ALTER TABLE "building_permits" ADD COLUMN "approvedBy" TEXT;
ALTER TABLE "building_permits" ADD COLUMN "blockNumber" TEXT;
ALTER TABLE "building_permits" ADD COLUMN "builtArea" REAL;
ALTER TABLE "building_permits" ADD COLUMN "constructionType" TEXT;
ALTER TABLE "building_permits" ADD COLUMN "floors" INTEGER;
ALTER TABLE "building_permits" ADD COLUMN "issuedDate" DATETIME;
ALTER TABLE "building_permits" ADD COLUMN "lotNumber" TEXT;
ALTER TABLE "building_permits" ADD COLUMN "neighborhood" TEXT;
ALTER TABLE "building_permits" ADD COLUMN "permitNumber" TEXT;
ALTER TABLE "building_permits" ADD COLUMN "projectValue" REAL;
ALTER TABLE "building_permits" ADD COLUMN "propertyNumber" TEXT;
ALTER TABLE "building_permits" ADD COLUMN "requirements" JSONB;
ALTER TABLE "building_permits" ADD COLUMN "reviewedAt" DATETIME;
ALTER TABLE "building_permits" ADD COLUMN "reviewedBy" TEXT;
ALTER TABLE "building_permits" ADD COLUMN "technicalAnalysis" JSONB;
ALTER TABLE "building_permits" ADD COLUMN "totalArea" REAL;
ALTER TABLE "building_permits" ADD COLUMN "validUntil" DATETIME;

-- AlterTable
ALTER TABLE "local_businesses" ADD COLUMN "city" TEXT;
ALTER TABLE "local_businesses" ADD COLUMN "neighborhood" TEXT;
ALTER TABLE "local_businesses" ADD COLUMN "protocol" TEXT;
ALTER TABLE "local_businesses" ADD COLUMN "state" TEXT;

-- AlterTable
ALTER TABLE "services" ADD COLUMN "moduleEntity" TEXT;
ALTER TABLE "services" ADD COLUMN "moduleType" TEXT;
ALTER TABLE "services" ADD COLUMN "serviceType" TEXT;
ALTER TABLE "services" ADD COLUMN "templateId" TEXT;

-- AlterTable
ALTER TABLE "tourism_programs" ADD COLUMN "currentParticipants" INTEGER;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "technical_assistance";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "service_templates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "department" TEXT,
    "departmentType" TEXT NOT NULL,
    "icon" TEXT,
    "color" TEXT,
    "isActive" BOOLEAN NOT NULL,
    "version" INTEGER DEFAULT 1,
    "defaultConfig" JSONB,
    "requiredFields" JSONB,
    "optionalFields" JSONB,
    "requiredDocs" JSONB,
    "formSchema" JSONB,
    "workflowSteps" JSONB,
    "estimatedTime" INTEGER,
    "moduleEntity" TEXT,
    "moduleType" TEXT,
    "fieldMapping" JSONB,
    "defaultFields" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "service_surveys" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "questions" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "showAfter" TEXT NOT NULL DEFAULT 'completion',
    "daysAfter" INTEGER,
    "type" TEXT,
    "timing" TEXT,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "service_surveys_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "service_workflows" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceId" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "steps" JSONB NOT NULL,
    "rules" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "service_workflows_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "service_notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "templates" JSONB NOT NULL,
    "triggers" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "service_notifications_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sports_modalities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "sports_modalities_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "custom_data_tables" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "tableName" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "fields" JSONB NOT NULL,
    "allowCreate" BOOLEAN NOT NULL DEFAULT true,
    "allowUpdate" BOOLEAN NOT NULL DEFAULT true,
    "allowDelete" BOOLEAN NOT NULL DEFAULT true,
    "moduleType" TEXT,
    "schema" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "custom_data_records" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tableId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "protocol" TEXT,
    "serviceId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT,
    CONSTRAINT "custom_data_records_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "custom_data_tables" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "protocolId" TEXT NOT NULL,
    "schedulingId" TEXT NOT NULL,
    "scheduledDate" DATETIME NOT NULL,
    "scheduledTime" TEXT,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "notes" TEXT,
    "reminderSent" BOOLEAN NOT NULL DEFAULT false,
    "confirmedAt" DATETIME,
    "completedAt" DATETIME,
    "cancelledAt" DATETIME,
    "cancellationReason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "appointments_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "appointments_schedulingId_fkey" FOREIGN KEY ("schedulingId") REFERENCES "service_scheduling" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "protocol_locations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "protocolId" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "address" TEXT,
    "number" TEXT,
    "complement" TEXT,
    "neighborhood" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "reference" TEXT,
    "accuracy" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "protocol_locations_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "service_locations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceId" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "useCurrentLocation" BOOLEAN NOT NULL DEFAULT true,
    "allowManualEntry" BOOLEAN NOT NULL DEFAULT true,
    "restrictToCity" BOOLEAN NOT NULL DEFAULT false,
    "allowedCities" JSONB,
    "centerLat" REAL,
    "centerLng" REAL,
    "allowedRadius" REAL,
    "requireAddress" BOOLEAN NOT NULL DEFAULT false,
    "requireReference" BOOLEAN NOT NULL DEFAULT false,
    "requiresLocation" BOOLEAN NOT NULL DEFAULT false,
    "locationType" TEXT,
    "hasGeofencing" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "service_locations_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "service_forms" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fields" JSONB NOT NULL,
    "requiresAllFields" BOOLEAN NOT NULL DEFAULT false,
    "allowDraft" BOOLEAN NOT NULL DEFAULT false,
    "validationRules" JSONB,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "validation" JSONB,
    "conditional" JSONB,
    "isMultiStep" BOOLEAN NOT NULL DEFAULT false,
    "steps" JSONB,
    "hasGeofencing" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "service_forms_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "service_form_submissions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "formId" TEXT NOT NULL,
    "protocolId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "isDraft" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "service_form_submissions_formId_fkey" FOREIGN KEY ("formId") REFERENCES "service_forms" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "service_form_submissions_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "service_scheduling" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
    "availableDays" JSONB NOT NULL,
    "timeSlots" JSONB NOT NULL,
    "slotDuration" INTEGER,
    "bufferTime" INTEGER,
    "maxPerSlot" INTEGER NOT NULL DEFAULT 1,
    "maxPerDay" INTEGER,
    "minAdvanceDays" INTEGER NOT NULL DEFAULT 1,
    "maxAdvanceDays" INTEGER NOT NULL DEFAULT 30,
    "advanceBooking" INTEGER,
    "sendReminder" BOOLEAN NOT NULL DEFAULT true,
    "reminderHours" INTEGER NOT NULL DEFAULT 24,
    "allowScheduling" BOOLEAN NOT NULL DEFAULT true,
    "type" TEXT,
    "workingHours" JSONB,
    "blockouts" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "service_scheduling_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "service_custom_fields" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "placeholder" TEXT,
    "helpText" TEXT,
    "validation" JSONB,
    "options" JSONB,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "service_custom_fields_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "protocol_custom_field_values" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "protocolId" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "protocol_custom_field_values_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "protocol_custom_field_values_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "service_custom_fields" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "service_documents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "multiple" BOOLEAN NOT NULL DEFAULT false,
    "minFiles" INTEGER DEFAULT 1,
    "maxFiles" INTEGER DEFAULT 1,
    "acceptedTypes" JSONB NOT NULL,
    "maxSize" INTEGER NOT NULL DEFAULT 5242880,
    "minSize" INTEGER,
    "validateWithAI" BOOLEAN NOT NULL DEFAULT false,
    "extractData" JSONB,
    "aiProvider" TEXT,
    "templateUrl" TEXT,
    "exampleUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "service_documents_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "document_uploads" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentConfigId" TEXT NOT NULL,
    "protocolId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "isValidated" BOOLEAN NOT NULL DEFAULT false,
    "validatedAt" DATETIME,
    "validatedBy" TEXT,
    "validationStatus" TEXT,
    "rejectionReason" TEXT,
    "extractedData" JSONB,
    "ocrConfidence" REAL,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedBy" TEXT,
    CONSTRAINT "document_uploads_documentConfigId_fkey" FOREIGN KEY ("documentConfigId") REFERENCES "service_documents" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "document_uploads_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_athletes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "cpf" TEXT,
    "rg" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "sport" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "team" TEXT,
    "teamId" TEXT,
    "position" TEXT,
    "medicalInfo" JSONB,
    "emergencyContact" JSONB,
    "federationNumber" TEXT,
    "federationExpiry" DATETIME,
    "medicalCertificate" JSONB,
    "modalityId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "protocol" TEXT,
    "serviceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "athletes_modalityId_fkey" FOREIGN KEY ("modalityId") REFERENCES "sport_modalities" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "athletes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_athletes" ("address", "birthDate", "category", "cpf", "createdAt", "email", "emergencyContact", "federationExpiry", "federationNumber", "id", "isActive", "medicalCertificate", "medicalInfo", "modalityId", "name", "phone", "position", "rg", "sport", "team", "teamId", "tenantId", "updatedAt") SELECT "address", "birthDate", "category", "cpf", "createdAt", "email", "emergencyContact", "federationExpiry", "federationNumber", "id", "isActive", "medicalCertificate", "medicalInfo", "modalityId", "name", "phone", "position", "rg", "sport", "team", "teamId", "tenantId", "updatedAt" FROM "athletes";
DROP TABLE "athletes";
ALTER TABLE "new_athletes" RENAME TO "athletes";
CREATE UNIQUE INDEX "athletes_tenantId_cpf_key" ON "athletes"("tenantId", "cpf");
CREATE TABLE "new_competitions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sport" TEXT NOT NULL,
    "competitionType" TEXT NOT NULL,
    "type" TEXT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "category" TEXT NOT NULL,
    "ageGroup" TEXT NOT NULL,
    "maxTeams" INTEGER,
    "registeredTeams" INTEGER,
    "registrationFee" REAL,
    "entryFee" REAL,
    "prizes" JSONB,
    "rules" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "organizer" TEXT NOT NULL,
    "venue" TEXT,
    "location" TEXT,
    "contact" JSONB,
    "results" JSONB,
    "modalityId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "sportsModalityId" TEXT,
    CONSTRAINT "competitions_modalityId_fkey" FOREIGN KEY ("modalityId") REFERENCES "sport_modalities" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "competitions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "competitions_sportsModalityId_fkey" FOREIGN KEY ("sportsModalityId") REFERENCES "sports_modalities" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_competitions" ("ageGroup", "category", "competitionType", "contact", "createdAt", "endDate", "entryFee", "id", "location", "maxTeams", "modalityId", "name", "organizer", "prizes", "registeredTeams", "registrationFee", "results", "rules", "sport", "startDate", "status", "tenantId", "type", "updatedAt", "venue") SELECT "ageGroup", "category", "competitionType", "contact", "createdAt", "endDate", "entryFee", "id", "location", "maxTeams", "modalityId", "name", "organizer", "prizes", "registeredTeams", "registrationFee", "results", "rules", "sport", "startDate", "status", "tenantId", "type", "updatedAt", "venue" FROM "competitions";
DROP TABLE "competitions";
ALTER TABLE "new_competitions" RENAME TO "competitions";
CREATE TABLE "new_cultural_attendances" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocol" TEXT NOT NULL,
    "citizenId" TEXT,
    "citizenName" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "observations" TEXT,
    "responsible" TEXT,
    "attachments" JSONB,
    "subject" TEXT,
    "category" TEXT,
    "requestedLocation" TEXT,
    "eventDate" DATETIME,
    "estimatedAudience" INTEGER,
    "requestedBudget" REAL,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "followUpDate" DATETIME,
    "serviceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "cultural_attendances_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_cultural_attendances" ("attachments", "category", "citizenId", "citizenName", "contact", "createdAt", "description", "email", "estimatedAudience", "eventDate", "followUpDate", "id", "observations", "phone", "priority", "protocol", "requestedBudget", "requestedLocation", "responsible", "status", "subject", "tenantId", "type", "updatedAt") SELECT "attachments", "category", "citizenId", "citizenName", "contact", "createdAt", "description", "email", "estimatedAudience", "eventDate", "followUpDate", "id", "observations", "phone", "priority", "protocol", "requestedBudget", "requestedLocation", "responsible", "status", "subject", "tenantId", "type", "updatedAt" FROM "cultural_attendances";
DROP TABLE "cultural_attendances";
ALTER TABLE "new_cultural_attendances" RENAME TO "cultural_attendances";
CREATE UNIQUE INDEX "cultural_attendances_protocol_key" ON "cultural_attendances"("protocol");
CREATE TABLE "new_cultural_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "spaceId" TEXT,
    "projectId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "schedule" JSONB NOT NULL,
    "duration" INTEGER,
    "venue" TEXT NOT NULL,
    "address" JSONB,
    "coordinates" JSONB,
    "capacity" INTEGER NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "ageRating" TEXT,
    "ticketPrice" REAL,
    "freeEvent" BOOLEAN NOT NULL DEFAULT true,
    "organizer" JSONB NOT NULL,
    "producer" TEXT,
    "contact" JSONB NOT NULL,
    "performers" JSONB,
    "guests" JSONB,
    "requirements" JSONB,
    "setup" JSONB,
    "technical" JSONB,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "approvedBy" TEXT,
    "approvedAt" DATETIME,
    "promotion" JSONB,
    "media" JSONB,
    "website" TEXT,
    "socialMedia" JSONB,
    "attendance" INTEGER,
    "revenue" REAL,
    "expenses" REAL,
    "photos" JSONB,
    "videos" JSONB,
    "reviews" JSONB,
    "observations" TEXT,
    "protocol" TEXT,
    "serviceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "cultural_events_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "cultural_projects" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "cultural_events_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "cultural_spaces" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "cultural_events_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_cultural_events" ("address", "ageRating", "approved", "approvedAt", "approvedBy", "attendance", "capacity", "category", "contact", "coordinates", "createdAt", "description", "duration", "endDate", "expenses", "freeEvent", "guests", "id", "media", "observations", "organizer", "performers", "photos", "producer", "projectId", "promotion", "requirements", "revenue", "reviews", "schedule", "setup", "socialMedia", "spaceId", "startDate", "status", "targetAudience", "technical", "tenantId", "ticketPrice", "title", "type", "updatedAt", "venue", "videos", "website") SELECT "address", "ageRating", "approved", "approvedAt", "approvedBy", "attendance", "capacity", "category", "contact", "coordinates", "createdAt", "description", "duration", "endDate", "expenses", "freeEvent", "guests", "id", "media", "observations", "organizer", "performers", "photos", "producer", "projectId", "promotion", "requirements", "revenue", "reviews", "schedule", "setup", "socialMedia", "spaceId", "startDate", "status", "targetAudience", "technical", "tenantId", "ticketPrice", "title", "type", "updatedAt", "venue", "videos", "website" FROM "cultural_events";
DROP TABLE "cultural_events";
ALTER TABLE "new_cultural_events" RENAME TO "cultural_events";
CREATE INDEX "cultural_events_tenantId_category_idx" ON "cultural_events"("tenantId", "category");
CREATE INDEX "cultural_events_tenantId_status_idx" ON "cultural_events"("tenantId", "status");
CREATE INDEX "cultural_events_tenantId_startDate_idx" ON "cultural_events"("tenantId", "startDate");
CREATE INDEX "cultural_events_tenantId_spaceId_idx" ON "cultural_events"("tenantId", "spaceId");
CREATE INDEX "cultural_events_tenantId_freeEvent_idx" ON "cultural_events"("tenantId", "freeEvent");
CREATE TABLE "new_cultural_projects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "responsible" TEXT NOT NULL,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "budget" REAL,
    "currentStatus" TEXT NOT NULL DEFAULT 'PLANNING',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "protocol" TEXT,
    "contact" JSONB,
    "funding" JSONB,
    "targetAudience" TEXT,
    "participants" INTEGER,
    "serviceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "cultural_projects_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_cultural_projects" ("budget", "createdAt", "currentStatus", "description", "endDate", "id", "name", "responsible", "startDate", "status", "tenantId", "type", "updatedAt") SELECT "budget", "createdAt", "currentStatus", "description", "endDate", "id", "name", "responsible", "startDate", "status", "tenantId", "type", "updatedAt" FROM "cultural_projects";
DROP TABLE "cultural_projects";
ALTER TABLE "new_cultural_projects" RENAME TO "cultural_projects";
CREATE TABLE "new_cultural_spaces" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "address" JSONB NOT NULL,
    "coordinates" JSONB,
    "neighborhood" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "area" REAL,
    "rooms" JSONB,
    "infrastructure" JSONB,
    "equipment" JSONB,
    "amenities" JSONB,
    "accessibility" BOOLEAN NOT NULL DEFAULT false,
    "manager" TEXT NOT NULL,
    "contact" JSONB NOT NULL,
    "operatingHours" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "available" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "hourlyRate" REAL,
    "dailyRate" REAL,
    "freeUse" BOOLEAN NOT NULL DEFAULT false,
    "photos" JSONB,
    "documents" JSONB,
    "observations" TEXT,
    "protocol" TEXT,
    "serviceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "cultural_spaces_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_cultural_spaces" ("accessibility", "address", "amenities", "area", "available", "capacity", "code", "contact", "coordinates", "createdAt", "dailyRate", "description", "documents", "equipment", "freeUse", "hourlyRate", "id", "infrastructure", "isActive", "manager", "name", "neighborhood", "observations", "operatingHours", "photos", "rooms", "status", "tenantId", "type", "updatedAt", "zipCode") SELECT "accessibility", "address", "amenities", "area", "available", "capacity", "code", "contact", "coordinates", "createdAt", "dailyRate", "description", "documents", "equipment", "freeUse", "hourlyRate", "id", "infrastructure", "isActive", "manager", "name", "neighborhood", "observations", "operatingHours", "photos", "rooms", "status", "tenantId", "type", "updatedAt", "zipCode" FROM "cultural_spaces";
DROP TABLE "cultural_spaces";
ALTER TABLE "new_cultural_spaces" RENAME TO "cultural_spaces";
CREATE INDEX "cultural_spaces_tenantId_type_idx" ON "cultural_spaces"("tenantId", "type");
CREATE INDEX "cultural_spaces_tenantId_status_idx" ON "cultural_spaces"("tenantId", "status");
CREATE INDEX "cultural_spaces_tenantId_available_idx" ON "cultural_spaces"("tenantId", "available");
CREATE INDEX "cultural_spaces_tenantId_neighborhood_idx" ON "cultural_spaces"("tenantId", "neighborhood");
CREATE UNIQUE INDEX "cultural_spaces_tenantId_code_key" ON "cultural_spaces"("tenantId", "code");
CREATE TABLE "new_environmental_complaints" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocol" TEXT NOT NULL,
    "reporterName" TEXT,
    "complainantName" TEXT,
    "reporterPhone" TEXT,
    "reporterEmail" TEXT,
    "complaintType" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "coordinates" JSONB,
    "evidence" JSONB,
    "occurrenceDate" DATETIME NOT NULL,
    "reportDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "inspector" TEXT,
    "assignedTo" TEXT,
    "inspectionDate" DATETIME,
    "findings" TEXT,
    "actions" TEXT,
    "actionsTaken" JSONB,
    "resolution" TEXT,
    "penalty" REAL,
    "followUp" BOOLEAN NOT NULL DEFAULT false,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "complainantPhone" TEXT,
    "complainantEmail" TEXT,
    "investigationDate" DATETIME,
    "investigatorId" TEXT,
    "investigationReport" JSONB,
    "resolvedBy" TEXT,
    "resolvedAt" DATETIME,
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "serviceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "photos" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "environmental_complaints_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_environmental_complaints" ("actions", "complaintType", "coordinates", "createdAt", "description", "evidence", "findings", "followUp", "id", "inspectionDate", "inspector", "isAnonymous", "location", "occurrenceDate", "penalty", "protocol", "reportDate", "reporterEmail", "reporterName", "reporterPhone", "resolution", "severity", "status", "tenantId", "updatedAt") SELECT "actions", "complaintType", "coordinates", "createdAt", "description", "evidence", "findings", "followUp", "id", "inspectionDate", "inspector", "isAnonymous", "location", "occurrenceDate", "penalty", "protocol", "reportDate", "reporterEmail", "reporterName", "reporterPhone", "resolution", "severity", "status", "tenantId", "updatedAt" FROM "environmental_complaints";
DROP TABLE "environmental_complaints";
ALTER TABLE "new_environmental_complaints" RENAME TO "environmental_complaints";
CREATE UNIQUE INDEX "environmental_complaints_protocol_key" ON "environmental_complaints"("protocol");
CREATE TABLE "new_environmental_licenses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "applicantName" TEXT NOT NULL,
    "applicantCpf" TEXT NOT NULL,
    "applicantPhone" TEXT,
    "applicantDocument" TEXT,
    "businessName" TEXT,
    "licenseType" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "coordinates" JSONB,
    "area" REAL,
    "applicationDate" DATETIME NOT NULL,
    "analysisDate" DATETIME,
    "issueDate" DATETIME,
    "validFrom" DATETIME,
    "expiryDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'UNDER_ANALYSIS',
    "conditions" JSONB,
    "technicalOpinion" TEXT,
    "analyst" TEXT,
    "fee" REAL,
    "documents" JSONB,
    "inspections" JSONB,
    "observations" TEXT,
    "applicantEmail" TEXT,
    "validUntil" DATETIME,
    "activityType" TEXT,
    "technicalReport" JSONB,
    "reviewedBy" TEXT,
    "reviewedAt" DATETIME,
    "approvedBy" TEXT,
    "approvedAt" DATETIME,
    "protocol" TEXT,
    "serviceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "environmental_licenses_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_environmental_licenses" ("activity", "analysisDate", "analyst", "applicantCpf", "applicantDocument", "applicantName", "applicationDate", "area", "businessName", "conditions", "coordinates", "createdAt", "description", "documents", "expiryDate", "fee", "id", "inspections", "issueDate", "licenseNumber", "licenseType", "location", "observations", "status", "technicalOpinion", "tenantId", "updatedAt") SELECT "activity", "analysisDate", "analyst", "applicantCpf", "applicantDocument", "applicantName", "applicationDate", "area", "businessName", "conditions", "coordinates", "createdAt", "description", "documents", "expiryDate", "fee", "id", "inspections", "issueDate", "licenseNumber", "licenseType", "location", "observations", "status", "technicalOpinion", "tenantId", "updatedAt" FROM "environmental_licenses";
DROP TABLE "environmental_licenses";
ALTER TABLE "new_environmental_licenses" RENAME TO "environmental_licenses";
CREATE UNIQUE INDEX "environmental_licenses_licenseNumber_key" ON "environmental_licenses"("licenseNumber");
CREATE TABLE "new_sports_attendances" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocol" TEXT NOT NULL,
    "citizenId" TEXT,
    "citizenName" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "serviceType" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "description" TEXT NOT NULL,
    "observations" TEXT,
    "responsible" TEXT,
    "referredTo" TEXT,
    "resolution" TEXT,
    "attachments" JSONB,
    "sportType" TEXT,
    "sport" TEXT,
    "eventDate" DATETIME,
    "location" TEXT,
    "expectedParticipants" INTEGER,
    "followUpNeeded" BOOLEAN NOT NULL DEFAULT false,
    "followUpDate" DATETIME,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "serviceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "sports_attendances_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_sports_attendances" ("attachments", "citizenId", "citizenName", "contact", "createdAt", "description", "eventDate", "expectedParticipants", "followUpDate", "followUpNeeded", "id", "location", "observations", "priority", "protocol", "referredTo", "resolution", "responsible", "serviceType", "sport", "sportType", "status", "tenantId", "type", "updatedAt") SELECT "attachments", "citizenId", "citizenName", "contact", "createdAt", "description", "eventDate", "expectedParticipants", "followUpDate", "followUpNeeded", "id", "location", "observations", "priority", "protocol", "referredTo", "resolution", "responsible", "serviceType", "sport", "sportType", "status", "tenantId", "type", "updatedAt" FROM "sports_attendances";
DROP TABLE "sports_attendances";
ALTER TABLE "new_sports_attendances" RENAME TO "sports_attendances";
CREATE UNIQUE INDEX "sports_attendances_protocol_key" ON "sports_attendances"("protocol");
CREATE TABLE "new_sports_teams" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sport" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "gender" TEXT,
    "ageGroup" TEXT NOT NULL,
    "coach" TEXT NOT NULL,
    "coachCpf" TEXT,
    "coachPhone" TEXT,
    "foundationDate" DATETIME,
    "trainingSchedule" JSONB,
    "maxPlayers" INTEGER,
    "currentPlayers" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "homeVenue" TEXT,
    "description" TEXT,
    "achievements" JSONB,
    "roster" JSONB,
    "modalityId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "protocol" TEXT,
    "serviceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "sportsModalityId" TEXT,
    CONSTRAINT "sports_teams_modalityId_fkey" FOREIGN KEY ("modalityId") REFERENCES "sport_modalities" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "sports_teams_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "sports_teams_sportsModalityId_fkey" FOREIGN KEY ("sportsModalityId") REFERENCES "sports_modalities" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_sports_teams" ("achievements", "ageGroup", "category", "coach", "coachCpf", "coachPhone", "createdAt", "currentPlayers", "description", "foundationDate", "gender", "homeVenue", "id", "isActive", "maxPlayers", "modalityId", "name", "roster", "sport", "status", "tenantId", "trainingSchedule", "updatedAt") SELECT "achievements", "ageGroup", "category", "coach", "coachCpf", "coachPhone", "createdAt", "currentPlayers", "description", "foundationDate", "gender", "homeVenue", "id", "isActive", "maxPlayers", "modalityId", "name", "roster", "sport", "status", "tenantId", "trainingSchedule", "updatedAt" FROM "sports_teams";
DROP TABLE "sports_teams";
ALTER TABLE "new_sports_teams" RENAME TO "sports_teams";
CREATE TABLE "new_technical_assistances" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocol" TEXT NOT NULL,
    "producerName" TEXT NOT NULL,
    "producerCpf" TEXT NOT NULL,
    "producerPhone" TEXT,
    "propertyName" TEXT NOT NULL,
    "propertySize" REAL NOT NULL,
    "location" TEXT NOT NULL,
    "coordinates" JSONB,
    "assistanceType" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "crop" TEXT,
    "livestock" TEXT,
    "technician" TEXT NOT NULL,
    "scheduledDate" DATETIME,
    "scheduledVisit" DATETIME,
    "requestDate" DATETIME,
    "visitDate" DATETIME NOT NULL,
    "visitReport" JSONB,
    "findings" TEXT,
    "recommendations" JSONB NOT NULL,
    "followUpPlan" JSONB,
    "materials" JSONB,
    "costs" REAL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "satisfaction" INTEGER,
    "photos" JSONB,
    "nextVisitDate" DATETIME,
    "observations" TEXT,
    "propertyLocation" TEXT,
    "technicianId" TEXT,
    "followUpRequired" BOOLEAN NOT NULL DEFAULT false,
    "propertyArea" REAL,
    "cropTypes" JSONB,
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "serviceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "completedBy" TEXT,
    "completedAt" DATETIME,
    "followUpDate" DATETIME,
    "followUpNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "technical_assistances_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_technical_assistances" ("assistanceType", "coordinates", "costs", "createdAt", "crop", "description", "findings", "followUpPlan", "id", "livestock", "location", "materials", "nextVisitDate", "observations", "photos", "producerCpf", "producerName", "propertyName", "propertySize", "protocol", "recommendations", "satisfaction", "status", "subject", "technician", "tenantId", "updatedAt", "visitDate") SELECT "assistanceType", "coordinates", "costs", "createdAt", "crop", "description", "findings", "followUpPlan", "id", "livestock", "location", "materials", "nextVisitDate", "observations", "photos", "producerCpf", "producerName", "propertyName", "propertySize", "protocol", "recommendations", "satisfaction", "status", "subject", "technician", "tenantId", "updatedAt", "visitDate" FROM "technical_assistances";
DROP TABLE "technical_assistances";
ALTER TABLE "new_technical_assistances" RENAME TO "technical_assistances";
CREATE UNIQUE INDEX "technical_assistances_protocol_key" ON "technical_assistances"("protocol");
CREATE TABLE "new_tourism_attendances" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocol" TEXT NOT NULL,
    "citizenId" TEXT,
    "visitorName" TEXT NOT NULL,
    "visitorEmail" TEXT,
    "visitorPhone" TEXT,
    "origin" TEXT,
    "serviceType" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT,
    "urgency" TEXT NOT NULL DEFAULT 'NORMAL',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "assignedAgent" TEXT,
    "resolution" TEXT,
    "satisfaction" INTEGER,
    "followUpDate" DATETIME,
    "touristProfile" JSONB,
    "serviceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "tourism_attendances_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "citizens" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tourism_attendances_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_tourism_attendances" ("assignedAgent", "category", "citizenId", "createdAt", "description", "followUpDate", "id", "origin", "protocol", "resolution", "satisfaction", "serviceType", "status", "subject", "tenantId", "updatedAt", "urgency", "visitorEmail", "visitorName", "visitorPhone") SELECT "assignedAgent", "category", "citizenId", "createdAt", "description", "followUpDate", "id", "origin", "protocol", "resolution", "satisfaction", "serviceType", "status", "subject", "tenantId", "updatedAt", "urgency", "visitorEmail", "visitorName", "visitorPhone" FROM "tourism_attendances";
DROP TABLE "tourism_attendances";
ALTER TABLE "new_tourism_attendances" RENAME TO "tourism_attendances";
CREATE UNIQUE INDEX "tourism_attendances_protocol_key" ON "tourism_attendances"("protocol");
CREATE TABLE "new_tourist_attractions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "neighborhood" TEXT,
    "coordinates" JSONB,
    "openingHours" TEXT,
    "ticketPrice" REAL,
    "accessibility" JSONB,
    "amenities" JSONB,
    "images" JSONB,
    "rating" REAL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "freeEntry" BOOLEAN NOT NULL DEFAULT false,
    "protocol" TEXT,
    "city" TEXT,
    "serviceId" TEXT,
    "state" TEXT,
    "facilities" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "tourist_attractions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_tourist_attractions" ("accessibility", "address", "amenities", "category", "coordinates", "createdAt", "description", "featured", "id", "images", "isActive", "name", "openingHours", "rating", "tenantId", "ticketPrice", "type", "updatedAt") SELECT "accessibility", "address", "amenities", "category", "coordinates", "createdAt", "description", "featured", "id", "images", "isActive", "name", "openingHours", "rating", "tenantId", "ticketPrice", "type", "updatedAt" FROM "tourist_attractions";
DROP TABLE "tourist_attractions";
ALTER TABLE "new_tourist_attractions" RENAME TO "tourist_attractions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "service_templates_code_key" ON "service_templates"("code");

-- CreateIndex
CREATE UNIQUE INDEX "service_surveys_serviceId_key" ON "service_surveys"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "service_workflows_serviceId_key" ON "service_workflows"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "service_notifications_serviceId_key" ON "service_notifications"("serviceId");

-- CreateIndex
CREATE INDEX "sports_modalities_tenantId_idx" ON "sports_modalities"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "custom_data_tables_tenantId_tableName_key" ON "custom_data_tables"("tenantId", "tableName");

-- CreateIndex
CREATE INDEX "custom_data_records_tableId_idx" ON "custom_data_records"("tableId");

-- CreateIndex
CREATE INDEX "custom_data_records_protocol_idx" ON "custom_data_records"("protocol");

-- CreateIndex
CREATE INDEX "custom_data_records_serviceId_idx" ON "custom_data_records"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "appointments_protocolId_key" ON "appointments"("protocolId");

-- CreateIndex
CREATE INDEX "appointments_schedulingId_idx" ON "appointments"("schedulingId");

-- CreateIndex
CREATE INDEX "appointments_scheduledDate_idx" ON "appointments"("scheduledDate");

-- CreateIndex
CREATE INDEX "appointments_status_idx" ON "appointments"("status");

-- CreateIndex
CREATE UNIQUE INDEX "protocol_locations_protocolId_key" ON "protocol_locations"("protocolId");

-- CreateIndex
CREATE INDEX "protocol_locations_protocolId_idx" ON "protocol_locations"("protocolId");

-- CreateIndex
CREATE UNIQUE INDEX "service_locations_serviceId_key" ON "service_locations"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "service_forms_serviceId_key" ON "service_forms"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "service_form_submissions_protocolId_key" ON "service_form_submissions"("protocolId");

-- CreateIndex
CREATE INDEX "service_form_submissions_formId_idx" ON "service_form_submissions"("formId");

-- CreateIndex
CREATE UNIQUE INDEX "service_scheduling_serviceId_key" ON "service_scheduling"("serviceId");

-- CreateIndex
CREATE INDEX "service_custom_fields_serviceId_idx" ON "service_custom_fields"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "service_custom_fields_serviceId_key_key" ON "service_custom_fields"("serviceId", "key");

-- CreateIndex
CREATE INDEX "protocol_custom_field_values_protocolId_idx" ON "protocol_custom_field_values"("protocolId");

-- CreateIndex
CREATE INDEX "protocol_custom_field_values_fieldId_idx" ON "protocol_custom_field_values"("fieldId");

-- CreateIndex
CREATE UNIQUE INDEX "protocol_custom_field_values_protocolId_fieldId_key" ON "protocol_custom_field_values"("protocolId", "fieldId");

-- CreateIndex
CREATE INDEX "service_documents_serviceId_idx" ON "service_documents"("serviceId");

-- CreateIndex
CREATE INDEX "document_uploads_documentConfigId_idx" ON "document_uploads"("documentConfigId");

-- CreateIndex
CREATE INDEX "document_uploads_protocolId_idx" ON "document_uploads"("protocolId");

-- CreateIndex
CREATE INDEX "anonymous_tips_tipNumber_idx" ON "anonymous_tips"("tipNumber");

-- CreateIndex
CREATE INDEX "anonymous_tips_feedbackCode_idx" ON "anonymous_tips"("feedbackCode");

-- CreateIndex
CREATE INDEX "farmer_market_registrations_protocol_idx" ON "farmer_market_registrations"("protocol");

-- CreateIndex
CREATE INDEX "lot_subdivisions_protocol_idx" ON "lot_subdivisions"("protocol");

-- CreateIndex
CREATE INDEX "organic_certifications_protocol_idx" ON "organic_certifications"("protocol");

-- CreateIndex
CREATE INDEX "police_reports_reportNumber_idx" ON "police_reports"("reportNumber");

-- CreateIndex
CREATE INDEX "property_numbering_protocol_idx" ON "property_numbering"("protocol");

-- CreateIndex
CREATE INDEX "seed_distributions_protocol_idx" ON "seed_distributions"("protocol");

-- CreateIndex
CREATE INDEX "soil_analyses_protocol_idx" ON "soil_analyses"("protocol");

-- CreateIndex
CREATE INDEX "tree_authorizations_protocol_idx" ON "tree_authorizations"("protocol");

-- CreateIndex
CREATE INDEX "urban_certificates_protocol_idx" ON "urban_certificates"("protocol");
