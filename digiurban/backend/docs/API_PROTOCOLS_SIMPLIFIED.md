# API de Protocolos - Vers\u00e3o Simplificada

## Base URL
```
http://localhost:3000/api/protocols-simplified
```

## Autentica\u00e7\u00e3o
Todas as rotas requerem um token JWT no header:
```
Authorization: Bearer {token}
```

---

## Endpoints

### 1. Criar Protocolo

**POST** `/`

Cria um novo protocolo no sistema.

#### Request Body
```json
{
  "title": "Solicita\u00e7\u00e3o de Matr\u00edcula Escolar",
  "description": "Solicita\u00e7\u00e3o de matr\u00edcula para o ano letivo 2025",
  "citizenId": "clx123abc",
  "serviceId": "clx456def",
  "priority": 3,
  "formData": {
    "nomeAluno": "Jo\u00e3o Silva",
    "dataNascimento": "2015-05-10",
    "escola": "Escola Municipal do Centro"
  },
  "latitude": -23.550520,
  "longitude": -46.633309,
  "address": "Rua das Flores, 123",
  "createdById": "clx789ghi"
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "clx999jkl",
    "number": "PROT-20251029-00001",
    "title": "Solicita\u00e7\u00e3o de Matr\u00edcula Escolar",
    "status": "VINCULADO",
    "serviceType": "COM_DADOS",
    "moduleType": "MATRICULA_ALUNO",
    "createdAt": "2025-10-29T10:00:00.000Z",
    ...
  },
  "message": "Protocolo PROT-20251029-00001 criado com sucesso"
}
```

---

### 2. Buscar Protocolo por N\u00famero

**GET** `/:number`

Busca um protocolo espec\u00edfico pelo n\u00famero.

#### Exemplo
```
GET /PROT-20251029-00001
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "clx999jkl",
    "number": "PROT-20251029-00001",
    "title": "Solicita\u00e7\u00e3o de Matr\u00edcula Escolar",
    "description": "Solicita\u00e7\u00e3o de matr\u00edcula para o ano letivo 2025",
    "status": "VINCULADO",
    "priority": 3,
    "citizen": {
      "id": "clx123abc",
      "name": "Maria Silva",
      "cpf": "123.456.789-00"
    },
    "service": {
      "id": "clx456def",
      "name": "Matr\u00edcula de Aluno",
      "serviceType": "COM_DADOS",
      "moduleType": "MATRICULA_ALUNO"
    },
    "history": [...],
    "evaluations": []
  }
}
```

---

### 3. Atualizar Status

**PATCH** `/:id/status`

Atualiza o status de um protocolo.

#### Request Body
```json
{
  "status": "PROGRESSO",
  "comment": "Documenta\u00e7\u00e3o em an\u00e1lise",
  "userId": "clx789ghi"
}
```

#### Status Dispon\u00edveis
- `VINCULADO` - Protocolo criado
- `PROGRESSO` - Em andamento
- `ATUALIZACAO` - Aguardando atualiza\u00e7\u00e3o
- `PENDENCIA` - Com pend\u00eancia
- `CONCLUIDO` - Finalizado
- `CANCELADO` - Cancelado

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "clx999jkl",
    "status": "PROGRESSO",
    ...
  },
  "message": "Status atualizado com sucesso"
}
```

---

### 4. Adicionar Coment\u00e1rio

**POST** `/:id/comments`

Adiciona um coment\u00e1rio ao hist\u00f3rico do protocolo.

#### Request Body
```json
{
  "comment": "Solicita\u00e7\u00e3o de documentos adicionais enviada ao respons\u00e1vel",
  "userId": "clx789ghi"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Coment\u00e1rio adicionado com sucesso"
}
```

---

### 5. Atribuir Protocolo

**PATCH** `/:id/assign`

Atribui o protocolo a um usu\u00e1rio espec\u00edfico.

#### Request Body
```json
{
  "assignedUserId": "clxabc123",
  "userId": "clx789ghi"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "clx999jkl",
    "assignedUserId": "clxabc123",
    ...
  },
  "message": "Protocolo atribu\u00eddo com sucesso"
}
```

---

### 6. Listar por Departamento

**GET** `/department/:departmentId`

Lista todos os protocolos de um departamento.

#### Query Parameters
- `status` (opcional): Filtrar por status
- `moduleType` (opcional): Filtrar por tipo de m\u00f3dulo
- `citizenId` (opcional): Filtrar por cidad\u00e3o
- `assignedUserId` (opcional): Filtrar por respons\u00e1vel

#### Exemplo
```
GET /department/clx456def?status=VINCULADO&moduleType=MATRICULA_ALUNO
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "clx999jkl",
      "number": "PROT-20251029-00001",
      "title": "Solicita\u00e7\u00e3o de Matr\u00edcula Escolar",
      "status": "VINCULADO",
      "citizen": {...},
      "service": {...},
      "assignedUser": {...}
    }
  ],
  "count": 1
}
```

---

### 7. Listar por M\u00f3dulo

**GET** `/module/:departmentId/:moduleType`

Lista protocolos de um m\u00f3dulo espec\u00edfico.

#### Exemplo
```
GET /module/clx456def/MATRICULA_ALUNO
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": [...],
  "count": 5
}
```

---

### 8. Listar por Cidad\u00e3o

**GET** `/citizen/:citizenId`

Lista todos os protocolos de um cidad\u00e3o.

#### Exemplo
```
GET /citizen/clx123abc
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "clx999jkl",
      "number": "PROT-20251029-00001",
      "title": "Solicita\u00e7\u00e3o de Matr\u00edcula Escolar",
      "status": "VINCULADO",
      "service": {
        "id": "clx456def",
        "name": "Matr\u00edcula de Aluno",
        "department": {
          "id": "clxdep123",
          "name": "Secretaria de Educa\u00e7\u00e3o"
        }
      },
      "history": [...]
    }
  ],
  "count": 3
}
```

---

### 9. Obter Hist\u00f3rico

**GET** `/:id/history`

Retorna o hist\u00f3rico completo de um protocolo.

#### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "clxhis001",
      "protocolId": "clx999jkl",
      "action": "STATUS_ALTERADO",
      "oldStatus": "VINCULADO",
      "newStatus": "PROGRESSO",
      "comment": "Documenta\u00e7\u00e3o em an\u00e1lise",
      "timestamp": "2025-10-29T14:30:00.000Z",
      "userId": "clx789ghi"
    },
    {
      "id": "clxhis002",
      "protocolId": "clx999jkl",
      "action": "CRIADO",
      "newStatus": "VINCULADO",
      "timestamp": "2025-10-29T10:00:00.000Z"
    }
  ]
}
```

---

### 10. Avaliar Protocolo

**POST** `/:id/evaluate`

Registra avalia\u00e7\u00e3o do cidad\u00e3o sobre o atendimento.

**Nota:** Apenas protocolos com status `CONCLUIDO` podem ser avaliados.

#### Request Body
```json
{
  "rating": 5,
  "comment": "\u00d3timo atendimento, muito eficiente!",
  "wouldRecommend": true
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "clxeval001",
    "protocolId": "clx999jkl",
    "rating": 5,
    "comment": "\u00d3timo atendimento, muito eficiente!",
    "wouldRecommend": true,
    "createdAt": "2025-10-29T16:00:00.000Z"
  },
  "message": "Avalia\u00e7\u00e3o registrada com sucesso"
}
```

---

### 11. Estat\u00edsticas

**GET** `/stats/:departmentId`

Obt\u00e9m estat\u00edsticas de protocolos por departamento.

#### Query Parameters
- `startDate` (opcional): Data inicial (ISO string)
- `endDate` (opcional): Data final (ISO string)

#### Exemplo
```
GET /stats/clx456def?startDate=2025-10-01&endDate=2025-10-31
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "total": 156,
    "byStatus": [
      {
        "status": "VINCULADO",
        "_count": 45
      },
      {
        "status": "PROGRESSO",
        "_count": 67
      },
      {
        "status": "CONCLUIDO",
        "_count": 40
      },
      {
        "status": "CANCELADO",
        "_count": 4
      }
    ],
    "byModule": [
      {
        "moduleType": "MATRICULA_ALUNO",
        "_count": 89
      },
      {
        "moduleType": "TRANSPORTE_ESCOLAR",
        "_count": 45
      },
      {
        "moduleType": "SOLICITACAO_DOCUMENTO_ESCOLAR",
        "_count": 22
      }
    ]
  }
}
```

---

## C\u00f3digos de Status HTTP

- `200 OK` - Requisi\u00e7\u00e3o bem-sucedida
- `201 Created` - Recurso criado com sucesso
- `400 Bad Request` - Dados inv\u00e1lidos na requisi\u00e7\u00e3o
- `401 Unauthorized` - Token ausente ou inv\u00e1lido
- `404 Not Found` - Recurso n\u00e3o encontrado
- `500 Internal Server Error` - Erro no servidor

---

## Exemplo de Fluxo Completo

### 1. Cidad\u00e3o cria protocolo
```bash
POST /api/protocols-simplified
{
  "title": "Matr\u00edcula Escolar",
  "citizenId": "citizen123",
  "serviceId": "service456",
  "formData": { "nomeAluno": "Jo\u00e3o", "dataNascimento": "2015-05-10" }
}
# Retorna: PROT-20251029-00001
```

### 2. Atendente atribui a si mesmo
```bash
PATCH /api/protocols-simplified/protocol-id/assign
{
  "assignedUserId": "user789"
}
```

### 3. Atendente atualiza status
```bash
PATCH /api/protocols-simplified/protocol-id/status
{
  "status": "PROGRESSO",
  "comment": "Documenta\u00e7\u00e3o em an\u00e1lise"
}
```

### 4. Atendente adiciona coment\u00e1rio
```bash
POST /api/protocols-simplified/protocol-id/comments
{
  "comment": "Aguardando comprovante de resid\u00eancia"
}
```

### 5. Atendente finaliza
```bash
PATCH /api/protocols-simplified/protocol-id/status
{
  "status": "CONCLUIDO",
  "comment": "Matr\u00edcula realizada com sucesso"
}
```

### 6. Cidad\u00e3o avalia
```bash
POST /api/protocols-simplified/protocol-id/evaluate
{
  "rating": 5,
  "comment": "\u00d3timo atendimento!"
}
```

---

## Integra\u00e7\u00e3o com Front-end

### Exemplo React/TypeScript

```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api/protocols-simplified',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})

// Criar protocolo
async function createProtocol(data) {
  const response = await api.post('/', data)
  return response.data
}

// Buscar protocolos do cidad\u00e3o
async function getCitizenProtocols(citizenId) {
  const response = await api.get(`/citizen/${citizenId}`)
  return response.data
}

// Atualizar status
async function updateStatus(protocolId, status, comment) {
  const response = await api.patch(`/${protocolId}/status`, {
    status,
    comment
  })
  return response.data
}
```

---

## Observa\u00e7\u00f5es Importantes

1. **Servi\u00e7os INFORMATIVOS**: N\u00e3o geram dados estruturados (moduleType = null)
2. **Servi\u00e7os COM_DADOS**: Geram dados que s\u00e3o roteados para m\u00f3dulos espec\u00edficos
3. **N\u00famero do Protocolo**: Gerado automaticamente no formato `PROT-YYYYMMDD-XXXXX`
4. **Hist\u00f3rico**: Todas as a\u00e7\u00f5es s\u00e3o registradas automaticamente
5. **Avalia\u00e7\u00e3o**: Apenas para protocolos conclu\u00eddos

---

## Suporte

Para d\u00favidas ou problemas, consulte a documenta\u00e7\u00e3o completa do projeto ou abra uma issue no reposit\u00f3rio.
