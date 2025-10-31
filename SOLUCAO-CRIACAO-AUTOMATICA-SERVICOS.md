# Solução: Criação Automática de Serviços para Novos Tenants

## 📋 Problema Identificado

Quando um novo tenant era criado no sistema, os serviços **não eram criados automaticamente**. Isso causava os seguintes problemas:

1. **IDs incompatíveis**: Serviços copiados manualmente de um tenant para outro mantinham os IDs do tenant original
2. **404 Not Found**: Cidadãos não conseguiam acessar serviços porque os IDs não correspondiam ao tenant correto
3. **Processo manual**: Era necessário copiar manualmente os serviços do tenant "demo" para cada novo tenant
4. **Inconsistência**: Diferentes tenants podiam ter conjuntos diferentes de serviços

## ✅ Solução Implementada

### 1. **Criação Automática de Serviços**

Modificamos a rota `POST /api/tenants` em [tenants.ts](digiurban/backend/src/routes/tenants.ts) para criar automaticamente todos os 114 serviços quando um novo tenant é criado.

**Arquivo modificado**: `digiurban/backend/src/routes/tenants.ts`

```typescript
import { seedServices } from '../seeds/services-simplified-complete';

// Dentro da rota POST /api/tenants
router.post('/', authenticateToken, requireSuperAdmin, async (req, res) => {
  // ... criar tenant ...

  // 🚀 CRIAR SERVIÇOS AUTOMATICAMENTE PARA O NOVO TENANT
  console.log(`\n🚀 Criando serviços automaticamente para o tenant ${tenant.name}...`);
  let servicesCreated = 0;
  try {
    servicesCreated = await seedServices(tenant.id);
    console.log(`✅ ${servicesCreated} serviços criados com sucesso para ${tenant.name}`);
  } catch (error) {
    console.error(`❌ Erro ao criar serviços para o tenant ${tenant.name}:`, error);
    // Não falha a criação do tenant, mas loga o erro
  }

  return res.status(201).json({
    message: 'Tenant criado com sucesso',
    tenant,
    servicesCreated, // Quantos serviços foram criados
    // ...
  });
});
```

### 2. **Função `seedServices(tenantId)`**

A função já existia em [services-simplified-complete.ts](digiurban/backend/src/seeds/services-simplified-complete.ts) e cria todos os 114 serviços padrão do sistema para um tenant específico.

**Características da função**:
- ✅ Cria 114 serviços distribuídos em 13 secretarias
- ✅ Cada serviço recebe um **ID único** (cuid) próprio do tenant
- ✅ Usa departamentos globais compartilhados entre tenants
- ✅ Trata erros de duplicação (se o serviço já existir, apenas registra no log)
- ✅ Retorna o número total de serviços criados

**Distribuição dos serviços por secretaria**:
1. Saúde - 11 serviços
2. Educação - 11 serviços
3. Assistência Social - 9 serviços
4. Agricultura - 6 serviços
5. Cultura - 9 serviços
6. Esportes - 9 serviços
7. Habitação - 7 serviços
8. Meio Ambiente - 7 serviços
9. Obras Públicas - 7 serviços
10. Planejamento Urbano - 9 serviços
11. Segurança Pública - 11 serviços
12. Serviços Públicos - 9 serviços
13. Turismo - 9 serviços

## 🔧 Como Funciona

### Fluxo de Criação de Tenant

```
1. Super-admin cria novo tenant via POST /api/tenants
   ↓
2. Sistema valida dados (CNPJ, município IBGE, etc)
   ↓
3. Sistema cria registro do tenant no banco
   ↓
4. Sistema chama seedServices(tenant.id)
   ↓
5. São criados 114 serviços com IDs únicos para o tenant
   ↓
6. Retorna sucesso com quantidade de serviços criados
```

### Exemplo de Resposta

```json
{
  "message": "Tenant criado com sucesso",
  "tenant": {
    "id": "cmhexjsc60000cbz0uxnr8hb5",
    "name": "Prefeitura de Palmital",
    "cnpj": "75.680.025/0001-82",
    // ...
  },
  "servicesCreated": 114,
  "municipioValidado": {
    "nome": "Palmital",
    "uf": "PR",
    "codigoIbge": "4118402"
  }
}
```

## 🎯 Benefícios

1. **✅ Automático**: Não é mais necessário copiar serviços manualmente
2. **✅ Consistente**: Todos os tenants começam com o mesmo conjunto de 114 serviços
3. **✅ IDs Únicos**: Cada tenant tem seus próprios serviços com IDs exclusivos
4. **✅ Funcional**: Cidadãos podem acessar e solicitar serviços imediatamente
5. **✅ Escalável**: Sistema pronto para criar milhares de tenants automaticamente
6. **✅ Robusto**: Trata erros sem falhar a criação do tenant

## 🔍 Verificação

Para verificar se um tenant tem serviços criados:

```sql
SELECT COUNT(*)
FROM ServiceSimplified
WHERE tenantId = 'ID_DO_TENANT';
```

**Resultado esperado**: 114 serviços

## 📝 Notas Importantes

1. **Departamentos Globais**: Os 14 departamentos são globais e compartilhados entre todos os tenants
2. **Erro Não Fatal**: Se a criação de serviços falhar, o tenant ainda é criado (permite correção manual depois)
3. **Log Completo**: Todo o processo é registrado no console do backend para auditoria
4. **Idempotência**: Se os serviços já existirem, a função não duplica (trata erro P2002 do Prisma)

## 🚀 Próximos Passos

Para criar um novo tenant com serviços automáticos:

```bash
POST /api/tenants
Authorization: Bearer <token_super_admin>

{
  "name": "Prefeitura de Exemplo",
  "cnpj": "12.345.678/0001-90",
  "codigoIbge": "1234567",
  "plan": "STARTER"
}
```

O sistema criará:
- ✅ 1 tenant
- ✅ 114 serviços com IDs únicos
- ✅ Pronto para uso imediato

---

**Data da implementação**: 31/10/2025
**Arquivo modificado**: `digiurban/backend/src/routes/tenants.ts`
**Função utilizada**: `seedServices()` de `digiurban/backend/src/seeds/services-simplified-complete.ts`
