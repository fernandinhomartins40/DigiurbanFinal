# 📡 Documentação Completa de API - DigiUrban

## Índice
1. [Introdução](#introdução)
2. [Autenticação](#autenticação)
3. [Estrutura de Resposta](#estrutura-de-resposta)
4. [Endpoints de Cidadão](#endpoints-de-cidadão)
5. [Endpoints de Administração](#endpoints-de-administração)
6. [Endpoints de Secretarias](#endpoints-de-secretarias)
7. [Endpoints de Serviços e Templates](#endpoints-de-serviços-e-templates)
8. [Endpoints Públicos](#endpoints-públicos)
9. [Códigos de Status](#códigos-de-status)
10. [Exemplos de Integração](#exemplos-de-integração)

---

## Introdução

A API DigiUrban é uma API RESTful que permite integração completa com o sistema de gestão municipal. Todos os endpoints retornam JSON e seguem padrões REST.

### Base URL

```
Produção: https://api.digiurban.com.br
Desenvolvimento: http://localhost:3001
```

### Versionamento

Atualmente na versão 1.0. Futuras versões serão prefixadas com `/v2`, `/v3`, etc.

---

## Autenticação

### Tipos de Autenticação

A API suporta dois tipos de autenticação:

#### 1. Autenticação de Cidadão

```typescript
// POST /api/citizen/auth/login
{
  "cpf": "12345678900",
  "password": "senha123"
}

// Resposta
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "citizen": {
    "id": "citizen-id",
    "name": "João Silva",
    "cpf": "123.456.789-00",
    "email": "joao@email.com"
  }
}
```

#### 2. Autenticação de Administrador

```typescript
// POST /api/admin/auth/login
{
  "email": "admin@prefeitura.gov.br",
  "password": "senha123"
}

// Resposta
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-id",
    "name": "Maria Administradora",
    "email": "admin@prefeitura.gov.br",
    "role": "ADMIN",
    "departmentId": "dept-id"
  }
}
```

### Usando o Token

Inclua o token no header Authorization de todas as requisições autenticadas:

```typescript
headers: {
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  'Content-Type': 'application/json'
}
```

---

## Estrutura de Resposta

### Resposta de Sucesso

```json
{
  "success": true,
  "data": {
    // Dados retornados
  }
}
```

### Resposta de Erro

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Mensagem de erro legível",
    "details": {
      "field": "cpf",
      "issue": "CPF inválido"
    }
  }
}
```

### Resposta Paginada

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## Endpoints de Cidadão

### Autenticação

#### Login

```http
POST /api/citizen/auth/login
Content-Type: application/json

{
  "cpf": "12345678900",
  "password": "senha123"
}
```

#### Registro

```http
POST /api/citizen/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "cpf": "12345678900",
  "email": "joao@email.com",
  "phone": "11999999999",
  "password": "senha123",
  "address": {
    "street": "Rua das Flores",
    "number": "123",
    "neighborhood": "Centro",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01000-000"
  }
}
```

#### Recuperar Senha

```http
POST /api/citizen/auth/forgot-password
Content-Type: application/json

{
  "cpf": "12345678900",
  "email": "joao@email.com"
}
```

### Serviços

#### Listar Serviços Disponíveis

```http
GET /api/citizen/services
Authorization: Bearer {token}

Query Parameters:
  - category: string (opcional)
  - search: string (opcional)
  - page: number (padrão: 1)
  - limit: number (padrão: 20)
```

#### Detalhes do Serviço

```http
GET /api/citizen/services/:serviceId
Authorization: Bearer {token}
```

### Protocolos

#### Criar Novo Protocolo

```http
POST /api/citizen/protocols
Authorization: Bearer {token}
Content-Type: application/json

{
  "serviceId": "service-id",
  "data": {
    // Dados específicos do serviço conforme formSchema
    "especialidade": "clinico-geral",
    "dataDesejada": "2025-02-15",
    "periodo": "MANHA",
    "observacoes": "Paciente com sintomas de gripe"
  },
  "documents": [
    {
      "type": "Cartão SUS",
      "url": "https://storage.../cartao-sus.pdf"
    }
  ]
}
```

#### Listar Meus Protocolos

```http
GET /api/citizen/protocols
Authorization: Bearer {token}

Query Parameters:
  - status: string (PENDENTE, EM_ANALISE, APROVADO, etc)
  - page: number
  - limit: number
```

#### Detalhes do Protocolo

```http
GET /api/citizen/protocols/:protocolId
Authorization: Bearer {token}
```

#### Cancelar Protocolo

```http
POST /api/citizen/protocols/:protocolId/cancel
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "Não preciso mais do serviço"
}
```

### Notificações

#### Listar Notificações

```http
GET /api/citizen/notifications
Authorization: Bearer {token}

Query Parameters:
  - unreadOnly: boolean
  - page: number
  - limit: number
```

#### Marcar como Lida

```http
PATCH /api/citizen/notifications/:notificationId/read
Authorization: Bearer {token}
```

### Documentos

#### Upload de Documento

```http
POST /api/citizen/documents/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

FormData:
  - file: File
  - type: string
  - protocolId: string (opcional)
```

#### Listar Meus Documentos

```http
GET /api/citizen/documents
Authorization: Bearer {token}
```

### Família

#### Adicionar Dependente

```http
POST /api/citizen/family/dependents
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Maria Silva",
  "cpf": "98765432100",
  "birthDate": "2015-05-20",
  "relationship": "FILHA"
}
```

#### Listar Dependentes

```http
GET /api/citizen/family/dependents
Authorization: Bearer {token}
```

---

## Endpoints de Administração

### Autenticação Admin

#### Login Admin

```http
POST /api/admin/auth/login
Content-Type: application/json

{
  "email": "admin@prefeitura.gov.br",
  "password": "senha123"
}
```

### Gerenciamento de Cidadãos

#### Listar Cidadãos

```http
GET /api/admin/citizens
Authorization: Bearer {token}

Query Parameters:
  - search: string
  - page: number
  - limit: number
```

#### Detalhes do Cidadão

```http
GET /api/admin/citizens/:citizenId
Authorization: Bearer {token}
```

#### Atualizar Cidadão

```http
PUT /api/admin/citizens/:citizenId
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "João Silva Santos",
  "email": "novoemail@email.com",
  "phone": "11988888888"
}
```

### Gerenciamento de Protocolos

#### Listar Protocolos da Secretaria

```http
GET /api/admin/protocols
Authorization: Bearer {token}

Query Parameters:
  - status: string
  - serviceId: string
  - startDate: string (ISO 8601)
  - endDate: string (ISO 8601)
  - page: number
  - limit: number
```

#### Atribuir Protocolo

```http
POST /api/admin/protocols/:protocolId/assign
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "user-id"
}
```

#### Atualizar Status

```http
PATCH /api/admin/protocols/:protocolId/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "EM_ANALISE",
  "notes": "Iniciando análise do pedido"
}
```

#### Aprovar Protocolo

```http
POST /api/admin/protocols/:protocolId/approve
Authorization: Bearer {token}
Content-Type: application/json

{
  "approvalData": {
    // Dados específicos da aprovação
    "dataAgendada": "2025-02-20",
    "horario": "10:00",
    "local": "UBS Centro"
  },
  "notes": "Consulta agendada conforme disponibilidade"
}
```

#### Rejeitar Protocolo

```http
POST /api/admin/protocols/:protocolId/reject
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "Documentação incompleta",
  "details": "Falta comprovante de residência atualizado"
}
```

### Gerenciamento de Serviços

#### Listar Serviços da Secretaria

```http
GET /api/admin/services
Authorization: Bearer {token}
```

#### Criar Serviço

```http
POST /api/admin/services
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Agendamento de Consulta - UBS Centro",
  "description": "Agende consultas na UBS Centro",
  "templateId": "template-id", // Opcional
  "moduleType": "consulta-medica",
  "category": "SAUDE",
  "formSchema": {...},
  "requiresApproval": true,
  "estimatedDays": 7,
  "isActive": true
}
```

#### Atualizar Serviço

```http
PUT /api/admin/services/:serviceId
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Novo nome",
  "isActive": false
}
```

#### Desativar Serviço

```http
DELETE /api/admin/services/:serviceId
Authorization: Bearer {token}
```

### Relatórios

#### Relatório de Atendimentos

```http
GET /api/admin/reports/attendance
Authorization: Bearer {token}

Query Parameters:
  - startDate: string (ISO 8601)
  - endDate: string (ISO 8601)
  - serviceId: string (opcional)
  - status: string (opcional)
```

**Resposta:**
```json
{
  "period": {
    "start": "2025-01-01",
    "end": "2025-01-31"
  },
  "totals": {
    "created": 150,
    "approved": 120,
    "rejected": 10,
    "pending": 20
  },
  "byService": [
    {
      "serviceName": "Consulta Médica",
      "count": 80
    }
  ],
  "byStatus": {...},
  "averageResponseTime": 3.5
}
```

#### Relatório de Performance

```http
GET /api/admin/reports/performance
Authorization: Bearer {token}

Query Parameters:
  - startDate: string
  - endDate: string
```

---

## Endpoints de Secretarias

Cada secretaria possui endpoints específicos para seus serviços.

### Saúde

#### Consultas Médicas

```http
GET /api/secretarias/saude/consultas
Authorization: Bearer {token}

Query Parameters:
  - status: string
  - especialidade: string
  - startDate: string
  - endDate: string
```

#### Agendar Consulta (Aprovação)

```http
POST /api/secretarias/saude/consultas/:id/agendar
Authorization: Bearer {token}
Content-Type: application/json

{
  "dataAgendada": "2025-02-20",
  "horario": "10:00",
  "local": "UBS Centro",
  "medico": "Dr. João Silva",
  "sala": "Consultório 3"
}
```

#### Exames

```http
GET /api/secretarias/saude/exames
Authorization: Bearer {token}
```

#### Medicamentos

```http
GET /api/secretarias/saude/medicamentos
Authorization: Bearer {token}
```

### Educação

#### Matrículas

```http
GET /api/secretarias/educacao/matriculas
Authorization: Bearer {token}

Query Parameters:
  - status: string
  - escola: string
  - ano: number
```

#### Aprovar Matrícula

```http
POST /api/secretarias/educacao/matriculas/:id/aprovar
Authorization: Bearer {token}
Content-Type: application/json

{
  "escola": "EMEF João Silva",
  "turma": "1º Ano A",
  "turno": "MANHA",
  "dataInicio": "2025-02-01"
}
```

#### Transporte Escolar

```http
GET /api/secretarias/educacao/transporte
Authorization: Bearer {token}
```

### Assistência Social

#### Benefícios

```http
GET /api/secretarias/assistencia-social/beneficios
Authorization: Bearer {token}

Query Parameters:
  - status: string
  - tipoBeneficio: string
  - prioridade: string
```

#### Aprovar Benefício

```http
POST /api/secretarias/assistencia-social/beneficios/:id/aprovar
Authorization: Bearer {token}
Content-Type: application/json

{
  "valorMensal": 300.00,
  "dataInicio": "2025-02-01",
  "duracaoMeses": 6,
  "observacoes": "Benefício aprovado após visita domiciliar"
}
```

#### Agendar Visita

```http
POST /api/secretarias/assistencia-social/visitas
Authorization: Bearer {token}
Content-Type: application/json

{
  "beneficioId": "beneficio-id",
  "dataVisita": "2025-02-15",
  "assistenteSocial": "user-id",
  "objetivo": "Avaliação socioeconômica"
}
```

### Obras Públicas

#### Problemas de Infraestrutura

```http
GET /api/secretarias/obras-publicas/problemas
Authorization: Bearer {token}

Query Parameters:
  - gravidade: string (BAIXA, MEDIA, ALTA, CRITICA)
  - tipo: string
  - status: string
```

#### Atribuir Equipe

```http
POST /api/secretarias/obras-publicas/problemas/:id/atribuir
Authorization: Bearer {token}
Content-Type: application/json

{
  "equipe": "Equipe de Pavimentação",
  "dataPrevisaoInicio": "2025-02-10",
  "observacoes": "Material disponível"
}
```

#### Registrar Manutenção

```http
POST /api/secretarias/obras-publicas/manutencoes
Authorization: Bearer {token}
Content-Type: application/json

{
  "problemaId": "problema-id",
  "dataExecucao": "2025-02-15",
  "equipe": "Equipe 3",
  "descricao": "Reparo concluído",
  "fotos": ["url1", "url2"],
  "materiaisUtilizados": [
    { "material": "Asfalto", "quantidade": "2 ton" }
  ]
}
```

### Cultura

#### Eventos Culturais

```http
GET /api/secretarias/cultura/eventos
Authorization: Bearer {token}
```

#### Criar Evento

```http
POST /api/secretarias/cultura/eventos
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Festival de Música",
  "descricao": "Festival anual de música da cidade",
  "dataInicio": "2025-03-15",
  "dataFim": "2025-03-17",
  "local": "Praça Central",
  "publicoEstimado": 5000
}
```

#### Espaços Culturais

```http
GET /api/secretarias/cultura/espacos
Authorization: Bearer {token}
```

### Esportes

#### Inscrições em Escolinhas

```http
GET /api/secretarias/esportes/escolinhas/inscricoes
Authorization: Bearer {token}

Query Parameters:
  - modalidade: string
  - status: string
```

#### Reservas de Espaços

```http
GET /api/secretarias/esportes/reservas
Authorization: Bearer {token}

Query Parameters:
  - espacoId: string
  - data: string
  - status: string
```

### Habitação

#### Inscrições MCMV

```http
GET /api/secretarias/habitacao/mcmv/inscricoes
Authorization: Bearer {token}
```

#### Regularização Fundiária

```http
GET /api/secretarias/habitacao/regularizacao
Authorization: Bearer {token}
```

### Meio Ambiente

#### Licenças Ambientais

```http
GET /api/secretarias/meio-ambiente/licencas
Authorization: Bearer {token}

Query Parameters:
  - tipo: string
  - status: string
```

#### Denúncias Ambientais

```http
GET /api/secretarias/meio-ambiente/denuncias
Authorization: Bearer {token}
```

### Agricultura

#### Distribuição de Sementes

```http
GET /api/secretarias/agricultura/sementes
Authorization: Bearer {token}
```

### Planejamento Urbano

#### Alvarás

```http
GET /api/secretarias/planejamento-urbano/alvaras
Authorization: Bearer {token}

Query Parameters:
  - tipo: string
  - status: string
```

#### Certidões

```http
GET /api/secretarias/planejamento-urbano/certidoes
Authorization: Bearer {token}
```

### Segurança Pública

#### Ocorrências

```http
GET /api/secretarias/seguranca-publica/ocorrencias
Authorization: Bearer {token}

Query Parameters:
  - tipo: string
  - gravidade: string
  - dataInicio: string
  - dataFim: string
```

#### Registrar Ronda

```http
POST /api/secretarias/seguranca-publica/rondas
Authorization: Bearer {token}
Content-Type: application/json

{
  "data": "2025-01-28",
  "turno": "NOTURNO",
  "equipe": "Equipe 2",
  "roteiro": "Centro, Bairro A, Bairro B",
  "ocorrencias": "Nenhuma ocorrência registrada",
  "kmsPercorridos": 45
}
```

---

## Endpoints de Serviços e Templates

### Templates de Serviços

#### Listar Templates

```http
GET /api/admin/service-templates
Authorization: Bearer {token}

Query Parameters:
  - category: string
  - search: string
  - isActive: boolean
```

#### Detalhes do Template

```http
GET /api/admin/service-templates/:templateId
Authorization: Bearer {token}
```

#### Criar Template

```http
POST /api/admin/service-templates
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Agendamento de Consulta Médica",
  "slug": "consulta-medica",
  "description": "Template para agendamento de consultas",
  "category": "SAUDE",
  "moduleType": "consulta-medica",
  "formSchema": {...},
  "requiredDocuments": ["Cartão SUS", "RG"],
  "requiresApproval": true,
  "estimatedDays": 7,
  "isPublic": true,
  "isActive": true,
  "icon": "🏥",
  "color": "#10B981"
}
```

#### Atualizar Template

```http
PUT /api/admin/service-templates/:templateId
Authorization: Bearer {token}
Content-Type: application/json

{
  "formSchema": {...},
  "version": 2
}
```

#### Criar Serviço a partir de Template

```http
POST /api/admin/service-templates/:templateId/create-service
Authorization: Bearer {token}
Content-Type: application/json

{
  "departmentId": "dept-id",
  "customizations": {
    "name": "Consultas UBS Centro",
    "formSchema": {
      // Customizações no schema
    }
  }
}
```

### Módulos Customizados

#### Listar Módulos Customizados

```http
GET /api/admin/custom-modules
Authorization: Bearer {token}

Query Parameters:
  - departmentId: string
  - category: string
```

#### Criar Módulo Customizado

```http
POST /api/admin/custom-modules
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Autorização para Evento",
  "description": "Autorização para eventos culturais",
  "category": "CULTURA",
  "departmentId": "dept-id",
  "formSchema": {...},
  "validationRules": {...},
  "workflowConfig": {...},
  "isActive": true
}
```

#### Atualizar Módulo Customizado

```http
PUT /api/admin/custom-modules/:moduleId
Authorization: Bearer {token}
Content-Type: application/json

{
  "formSchema": {...}
}
```

#### Desativar Módulo Customizado

```http
PATCH /api/admin/custom-modules/:moduleId/deactivate
Authorization: Bearer {token}
```

---

## Endpoints Públicos

Endpoints que não requerem autenticação.

### Informações do Município

```http
GET /api/public/municipality/:tenantId
```

**Resposta:**
```json
{
  "name": "Prefeitura de São Paulo",
  "logo": "https://...",
  "services": {
    "total": 45,
    "categories": [...]
  },
  "contact": {
    "phone": "11 3333-4444",
    "email": "contato@prefeitura.sp.gov.br",
    "address": "..."
  }
}
```

### Consultar Protocolo

```http
GET /api/public/protocols/:protocolNumber

Query Parameters:
  - cpf: string (últimos 4 dígitos)
```

**Resposta:**
```json
{
  "protocol": "2025010001",
  "status": "EM_ANALISE",
  "service": "Agendamento de Consulta Médica",
  "createdAt": "2025-01-28T10:00:00Z",
  "estimatedCompletion": "2025-02-04",
  "timeline": [
    {
      "status": "CRIADO",
      "date": "2025-01-28T10:00:00Z"
    },
    {
      "status": "EM_ANALISE",
      "date": "2025-01-28T14:30:00Z"
    }
  ]
}
```

### Categorias de Serviços

```http
GET /api/public/categories
```

---

## Códigos de Status

### HTTP Status Codes

- `200 OK` - Requisição bem-sucedida
- `201 Created` - Recurso criado com sucesso
- `204 No Content` - Sucesso sem conteúdo de retorno
- `400 Bad Request` - Requisição inválida
- `401 Unauthorized` - Não autenticado
- `403 Forbidden` - Sem permissão
- `404 Not Found` - Recurso não encontrado
- `422 Unprocessable Entity` - Validação falhou
- `429 Too Many Requests` - Rate limit excedido
- `500 Internal Server Error` - Erro no servidor

### Status de Protocolo

- `PENDENTE` - Aguardando análise
- `EM_ANALISE` - Sendo analisado
- `AGUARDANDO_DOCUMENTOS` - Falta documentação
- `AGUARDANDO_APROVACAO` - Aguardando aprovação superior
- `APROVADO` - Aprovado
- `REJEITADO` - Rejeitado
- `CANCELADO` - Cancelado pelo cidadão
- `CONCLUIDO` - Atendimento concluído

---

## Exemplos de Integração

### JavaScript/TypeScript

```typescript
class DigiUrbanAPI {
  private baseURL = 'https://api.digiurban.com.br';
  private token: string;

  async login(email: string, password: string) {
    const response = await fetch(`${this.baseURL}/api/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    this.token = data.token;
    return data;
  }

  async getProtocols(filters?: any) {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${this.baseURL}/api/admin/protocols?${params}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });

    return response.json();
  }

  async approveProtocol(protocolId: string, approvalData: any) {
    const response = await fetch(
      `${this.baseURL}/api/admin/protocols/${protocolId}/approve`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(approvalData)
      }
    );

    return response.json();
  }
}

// Uso
const api = new DigiUrbanAPI();
await api.login('admin@prefeitura.gov.br', 'senha123');

const protocols = await api.getProtocols({
  status: 'PENDENTE',
  page: 1,
  limit: 20
});

await api.approveProtocol('protocol-id', {
  approvalData: {
    dataAgendada: '2025-02-20',
    horario: '10:00'
  }
});
```

### Python

```python
import requests
from typing import Dict, Optional

class DigiUrbanAPI:
    def __init__(self, base_url: str = 'https://api.digiurban.com.br'):
        self.base_url = base_url
        self.token: Optional[str] = None

    def login(self, email: str, password: str) -> Dict:
        response = requests.post(
            f'{self.base_url}/api/admin/auth/login',
            json={'email': email, 'password': password}
        )
        data = response.json()
        self.token = data['token']
        return data

    def _headers(self) -> Dict:
        return {
            'Authorization': f'Bearer {self.token}',
            'Content-Type': 'application/json'
        }

    def get_protocols(self, **filters) -> Dict:
        response = requests.get(
            f'{self.base_url}/api/admin/protocols',
            headers=self._headers(),
            params=filters
        )
        return response.json()

    def approve_protocol(self, protocol_id: str, approval_data: Dict) -> Dict:
        response = requests.post(
            f'{self.base_url}/api/admin/protocols/{protocol_id}/approve',
            headers=self._headers(),
            json=approval_data
        )
        return response.json()

# Uso
api = DigiUrbanAPI()
api.login('admin@prefeitura.gov.br', 'senha123')

protocols = api.get_protocols(status='PENDENTE', page=1, limit=20)

api.approve_protocol('protocol-id', {
    'approvalData': {
        'dataAgendada': '2025-02-20',
        'horario': '10:00'
    }
})
```

### PHP

```php
<?php

class DigiUrbanAPI {
    private $baseURL = 'https://api.digiurban.com.br';
    private $token;

    public function login($email, $password) {
        $ch = curl_init($this->baseURL . '/api/admin/auth/login');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            'email' => $email,
            'password' => $password
        ]));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json'
        ]);

        $response = curl_exec($ch);
        curl_close($ch);

        $data = json_decode($response, true);
        $this->token = $data['token'];
        return $data;
    }

    public function getProtocols($filters = []) {
        $url = $this->baseURL . '/api/admin/protocols?' . http_build_query($filters);

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $this->token
        ]);

        $response = curl_exec($ch);
        curl_close($ch);

        return json_decode($response, true);
    }

    public function approveProtocol($protocolId, $approvalData) {
        $url = $this->baseURL . '/api/admin/protocols/' . $protocolId . '/approve';

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($approvalData));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $this->token,
            'Content-Type: application/json'
        ]);

        $response = curl_exec($ch);
        curl_close($ch);

        return json_decode($response, true);
    }
}

// Uso
$api = new DigiUrbanAPI();
$api->login('admin@prefeitura.gov.br', 'senha123');

$protocols = $api->getProtocols(['status' => 'PENDENTE']);

$api->approveProtocol('protocol-id', [
    'approvalData' => [
        'dataAgendada' => '2025-02-20',
        'horario' => '10:00'
    ]
]);
```

---

## Rate Limiting

A API possui limites de requisição para evitar sobrecarga:

- **Cidadãos**: 100 requisições/minuto
- **Administradores**: 300 requisições/minuto
- **Integrações**: 1000 requisições/minuto

Headers de resposta:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1643385600
```

---

## Webhooks

Configure webhooks para receber notificações de eventos:

### Eventos Disponíveis

- `protocol.created` - Novo protocolo criado
- `protocol.updated` - Protocolo atualizado
- `protocol.approved` - Protocolo aprovado
- `protocol.rejected` - Protocolo rejeitado
- `protocol.cancelled` - Protocolo cancelado

### Configurar Webhook

```http
POST /api/admin/webhooks
Authorization: Bearer {token}
Content-Type: application/json

{
  "url": "https://seu-sistema.com/webhook",
  "events": ["protocol.created", "protocol.approved"],
  "secret": "seu-secret-para-validacao"
}
```

### Payload do Webhook

```json
{
  "event": "protocol.approved",
  "timestamp": "2025-01-28T15:30:00Z",
  "data": {
    "protocolId": "protocol-id",
    "protocolNumber": "2025010001",
    "status": "APROVADO",
    "citizen": {...},
    "service": {...}
  }
}
```

---

## Suporte

Dúvidas sobre a API?

- **Documentação Técnica**: [MODULE_HANDLERS.md](./MODULE_HANDLERS.md)
- **Exemplos**: [CUSTOM_MODULES.md](./CUSTOM_MODULES.md)
- **Suporte**: api@digiurban.com.br
- **Status da API**: https://status.digiurban.com.br

---

## Changelog

### v1.0.0 (2025-01-28)
- Lançamento inicial da API
- Endpoints de cidadão, administração e secretarias
- Sistema de templates e módulos customizados
- Autenticação JWT
- Rate limiting
- Webhooks
