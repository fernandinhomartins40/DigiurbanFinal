# 🔐 Credenciais de Acesso - DigiUrban

Este documento contém todas as credenciais padrão criadas pelo seed do sistema DigiUrban.

## 📋 Índice

- [Super Admin (SaaS)](#super-admin-saas)
- [Admin Tenant Demo](#admin-tenant-demo)
- [Tenant Demo](#tenant-demo)
- [Como Executar o Seed](#como-executar-o-seed)
- [Como Resetar Senhas](#como-resetar-senhas)

---

## 👤 Super Admin (SaaS)

**Perfil de acesso global à plataforma SaaS**

### Credenciais

- **📧 Email**: `superadmin@digiurban.com`
- **🔑 Senha**: `Super@admin123`
- **🌐 URL de Acesso**: https://digiurban.com.br/super-admin/login

### Permissões

- ✅ Gerenciamento de todos os tenants (municípios)
- ✅ Configuração global da plataforma SaaS
- ✅ Monitoramento de infraestrutura e performance
- ✅ Controle de billing e assinaturas
- ✅ Analytics consolidados multi-tenant
- ✅ Soft delete e hard delete de tenants
- ✅ Geração de faturas
- ✅ Auditoria de sistema

---

## 👤 Admin Tenant Demo

**Perfil de administrador do município de demonstração**

### Credenciais

- **📧 Email**: `admin@demo.gov.br`
- **🔑 Senha**: `Admin@demo123`
- **🌐 URL de Acesso**: https://digiurban.com.br/admin/login

### Permissões

- ✅ Gerenciamento completo do tenant Demo
- ✅ Criação e gestão de usuários do município
- ✅ Gestão de departamentos
- ✅ Gestão de serviços municipais
- ✅ Gestão de protocolos
- ✅ Gestão de cidadãos
- ✅ Relatórios e analytics do município

---

## 🏛️ Tenant Demo

**Município de demonstração para testes**

### Informações

- **📛 Nome**: Município Demonstração
- **🌐 Domínio**: `demo`
- **📋 CNPJ**: 00000000000191
- **📍 Código IBGE**: 0000000
- **🏙️ Município**: Demonstração - SP
- **📊 Status**: ACTIVE
- **💼 Plano**: PROFESSIONAL

---

## 🚀 Como Executar o Seed

### Desenvolvimento Local

```bash
cd digiurban/backend
npm run seed
```

### Produção (Docker)

```bash
# Via Docker Compose
docker-compose exec backend npm run seed

# Via Docker direto
docker exec digiurban-vps sh -c 'cd /app/backend && npm run seed'
```

### Via Prisma Diretamente

```bash
cd digiurban/backend
npx prisma db seed
```

---

## 🔧 Como Resetar Senhas

### Usando Script de Reset

O repositório inclui scripts utilitários para reset de senha:

#### Super Admin

```bash
# 1. Copiar script para o servidor
scp reset-superadmin-remote.js root@72.60.10.108:/tmp/

# 2. Executar no container
ssh root@72.60.10.108 "docker cp /tmp/reset-superadmin-remote.js digiurban-vps:/app/backend/ && docker exec digiurban-vps sh -c 'cd /app/backend && node reset-superadmin-remote.js'"
```

O script `reset-superadmin-remote.js` cria/atualiza o super admin com:
- Email: `superadmin@digiurban.com`
- Senha: `Super@admin123`

### Manualmente via Prisma Studio

```bash
cd digiurban/backend
npx prisma studio
```

Depois:
1. Abra a tabela `User`
2. Encontre o usuário
3. Use bcrypt para gerar um novo hash de senha
4. Atualize o campo `password`

---

## 📝 Notas Importantes

### Segurança

⚠️ **IMPORTANTE**: Estas são credenciais de desenvolvimento/demonstração. Em ambiente de produção real:

1. **Altere todas as senhas padrão imediatamente**
2. Use senhas fortes e únicas
3. Implemente rotação de senhas
4. Monitore tentativas de login
5. Use 2FA quando disponível

### Política de Senhas

As senhas padrão seguem a política de segurança:
- ✅ Mínimo 8 caracteres
- ✅ Pelo menos 1 letra maiúscula
- ✅ Pelo menos 1 letra minúscula
- ✅ Pelo menos 1 número
- ✅ Pelo menos 1 caractere especial

### Bcrypt Rounds

O sistema usa **12 rounds** do bcrypt para hash de senhas (padrão OWASP 2024).

---

## 🔄 Atualizações

**Última atualização**: 2025-10-24

**Changelog**:
- ✅ Credenciais padronizadas do Super Admin
- ✅ Credenciais padronizadas do Admin Demo
- ✅ Seed atualiza senhas se usuários já existem
- ✅ Bcrypt rounds aumentado para 12 (segurança)
- ✅ Scripts de reset automatizados

---

## 📞 Suporte

Em caso de problemas com credenciais:

1. Execute o seed novamente: `npm run seed`
2. Use o script de reset: `reset-superadmin-remote.js`
3. Verifique os logs do container: `docker logs digiurban-vps`
4. Consulte a equipe de desenvolvimento

---

**🤖 Generated with Claude Code**
