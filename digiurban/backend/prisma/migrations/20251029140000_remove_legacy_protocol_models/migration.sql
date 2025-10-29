-- RemoveLegacyProtocolModels Migration
-- Remove all legacy Protocol and Service models

-- Drop tables in correct order (respecting foreign keys)

-- 1. Drop tables that depend on Protocol
DROP TABLE IF EXISTS "document_uploads";
DROP TABLE IF EXISTS "appointments";
DROP TABLE IF EXISTS "protocol_custom_field_values";
DROP TABLE IF EXISTS "service_form_submissions";
DROP TABLE IF EXISTS "protocol_locations";
DROP TABLE IF EXISTS "protocol_evaluations";
DROP TABLE IF EXISTS "protocol_history";
DROP TABLE IF EXISTS "protocols";

-- 2. Drop tables that depend on Service
DROP TABLE IF EXISTS "service_documents";
DROP TABLE IF EXISTS "service_custom_fields";
DROP TABLE IF EXISTS "service_scheduling";
DROP TABLE IF EXISTS "service_locations";
DROP TABLE IF EXISTS "service_forms";
DROP TABLE IF EXISTS "service_notifications";
DROP TABLE IF EXISTS "service_workflows";
DROP TABLE IF EXISTS "service_surveys";
DROP TABLE IF EXISTS "service_generations";
DROP TABLE IF EXISTS "services";

-- 3. Drop service template table
DROP TABLE IF EXISTS "service_templates";
