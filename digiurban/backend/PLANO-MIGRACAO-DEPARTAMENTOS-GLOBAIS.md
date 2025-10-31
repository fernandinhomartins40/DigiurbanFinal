# Plano de Migração: Departamentos Globais

## ⚠️ PROBLEMA IDENTIFICADO
- Departamentos estão sendo criados por tenant (com `tenantId`)
- Isso causa duplicação e inconsistência de nomes
- Estrutura atual: 30 departamentos para 3 tenants (deveria ser 14 globais)

## ✅ SOLUÇÃO: Departamentos Globais

### Mudanças no Schema

#### ANTES:
```prisma
model Department {
  id          String   @id @default(cuid())
  name        String
  tenantId    String   // ❌ REMOVER
  tenant      Tenant   @relation(...) // ❌ REMOVER

  @@unique([tenantId, name]) // ❌ REMOVER
}
```

#### DEPOIS:
```prisma
model Department {
  id          String   @id @default(cuid())
  name        String   @unique // ✅ GLOBAL
  code        String   @unique // ✅ Código padronizado

  // Sem tenantId - departamentos são globais
}
```

## 🔄 PASSOS DA MIGRAÇÃO (Ordem Segura)

### 1. **Backup do Banco Atual**
```bash
# SQLite - copiar arquivo
cp digiurban/backend/prisma/dev.db digiurban/backend/prisma/dev.db.backup-before-global-depts
```

### 2. **Criar 14 Departamentos Globais Padronizados**
- Saúde (SAUDE)
- Educação (EDUCACAO)
- Assistência Social (ASSISTENCIA_SOCIAL)
- Agricultura (AGRICULTURA)
- Cultura (CULTURA)
- Esportes (ESPORTES)
- Habitação (HABITACAO)
- Meio Ambiente (MEIO_AMBIENTE)
- Obras Públicas (OBRAS_PUBLICAS)
- Planejamento Urbano (PLANEJAMENTO_URBANO)
- Segurança Pública (SEGURANCA_PUBLICA)
- Serviços Públicos (SERVICOS_PUBLICOS)
- Turismo (TURISMO)
- Fazenda (FAZENDA)

### 3. **Migrar Serviços para Departamentos Globais**
- Para cada serviço, mapear departamento antigo → departamento global
- Atualizar `departmentId` dos serviços

### 4. **Remover Departamentos Antigos (com tenantId)**

### 5. **Atualizar Schema Prisma**
- Remover `tenantId` de Department
- Adicionar `@unique` no campo `name`

### 6. **Atualizar Seed**
- Criar departamentos globais apenas uma vez
- Não duplicar por tenant

## 🛡️ SEGURANÇA

### Validações Antes de Migrar:
- ✅ Backup do banco criado
- ✅ Todos os serviços têm departmentId válido
- ✅ Nenhum protocolo órfão

### Rollback (se necessário):
```bash
# Restaurar backup
cp digiurban/backend/prisma/dev.db.backup-before-global-depts digiurban/backend/prisma/dev.db
```

## 📋 14 DEPARTAMENTOS GLOBAIS PADRONIZADOS

| Código | Nome Completo |
|--------|---------------|
| SAUDE | Secretaria de Saúde |
| EDUCACAO | Secretaria de Educação |
| ASSISTENCIA_SOCIAL | Secretaria de Assistência Social |
| AGRICULTURA | Secretaria de Agricultura |
| CULTURA | Secretaria de Cultura |
| ESPORTES | Secretaria de Esportes |
| HABITACAO | Secretaria de Habitação |
| MEIO_AMBIENTE | Secretaria de Meio Ambiente |
| OBRAS_PUBLICAS | Secretaria de Obras Públicas |
| PLANEJAMENTO_URBANO | Secretaria de Planejamento Urbano |
| SEGURANCA_PUBLICA | Secretaria de Segurança Pública |
| SERVICOS_PUBLICOS | Secretaria de Serviços Públicos |
| TURISMO | Secretaria de Turismo |
| FAZENDA | Secretaria de Fazenda |
