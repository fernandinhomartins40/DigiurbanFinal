const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf-8');

// Mapa de correções: tipo enum -> valor string -> valor enum correto
const fixes = [
  { pattern: /Plan\s+@default\("STARTER"\)/, replacement: 'Plan                         @default(STARTER)' },
  { pattern: /TenantStatus\s+@default\("TRIAL"\)/, replacement: 'TenantStatus                 @default(TRIAL)' },
  { pattern: /EmailPlan\s+@default\("NONE"\)/, replacement: 'EmailPlan                    @default(NONE)' },
  { pattern: /UserRole\s+@default\("USER"\)/, replacement: 'UserRole                     @default(USER)' },
  { pattern: /ProtocolStatus\s+@default\("VINCULADO"\)/, replacement: 'ProtocolStatus       @default(VINCULADO)' },
  { pattern: /InvoiceStatus\s+@default\("PENDING"\)/, replacement: 'InvoiceStatus @default(PENDING)' },
  { pattern: /EmailStatus\s+@default\("QUEUED"\)/, replacement: 'EmailStatus  @default(QUEUED)' },
  { pattern: /LogLevel\s+@default\("INFO"\)/, replacement: 'LogLevel     @default(INFO)' },
  { pattern: /SportsAttendanceStatus\s+@default\("PENDING"\)/, replacement: 'SportsAttendanceStatus @default(PENDING)' },
  { pattern: /HealthAttendanceStatus\s+@default\("PENDING"\)/, replacement: 'HealthAttendanceStatus @default(PENDING)' },
  { pattern: /HousingAttendanceStatus\s+@default\("PENDING"\)/, replacement: 'HousingAttendanceStatus @default(PENDING)' }
];

let totalFixes = 0;
fixes.forEach(({ pattern, replacement }) => {
  const matches = schema.match(pattern);
  if (matches) {
    schema = schema.replace(pattern, replacement);
    totalFixes++;
    console.log(`✓ Corrigido: ${matches[0]}`);
  }
});

console.log(`\n✓ Total de correções: ${totalFixes}`);

// Salvar
fs.writeFileSync(schemaPath, schema, 'utf-8');
console.log(`✓ Schema corrigido salvo em: ${schemaPath}`);
