# FASE 1 - Setup e Estrutura Base

## Objetivo
Criar estrutura base do projeto com arquitetura multi-tenant.

## Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind, Shadcn/ui
- **Backend**: Node.js, Prisma, SQLite
- **Infra**: Docker, nginx

## Estrutura de Pastas
```
digiurban/
├── frontend/
│   ├── app/
│   │   ├── (landing)/
│   │   ├── (cidadao)/
│   │   ├── (admin)/
│   │   └── (super-admin)/
│   ├── components/ui/
│   ├── lib/
│   └── stores/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── middleware/
│   └── prisma/
├── docker/
└── nginx/
```

## Models Prisma Base
- **Tenant**: Prefeituras (id, name, cnpj, plan, status)
- **User**: Usuários do sistema (níveis 0-5)
- **Protocol**: Core do sistema (id, status, citizen, service)
- **Service**: Catálogo de serviços
- **Department**: Secretarias municipais
- **Citizen**: Dados dos cidadãos

## APIs Essenciais
- `/api/auth/*`: Autenticação multi-tenant
- `/api/protocols/*`: CRUD protocolos
- `/api/services/*`: Catálogo serviços
- `/api/tenants/*`: Gestão tenants

## Configuração Docker
- Container frontend (Next.js)
- Container backend (Node.js)
- Volume SQLite e uploads
- nginx proxy reverso

## Middleware Multi-tenant
- Identificação por subdomínio
- Isolamento de dados por tenant_id
- Autorização por níveis de usuário
- Rate limiting básico

## Critérios de Sucesso
1. Projeto inicializado e funcionando
2. Multi-tenancy básico implementado
3. Autenticação funcionando
4. Docker containers rodando
5. nginx proxy configurado
6. Database schema criado
7. APIs básicas respondendo