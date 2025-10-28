# 🚀 GUIA RÁPIDO - Sistema de Templates DigiUrban

---

## ⚡ Start Rápido

### 1. Ver Templates Disponíveis

```bash
curl -X GET "http://localhost:3001/api/admin/templates" \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN" \
  -H "X-Tenant-ID: seu_tenant_id"
```

### 2. Ativar um Template

```bash
curl -X POST "http://localhost:3001/api/admin/templates/TEMPLATE_ID/activate" \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN" \
  -H "X-Tenant-ID: seu_tenant_id" \
  -H "Content-Type: application/json" \
  -d '{
    "departmentId": "dept_educacao",
    "priority": 1
  }'
```

### 3. Cidadão Solicita Serviço

```bash
curl -X POST "http://localhost:3001/api/citizen/services/SERVICE_ID/request" \
  -H "Authorization: Bearer TOKEN_CIDADAO" \
  -H "X-Tenant-ID: seu_tenant_id" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Solicito matrícula escolar",
    "customFormData": {
      "studentName": "João Silva",
      "birthDate": "2018-03-15",
      "parentName": "Maria Silva",
      "parentCpf": "123.456.789-00",
      "desiredGrade": "1º ano"
    }
  }'
```

---

## 📋 Templates Disponíveis (30 Piloto)

### EDUCAÇÃO (5)
- `EDU_MATRICULA_001` - Matrícula Escolar
- `EDU_TRANSPORTE_001` - Transporte Escolar
- `EDU_UNIFORME_001` - Kit Uniforme Escolar
- `EDU_MATERIAL_001` - Kit Material Escolar
- `EDU_HISTORICO_001` - Histórico Escolar

### SAÚDE (5)
- `SAU_CONSULTA_001` - Agendamento de Consulta Médica
- `SAU_MEDICAMENTO_001` - Solicitação de Medicamento
- `SAU_EXAME_001` - Agendamento de Exame
- `SAU_VACINA_001` - Carteira de Vacinação
- `SAU_CARTAO_SUS_001` - Cartão SUS

### ASSISTÊNCIA SOCIAL (4)
- `SOC_CESTA_BASICA_001` - Cesta Básica
- `SOC_CADUNICO_001` - Cadastro Único (CadÚnico)
- `SOC_AUXILIO_FUNERAL_001` - Auxílio Funeral
- `SOC_VISITA_DOMICILIAR_001` - Visita Domiciliar

### HABITAÇÃO (4)
- `HAB_MCMV_001` - Minha Casa Minha Vida
- `HAB_REGULARIZACAO_001` - Regularização Fundiária
- `HAB_AUXILIO_ALUGUEL_001` - Auxílio Aluguel
- `HAB_PLANTA_CASA_001` - Planta de Casa Popular

### OBRAS PÚBLICAS (3)
- `OBR_BURACO_RUA_001` - Buraco na Rua
- `OBR_ILUMINACAO_001` - Iluminação Pública
- `OBR_CALCADA_001` - Manutenção de Calçada

### SERVIÇOS PÚBLICOS (3)
- `SER_PODA_ARVORE_001` - Poda de Árvore
- `SER_ENTULHO_001` - Retirada de Entulho
- `SER_DEDETIZACAO_001` - Dedetização

### CULTURA (2)
- `CUL_OFICINA_001` - Inscrição em Oficina Cultural
- `CUL_ESPACO_001` - Reserva de Espaço Cultural

### ESPORTE (2)
- `ESP_ESCOLINHA_001` - Escolinha Esportiva
- `ESP_QUADRA_001` - Reserva de Quadra Esportiva

### MEIO AMBIENTE (2)
- `AMB_DENUNCIA_001` - Denúncia Ambiental
- `AMB_PLANTIO_001` - Solicitação de Plantio de Árvore

---

## 🔧 Comandos Úteis

### Rodar seed de templates

```bash
cd digiurban/backend
npx ts-node src/seeds/service-templates.ts
```

### Verificar banco de dados

```bash
cd digiurban/backend
npx prisma studio
```

### Compilar TypeScript

```bash
cd digiurban/backend
npx tsc --noEmit
```

### Aplicar migrations

```bash
cd digiurban/backend
npx prisma migrate dev
```

---

## 📊 Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/admin/templates` | Lista templates |
| `GET` | `/api/admin/templates/categories` | Lista categorias |
| `GET` | `/api/admin/templates/:id` | Detalhes do template |
| `POST` | `/api/admin/templates/:id/activate` | Ativa template |
| `DELETE` | `/api/admin/templates/:id/deactivate` | Desativa template |
| `GET` | `/api/admin/templates/stats/summary` | Estatísticas |

---

## 💡 Dicas

### Como saber o ID do template?

```bash
# Listar todos os templates e buscar pelo código
GET /api/admin/templates?search=EDU_MATRICULA
```

### Como ver serviços ativados?

```bash
# Templates ativados terão isActivated: true
GET /api/admin/templates

# Ou listar serviços diretamente
GET /api/services
```

### Como testar um template?

1. Ativar o template via API
2. Obter o serviceId do serviço criado
3. Fazer uma solicitação como cidadão
4. Verificar se protocolo e entidade foram criados

---

## 🐛 Troubleshooting

### Template não aparece na lista

- Verificar se está marcado como `isActive: true`
- Rodar o seed novamente: `npx ts-node src/seeds/service-templates.ts`

### Erro ao ativar template

- Verificar se `departmentId` existe no tenant
- Verificar se template já não foi ativado

### Module Handler não está criando entidade

- Verificar se `moduleType` e `moduleEntity` estão corretos no template
- Ver logs do console no backend
- Verificar se o model Prisma existe

---

## 📞 Precisa de Ajuda?

Ver documentação completa em: `docs/IMPLEMENTACAO_COMPLETA.md`

---

**Atualizado em:** 27/10/2025
