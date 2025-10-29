/*
  Warnings:

  - You are about to drop the `_ServiceToSpecializedPage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `protocol` on the `environmental_licenses` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "_ServiceToSpecializedPage_B_index";

-- DropIndex
DROP INDEX "_ServiceToSpecializedPage_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ServiceToSpecializedPage";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "cultural_workshop_enrollments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "workshopId" TEXT,
    "citizenName" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "birthDate" DATETIME,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT,
    "hasExperience" BOOLEAN NOT NULL DEFAULT false,
    "experience" TEXT,
    "motivation" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "enrolledAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "cultural_workshop_enrollments_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "cultural_workshop_enrollments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cultural_project_submissions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "projectName" TEXT NOT NULL,
    "projectType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "responsible" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "organization" TEXT,
    "budget" REAL NOT NULL,
    "fundingSource" TEXT,
    "targetAudience" TEXT NOT NULL,
    "expectedImpact" TEXT NOT NULL,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "attachments" JSONB,
    "status" TEXT NOT NULL DEFAULT 'UNDER_REVIEW',
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" DATETIME,
    "reviewComments" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "cultural_project_submissions_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "cultural_project_submissions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cultural_space_reservations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "spaceId" TEXT,
    "spaceName" TEXT NOT NULL,
    "requesterName" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "eventName" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "expectedPeople" INTEGER NOT NULL,
    "needsEquipment" BOOLEAN NOT NULL DEFAULT false,
    "equipment" JSONB,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "requestedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" DATETIME,
    "observations" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "cultural_space_reservations_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "cultural_space_reservations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "education_attendances" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "citizenName" TEXT NOT NULL,
    "citizenCpf" TEXT NOT NULL,
    "citizenPhone" TEXT,
    "citizenEmail" TEXT,
    "serviceType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "scheduledDate" DATETIME,
    "completedDate" DATETIME,
    "observations" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "education_attendances_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "education_attendances_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "school_documents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "studentId" TEXT,
    "studentName" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "issueDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "observations" TEXT,
    "fileUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "school_documents_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "school_documents_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "student_transfers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "studentId" TEXT,
    "studentName" TEXT NOT NULL,
    "currentSchool" TEXT NOT NULL,
    "targetSchool" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "transferReason" TEXT NOT NULL,
    "requestDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transferDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "documents" JSONB,
    "observations" TEXT,
    "approvedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "student_transfers_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "student_transfers_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "attendance_records" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "studentId" TEXT,
    "studentName" TEXT NOT NULL,
    "schoolId" TEXT,
    "classId" TEXT,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "totalDays" INTEGER NOT NULL,
    "presentDays" INTEGER NOT NULL,
    "absentDays" INTEGER NOT NULL,
    "percentage" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "observations" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "attendance_records_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "attendance_records_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "grade_records" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "studentId" TEXT,
    "studentName" TEXT NOT NULL,
    "schoolId" TEXT,
    "classId" TEXT,
    "subject" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "grade" REAL NOT NULL,
    "maxGrade" REAL NOT NULL DEFAULT 10,
    "status" TEXT NOT NULL DEFAULT 'APPROVED',
    "observations" TEXT,
    "teacherName" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "grade_records_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "grade_records_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "school_management" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "schoolId" TEXT,
    "schoolName" TEXT NOT NULL,
    "managementType" TEXT NOT NULL,
    "requestDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "assignedTo" TEXT,
    "completedDate" DATETIME,
    "observations" TEXT,
    "documents" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "school_management_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "school_management_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "health_programs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "programType" TEXT NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "coordinatorName" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "goals" JSONB,
    "participants" INTEGER NOT NULL DEFAULT 0,
    "budget" REAL,
    "observations" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "health_programs_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "health_programs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "health_exams" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "patientName" TEXT NOT NULL,
    "patientCpf" TEXT NOT NULL,
    "patientPhone" TEXT,
    "examType" TEXT NOT NULL,
    "examName" TEXT NOT NULL,
    "requestDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scheduledDate" DATETIME,
    "resultDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'REQUESTED',
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "requestedBy" TEXT NOT NULL,
    "healthUnit" TEXT,
    "observations" TEXT,
    "result" TEXT,
    "attachments" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "health_exams_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "health_exams_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "health_transport_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "patientName" TEXT NOT NULL,
    "patientCpf" TEXT NOT NULL,
    "patientPhone" TEXT,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "transportType" TEXT NOT NULL,
    "urgencyLevel" TEXT NOT NULL DEFAULT 'NORMAL',
    "requestDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scheduledDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'REQUESTED',
    "reason" TEXT NOT NULL,
    "observations" TEXT,
    "responsibleDriver" TEXT,
    "vehicleId" TEXT,
    "departureTime" DATETIME,
    "arrivalTime" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "health_transport_requests_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "health_transport_requests_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "patients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "fullName" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "rg" TEXT,
    "birthDate" DATETIME NOT NULL,
    "gender" TEXT NOT NULL,
    "bloodType" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "susCardNumber" TEXT,
    "allergies" TEXT,
    "chronicDiseases" TEXT,
    "medications" TEXT,
    "emergencyContact" TEXT,
    "emergencyPhone" TEXT,
    "observations" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "registeredBy" TEXT NOT NULL,
    "registrationDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "patients_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "patients_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "community_health_agents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "fullName" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT,
    "assignedArea" TEXT NOT NULL,
    "registrationNum" TEXT,
    "hireDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "healthUnit" TEXT,
    "supervisor" TEXT,
    "familiesServed" INTEGER NOT NULL DEFAULT 0,
    "workSchedule" JSONB,
    "observations" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "community_health_agents_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "community_health_agents_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sports_school_enrollments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "sportsSchoolId" TEXT,
    "studentName" TEXT NOT NULL,
    "studentBirthDate" DATETIME NOT NULL,
    "studentCpf" TEXT,
    "studentRg" TEXT,
    "parentName" TEXT,
    "parentCpf" TEXT,
    "parentPhone" TEXT NOT NULL,
    "parentEmail" TEXT,
    "address" TEXT NOT NULL,
    "neighborhood" TEXT,
    "sport" TEXT NOT NULL,
    "level" TEXT,
    "enrollmentDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "medicalCertificate" JSONB,
    "emergencyContact" JSONB,
    "observations" TEXT,
    "uniforms" JSONB,
    "attendance" JSONB,
    "serviceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "sports_school_enrollments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "sports_school_enrollments_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sports_infrastructure_reservations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "infrastructureId" TEXT,
    "infrastructureName" TEXT NOT NULL,
    "requesterName" TEXT NOT NULL,
    "requesterCpf" TEXT,
    "requesterPhone" TEXT NOT NULL,
    "requesterEmail" TEXT,
    "organization" TEXT,
    "sport" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "expectedPeople" INTEGER,
    "equipment" JSONB,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "approvedBy" TEXT,
    "approvedAt" DATETIME,
    "rejectionReason" TEXT,
    "observations" TEXT,
    "serviceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "sports_infrastructure_reservations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "sports_infrastructure_reservations_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "competition_enrollments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "competitionId" TEXT,
    "competitionName" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "sport" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "ageGroup" TEXT NOT NULL,
    "coachName" TEXT NOT NULL,
    "coachCpf" TEXT,
    "coachPhone" TEXT NOT NULL,
    "coachEmail" TEXT,
    "playersCount" INTEGER NOT NULL,
    "playersList" JSONB NOT NULL,
    "enrollmentDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentProof" JSONB,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "approvedBy" TEXT,
    "approvedAt" DATETIME,
    "rejectionReason" TEXT,
    "observations" TEXT,
    "serviceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "competition_enrollments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "competition_enrollments_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tournament_enrollments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "tournamentId" TEXT,
    "tournamentName" TEXT NOT NULL,
    "participantType" TEXT NOT NULL,
    "teamName" TEXT,
    "athleteName" TEXT,
    "athleteCpf" TEXT,
    "sport" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "ageGroup" TEXT NOT NULL,
    "coachName" TEXT,
    "coachPhone" TEXT,
    "coachEmail" TEXT,
    "playersCount" INTEGER,
    "playersList" JSONB,
    "enrollmentDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentProof" JSONB,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "approvedBy" TEXT,
    "approvedAt" DATETIME,
    "rejectionReason" TEXT,
    "observations" TEXT,
    "serviceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "tournament_enrollments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tournament_enrollments_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tree_cutting_authorizations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "authorizationNumber" TEXT NOT NULL,
    "applicantName" TEXT NOT NULL,
    "applicantCpf" TEXT NOT NULL,
    "applicantPhone" TEXT,
    "applicantEmail" TEXT,
    "propertyAddress" TEXT NOT NULL,
    "coordinates" JSONB,
    "requestType" TEXT NOT NULL,
    "treeSpecies" TEXT NOT NULL,
    "treeQuantity" INTEGER NOT NULL DEFAULT 1,
    "treeHeight" REAL,
    "trunkDiameter" REAL,
    "justification" TEXT NOT NULL,
    "technicalReport" TEXT,
    "photos" JSONB,
    "requestDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inspectionDate" DATETIME,
    "inspector" TEXT,
    "inspectionReport" TEXT,
    "decision" TEXT,
    "conditions" JSONB,
    "authorizationDate" DATETIME,
    "validUntil" DATETIME,
    "executionDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'UNDER_ANALYSIS',
    "fee" REAL,
    "observations" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "tree_cutting_authorizations_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tree_cutting_authorizations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "environmental_inspections" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "inspectionNumber" TEXT NOT NULL,
    "inspectionType" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "coordinates" JSONB,
    "scheduledDate" DATETIME NOT NULL,
    "inspectionDate" DATETIME,
    "inspector" TEXT NOT NULL,
    "inspectorTeam" JSONB,
    "findings" TEXT,
    "photos" JSONB,
    "evidence" JSONB,
    "nonCompliances" JSONB,
    "recommendations" TEXT,
    "reportedViolations" JSONB,
    "penalties" REAL,
    "correctiveActions" JSONB,
    "followUpRequired" BOOLEAN NOT NULL DEFAULT false,
    "followUpDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "report" TEXT,
    "reportDate" DATETIME,
    "relatedLicenseId" TEXT,
    "relatedComplaintId" TEXT,
    "observations" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "environmental_inspections_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "environmental_inspections_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "rent_assistances" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "protocol" TEXT NOT NULL,
    "applicantName" TEXT NOT NULL,
    "applicantCpf" TEXT NOT NULL,
    "contact" JSONB NOT NULL,
    "currentAddress" TEXT NOT NULL,
    "monthlyRent" REAL NOT NULL,
    "landlordName" TEXT NOT NULL,
    "landlordContact" JSONB NOT NULL,
    "leaseContract" JSONB,
    "familyIncome" REAL NOT NULL,
    "familySize" INTEGER NOT NULL,
    "hasEmployment" BOOLEAN NOT NULL DEFAULT false,
    "employmentDetails" JSONB,
    "vulnerabilityReason" TEXT NOT NULL,
    "requestedAmount" REAL NOT NULL,
    "requestedPeriod" INTEGER NOT NULL,
    "bankAccount" JSONB,
    "documents" JSONB NOT NULL,
    "socialReport" JSONB,
    "applicationDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "analysisDate" DATETIME,
    "approvalDate" DATETIME,
    "firstPaymentDate" DATETIME,
    "lastPaymentDate" DATETIME,
    "totalPaid" REAL NOT NULL DEFAULT 0,
    "paymentsCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'UNDER_ANALYSIS',
    "analyst" TEXT,
    "observations" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "rent_assistances_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "rent_assistances_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "social_group_enrollments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "citizenId" TEXT,
    "participantName" TEXT NOT NULL,
    "participantCpf" TEXT,
    "groupName" TEXT NOT NULL,
    "groupType" TEXT NOT NULL,
    "enrollmentDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "frequency" TEXT,
    "observations" TEXT,
    "instructor" TEXT,
    "schedule" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "social_group_enrollments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "social_group_enrollments_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "citizens" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "social_group_enrollments_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "social_program_enrollments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "citizenId" TEXT,
    "beneficiaryName" TEXT NOT NULL,
    "beneficiaryCpf" TEXT,
    "programName" TEXT NOT NULL,
    "programType" TEXT NOT NULL,
    "enrollmentDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "monthlyIncome" REAL,
    "familySize" INTEGER,
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "approvedDate" DATETIME,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "benefits" JSONB,
    "observations" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "social_program_enrollments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "social_program_enrollments_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "citizens" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "social_program_enrollments_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "social_appointments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "citizenId" TEXT,
    "citizenName" TEXT NOT NULL,
    "citizenCpf" TEXT,
    "appointmentType" TEXT NOT NULL,
    "appointmentDate" DATETIME NOT NULL,
    "socialWorker" TEXT,
    "socialWorkerId" TEXT,
    "purpose" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "notes" TEXT,
    "result" TEXT,
    "followUpNeeded" BOOLEAN NOT NULL DEFAULT false,
    "followUpDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "social_appointments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "social_appointments_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "citizens" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "social_appointments_socialWorkerId_fkey" FOREIGN KEY ("socialWorkerId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "social_appointments_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "social_equipments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "equipmentName" TEXT NOT NULL,
    "equipmentType" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "coordinates" JSONB,
    "capacity" INTEGER,
    "currentOccupancy" INTEGER NOT NULL DEFAULT 0,
    "coordinator" TEXT,
    "coordinatorId" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "services" JSONB,
    "schedule" JSONB,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "observations" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "social_equipments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "social_equipments_coordinatorId_fkey" FOREIGN KEY ("coordinatorId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "social_equipments_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "road_repair_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "protocol" TEXT NOT NULL,
    "citizenName" TEXT NOT NULL,
    "citizenCpf" TEXT,
    "contact" JSONB NOT NULL,
    "roadName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "coordinates" JSONB,
    "problemType" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'MEDIUM',
    "description" TEXT NOT NULL,
    "photos" JSONB,
    "affectedArea" REAL,
    "trafficImpact" TEXT,
    "urgency" TEXT NOT NULL DEFAULT 'NORMAL',
    "estimatedCost" REAL,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "assignedTeam" TEXT,
    "scheduledDate" DATETIME,
    "completionDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "resolution" TEXT,
    "materialsUsed" JSONB,
    "workDuration" INTEGER,
    "satisfaction" INTEGER,
    "observations" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "road_repair_requests_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "road_repair_requests_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "technical_inspections" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "protocol" TEXT NOT NULL,
    "requestorName" TEXT NOT NULL,
    "requestorCpf" TEXT,
    "contact" JSONB NOT NULL,
    "inspectionType" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "coordinates" JSONB,
    "propertyType" TEXT,
    "constructionStage" TEXT,
    "documents" JSONB,
    "photos" JSONB,
    "urgency" TEXT NOT NULL DEFAULT 'NORMAL',
    "scheduledDate" DATETIME,
    "inspectionDate" DATETIME,
    "inspector" TEXT,
    "findings" JSONB,
    "technicalOpinion" TEXT,
    "approved" BOOLEAN,
    "conditions" JSONB,
    "validUntil" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "resolution" TEXT,
    "followUpDate" DATETIME,
    "observations" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "technical_inspections_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "technical_inspections_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "municipal_guards" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "name" TEXT NOT NULL,
    "badge" TEXT NOT NULL,
    "cpf" TEXT,
    "rg" TEXT,
    "birthDate" DATETIME,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT,
    "position" TEXT NOT NULL,
    "admissionDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "specialties" JSONB,
    "certifications" JSONB,
    "assignedVehicle" TEXT,
    "assignedRadio" TEXT,
    "assignedBadge" TEXT,
    "equipment" JSONB,
    "shift" TEXT,
    "workSchedule" JSONB,
    "availability" TEXT NOT NULL DEFAULT 'available',
    "patrolsCount" INTEGER NOT NULL DEFAULT 0,
    "incidentsCount" INTEGER NOT NULL DEFAULT 0,
    "commendations" JSONB,
    "disciplinary" JSONB,
    "notes" TEXT,
    "emergencyContact" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "municipal_guards_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "municipal_guards_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "surveillance_systems" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "systemName" TEXT NOT NULL,
    "systemCode" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "address" TEXT,
    "coordinates" JSONB,
    "area" TEXT,
    "zone" TEXT,
    "manufacturer" TEXT,
    "model" TEXT,
    "installationDate" DATETIME,
    "warrantyExpires" DATETIME,
    "cameraType" TEXT,
    "resolution" TEXT,
    "hasNightVision" BOOLEAN NOT NULL DEFAULT false,
    "hasAudio" BOOLEAN NOT NULL DEFAULT false,
    "recordingDays" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'operational',
    "lastMaintenance" DATETIME,
    "nextMaintenance" DATETIME,
    "coverageArea" TEXT,
    "viewAngle" TEXT,
    "range" TEXT,
    "ipAddress" TEXT,
    "connectionType" TEXT,
    "bandwidth" TEXT,
    "isMonitored" BOOLEAN NOT NULL DEFAULT true,
    "monitoringCenter" TEXT,
    "alerts" JSONB,
    "incidentsDetected" INTEGER NOT NULL DEFAULT 0,
    "maintenanceHistory" JSONB,
    "downtimeHours" REAL DEFAULT 0,
    "integratedWith" JSONB,
    "apiAccess" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "technicalSpecs" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "surveillance_systems_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "surveillance_systems_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_anonymous_tips" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
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
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "anonymous_tips_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "anonymous_tips_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_anonymous_tips" ("actionTaken", "anonymityLevel", "assignedAt", "assignedTo", "category", "closedAt", "coordinates", "createdAt", "dangerLevel", "description", "evidenceNotes", "evidenceType", "feedbackCode", "frequency", "hasEvidence", "id", "investigationLog", "ipHash", "isAnonymous", "isUrgent", "location", "metadata", "outcome", "priority", "protocol", "publicUpdates", "serviceId", "source", "status", "suspectInfo", "tenantId", "timeframe", "tipNumber", "type", "updatedAt", "vehicleInfo") SELECT "actionTaken", "anonymityLevel", "assignedAt", "assignedTo", "category", "closedAt", "coordinates", "createdAt", "dangerLevel", "description", "evidenceNotes", "evidenceType", "feedbackCode", "frequency", "hasEvidence", "id", "investigationLog", "ipHash", "isAnonymous", "isUrgent", "location", "metadata", "outcome", "priority", "protocol", "publicUpdates", "serviceId", "source", "status", "suspectInfo", "tenantId", "timeframe", "tipNumber", "type", "updatedAt", "vehicleInfo" FROM "anonymous_tips";
DROP TABLE "anonymous_tips";
ALTER TABLE "new_anonymous_tips" RENAME TO "anonymous_tips";
CREATE UNIQUE INDEX "anonymous_tips_tipNumber_key" ON "anonymous_tips"("tipNumber");
CREATE UNIQUE INDEX "anonymous_tips_feedbackCode_key" ON "anonymous_tips"("feedbackCode");
CREATE INDEX "anonymous_tips_tenantId_idx" ON "anonymous_tips"("tenantId");
CREATE INDEX "anonymous_tips_status_idx" ON "anonymous_tips"("status");
CREATE INDEX "anonymous_tips_type_idx" ON "anonymous_tips"("type");
CREATE INDEX "anonymous_tips_tipNumber_idx" ON "anonymous_tips"("tipNumber");
CREATE INDEX "anonymous_tips_feedbackCode_idx" ON "anonymous_tips"("feedbackCode");
CREATE TABLE "new_artistic_groups" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "foundationDate" DATETIME,
    "responsible" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "members" JSONB,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "artistic_groups_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "artistic_groups_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_artistic_groups" ("category", "contact", "createdAt", "foundationDate", "id", "members", "name", "responsible", "status", "tenantId", "updatedAt") SELECT "category", "contact", "createdAt", "foundationDate", "id", "members", "name", "responsible", "status", "tenantId", "updatedAt" FROM "artistic_groups";
DROP TABLE "artistic_groups";
ALTER TABLE "new_artistic_groups" RENAME TO "artistic_groups";
CREATE TABLE "new_athletes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
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
    CONSTRAINT "athletes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "athletes_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_athletes" ("address", "birthDate", "category", "cpf", "createdAt", "email", "emergencyContact", "federationExpiry", "federationNumber", "id", "isActive", "medicalCertificate", "medicalInfo", "modalityId", "name", "phone", "position", "protocol", "rg", "serviceId", "source", "sport", "team", "teamId", "tenantId", "updatedAt") SELECT "address", "birthDate", "category", "cpf", "createdAt", "email", "emergencyContact", "federationExpiry", "federationNumber", "id", "isActive", "medicalCertificate", "medicalInfo", "modalityId", "name", "phone", "position", "protocol", "rg", "serviceId", "source", "sport", "team", "teamId", "tenantId", "updatedAt" FROM "athletes";
DROP TABLE "athletes";
ALTER TABLE "new_athletes" RENAME TO "athletes";
CREATE UNIQUE INDEX "athletes_tenantId_cpf_key" ON "athletes"("tenantId", "cpf");
CREATE TABLE "new_benefit_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "familyId" TEXT NOT NULL,
    "benefitType" TEXT NOT NULL,
    "requestDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "urgency" TEXT NOT NULL DEFAULT 'NORMAL',
    "reason" TEXT NOT NULL,
    "documentsProvided" JSONB,
    "approvedBy" TEXT,
    "approvedDate" DATETIME,
    "deliveredDate" DATETIME,
    "observations" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "benefit_requests_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "vulnerable_families" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "benefit_requests_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "benefit_requests_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_benefit_requests" ("approvedBy", "approvedDate", "benefitType", "createdAt", "deliveredDate", "documentsProvided", "familyId", "id", "observations", "reason", "requestDate", "status", "tenantId", "updatedAt", "urgency") SELECT "approvedBy", "approvedDate", "benefitType", "createdAt", "deliveredDate", "documentsProvided", "familyId", "id", "observations", "reason", "requestDate", "status", "tenantId", "updatedAt", "urgency" FROM "benefit_requests";
DROP TABLE "benefit_requests";
ALTER TABLE "new_benefit_requests" RENAME TO "benefit_requests";
CREATE TABLE "new_camera_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
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
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "camera_requests_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "camera_requests_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_camera_requests" ("address", "area", "cameraIds", "cameraType", "coordinates", "createdAt", "createdBy", "estimatedCost", "feasibilityStatus", "footageDelivered", "footageDeliveryDate", "footageNotes", "id", "incidentDate", "incidentDescription", "incidentTime", "installationTeam", "installedDate", "justification", "location", "metadata", "priority", "protocol", "purpose", "quantity", "requesterDocument", "requesterEmail", "requesterName", "requesterPhone", "requesterType", "scheduledDate", "serviceId", "source", "status", "technicalNotes", "tenantId", "timeRange", "type", "updatedAt") SELECT "address", "area", "cameraIds", "cameraType", "coordinates", "createdAt", "createdBy", "estimatedCost", "feasibilityStatus", "footageDelivered", "footageDeliveryDate", "footageNotes", "id", "incidentDate", "incidentDescription", "incidentTime", "installationTeam", "installedDate", "justification", "location", "metadata", "priority", "protocol", "purpose", "quantity", "requesterDocument", "requesterEmail", "requesterName", "requesterPhone", "requesterType", "scheduledDate", "serviceId", "source", "status", "technicalNotes", "tenantId", "timeRange", "type", "updatedAt" FROM "camera_requests";
DROP TABLE "camera_requests";
ALTER TABLE "new_camera_requests" RENAME TO "camera_requests";
CREATE INDEX "camera_requests_tenantId_idx" ON "camera_requests"("tenantId");
CREATE INDEX "camera_requests_status_idx" ON "camera_requests"("status");
CREATE INDEX "camera_requests_type_idx" ON "camera_requests"("type");
CREATE TABLE "new_competitions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
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
    CONSTRAINT "competitions_sportsModalityId_fkey" FOREIGN KEY ("sportsModalityId") REFERENCES "sports_modalities" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "competitions_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_competitions" ("ageGroup", "category", "competitionType", "contact", "createdAt", "endDate", "entryFee", "id", "location", "maxTeams", "modalityId", "name", "organizer", "prizes", "registeredTeams", "registrationFee", "results", "rules", "sport", "sportsModalityId", "startDate", "status", "tenantId", "type", "updatedAt", "venue") SELECT "ageGroup", "category", "competitionType", "contact", "createdAt", "endDate", "entryFee", "id", "location", "maxTeams", "modalityId", "name", "organizer", "prizes", "registeredTeams", "registrationFee", "results", "rules", "sport", "sportsModalityId", "startDate", "status", "tenantId", "type", "updatedAt", "venue" FROM "competitions";
DROP TABLE "competitions";
ALTER TABLE "new_competitions" RENAME TO "competitions";
CREATE TABLE "new_critical_points" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "address" TEXT,
    "coordinates" JSONB NOT NULL,
    "pointType" TEXT NOT NULL,
    "riskType" JSONB,
    "riskLevel" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "recommendations" TEXT NOT NULL,
    "recommendedActions" JSONB,
    "patrolFrequency" TEXT,
    "monitoringLevel" TEXT NOT NULL,
    "lastIncident" DATETIME,
    "lastIncidentDate" DATETIME,
    "incidentCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "observations" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "critical_points_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "critical_points_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_critical_points" ("address", "coordinates", "createdAt", "description", "id", "incidentCount", "isActive", "lastIncident", "lastIncidentDate", "location", "monitoringLevel", "name", "observations", "patrolFrequency", "pointType", "recommendations", "recommendedActions", "riskLevel", "riskType", "tenantId", "updatedAt") SELECT "address", "coordinates", "createdAt", "description", "id", "incidentCount", "isActive", "lastIncident", "lastIncidentDate", "location", "monitoringLevel", "name", "observations", "patrolFrequency", "pointType", "recommendations", "recommendedActions", "riskLevel", "riskType", "tenantId", "updatedAt" FROM "critical_points";
DROP TABLE "critical_points";
ALTER TABLE "new_critical_points" RENAME TO "critical_points";
CREATE TABLE "new_cultural_attendances" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
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
    CONSTRAINT "cultural_attendances_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "cultural_attendances_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_cultural_attendances" ("attachments", "category", "citizenId", "citizenName", "contact", "createdAt", "description", "email", "estimatedAudience", "eventDate", "followUpDate", "id", "observations", "phone", "priority", "protocol", "requestedBudget", "requestedLocation", "responsible", "serviceId", "source", "status", "subject", "tenantId", "type", "updatedAt") SELECT "attachments", "category", "citizenId", "citizenName", "contact", "createdAt", "description", "email", "estimatedAudience", "eventDate", "followUpDate", "id", "observations", "phone", "priority", "protocol", "requestedBudget", "requestedLocation", "responsible", "serviceId", "source", "status", "subject", "tenantId", "type", "updatedAt" FROM "cultural_attendances";
DROP TABLE "cultural_attendances";
ALTER TABLE "new_cultural_attendances" RENAME TO "cultural_attendances";
CREATE UNIQUE INDEX "cultural_attendances_protocol_key" ON "cultural_attendances"("protocol");
CREATE TABLE "new_cultural_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
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
    CONSTRAINT "cultural_events_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "cultural_events_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "cultural_projects" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "cultural_events_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "cultural_spaces" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "cultural_events_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_cultural_events" ("address", "ageRating", "approved", "approvedAt", "approvedBy", "attendance", "capacity", "category", "contact", "coordinates", "createdAt", "description", "duration", "endDate", "expenses", "freeEvent", "guests", "id", "media", "observations", "organizer", "performers", "photos", "producer", "projectId", "promotion", "protocol", "requirements", "revenue", "reviews", "schedule", "serviceId", "setup", "socialMedia", "source", "spaceId", "startDate", "status", "targetAudience", "technical", "tenantId", "ticketPrice", "title", "type", "updatedAt", "venue", "videos", "website") SELECT "address", "ageRating", "approved", "approvedAt", "approvedBy", "attendance", "capacity", "category", "contact", "coordinates", "createdAt", "description", "duration", "endDate", "expenses", "freeEvent", "guests", "id", "media", "observations", "organizer", "performers", "photos", "producer", "projectId", "promotion", "protocol", "requirements", "revenue", "reviews", "schedule", "serviceId", "setup", "socialMedia", "source", "spaceId", "startDate", "status", "targetAudience", "technical", "tenantId", "ticketPrice", "title", "type", "updatedAt", "venue", "videos", "website" FROM "cultural_events";
DROP TABLE "cultural_events";
ALTER TABLE "new_cultural_events" RENAME TO "cultural_events";
CREATE INDEX "cultural_events_tenantId_category_idx" ON "cultural_events"("tenantId", "category");
CREATE INDEX "cultural_events_tenantId_status_idx" ON "cultural_events"("tenantId", "status");
CREATE INDEX "cultural_events_tenantId_startDate_idx" ON "cultural_events"("tenantId", "startDate");
CREATE INDEX "cultural_events_tenantId_spaceId_idx" ON "cultural_events"("tenantId", "spaceId");
CREATE INDEX "cultural_events_tenantId_freeEvent_idx" ON "cultural_events"("tenantId", "freeEvent");
CREATE TABLE "new_cultural_manifestations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "currentSituation" TEXT NOT NULL,
    "knowledgeHolders" JSONB,
    "safeguardActions" JSONB,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "cultural_manifestations_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "cultural_manifestations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_cultural_manifestations" ("createdAt", "currentSituation", "description", "id", "knowledgeHolders", "name", "safeguardActions", "status", "tenantId", "type", "updatedAt") SELECT "createdAt", "currentSituation", "description", "id", "knowledgeHolders", "name", "safeguardActions", "status", "tenantId", "type", "updatedAt" FROM "cultural_manifestations";
DROP TABLE "cultural_manifestations";
ALTER TABLE "new_cultural_manifestations" RENAME TO "cultural_manifestations";
CREATE TABLE "new_cultural_projects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
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
    CONSTRAINT "cultural_projects_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "cultural_projects_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_cultural_projects" ("budget", "contact", "createdAt", "currentStatus", "description", "endDate", "funding", "id", "name", "participants", "protocol", "responsible", "serviceId", "source", "startDate", "status", "targetAudience", "tenantId", "type", "updatedAt") SELECT "budget", "contact", "createdAt", "currentStatus", "description", "endDate", "funding", "id", "name", "participants", "protocol", "responsible", "serviceId", "source", "startDate", "status", "targetAudience", "tenantId", "type", "updatedAt" FROM "cultural_projects";
DROP TABLE "cultural_projects";
ALTER TABLE "new_cultural_projects" RENAME TO "cultural_projects";
CREATE TABLE "new_disciplinary_records" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "studentId" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "incidentType" TEXT NOT NULL,
    "severity" TEXT,
    "description" TEXT NOT NULL,
    "incidentDate" DATETIME NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "time" TEXT,
    "location" TEXT,
    "witnesses" TEXT,
    "actions_taken" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reportedBy" TEXT,
    "measures" TEXT NOT NULL,
    "responsibleTeacher" TEXT NOT NULL,
    "parentNotified" BOOLEAN NOT NULL DEFAULT false,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "observations" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "disciplinary_records_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "disciplinary_records_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_disciplinary_records" ("actions_taken", "createdAt", "date", "description", "id", "incidentDate", "incidentType", "location", "measures", "observations", "parentNotified", "reportedBy", "resolved", "responsibleTeacher", "schoolId", "severity", "status", "studentId", "tenantId", "time", "updatedAt", "witnesses") SELECT "actions_taken", "createdAt", "date", "description", "id", "incidentDate", "incidentType", "location", "measures", "observations", "parentNotified", "reportedBy", "resolved", "responsibleTeacher", "schoolId", "severity", "status", "studentId", "tenantId", "time", "updatedAt", "witnesses" FROM "disciplinary_records";
DROP TABLE "disciplinary_records";
ALTER TABLE "new_disciplinary_records" RENAME TO "disciplinary_records";
CREATE TABLE "new_emergency_deliveries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "benefitRequestId" TEXT,
    "citizenId" TEXT,
    "deliveryType" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "deliveryDate" DATETIME NOT NULL,
    "recipientName" TEXT NOT NULL,
    "recipientSignature" TEXT,
    "deliveredBy" TEXT NOT NULL,
    "urgency" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "observations" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "emergency_deliveries_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "citizens" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "emergency_deliveries_benefitRequestId_fkey" FOREIGN KEY ("benefitRequestId") REFERENCES "benefit_requests" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "emergency_deliveries_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "emergency_deliveries_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_emergency_deliveries" ("benefitRequestId", "citizenId", "createdAt", "deliveredBy", "deliveryDate", "deliveryType", "id", "observations", "quantity", "recipientName", "recipientSignature", "status", "tenantId", "updatedAt", "urgency") SELECT "benefitRequestId", "citizenId", "createdAt", "deliveredBy", "deliveryDate", "deliveryType", "id", "observations", "quantity", "recipientName", "recipientSignature", "status", "tenantId", "updatedAt", "urgency" FROM "emergency_deliveries";
DROP TABLE "emergency_deliveries";
ALTER TABLE "new_emergency_deliveries" RENAME TO "emergency_deliveries";
CREATE TABLE "new_environmental_attendances" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "protocol" TEXT NOT NULL,
    "citizenId" TEXT,
    "citizenName" TEXT NOT NULL,
    "citizenCpf" TEXT,
    "contact" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT,
    "urgency" TEXT NOT NULL DEFAULT 'NORMAL',
    "location" TEXT,
    "evidence" JSONB,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "analyst" TEXT,
    "technicalOpinion" TEXT,
    "recommendation" TEXT,
    "followUpDate" DATETIME,
    "resolution" TEXT,
    "satisfaction" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "environmental_attendances_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "environmental_attendances_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "citizens" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "environmental_attendances_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_environmental_attendances" ("analyst", "category", "citizenCpf", "citizenId", "citizenName", "contact", "createdAt", "description", "evidence", "followUpDate", "id", "location", "protocol", "recommendation", "resolution", "satisfaction", "serviceType", "status", "subject", "technicalOpinion", "tenantId", "updatedAt", "urgency") SELECT "analyst", "category", "citizenCpf", "citizenId", "citizenName", "contact", "createdAt", "description", "evidence", "followUpDate", "id", "location", "protocol", "recommendation", "resolution", "satisfaction", "serviceType", "status", "subject", "technicalOpinion", "tenantId", "updatedAt", "urgency" FROM "environmental_attendances";
DROP TABLE "environmental_attendances";
ALTER TABLE "new_environmental_attendances" RENAME TO "environmental_attendances";
CREATE UNIQUE INDEX "environmental_attendances_protocol_key" ON "environmental_attendances"("protocol");
CREATE TABLE "new_environmental_complaints" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
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
    CONSTRAINT "environmental_complaints_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "environmental_complaints_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_environmental_complaints" ("actions", "actionsTaken", "assignedTo", "complainantEmail", "complainantName", "complainantPhone", "complaintType", "coordinates", "createdAt", "description", "evidence", "findings", "followUp", "id", "inspectionDate", "inspector", "investigationDate", "investigationReport", "investigatorId", "isAnonymous", "location", "occurrenceDate", "penalty", "photos", "priority", "protocol", "reportDate", "reporterEmail", "reporterName", "reporterPhone", "resolution", "resolvedAt", "resolvedBy", "serviceId", "severity", "source", "status", "tenantId", "updatedAt") SELECT "actions", "actionsTaken", "assignedTo", "complainantEmail", "complainantName", "complainantPhone", "complaintType", "coordinates", "createdAt", "description", "evidence", "findings", "followUp", "id", "inspectionDate", "inspector", "investigationDate", "investigationReport", "investigatorId", "isAnonymous", "location", "occurrenceDate", "penalty", "photos", "priority", "protocol", "reportDate", "reporterEmail", "reporterName", "reporterPhone", "resolution", "resolvedAt", "resolvedBy", "serviceId", "severity", "source", "status", "tenantId", "updatedAt" FROM "environmental_complaints";
DROP TABLE "environmental_complaints";
ALTER TABLE "new_environmental_complaints" RENAME TO "environmental_complaints";
CREATE UNIQUE INDEX "environmental_complaints_protocol_key" ON "environmental_complaints"("protocol");
CREATE TABLE "new_environmental_licenses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
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
    "protocolNumber" TEXT,
    "serviceId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "environmental_licenses_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "environmental_licenses_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_environmental_licenses" ("activity", "activityType", "analysisDate", "analyst", "applicantCpf", "applicantDocument", "applicantEmail", "applicantName", "applicantPhone", "applicationDate", "approvedAt", "approvedBy", "area", "businessName", "conditions", "coordinates", "createdAt", "description", "documents", "expiryDate", "fee", "id", "inspections", "issueDate", "licenseNumber", "licenseType", "location", "observations", "reviewedAt", "reviewedBy", "serviceId", "source", "status", "technicalOpinion", "technicalReport", "tenantId", "updatedAt", "validFrom", "validUntil") SELECT "activity", "activityType", "analysisDate", "analyst", "applicantCpf", "applicantDocument", "applicantEmail", "applicantName", "applicantPhone", "applicationDate", "approvedAt", "approvedBy", "area", "businessName", "conditions", "coordinates", "createdAt", "description", "documents", "expiryDate", "fee", "id", "inspections", "issueDate", "licenseNumber", "licenseType", "location", "observations", "reviewedAt", "reviewedBy", "serviceId", "source", "status", "technicalOpinion", "technicalReport", "tenantId", "updatedAt", "validFrom", "validUntil" FROM "environmental_licenses";
DROP TABLE "environmental_licenses";
ALTER TABLE "new_environmental_licenses" RENAME TO "environmental_licenses";
CREATE UNIQUE INDEX "environmental_licenses_licenseNumber_key" ON "environmental_licenses"("licenseNumber");
CREATE TABLE "new_environmental_programs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "name" TEXT NOT NULL,
    "programType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "objectives" JSONB NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "budget" REAL,
    "coordinator" TEXT NOT NULL,
    "activities" JSONB NOT NULL,
    "indicators" JSONB,
    "partnerships" JSONB,
    "beneficiaries" INTEGER,
    "results" JSONB,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "evaluation" JSONB,
    "reports" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "environmental_programs_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "environmental_programs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_environmental_programs" ("activities", "beneficiaries", "budget", "coordinator", "createdAt", "description", "endDate", "evaluation", "id", "indicators", "isActive", "name", "objectives", "partnerships", "programType", "reports", "results", "startDate", "status", "targetAudience", "tenantId", "updatedAt") SELECT "activities", "beneficiaries", "budget", "coordinator", "createdAt", "description", "endDate", "evaluation", "id", "indicators", "isActive", "name", "objectives", "partnerships", "programType", "reports", "results", "startDate", "status", "targetAudience", "tenantId", "updatedAt" FROM "environmental_programs";
DROP TABLE "environmental_programs";
ALTER TABLE "new_environmental_programs" RENAME TO "environmental_programs";
CREATE TABLE "new_health_appointments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "patientName" TEXT NOT NULL,
    "patientCpf" TEXT NOT NULL,
    "patientBirthDate" DATETIME,
    "patientPhone" TEXT,
    "appointmentDate" DATETIME NOT NULL,
    "appointmentTime" TEXT NOT NULL,
    "doctorId" TEXT,
    "speciality" TEXT NOT NULL DEFAULT 'GENERAL',
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "symptoms" TEXT,
    "observations" TEXT,
    "diagnosis" TEXT,
    "treatment" TEXT,
    "followUpDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "health_appointments_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "health_appointments_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "health_doctors" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "health_appointments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_health_appointments" ("appointmentDate", "appointmentTime", "createdAt", "diagnosis", "doctorId", "followUpDate", "id", "observations", "patientBirthDate", "patientCpf", "patientName", "patientPhone", "priority", "speciality", "status", "symptoms", "tenantId", "treatment", "updatedAt") SELECT "appointmentDate", "appointmentTime", "createdAt", "diagnosis", "doctorId", "followUpDate", "id", "observations", "patientBirthDate", "patientCpf", "patientName", "patientPhone", "priority", "speciality", "status", "symptoms", "tenantId", "treatment", "updatedAt" FROM "health_appointments";
DROP TABLE "health_appointments";
ALTER TABLE "new_health_appointments" RENAME TO "health_appointments";
CREATE TABLE "new_health_attendances" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "protocol" TEXT NOT NULL,
    "citizenName" TEXT NOT NULL,
    "citizenCPF" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "description" TEXT NOT NULL,
    "observations" TEXT,
    "responsible" TEXT,
    "attachments" JSONB,
    "urgency" TEXT NOT NULL DEFAULT 'NORMAL',
    "medicalUnit" TEXT,
    "appointmentDate" DATETIME,
    "symptoms" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "health_attendances_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "health_attendances_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_health_attendances" ("appointmentDate", "attachments", "citizenCPF", "citizenName", "contact", "createdAt", "description", "id", "medicalUnit", "observations", "priority", "protocol", "responsible", "status", "symptoms", "tenantId", "type", "updatedAt", "urgency") SELECT "appointmentDate", "attachments", "citizenCPF", "citizenName", "contact", "createdAt", "description", "id", "medicalUnit", "observations", "priority", "protocol", "responsible", "status", "symptoms", "tenantId", "type", "updatedAt", "urgency" FROM "health_attendances";
DROP TABLE "health_attendances";
ALTER TABLE "new_health_attendances" RENAME TO "health_attendances";
CREATE UNIQUE INDEX "health_attendances_protocol_key" ON "health_attendances"("protocol");
CREATE TABLE "new_health_campaigns" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "campaignType" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "goals" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "coordinatorName" TEXT NOT NULL,
    "budget" REAL,
    "results" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "health_campaigns_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "health_campaigns_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_health_campaigns" ("budget", "campaignType", "coordinatorName", "createdAt", "description", "endDate", "goals", "id", "isActive", "name", "results", "startDate", "status", "targetAudience", "tenantId", "updatedAt") SELECT "budget", "campaignType", "coordinatorName", "createdAt", "description", "endDate", "goals", "id", "isActive", "name", "results", "startDate", "status", "targetAudience", "tenantId", "updatedAt" FROM "health_campaigns";
DROP TABLE "health_campaigns";
ALTER TABLE "new_health_campaigns" RENAME TO "health_campaigns";
CREATE TABLE "new_health_transports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "patientName" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "transportType" TEXT NOT NULL,
    "urgencyLevel" TEXT NOT NULL,
    "scheduledDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "observations" TEXT,
    "responsibleDriver" TEXT,
    "vehicleId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "health_transports_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "health_transports_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_health_transports" ("createdAt", "destination", "id", "observations", "origin", "patientName", "responsibleDriver", "scheduledDate", "status", "tenantId", "transportType", "updatedAt", "urgencyLevel", "vehicleId") SELECT "createdAt", "destination", "id", "observations", "origin", "patientName", "responsibleDriver", "scheduledDate", "status", "tenantId", "transportType", "updatedAt", "urgencyLevel", "vehicleId" FROM "health_transports";
DROP TABLE "health_transports";
ALTER TABLE "new_health_transports" RENAME TO "health_transports";
CREATE TABLE "new_home_visits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "familyId" TEXT NOT NULL,
    "socialWorkerId" TEXT,
    "visitDate" DATETIME NOT NULL,
    "socialWorker" TEXT NOT NULL,
    "visitType" TEXT NOT NULL DEFAULT 'ROUTINE',
    "visitPurpose" TEXT NOT NULL,
    "purpose" TEXT,
    "findings" TEXT,
    "recommendations" TEXT,
    "nextVisitDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "home_visits_socialWorkerId_fkey" FOREIGN KEY ("socialWorkerId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "home_visits_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "vulnerable_families" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "home_visits_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "home_visits_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_home_visits" ("createdAt", "familyId", "findings", "id", "nextVisitDate", "purpose", "recommendations", "socialWorker", "socialWorkerId", "status", "tenantId", "updatedAt", "visitDate", "visitPurpose", "visitType") SELECT "createdAt", "familyId", "findings", "id", "nextVisitDate", "purpose", "recommendations", "socialWorker", "socialWorkerId", "status", "tenantId", "updatedAt", "visitDate", "visitPurpose", "visitType" FROM "home_visits";
DROP TABLE "home_visits";
ALTER TABLE "new_home_visits" RENAME TO "home_visits";
CREATE TABLE "new_housing_applications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "protocol" TEXT NOT NULL,
    "applicantName" TEXT NOT NULL,
    "applicantCpf" TEXT NOT NULL,
    "contact" JSONB NOT NULL,
    "address" TEXT NOT NULL,
    "familyIncome" REAL NOT NULL,
    "familySize" INTEGER NOT NULL,
    "housingType" TEXT NOT NULL,
    "programType" TEXT NOT NULL,
    "propertyValue" REAL,
    "hasProperty" BOOLEAN NOT NULL DEFAULT false,
    "isFirstHome" BOOLEAN NOT NULL DEFAULT true,
    "priorityScore" INTEGER NOT NULL DEFAULT 0,
    "documents" JSONB NOT NULL,
    "program" TEXT,
    "applicationDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submissionDate" DATETIME,
    "analysisDate" DATETIME,
    "approvalDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'UNDER_ANALYSIS',
    "analyst" TEXT,
    "observations" TEXT,
    "rejection_reason" TEXT,
    "approvedBenefit" JSONB,
    "disbursementDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "housing_applications_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "housing_applications_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_housing_applications" ("address", "analysisDate", "analyst", "applicantCpf", "applicantName", "applicationDate", "approvalDate", "approvedBenefit", "contact", "createdAt", "disbursementDate", "documents", "familyIncome", "familySize", "hasProperty", "housingType", "id", "isFirstHome", "observations", "priorityScore", "program", "programType", "propertyValue", "protocol", "rejection_reason", "status", "submissionDate", "tenantId", "updatedAt") SELECT "address", "analysisDate", "analyst", "applicantCpf", "applicantName", "applicationDate", "approvalDate", "approvedBenefit", "contact", "createdAt", "disbursementDate", "documents", "familyIncome", "familySize", "hasProperty", "housingType", "id", "isFirstHome", "observations", "priorityScore", "program", "programType", "propertyValue", "protocol", "rejection_reason", "status", "submissionDate", "tenantId", "updatedAt" FROM "housing_applications";
DROP TABLE "housing_applications";
ALTER TABLE "new_housing_applications" RENAME TO "housing_applications";
CREATE UNIQUE INDEX "housing_applications_protocol_key" ON "housing_applications"("protocol");
CREATE TABLE "new_housing_attendances" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "protocol" TEXT NOT NULL,
    "citizenId" TEXT,
    "citizenName" TEXT NOT NULL,
    "citizenCPF" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "description" TEXT NOT NULL,
    "observations" TEXT,
    "responsible" TEXT,
    "attachments" JSONB,
    "program" TEXT,
    "documents" JSONB,
    "propertyAddress" TEXT,
    "familyIncome" REAL,
    "familySize" INTEGER,
    "currentHousing" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "housing_attendances_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "citizens" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "housing_attendances_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "housing_attendances_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_housing_attendances" ("attachments", "citizenCPF", "citizenId", "citizenName", "contact", "createdAt", "currentHousing", "description", "documents", "familyIncome", "familySize", "id", "observations", "priority", "program", "propertyAddress", "protocol", "responsible", "status", "tenantId", "type", "updatedAt") SELECT "attachments", "citizenCPF", "citizenId", "citizenName", "contact", "createdAt", "currentHousing", "description", "documents", "familyIncome", "familySize", "id", "observations", "priority", "program", "propertyAddress", "protocol", "responsible", "status", "tenantId", "type", "updatedAt" FROM "housing_attendances";
DROP TABLE "housing_attendances";
ALTER TABLE "new_housing_attendances" RENAME TO "housing_attendances";
CREATE UNIQUE INDEX "housing_attendances_protocol_key" ON "housing_attendances"("protocol");
CREATE TABLE "new_housing_registrations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "programId" TEXT NOT NULL,
    "familyHeadName" TEXT NOT NULL,
    "familyHeadCPF" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "familyIncome" REAL NOT NULL,
    "familySize" INTEGER NOT NULL,
    "score" REAL,
    "status" TEXT NOT NULL DEFAULT 'REGISTERED',
    "registrationDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "selectedDate" DATETIME,
    "observations" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "housing_registrations_programId_fkey" FOREIGN KEY ("programId") REFERENCES "housing_programs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "housing_registrations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "housing_registrations_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_housing_registrations" ("address", "contact", "createdAt", "familyHeadCPF", "familyHeadName", "familyIncome", "familySize", "id", "observations", "programId", "registrationDate", "score", "selectedDate", "status", "tenantId", "updatedAt") SELECT "address", "contact", "createdAt", "familyHeadCPF", "familyHeadName", "familyIncome", "familySize", "id", "observations", "programId", "registrationDate", "score", "selectedDate", "status", "tenantId", "updatedAt" FROM "housing_registrations";
DROP TABLE "housing_registrations";
ALTER TABLE "new_housing_registrations" RENAME TO "housing_registrations";
CREATE TABLE "new_housing_units" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "unitCode" TEXT NOT NULL,
    "unitType" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "coordinates" JSONB,
    "neighborhood" TEXT NOT NULL,
    "area" REAL NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "constructionYear" INTEGER,
    "propertyValue" REAL,
    "monthlyRent" REAL,
    "isOccupied" BOOLEAN NOT NULL DEFAULT false,
    "occupantName" TEXT,
    "occupantCpf" TEXT,
    "occupancyDate" DATETIME,
    "contractType" TEXT,
    "contractEnd" DATETIME,
    "program" TEXT,
    "conditions" JSONB,
    "lastInspection" DATETIME,
    "needsMaintenance" BOOLEAN NOT NULL DEFAULT false,
    "maintenanceItems" JSONB,
    "photos" JSONB,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "housing_units_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "housing_units_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_housing_units" ("address", "area", "bathrooms", "bedrooms", "conditions", "constructionYear", "contractEnd", "contractType", "coordinates", "createdAt", "id", "isOccupied", "lastInspection", "maintenanceItems", "monthlyRent", "needsMaintenance", "neighborhood", "occupancyDate", "occupantCpf", "occupantName", "photos", "program", "propertyValue", "status", "tenantId", "unitCode", "unitType", "updatedAt") SELECT "address", "area", "bathrooms", "bedrooms", "conditions", "constructionYear", "contractEnd", "contractType", "coordinates", "createdAt", "id", "isOccupied", "lastInspection", "maintenanceItems", "monthlyRent", "needsMaintenance", "neighborhood", "occupancyDate", "occupantCpf", "occupantName", "photos", "program", "propertyValue", "status", "tenantId", "unitCode", "unitType", "updatedAt" FROM "housing_units";
DROP TABLE "housing_units";
ALTER TABLE "new_housing_units" RENAME TO "housing_units";
CREATE UNIQUE INDEX "housing_units_unitCode_key" ON "housing_units"("unitCode");
CREATE TABLE "new_land_regularizations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "protocol" TEXT NOT NULL,
    "applicantName" TEXT NOT NULL,
    "applicantCpf" TEXT NOT NULL,
    "contact" JSONB NOT NULL,
    "propertyAddress" TEXT NOT NULL,
    "coordinates" JSONB,
    "propertyArea" REAL NOT NULL,
    "occupationDate" DATETIME,
    "occupationType" TEXT NOT NULL,
    "hasBuilding" BOOLEAN NOT NULL DEFAULT false,
    "buildingArea" REAL,
    "landValue" REAL,
    "neighbors" JSONB,
    "accessRoads" JSONB,
    "utilities" JSONB,
    "legalDocuments" JSONB,
    "technicalSurvey" JSONB,
    "environmentalAnalysis" JSONB,
    "applicationDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "analysisStartDate" DATETIME,
    "fieldVisitDate" DATETIME,
    "publicationDate" DATETIME,
    "objectionPeriod" JSONB,
    "approvalDate" DATETIME,
    "titleIssueDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'UNDER_ANALYSIS',
    "analyst" TEXT,
    "observations" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "land_regularizations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "land_regularizations_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_land_regularizations" ("accessRoads", "analysisStartDate", "analyst", "applicantCpf", "applicantName", "applicationDate", "approvalDate", "buildingArea", "contact", "coordinates", "createdAt", "environmentalAnalysis", "fieldVisitDate", "hasBuilding", "id", "landValue", "legalDocuments", "neighbors", "objectionPeriod", "observations", "occupationDate", "occupationType", "propertyAddress", "propertyArea", "protocol", "publicationDate", "status", "technicalSurvey", "tenantId", "titleIssueDate", "updatedAt", "utilities") SELECT "accessRoads", "analysisStartDate", "analyst", "applicantCpf", "applicantName", "applicationDate", "approvalDate", "buildingArea", "contact", "coordinates", "createdAt", "environmentalAnalysis", "fieldVisitDate", "hasBuilding", "id", "landValue", "legalDocuments", "neighbors", "objectionPeriod", "observations", "occupationDate", "occupationType", "propertyAddress", "propertyArea", "protocol", "publicationDate", "status", "technicalSurvey", "tenantId", "titleIssueDate", "updatedAt", "utilities" FROM "land_regularizations";
DROP TABLE "land_regularizations";
ALTER TABLE "new_land_regularizations" RENAME TO "land_regularizations";
CREATE UNIQUE INDEX "land_regularizations_protocol_key" ON "land_regularizations"("protocol");
CREATE TABLE "new_medication_dispenses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "patientName" TEXT NOT NULL,
    "patientCpf" TEXT NOT NULL,
    "medicationName" TEXT NOT NULL,
    "dosage" TEXT NOT NULL DEFAULT '1x ao dia',
    "quantity" INTEGER NOT NULL,
    "dispenseDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "prescriptionId" TEXT,
    "pharmacistName" TEXT NOT NULL,
    "dispensedBy" TEXT NOT NULL,
    "unitId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DISPENSED',
    "observations" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "medication_dispenses_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "medication_dispenses_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_medication_dispenses" ("createdAt", "dispenseDate", "dispensedBy", "dosage", "id", "medicationName", "observations", "patientCpf", "patientName", "pharmacistName", "prescriptionId", "quantity", "status", "tenantId", "unitId", "updatedAt") SELECT "createdAt", "dispenseDate", "dispensedBy", "dosage", "id", "medicationName", "observations", "patientCpf", "patientName", "pharmacistName", "prescriptionId", "quantity", "status", "tenantId", "unitId", "updatedAt" FROM "medication_dispenses";
DROP TABLE "medication_dispenses";
ALTER TABLE "new_medication_dispenses" RENAME TO "medication_dispenses";
CREATE TABLE "new_patrol_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
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
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "patrol_requests_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "patrol_requests_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_patrol_requests" ("additionalInfo", "area", "assignedOfficers", "assignedUnit", "completedAt", "concerns", "coordinates", "createdAt", "createdBy", "description", "duration", "frequency", "id", "location", "metadata", "observations", "patrolLog", "priority", "protocol", "reason", "requestedDate", "requestedTime", "requesterAddress", "requesterEmail", "requesterName", "requesterPhone", "scheduledDate", "scheduledTime", "serviceId", "source", "status", "tenantId", "type", "updatedAt") SELECT "additionalInfo", "area", "assignedOfficers", "assignedUnit", "completedAt", "concerns", "coordinates", "createdAt", "createdBy", "description", "duration", "frequency", "id", "location", "metadata", "observations", "patrolLog", "priority", "protocol", "reason", "requestedDate", "requestedTime", "requesterAddress", "requesterEmail", "requesterName", "requesterPhone", "scheduledDate", "scheduledTime", "serviceId", "source", "status", "tenantId", "type", "updatedAt" FROM "patrol_requests";
DROP TABLE "patrol_requests";
ALTER TABLE "new_patrol_requests" RENAME TO "patrol_requests";
CREATE INDEX "patrol_requests_tenantId_idx" ON "patrol_requests"("tenantId");
CREATE INDEX "patrol_requests_status_idx" ON "patrol_requests"("status");
CREATE INDEX "patrol_requests_type_idx" ON "patrol_requests"("type");
CREATE INDEX "patrol_requests_requestedDate_idx" ON "patrol_requests"("requestedDate");
CREATE TABLE "new_protected_areas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "name" TEXT NOT NULL,
    "areaType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "coordinates" JSONB NOT NULL,
    "totalArea" REAL NOT NULL,
    "protectionLevel" TEXT NOT NULL,
    "legalBasis" TEXT NOT NULL,
    "managementPlan" JSONB,
    "biodiversity" JSONB,
    "threats" JSONB,
    "activities" JSONB,
    "restrictions" JSONB,
    "guardian" TEXT,
    "contact" TEXT,
    "visitationRules" JSONB,
    "isPublicAccess" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "lastInspection" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "protected_areas_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "protected_areas_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_protected_areas" ("activities", "areaType", "biodiversity", "contact", "coordinates", "createdAt", "description", "guardian", "id", "isPublicAccess", "lastInspection", "legalBasis", "location", "managementPlan", "name", "protectionLevel", "restrictions", "status", "tenantId", "threats", "totalArea", "updatedAt", "visitationRules") SELECT "activities", "areaType", "biodiversity", "contact", "coordinates", "createdAt", "description", "guardian", "id", "isPublicAccess", "lastInspection", "legalBasis", "location", "managementPlan", "name", "protectionLevel", "restrictions", "status", "tenantId", "threats", "totalArea", "updatedAt", "visitationRules" FROM "protected_areas";
DROP TABLE "protected_areas";
ALTER TABLE "new_protected_areas" RENAME TO "protected_areas";
CREATE TABLE "new_public_works" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "workType" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "coordinates" JSONB,
    "contractor" TEXT,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "plannedBudget" REAL,
    "actualBudget" REAL,
    "budget" JSONB,
    "progressPercent" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "beneficiaries" INTEGER,
    "photos" JSONB,
    "documents" JSONB,
    "timeline" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "public_works_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "public_works_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_public_works" ("actualBudget", "beneficiaries", "budget", "contractor", "coordinates", "createdAt", "description", "documents", "endDate", "id", "location", "photos", "plannedBudget", "priority", "progressPercent", "startDate", "status", "tenantId", "timeline", "title", "updatedAt", "workType") SELECT "actualBudget", "beneficiaries", "budget", "contractor", "coordinates", "createdAt", "description", "documents", "endDate", "id", "location", "photos", "plannedBudget", "priority", "progressPercent", "startDate", "status", "tenantId", "timeline", "title", "updatedAt", "workType" FROM "public_works";
DROP TABLE "public_works";
ALTER TABLE "new_public_works" RENAME TO "public_works";
CREATE TABLE "new_public_works_attendances" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "protocol" TEXT NOT NULL,
    "citizenName" TEXT NOT NULL,
    "citizenCpf" TEXT,
    "contact" JSONB NOT NULL,
    "serviceType" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "workType" TEXT,
    "location" TEXT NOT NULL,
    "coordinates" JSONB,
    "urgency" TEXT NOT NULL DEFAULT 'NORMAL',
    "photos" JSONB,
    "estimatedCost" REAL,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "feasibility" TEXT,
    "technicalOpinion" TEXT,
    "engineer" TEXT,
    "scheduledDate" DATETIME,
    "completionDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "resolution" TEXT,
    "satisfaction" INTEGER,
    "followUpDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "public_works_attendances_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "public_works_attendances_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_public_works_attendances" ("citizenCpf", "citizenName", "completionDate", "contact", "coordinates", "createdAt", "description", "engineer", "estimatedCost", "feasibility", "followUpDate", "id", "location", "photos", "priority", "protocol", "resolution", "satisfaction", "scheduledDate", "serviceType", "status", "subject", "technicalOpinion", "tenantId", "updatedAt", "urgency", "workType") SELECT "citizenCpf", "citizenName", "completionDate", "contact", "coordinates", "createdAt", "description", "engineer", "estimatedCost", "feasibility", "followUpDate", "id", "location", "photos", "priority", "protocol", "resolution", "satisfaction", "scheduledDate", "serviceType", "status", "subject", "technicalOpinion", "tenantId", "updatedAt", "urgency", "workType" FROM "public_works_attendances";
DROP TABLE "public_works_attendances";
ALTER TABLE "new_public_works_attendances" RENAME TO "public_works_attendances";
CREATE UNIQUE INDEX "public_works_attendances_protocol_key" ON "public_works_attendances"("protocol");
CREATE TABLE "new_rural_producers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "name" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "productionType" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "mainCrop" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "rural_producers_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "rural_producers_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_rural_producers" ("address", "createdAt", "document", "email", "id", "isActive", "mainCrop", "name", "phone", "productionType", "status", "tenantId", "updatedAt") SELECT "address", "createdAt", "document", "email", "id", "isActive", "mainCrop", "name", "phone", "productionType", "status", "tenantId", "updatedAt" FROM "rural_producers";
DROP TABLE "rural_producers";
ALTER TABLE "new_rural_producers" RENAME TO "rural_producers";
CREATE UNIQUE INDEX "rural_producers_tenantId_document_key" ON "rural_producers"("tenantId", "document");
CREATE TABLE "new_rural_programs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "name" TEXT NOT NULL,
    "programType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "objectives" JSONB NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "requirements" JSONB NOT NULL,
    "benefits" JSONB NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "budget" REAL,
    "coordinator" TEXT NOT NULL,
    "maxParticipants" INTEGER,
    "currentParticipants" INTEGER NOT NULL DEFAULT 0,
    "applicationPeriod" JSONB,
    "selectionCriteria" JSONB,
    "partners" JSONB,
    "results" JSONB,
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "evaluation" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "rural_programs_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "rural_programs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_rural_programs" ("applicationPeriod", "benefits", "budget", "coordinator", "createdAt", "currentParticipants", "description", "endDate", "evaluation", "id", "maxParticipants", "name", "objectives", "partners", "programType", "requirements", "results", "selectionCriteria", "startDate", "status", "targetAudience", "tenantId", "updatedAt") SELECT "applicationPeriod", "benefits", "budget", "coordinator", "createdAt", "currentParticipants", "description", "endDate", "evaluation", "id", "maxParticipants", "name", "objectives", "partners", "programType", "requirements", "results", "selectionCriteria", "startDate", "status", "targetAudience", "tenantId", "updatedAt" FROM "rural_programs";
DROP TABLE "rural_programs";
ALTER TABLE "new_rural_programs" RENAME TO "rural_programs";
CREATE TABLE "new_rural_properties" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "producerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" REAL NOT NULL,
    "location" TEXT NOT NULL,
    "plantedArea" REAL,
    "mainCrops" JSONB,
    "owner" TEXT,
    "totalArea" REAL,
    "cultivatedArea" REAL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "rural_properties_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "rural_properties_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "rural_producers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "rural_properties_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_rural_properties" ("createdAt", "cultivatedArea", "id", "location", "mainCrops", "name", "owner", "plantedArea", "producerId", "size", "status", "tenantId", "totalArea", "updatedAt") SELECT "createdAt", "cultivatedArea", "id", "location", "mainCrops", "name", "owner", "plantedArea", "producerId", "size", "status", "tenantId", "totalArea", "updatedAt" FROM "rural_properties";
DROP TABLE "rural_properties";
ALTER TABLE "new_rural_properties" RENAME TO "rural_properties";
CREATE TABLE "new_rural_trainings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "title" TEXT NOT NULL,
    "trainingType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "objectives" JSONB NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "instructor" TEXT NOT NULL,
    "instructorBio" TEXT,
    "content" JSONB NOT NULL,
    "duration" INTEGER NOT NULL,
    "maxParticipants" INTEGER NOT NULL,
    "currentParticipants" INTEGER NOT NULL DEFAULT 0,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "schedule" JSONB NOT NULL,
    "location" TEXT NOT NULL,
    "materials" JSONB,
    "certificate" BOOLEAN NOT NULL DEFAULT false,
    "cost" REAL,
    "requirements" TEXT,
    "evaluation" JSONB,
    "feedback" JSONB,
    "photos" JSONB,
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "rural_trainings_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "rural_trainings_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_rural_trainings" ("certificate", "content", "cost", "createdAt", "currentParticipants", "description", "duration", "endDate", "evaluation", "feedback", "id", "instructor", "instructorBio", "location", "materials", "maxParticipants", "objectives", "photos", "requirements", "schedule", "startDate", "status", "targetAudience", "tenantId", "title", "trainingType", "updatedAt") SELECT "certificate", "content", "cost", "createdAt", "currentParticipants", "description", "duration", "endDate", "evaluation", "feedback", "id", "instructor", "instructorBio", "location", "materials", "maxParticipants", "objectives", "photos", "requirements", "schedule", "startDate", "status", "targetAudience", "tenantId", "title", "trainingType", "updatedAt" FROM "rural_trainings";
DROP TABLE "rural_trainings";
ALTER TABLE "new_rural_trainings" RENAME TO "rural_trainings";
CREATE TABLE "new_school_meals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "schoolId" TEXT,
    "date" DATETIME NOT NULL,
    "shift" TEXT NOT NULL,
    "menu" JSONB NOT NULL,
    "studentsServed" INTEGER NOT NULL DEFAULT 0,
    "cost" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "school_meals_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "school_meals_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "school_meals_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_school_meals" ("cost", "createdAt", "date", "id", "menu", "schoolId", "shift", "studentsServed", "tenantId", "updatedAt") SELECT "cost", "createdAt", "date", "id", "menu", "schoolId", "shift", "studentsServed", "tenantId", "updatedAt" FROM "school_meals";
DROP TABLE "school_meals";
ALTER TABLE "new_school_meals" RENAME TO "school_meals";
CREATE TABLE "new_school_transports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "route" TEXT NOT NULL,
    "driver" TEXT NOT NULL,
    "vehicle" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "shift" TEXT NOT NULL,
    "stops" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "school_transports_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_school_transports" ("capacity", "createdAt", "driver", "id", "isActive", "route", "shift", "stops", "tenantId", "updatedAt", "vehicle") SELECT "capacity", "createdAt", "driver", "id", "isActive", "route", "shift", "stops", "tenantId", "updatedAt", "vehicle" FROM "school_transports";
DROP TABLE "school_transports";
ALTER TABLE "new_school_transports" RENAME TO "school_transports";
CREATE TABLE "new_security_alerts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "title" TEXT NOT NULL,
    "alertType" TEXT NOT NULL,
    "type" TEXT,
    "message" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "targetArea" TEXT,
    "coordinates" JSONB,
    "severity" TEXT NOT NULL,
    "priority" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "expiresAt" DATETIME,
    "validUntil" DATETIME,
    "targetAudience" TEXT,
    "affectedAreas" JSONB,
    "channels" JSONB NOT NULL,
    "acknowledgments" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "security_alerts_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "security_alerts_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_security_alerts" ("acknowledgments", "affectedAreas", "alertType", "channels", "coordinates", "createdAt", "createdBy", "description", "endDate", "expiresAt", "id", "isActive", "location", "message", "priority", "severity", "startDate", "status", "targetArea", "targetAudience", "tenantId", "title", "type", "updatedAt", "validUntil") SELECT "acknowledgments", "affectedAreas", "alertType", "channels", "coordinates", "createdAt", "createdBy", "description", "endDate", "expiresAt", "id", "isActive", "location", "message", "priority", "severity", "startDate", "status", "targetArea", "targetAudience", "tenantId", "title", "type", "updatedAt", "validUntil" FROM "security_alerts";
DROP TABLE "security_alerts";
ALTER TABLE "new_security_alerts" RENAME TO "security_alerts";
CREATE TABLE "new_security_attendances" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "protocol" TEXT NOT NULL,
    "citizenId" TEXT,
    "citizenName" TEXT NOT NULL,
    "citizenCpf" TEXT,
    "contact" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "attendanceType" TEXT,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "urgency" TEXT NOT NULL DEFAULT 'NORMAL',
    "location" TEXT,
    "evidence" JSONB,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "assignedOfficer" TEXT,
    "referredTo" TEXT,
    "actions" TEXT,
    "resolution" TEXT,
    "satisfactionRating" INTEGER,
    "followUpDate" DATETIME,
    "followUpNeeded" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "security_attendances_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "security_attendances_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_security_attendances" ("actions", "assignedOfficer", "attendanceType", "citizenCpf", "citizenId", "citizenName", "contact", "createdAt", "description", "evidence", "followUpDate", "followUpNeeded", "id", "location", "protocol", "referredTo", "resolution", "satisfactionRating", "serviceType", "status", "subject", "tenantId", "updatedAt", "urgency") SELECT "actions", "assignedOfficer", "attendanceType", "citizenCpf", "citizenId", "citizenName", "contact", "createdAt", "description", "evidence", "followUpDate", "followUpNeeded", "id", "location", "protocol", "referredTo", "resolution", "satisfactionRating", "serviceType", "status", "subject", "tenantId", "updatedAt", "urgency" FROM "security_attendances";
DROP TABLE "security_attendances";
ALTER TABLE "new_security_attendances" RENAME TO "security_attendances";
CREATE UNIQUE INDEX "security_attendances_protocol_key" ON "security_attendances"("protocol");
CREATE TABLE "new_security_occurrences" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "protocol" TEXT NOT NULL,
    "occurrenceType" TEXT NOT NULL,
    "type" TEXT,
    "severity" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "coordinates" JSONB,
    "reportedBy" TEXT,
    "reporterName" TEXT,
    "reporterPhone" TEXT,
    "reporterCpf" TEXT,
    "victimInfo" JSONB,
    "officerName" TEXT,
    "dateTime" DATETIME,
    "occurrenceDate" DATETIME NOT NULL,
    "reportDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "evidence" JSONB,
    "witnesses" JSONB,
    "actions" TEXT,
    "resolution" TEXT,
    "followUp" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "security_occurrences_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "security_occurrences_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_security_occurrences" ("actions", "coordinates", "createdAt", "dateTime", "description", "evidence", "followUp", "id", "location", "occurrenceDate", "occurrenceType", "officerName", "protocol", "reportDate", "reportedBy", "reporterCpf", "reporterName", "reporterPhone", "resolution", "severity", "status", "tenantId", "type", "updatedAt", "victimInfo", "witnesses") SELECT "actions", "coordinates", "createdAt", "dateTime", "description", "evidence", "followUp", "id", "location", "occurrenceDate", "occurrenceType", "officerName", "protocol", "reportDate", "reportedBy", "reporterCpf", "reporterName", "reporterPhone", "resolution", "severity", "status", "tenantId", "type", "updatedAt", "victimInfo", "witnesses" FROM "security_occurrences";
DROP TABLE "security_occurrences";
ALTER TABLE "new_security_occurrences" RENAME TO "security_occurrences";
CREATE UNIQUE INDEX "security_occurrences_protocol_key" ON "security_occurrences"("protocol");
CREATE TABLE "new_security_patrols" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "patrolType" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME,
    "guardId" TEXT,
    "guardName" TEXT,
    "officerName" TEXT NOT NULL,
    "officerBadge" TEXT,
    "vehicle" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "checkpoints" JSONB,
    "incidents" JSONB,
    "observations" TEXT,
    "gpsTrack" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "security_patrols_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "security_patrols_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_security_patrols" ("checkpoints", "createdAt", "endTime", "gpsTrack", "guardId", "guardName", "id", "incidents", "observations", "officerBadge", "officerName", "patrolType", "route", "startTime", "status", "tenantId", "updatedAt", "vehicle") SELECT "checkpoints", "createdAt", "endTime", "gpsTrack", "guardId", "guardName", "id", "incidents", "observations", "officerBadge", "officerName", "patrolType", "route", "startTime", "status", "tenantId", "updatedAt", "vehicle" FROM "security_patrols";
DROP TABLE "security_patrols";
ALTER TABLE "new_security_patrols" RENAME TO "security_patrols";
CREATE TABLE "new_social_assistance_attendances" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "protocol" TEXT NOT NULL,
    "citizenId" TEXT,
    "citizenName" TEXT NOT NULL,
    "citizenCpf" TEXT NOT NULL,
    "contact" JSONB NOT NULL,
    "familyIncome" REAL,
    "familySize" INTEGER,
    "serviceType" TEXT NOT NULL,
    "attendanceType" TEXT,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "vulnerability" TEXT,
    "urgency" TEXT NOT NULL DEFAULT 'NORMAL',
    "referredBy" TEXT,
    "socialWorker" TEXT,
    "socialWorkerId" TEXT,
    "assessment" JSONB,
    "interventionPlan" JSONB,
    "referrals" JSONB,
    "followUpPlan" JSONB,
    "followUpNeeded" BOOLEAN NOT NULL DEFAULT false,
    "followUpDate" DATETIME,
    "priority" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "resolution" TEXT,
    "nextVisitDate" DATETIME,
    "satisfaction" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "social_assistance_attendances_socialWorkerId_fkey" FOREIGN KEY ("socialWorkerId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "social_assistance_attendances_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "citizens" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "social_assistance_attendances_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "social_assistance_attendances_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_social_assistance_attendances" ("assessment", "attendanceType", "citizenCpf", "citizenId", "citizenName", "contact", "createdAt", "description", "familyIncome", "familySize", "followUpDate", "followUpNeeded", "followUpPlan", "id", "interventionPlan", "nextVisitDate", "priority", "protocol", "referrals", "referredBy", "resolution", "satisfaction", "serviceType", "socialWorker", "socialWorkerId", "status", "subject", "tenantId", "updatedAt", "urgency", "vulnerability") SELECT "assessment", "attendanceType", "citizenCpf", "citizenId", "citizenName", "contact", "createdAt", "description", "familyIncome", "familySize", "followUpDate", "followUpNeeded", "followUpPlan", "id", "interventionPlan", "nextVisitDate", "priority", "protocol", "referrals", "referredBy", "resolution", "satisfaction", "serviceType", "socialWorker", "socialWorkerId", "status", "subject", "tenantId", "updatedAt", "urgency", "vulnerability" FROM "social_assistance_attendances";
DROP TABLE "social_assistance_attendances";
ALTER TABLE "new_social_assistance_attendances" RENAME TO "social_assistance_attendances";
CREATE UNIQUE INDEX "social_assistance_attendances_protocol_key" ON "social_assistance_attendances"("protocol");
CREATE TABLE "new_sports_attendances" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
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
    CONSTRAINT "sports_attendances_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "sports_attendances_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_sports_attendances" ("attachments", "citizenId", "citizenName", "contact", "createdAt", "description", "eventDate", "expectedParticipants", "followUpDate", "followUpNeeded", "id", "location", "observations", "priority", "protocol", "referredTo", "resolution", "responsible", "serviceId", "serviceType", "source", "sport", "sportType", "status", "tenantId", "type", "updatedAt") SELECT "attachments", "citizenId", "citizenName", "contact", "createdAt", "description", "eventDate", "expectedParticipants", "followUpDate", "followUpNeeded", "id", "location", "observations", "priority", "protocol", "referredTo", "resolution", "responsible", "serviceId", "serviceType", "source", "sport", "sportType", "status", "tenantId", "type", "updatedAt" FROM "sports_attendances";
DROP TABLE "sports_attendances";
ALTER TABLE "new_sports_attendances" RENAME TO "sports_attendances";
CREATE UNIQUE INDEX "sports_attendances_protocol_key" ON "sports_attendances"("protocol");
CREATE TABLE "new_sports_infrastructures" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "sports" JSONB NOT NULL,
    "modalities" JSONB,
    "address" TEXT NOT NULL,
    "coordinates" JSONB,
    "capacity" INTEGER,
    "dimensions" TEXT,
    "surface" TEXT,
    "lighting" BOOLEAN NOT NULL DEFAULT false,
    "covered" BOOLEAN NOT NULL DEFAULT false,
    "accessibility" BOOLEAN NOT NULL DEFAULT false,
    "equipment" JSONB,
    "facilities" JSONB,
    "operatingHours" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "maintenanceSchedule" JSONB,
    "lastMaintenance" DATETIME,
    "bookingRules" JSONB,
    "contact" TEXT,
    "manager" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "sports_infrastructures_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "sports_infrastructures_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_sports_infrastructures" ("accessibility", "address", "bookingRules", "capacity", "contact", "coordinates", "covered", "createdAt", "dimensions", "equipment", "facilities", "id", "isPublic", "lastMaintenance", "lighting", "maintenanceSchedule", "manager", "modalities", "name", "operatingHours", "sports", "status", "surface", "tenantId", "type", "updatedAt") SELECT "accessibility", "address", "bookingRules", "capacity", "contact", "coordinates", "covered", "createdAt", "dimensions", "equipment", "facilities", "id", "isPublic", "lastMaintenance", "lighting", "maintenanceSchedule", "manager", "modalities", "name", "operatingHours", "sports", "status", "surface", "tenantId", "type", "updatedAt" FROM "sports_infrastructures";
DROP TABLE "sports_infrastructures";
ALTER TABLE "new_sports_infrastructures" RENAME TO "sports_infrastructures";
CREATE TABLE "new_sports_modalities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "sports_modalities_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "sports_modalities_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_sports_modalities" ("category", "createdAt", "description", "id", "isActive", "name", "tenantId", "updatedAt") SELECT "category", "createdAt", "description", "id", "isActive", "name", "tenantId", "updatedAt" FROM "sports_modalities";
DROP TABLE "sports_modalities";
ALTER TABLE "new_sports_modalities" RENAME TO "sports_modalities";
CREATE INDEX "sports_modalities_tenantId_idx" ON "sports_modalities"("tenantId");
CREATE TABLE "new_sports_schools" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "name" TEXT NOT NULL,
    "sport" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "targetAge" TEXT NOT NULL,
    "instructor" TEXT NOT NULL,
    "instructorCpf" TEXT,
    "maxStudents" INTEGER NOT NULL,
    "currentStudents" INTEGER NOT NULL DEFAULT 0,
    "schedule" JSONB NOT NULL,
    "location" TEXT NOT NULL,
    "monthlyFee" REAL,
    "equipment" JSONB,
    "requirements" TEXT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "sports_schools_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "sports_schools_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_sports_schools" ("createdAt", "currentStudents", "description", "endDate", "equipment", "id", "instructor", "instructorCpf", "isActive", "location", "maxStudents", "monthlyFee", "name", "requirements", "schedule", "sport", "startDate", "status", "targetAge", "tenantId", "updatedAt") SELECT "createdAt", "currentStudents", "description", "endDate", "equipment", "id", "instructor", "instructorCpf", "isActive", "location", "maxStudents", "monthlyFee", "name", "requirements", "schedule", "sport", "startDate", "status", "targetAge", "tenantId", "updatedAt" FROM "sports_schools";
DROP TABLE "sports_schools";
ALTER TABLE "new_sports_schools" RENAME TO "sports_schools";
CREATE TABLE "new_sports_teams" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
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
    CONSTRAINT "sports_teams_sportsModalityId_fkey" FOREIGN KEY ("sportsModalityId") REFERENCES "sports_modalities" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "sports_teams_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_sports_teams" ("achievements", "ageGroup", "category", "coach", "coachCpf", "coachPhone", "createdAt", "currentPlayers", "description", "foundationDate", "gender", "homeVenue", "id", "isActive", "maxPlayers", "modalityId", "name", "protocol", "roster", "serviceId", "source", "sport", "sportsModalityId", "status", "tenantId", "trainingSchedule", "updatedAt") SELECT "achievements", "ageGroup", "category", "coach", "coachCpf", "coachPhone", "createdAt", "currentPlayers", "description", "foundationDate", "gender", "homeVenue", "id", "isActive", "maxPlayers", "modalityId", "name", "protocol", "roster", "serviceId", "source", "sport", "sportsModalityId", "status", "tenantId", "trainingSchedule", "updatedAt" FROM "sports_teams";
DROP TABLE "sports_teams";
ALTER TABLE "new_sports_teams" RENAME TO "sports_teams";
CREATE TABLE "new_students" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "name" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "cpf" TEXT,
    "rg" TEXT,
    "parentName" TEXT NOT NULL,
    "parentPhone" TEXT NOT NULL,
    "parentEmail" TEXT,
    "address" TEXT NOT NULL,
    "medicalInfo" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "schoolId" TEXT NOT NULL,
    CONSTRAINT "students_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "students_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "students_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_students" ("address", "birthDate", "cpf", "createdAt", "id", "isActive", "medicalInfo", "name", "parentEmail", "parentName", "parentPhone", "rg", "schoolId", "tenantId", "updatedAt") SELECT "address", "birthDate", "cpf", "createdAt", "id", "isActive", "medicalInfo", "name", "parentEmail", "parentName", "parentPhone", "rg", "schoolId", "tenantId", "updatedAt" FROM "students";
DROP TABLE "students";
ALTER TABLE "new_students" RENAME TO "students";
CREATE UNIQUE INDEX "students_tenantId_cpf_key" ON "students"("tenantId", "cpf");
CREATE TABLE "new_vaccinations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "campaignId" TEXT,
    "patientId" TEXT NOT NULL,
    "vaccine" TEXT NOT NULL,
    "dose" TEXT NOT NULL,
    "appliedAt" DATETIME NOT NULL,
    "appliedBy" TEXT NOT NULL,
    "lotNumber" TEXT,
    "nextDose" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "vaccinations_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "vaccinations_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "citizens" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "vaccinations_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "vaccination_campaigns" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "vaccinations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_vaccinations" ("appliedAt", "appliedBy", "campaignId", "createdAt", "dose", "id", "lotNumber", "nextDose", "patientId", "tenantId", "updatedAt", "vaccine") SELECT "appliedAt", "appliedBy", "campaignId", "createdAt", "dose", "id", "lotNumber", "nextDose", "patientId", "tenantId", "updatedAt", "vaccine" FROM "vaccinations";
DROP TABLE "vaccinations";
ALTER TABLE "new_vaccinations" RENAME TO "vaccinations";
CREATE INDEX "vaccinations_tenantId_patientId_idx" ON "vaccinations"("tenantId", "patientId");
CREATE INDEX "vaccinations_tenantId_appliedAt_idx" ON "vaccinations"("tenantId", "appliedAt");
CREATE INDEX "vaccinations_tenantId_vaccine_idx" ON "vaccinations"("tenantId", "vaccine");
CREATE TABLE "new_vulnerable_families" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "citizenId" TEXT NOT NULL,
    "familyCode" TEXT,
    "responsibleName" TEXT,
    "memberCount" INTEGER NOT NULL,
    "monthlyIncome" REAL,
    "riskLevel" TEXT NOT NULL DEFAULT 'LOW',
    "vulnerabilityType" TEXT NOT NULL,
    "socialWorker" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "observations" TEXT,
    "lastVisitDate" DATETIME,
    "nextVisitDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "vulnerable_families_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "vulnerable_families_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "citizens" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "vulnerable_families_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_vulnerable_families" ("citizenId", "createdAt", "familyCode", "id", "lastVisitDate", "memberCount", "monthlyIncome", "nextVisitDate", "observations", "responsibleName", "riskLevel", "socialWorker", "status", "tenantId", "updatedAt", "vulnerabilityType") SELECT "citizenId", "createdAt", "familyCode", "id", "lastVisitDate", "memberCount", "monthlyIncome", "nextVisitDate", "observations", "responsibleName", "riskLevel", "socialWorker", "status", "tenantId", "updatedAt", "vulnerabilityType" FROM "vulnerable_families";
DROP TABLE "vulnerable_families";
ALTER TABLE "new_vulnerable_families" RENAME TO "vulnerable_families";
CREATE UNIQUE INDEX "vulnerable_families_citizenId_key" ON "vulnerable_families"("citizenId");
CREATE TABLE "new_work_inspections" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "protocolId" TEXT,
    "protocol" TEXT NOT NULL,
    "workName" TEXT NOT NULL,
    "workType" TEXT NOT NULL,
    "contractor" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "coordinates" JSONB,
    "inspectionDate" DATETIME NOT NULL,
    "inspector" TEXT NOT NULL,
    "inspectionType" TEXT NOT NULL,
    "findings" JSONB NOT NULL,
    "compliance" TEXT NOT NULL,
    "violations" JSONB,
    "recommendations" JSONB,
    "photos" JSONB,
    "documents" JSONB,
    "deadline" DATETIME,
    "followUpDate" DATETIME,
    "nextInspection" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "observations" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "work_inspections_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "protocols_simplified" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "work_inspections_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_work_inspections" ("compliance", "contractor", "coordinates", "createdAt", "deadline", "documents", "findings", "followUpDate", "id", "inspectionDate", "inspectionType", "inspector", "location", "nextInspection", "observations", "photos", "protocol", "recommendations", "status", "tenantId", "updatedAt", "violations", "workName", "workType") SELECT "compliance", "contractor", "coordinates", "createdAt", "deadline", "documents", "findings", "followUpDate", "id", "inspectionDate", "inspectionType", "inspector", "location", "nextInspection", "observations", "photos", "protocol", "recommendations", "status", "tenantId", "updatedAt", "violations", "workName", "workType" FROM "work_inspections";
DROP TABLE "work_inspections";
ALTER TABLE "new_work_inspections" RENAME TO "work_inspections";
CREATE UNIQUE INDEX "work_inspections_protocol_key" ON "work_inspections"("protocol");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "patients_tenantId_cpf_key" ON "patients"("tenantId", "cpf");

-- CreateIndex
CREATE UNIQUE INDEX "community_health_agents_tenantId_cpf_key" ON "community_health_agents"("tenantId", "cpf");

-- CreateIndex
CREATE UNIQUE INDEX "tree_cutting_authorizations_authorizationNumber_key" ON "tree_cutting_authorizations"("authorizationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "environmental_inspections_inspectionNumber_key" ON "environmental_inspections"("inspectionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "rent_assistances_protocol_key" ON "rent_assistances"("protocol");

-- CreateIndex
CREATE UNIQUE INDEX "road_repair_requests_protocol_key" ON "road_repair_requests"("protocol");

-- CreateIndex
CREATE UNIQUE INDEX "technical_inspections_protocol_key" ON "technical_inspections"("protocol");

-- CreateIndex
CREATE UNIQUE INDEX "municipal_guards_badge_key" ON "municipal_guards"("badge");

-- CreateIndex
CREATE INDEX "municipal_guards_tenantId_idx" ON "municipal_guards"("tenantId");

-- CreateIndex
CREATE INDEX "municipal_guards_status_idx" ON "municipal_guards"("status");

-- CreateIndex
CREATE INDEX "municipal_guards_badge_idx" ON "municipal_guards"("badge");

-- CreateIndex
CREATE UNIQUE INDEX "surveillance_systems_systemCode_key" ON "surveillance_systems"("systemCode");

-- CreateIndex
CREATE INDEX "surveillance_systems_tenantId_idx" ON "surveillance_systems"("tenantId");

-- CreateIndex
CREATE INDEX "surveillance_systems_status_idx" ON "surveillance_systems"("status");

-- CreateIndex
CREATE INDEX "surveillance_systems_type_idx" ON "surveillance_systems"("type");

-- CreateIndex
CREATE INDEX "surveillance_systems_systemCode_idx" ON "surveillance_systems"("systemCode");
