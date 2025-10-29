@echo off
set PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION=sim, pode prosseguir
npx prisma migrate reset --force
npx prisma migrate dev --name add_health_modules_and_protocol_integration
