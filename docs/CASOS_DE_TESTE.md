# Casos de Teste - Sistema de Serviços DigiUrban

**Data:** 27 de Outubro de 2025
**Versão:** 1.0
**Framework:** Gherkin (BDD)

---

## Sumário

1. [Funcionalidade: Criação de Serviços pelo Admin](#feature-1)
2. [Funcionalidade: Solicitação de Serviços pelo Cidadão](#feature-2)
3. [Funcionalidade: Integração com Secretarias](#feature-3)
4. [Funcionalidade: Rastreamento de Protocolos](#feature-4)
5. [Funcionalidade: Tipagem de Serviços](#feature-5)
6. [Funcionalidade: Numeração de Protocolos](#feature-6)
7. [Testes de Segurança](#security-tests)
8. [Testes de Performance](#performance-tests)
9. [Casos de Borda e Edge Cases](#edge-cases)

---

<a name="feature-1"></a>
## 1. Funcionalidade: Criação de Serviços pelo Admin

### Cenário 1.1: Criar serviço com dados básicos

```gherkin
Feature: Criação de Serviços
  Como admin da prefeitura
  Eu quero criar novos serviços
  Para que os cidadãos possam solicitá-los

  Background:
    Given estou autenticado como "admin@prefeitura.com" com tenant "pmsp"
    And acesso a página "/admin/servicos/novo"

  Scenario: Criar serviço básico com sucesso
    When preencho o campo "Nome" com "Poda de Árvores"
    And preencho o campo "Descrição" com "Serviço de poda e manutenção de árvores"
    And seleciono a secretaria "Meio Ambiente"
    And seleciono a categoria "Manutenção Urbana"
    And clico em "Avançar"
    And clico em "Criar Serviço"
    Then vejo a mensagem "Serviço criado com sucesso"
    And sou redirecionado para "/admin/servicos"
    And vejo "Poda de Árvores" na listagem de serviços
    And no banco de dados existe:
      | Tabela  | Campo       | Valor                  |
      | Service | name        | Poda de Árvores        |
      | Service | description | Serviço de poda...     |
      | Service | tenantId    | pmsp                   |
      | Service | isActive    | true                   |

  Scenario: Validar campos obrigatórios
    When deixo o campo "Nome" vazio
    And clico em "Avançar"
    Then vejo a mensagem de erro "Nome é obrigatório"
    And o botão "Avançar" está desabilitado

  Scenario: Nome duplicado no mesmo tenant
    Given existe um serviço "Coleta de Lixo" no tenant "pmsp"
    When preencho o campo "Nome" com "Coleta de Lixo"
    And clico em "Criar Serviço"
    Then vejo a mensagem de erro "Já existe um serviço com este nome"
    And o serviço não é criado

  Scenario: Nome duplicado em tenant diferente (permitido)
    Given existe um serviço "Coleta de Lixo" no tenant "pmrj"
    And estou no tenant "pmsp"
    When preencho o campo "Nome" com "Coleta de Lixo"
    And clico em "Criar Serviço"
    Then vejo a mensagem "Serviço criado com sucesso"
    And existem 2 serviços com nome "Coleta de Lixo" em tenants diferentes
```

### Cenário 1.2: Criar serviço com formulário customizado

```gherkin
  Scenario: Criar serviço com custom form válido
    Given preenchi os dados básicos do serviço
    When clico em "Avançar" para "Configurações Avançadas"
    And ativo o toggle "Formulário Personalizado"
    And preencho o schema JSON:
      """
      {
        "fields": [
          {
            "id": "num_arvores",
            "type": "number",
            "label": "Número de árvores",
            "required": true
          },
          {
            "id": "endereco",
            "type": "text",
            "label": "Endereço da árvore",
            "required": true
          }
        ]
      }
      """
    And clico em "Validar Schema"
    Then vejo a mensagem "Schema válido"
    When clico em "Criar Serviço"
    Then no banco de dados existe:
      | Tabela      | Campo      | Valor          |
      | ServiceForm | serviceId  | <id do serviço> |
      | ServiceForm | formSchema | <JSON acima>    |

  Scenario: Schema JSON inválido
    Given ativo o toggle "Formulário Personalizado"
    When preencho o schema JSON:
      """
      {
        "fields": [
          {
            "id": "",  // ID vazio (inválido)
            "type": "invalid_type"
          }
        ]
      }
      """
    And clico em "Validar Schema"
    Then vejo a mensagem de erro "Schema inválido: campo 'id' não pode ser vazio"
    And o botão "Criar Serviço" está desabilitado

  Scenario: Schema JSON com sintaxe incorreta
    Given ativo o toggle "Formulário Personalizado"
    When preencho o schema JSON:
      """
      {
        "fields": [
          { "id": "test" // Faltando fechar chave
      }
      """
    And clico em "Validar Schema"
    Then vejo a mensagem de erro "Erro de sintaxe JSON na linha 3"
```

### Cenário 1.3: Criar serviço com localização

```gherkin
  Scenario: Configurar área de atendimento com raio
    Given preenchi os dados básicos do serviço
    When ativo o toggle "Requer Localização"
    And clico no mapa nas coordenadas "-23.5505, -46.6333" (Sé, SP)
    And defino raio de atendimento "5km"
    And clico em "Criar Serviço"
    Then no banco de dados existe:
      | Tabela          | Campo             | Valor                    |
      | ServiceLocation | serviceId         | <id do serviço>          |
      | ServiceLocation | centerLat         | -23.5505                 |
      | ServiceLocation | centerLng         | -46.6333                 |
      | ServiceLocation | radiusKm          | 5                        |
      | ServiceLocation | restrictByLocation| true                     |

  Scenario: Configurar área de atendimento com polígono
    Given preenchi os dados básicos do serviço
    When ativo o toggle "Requer Localização"
    And desenho um polígono no mapa com vértices:
      | Latitude  | Longitude |
      | -23.5505  | -46.6333  |
      | -23.5520  | -46.6350  |
      | -23.5530  | -46.6320  |
      | -23.5510  | -46.6300  |
    And clico em "Criar Serviço"
    Then no banco de dados existe:
      | Tabela          | Campo             | Valor                      |
      | ServiceLocation | serviceId         | <id do serviço>            |
      | ServiceLocation | polygonCoords     | <array de coordenadas JSON>|
      | ServiceLocation | restrictByLocation| true                       |
```

### Cenário 1.4: Criar serviço com agendamento

```gherkin
  Scenario: Configurar horários de atendimento
    Given preenchi os dados básicos do serviço
    When ativo o toggle "Requer Agendamento"
    And configuro horários disponíveis:
      | Dia            | Horário Início | Horário Fim |
      | Segunda-feira  | 08:00          | 12:00       |
      | Segunda-feira  | 14:00          | 18:00       |
      | Quarta-feira   | 08:00          | 12:00       |
      | Sexta-feira    | 08:00          | 16:00       |
    And defino duração do atendimento como "30 minutos"
    And defino antecedência mínima "2 dias"
    And clico em "Criar Serviço"
    Then o campo "schedulingConfig" contém:
      """
      {
        "availableSlots": [
          { "day": 1, "start": "08:00", "end": "12:00" },
          { "day": 1, "start": "14:00", "end": "18:00" },
          { "day": 3, "start": "08:00", "end": "12:00" },
          { "day": 5, "start": "08:00", "end": "16:00" }
        ],
        "slotDuration": 30,
        "minAdvanceHours": 48
      }
      """
```

### Cenário 1.5: Criar serviço com todas as features (transação completa)

```gherkin
  Scenario: Criar serviço completo com 6 feature flags
    Given preenchi os dados básicos do serviço
    When ativo todas as features:
      | Feature                    |
      | Formulário Personalizado   |
      | Requer Localização         |
      | Requer Agendamento         |
      | Permite Anexos             |
      | Notificações Automáticas   |
      | Workflow Customizado       |
    And configuro cada feature corretamente
    And clico em "Criar Serviço"
    Then a requisição usa prisma.$transaction
    And no banco de dados existe:
      | Tabela              | Registros Criados |
      | Service             | 1                 |
      | ServiceForm         | 1                 |
      | ServiceLocation     | 1                 |
      | ServiceWorkflow     | 1                 |
      | ServiceNotification | 1                 |

  Scenario: Rollback se uma configuração falhar
    Given preenchi os dados básicos do serviço
    When ativo "Formulário Personalizado" com schema INVÁLIDO
    And ativo "Requer Localização" com config válida
    And clico em "Criar Serviço"
    Then a API retorna status 400
    And vejo a mensagem "Erro ao criar formulário: schema inválido"
    And no banco de dados NÃO existe:
      | Tabela          |
      | Service         |
      | ServiceLocation |
      | ServiceForm     |
    # Rollback completo garantido pela transação
```

---

<a name="feature-2"></a>
## 2. Funcionalidade: Solicitação de Serviços pelo Cidadão

### Cenário 2.1: Visualizar catálogo de serviços

```gherkin
Feature: Solicitação de Serviços pelo Cidadão
  Como cidadão
  Eu quero solicitar serviços da prefeitura
  Para resolver problemas do meu bairro

  Background:
    Given estou autenticado como "joao@email.com" (cidadão)
    And o tenant "pmsp" possui 15 serviços ativos

  Scenario: Listar serviços disponíveis
    When acesso "/cidadao/servicos"
    Then vejo 15 cards de serviços
    And cada card exibe:
      | Campo          |
      | Nome           |
      | Descrição      |
      | Ícone          |
      | Categoria      |
      | Botão Solicitar|

  Scenario: Filtrar serviços por categoria
    When acesso "/cidadao/servicos"
    And seleciono o filtro "Categoria: Manutenção Urbana"
    Then vejo apenas 5 serviços da categoria "Manutenção Urbana"

  Scenario: Buscar serviços por nome
    When acesso "/cidadao/servicos"
    And digito "poda" no campo de busca
    Then vejo apenas serviços contendo "poda" no nome ou descrição:
      | Nome             |
      | Poda de Árvores  |
      | Poda de Canteiros|

  Scenario: Serviço inativo não aparece para cidadão
    Given existe um serviço "Teste" com isActive = false
    When acesso "/cidadao/servicos"
    Then NÃO vejo o serviço "Teste" na listagem
```

### Cenário 2.2: Solicitação básica de serviço

```gherkin
  Scenario: Solicitar serviço sem features avançadas
    Given existe o serviço "Coleta de Entulho" (sem features)
    When acesso "/cidadao/servicos"
    And clico em "Solicitar" no card "Coleta de Entulho"
    Then sou redirecionado para "/cidadao/servicos/<id>/solicitar"
    And vejo o formulário de solicitação com campos:
      | Campo                 | Tipo     | Obrigatório |
      | Descrição do Problema | Textarea | Sim         |
      | Observações           | Textarea | Não         |
    When preencho "Descrição do Problema" com "Entulho acumulado na calçada"
    And clico em "Enviar Solicitação"
    Then vejo a mensagem "Protocolo <número> gerado com sucesso!"
    And sou redirecionado para "/cidadao/protocolos"
    And no banco de dados existe:
      | Tabela            | Campo            | Valor                          |
      | Protocol          | citizenId        | <id do joao>                   |
      | Protocol          | serviceId        | <id do serviço>                |
      | Protocol          | status           | ABERTO                         |
      | Protocol          | protocolNumber   | PMSP-2025-000001               |
      | AttendanceGeneric | protocolId       | <id do protocolo>              |
      | AttendanceGeneric | description      | Entulho acumulado na calçada   |

  Scenario: Validação de campos obrigatórios
    Given acesso o formulário de solicitação de "Coleta de Entulho"
    When deixo "Descrição do Problema" vazio
    And clico em "Enviar Solicitação"
    Then vejo a mensagem de erro "Descrição é obrigatória"
    And o protocolo NÃO é criado
```

### Cenário 2.3: Solicitação com localização

```gherkin
  Scenario: Solicitar serviço com localização dentro da área permitida
    Given existe o serviço "Tapa-Buraco" com:
      | hasLocation          | true                    |
      | centerLat            | -23.5505                |
      | centerLng            | -46.6333                |
      | radiusKm             | 5                       |
      | restrictByLocation   | true                    |
    When acesso o formulário de solicitação
    Then vejo o step "Localização do Problema"
    And vejo um mapa interativo centrado em "-23.5505, -46.6333"
    And vejo um círculo de raio 5km no mapa
    When clico no mapa em "-23.5520, -46.6340" (dentro do raio)
    Then o marcador é adicionado no mapa
    And vejo a mensagem "Localização dentro da área de atendimento"
    When clico em "Avançar"
    And preencho os dados básicos
    And clico em "Enviar Solicitação"
    Then o protocolo é criado com:
      | Campo       | Valor         |
      | locationLat | -23.5520      |
      | locationLng | -46.6340      |

  Scenario: Validação de localização fora da área permitida
    Given existe o serviço "Tapa-Buraco" com raio de 5km na Sé
    When clico no mapa em "-23.6505, -46.7333" (fora do raio)
    Then vejo a mensagem de erro "Localização fora da área de atendimento"
    And o marcador aparece vermelho no mapa
    And o botão "Avançar" está desabilitado

  Scenario: Autodetectar localização do usuário
    Given estou no step "Localização do Problema"
    When clico em "Usar Minha Localização"
    Then o navegador solicita permissão de geolocalização
    When permito o acesso
    Then o mapa centraliza na minha localização atual
    And um marcador é adicionado automaticamente
```

### Cenário 2.4: Solicitação com agendamento

```gherkin
  Scenario: Agendar horário disponível
    Given existe o serviço "Consulta Nutricional" com agendamento:
      """
      {
        "availableSlots": [
          { "day": 1, "start": "08:00", "end": "12:00" },
          { "day": 3, "start": "14:00", "end": "18:00" }
        ],
        "slotDuration": 30,
        "minAdvanceHours": 48
      }
      """
    And hoje é "2025-10-24" (sexta-feira)
    When acesso o formulário de solicitação
    Then vejo o step "Agendamento"
    And vejo um calendário iniciando em "2025-10-27" (daqui 2 dias + final de semana)
    And os dias disponíveis são:
      | Data       | Dia da Semana | Disponível |
      | 2025-10-27 | Segunda       | Sim        |
      | 2025-10-28 | Terça         | Não        |
      | 2025-10-29 | Quarta        | Sim        |
      | 2025-10-30 | Quinta        | Não        |
    When seleciono "2025-10-27" (segunda)
    Then vejo os horários disponíveis:
      | Horário |
      | 08:00   |
      | 08:30   |
      | 09:00   |
      | 09:30   |
      | 10:00   |
      | 10:30   |
      | 11:00   |
      | 11:30   |
    When seleciono "09:00"
    And clico em "Confirmar Agendamento"
    Then o protocolo é criado com:
      | Campo             | Valor                |
      | scheduledDate     | 2025-10-27           |
      | scheduledTime     | 09:00                |

  Scenario: Validar antecedência mínima
    Given a antecedência mínima é 48 horas
    And hoje é "2025-10-24 15:00"
    When acesso o calendário
    Then os dias antes de "2025-10-26" estão desabilitados
    And vejo tooltip "Agendamento requer 48h de antecedência"

  Scenario: Horários já reservados não aparecem
    Given existe um protocolo agendado para "2025-10-27 09:00"
    When seleciono "2025-10-27" no calendário
    Then NÃO vejo o horário "09:00" na lista
    # Apenas 7 horários aparecem (8 - 1 reservado)
```

### Cenário 2.5: Solicitação com anexos

```gherkin
  Scenario: Upload de fotos do problema
    Given existe o serviço "Iluminação Pública" com hasAttachments = true
    When acesso o formulário de solicitação
    Then vejo o step "Fotos do Problema"
    When clico em "Adicionar Foto"
    And seleciono o arquivo "poste_quebrado.jpg" (2MB, image/jpeg)
    Then vejo o preview da imagem
    And vejo "1 arquivo anexado"
    When clico em "Adicionar Foto" novamente
    And seleciono "rua_escura.jpg" (1.5MB, image/jpeg)
    Then vejo "2 arquivos anexados"
    When clico em "Enviar Solicitação"
    Then os arquivos são enviados via FormData
    And no storage existem:
      | Arquivo              | Path                                    |
      | poste_quebrado.jpg   | /uploads/pmsp/protocols/<id>/photo1.jpg|
      | rua_escura.jpg       | /uploads/pmsp/protocols/<id>/photo2.jpg|

  Scenario: Validar tipo de arquivo
    Given estou no step "Fotos do Problema"
    When seleciono o arquivo "documento.pdf" (application/pdf)
    Then vejo a mensagem de erro "Apenas imagens são permitidas (JPG, PNG, WEBP)"
    And o arquivo NÃO é adicionado

  Scenario: Validar tamanho de arquivo
    Given estou no step "Fotos do Problema"
    When seleciono o arquivo "foto_grande.jpg" (15MB)
    Then vejo a mensagem de erro "Tamanho máximo: 10MB por arquivo"
    And o arquivo NÃO é adicionado

  Scenario: Validar quantidade máxima de arquivos
    Given o limite é 5 arquivos
    And já anexei 5 fotos
    When clico em "Adicionar Foto"
    Then o botão está desabilitado
    And vejo a mensagem "Máximo de 5 arquivos atingido"
```

### Cenário 2.6: Solicitação com formulário customizado

```gherkin
  Scenario: Preencher formulário dinâmico
    Given existe o serviço "Poda de Árvores" com customForm:
      """
      {
        "fields": [
          {
            "id": "num_arvores",
            "type": "number",
            "label": "Quantas árvores?",
            "required": true,
            "min": 1,
            "max": 10
          },
          {
            "id": "tipo_poda",
            "type": "select",
            "label": "Tipo de poda",
            "required": true,
            "options": ["Leve", "Pesada", "Remoção"]
          },
          {
            "id": "endereco_arvore",
            "type": "text",
            "label": "Endereço exato",
            "required": true
          }
        ]
      }
      """
    When acesso o formulário de solicitação
    Then vejo o step "Informações Específicas"
    And vejo os campos dinâmicos:
      | Campo             | Tipo   |
      | Quantas árvores?  | Number |
      | Tipo de poda      | Select |
      | Endereço exato    | Text   |
    When preencho:
      | Campo             | Valor                  |
      | num_arvores       | 3                      |
      | tipo_poda         | Pesada                 |
      | endereco_arvore   | Rua das Flores, 123    |
    And clico em "Enviar Solicitação"
    Then o protocolo é criado
    And o campo customFormData contém:
      """
      {
        "num_arvores": 3,
        "tipo_poda": "Pesada",
        "endereco_arvore": "Rua das Flores, 123"
      }
      """

  Scenario: Validação de campos dinâmicos
    Given o campo "num_arvores" tem min: 1, max: 10
    When preencho "num_arvores" com "15"
    And clico em "Avançar"
    Then vejo a mensagem de erro "Valor deve estar entre 1 e 10"
```

---

<a name="feature-3"></a>
## 3. Funcionalidade: Integração com Secretarias

### Cenário 3.1: Secretaria de Saúde

```gherkin
Feature: Integração com Secretaria de Saúde
  Como atendente da secretaria de saúde
  Eu quero criar atendimentos que geram protocolos
  Para rastrear todas solicitações no sistema único

  Scenario: Criar atendimento de saúde via solicitação de serviço
    Given existe o serviço "Consulta Médica" vinculado à secretaria "Saúde"
    And um cidadão solicita este serviço com dados:
      | Campo           | Valor                |
      | patientName     | Maria Silva          |
      | symptoms        | Febre e dor de cabeça|
      | scheduledDate   | 2025-10-30           |
    When o sistema processa a solicitação
    Then em UMA TRANSAÇÃO são criados:
      | Tabela           | Dados                                    |
      | Protocol         | status=ABERTO, serviceId=<id>            |
      | AttendanceHealth | protocolId=<id>, patientName=Maria Silva |
    And o protocolo gerado é "PMSP-2025-000001"

  Scenario: Criar atendimento de saúde manualmente pelo admin
    Given estou autenticado como admin da secretaria "Saúde"
    When acesso "/admin/secretarias/saude"
    And clico em "Novo Atendimento"
    And preencho:
      | Campo           | Valor                |
      | patientName     | João Santos          |
      | cpf             | 123.456.789-00       |
      | symptoms        | Dor abdominal        |
      | attendanceType  | URGENCIA             |
    And clico em "Criar Atendimento"
    Then a API chama:
      ```
      POST /admin/secretarias/saude
      {
        "patientName": "João Santos",
        "cpf": "12345678900",
        "symptoms": "Dor abdominal",
        "attendanceType": "URGENCIA"
      }
      ```
    And o backend cria Protocol + AttendanceHealth em transação
    And retorna:
      ```json
      {
        "protocol": {
          "id": 1,
          "protocolNumber": "PMSP-2025-000001",
          "status": "ABERTO"
        },
        "attendance": {
          "id": 1,
          "protocolId": 1,
          "patientName": "João Santos",
          "symptoms": "Dor abdominal"
        }
      }
      ```

  Scenario: Visualizar dados completos do atendimento de saúde
    Given existe um protocolo de saúde com:
      | Protocol          | AttendanceHealth        |
      | protocolNumber: 001| patientName: Maria Silva|
      | status: ABERTO     | symptoms: Febre         |
    When acesso "/admin/protocolos/1"
    Then vejo os dados gerais do protocolo
    And vejo a aba "Dados de Saúde"
    When clico na aba "Dados de Saúde"
    Then vejo:
      | Campo            | Valor        |
      | Nome do Paciente | Maria Silva  |
      | Sintomas         | Febre        |
```

### Cenário 3.2: Secretaria de Educação

```gherkin
Feature: Integração com Secretaria de Educação

  Scenario: Criar matrícula escolar via serviço
    Given existe o serviço "Matrícula Escolar" vinculado à "Educação"
    When um cidadão solicita com dados:
      | Campo        | Valor                    |
      | studentName  | Pedro Oliveira           |
      | birthDate    | 2015-03-15               |
      | schoolName   | EMEF João Paulo II       |
      | grade        | 4º Ano                   |
    Then são criados Protocol + AttendanceEducation
    And AttendanceEducation contém:
      | Campo        | Valor                    |
      | studentName  | Pedro Oliveira           |
      | birthDate    | 2015-03-15               |
      | schoolName   | EMEF João Paulo II       |
      | grade        | 4º Ano                   |
```

### Cenário 3.3: Secretaria de Habitação

```gherkin
Feature: Integração com Secretaria de Habitação

  Scenario: Solicitar vistoria de imóvel
    Given existe o serviço "Vistoria de Imóvel" vinculado à "Habitação"
    When um cidadão solicita com dados:
      | Campo         | Valor                     |
      | address       | Rua das Palmeiras, 456    |
      | housingType   | APARTAMENTO               |
      | issueType     | INFILTRACAO               |
      | urgency       | ALTA                      |
    Then são criados Protocol + AttendanceHousing
    And AttendanceHousing.issueType = "INFILTRACAO"
```

### Cenário 3.4: Validar integridade referencial (FK)

```gherkin
  Scenario: FK protocolId garante consistência
    Given existe um Protocol com id = 100
    When tento criar AttendanceHealth com protocolId = 999 (não existe)
    Then o banco de dados rejeita com erro:
      """
      FOREIGN KEY constraint failed: protocolId references Protocol(id)
      """
    And AttendanceHealth NÃO é criado

  Scenario: Deletar Protocol em cascata deleta Attendances
    Given existe Protocol id=1 com AttendanceHealth vinculado
    When deleto o Protocol
    Then AttendanceHealth também é deletado (ON DELETE CASCADE)
    # OU retorna erro se ON DELETE RESTRICT
```

### Cenário 3.5: Rollback se criação de Attendance falhar

```gherkin
  Scenario: Transação garante atomicidade
    Given a rota usa prisma.$transaction
    When POST /admin/secretarias/saude com dados válidos
    But a criação de AttendanceHealth falha (ex: campo obrigatório faltando)
    Then o Protocol criado anteriormente é revertido (rollback)
    And o banco fica sem registros inconsistentes
    And a API retorna status 500 com mensagem de erro
```

---

<a name="feature-4"></a>
## 4. Funcionalidade: Rastreamento de Protocolos

### Cenário 4.1: Ciclo de vida do protocolo

```gherkin
Feature: Rastreamento de Protocolos
  Como admin
  Eu quero atualizar o status dos protocolos
  Para acompanhar o andamento dos atendimentos

  Scenario: Alterar status para EM_ANDAMENTO
    Given existe um protocolo com status "ABERTO"
    When acesso "/admin/protocolos/1"
    And altero o status para "EM_ANDAMENTO"
    And clico em "Salvar"
    Then a API chama PATCH /protocols/1 com { status: "EM_ANDAMENTO" }
    And no banco de dados:
      | Campo      | Valor Antes | Valor Depois   |
      | status     | ABERTO      | EM_ANDAMENTO   |
      | updatedAt  | <data1>     | <data2 > data1>|
      | concludedAt| null        | null           |

  Scenario: Concluir protocolo
    Given existe um protocolo com status "EM_ANDAMENTO"
    When altero o status para "CONCLUIDO"
    And clico em "Salvar"
    Then no banco de dados:
      | Campo       | Valor                    |
      | status      | CONCLUIDO                |
      | concludedAt | 2025-10-27T14:30:00.000Z |
    And concludedAt é a data/hora EXATA da atualização

  Scenario: Reabrir protocolo concluído
    Given existe um protocolo com:
      | status      | CONCLUIDO                |
      | concludedAt | 2025-10-25T10:00:00.000Z |
    When altero o status para "ABERTO"
    Then no banco de dados:
      | Campo       | Valor |
      | status      | ABERTO|
      | concludedAt | null  |

  Scenario: Cancelar protocolo
    Given existe um protocolo com status "ABERTO"
    When altero o status para "CANCELADO"
    Then no banco de dados:
      | Campo       | Valor                    |
      | status      | CANCELADO                |
      | concludedAt | 2025-10-27T14:30:00.000Z |
    # CANCELADO também seta concludedAt
```

### Cenário 4.2: Cálculo de SLA

```gherkin
  Scenario: Calcular tempo de resolução em dias úteis
    Given um protocolo foi criado em "2025-10-24 09:00" (sexta)
    And foi concluído em "2025-10-27 15:00" (segunda)
    When calculo o SLA
    Then o tempo de resolução é "1 dia útil"
    # Sexta → Segunda (pula sábado e domingo)

  Scenario: Calcular tempo de resolução em dias corridos
    Given um protocolo foi criado em "2025-10-24 09:00"
    And foi concluído em "2025-10-27 15:00"
    When calculo o SLA em dias corridos
    Then o tempo de resolução é "3 dias corridos"

  Scenario: Protocolo atrasado (SLA expirado)
    Given o serviço tem SLA de "2 dias úteis"
    And um protocolo foi criado em "2025-10-24 09:00"
    And hoje é "2025-10-28" (segunda - 2 dias úteis depois)
    And o protocolo ainda está "EM_ANDAMENTO"
    When acesso "/admin/protocolos"
    Then vejo o protocolo marcado como "ATRASADO" (badge vermelho)
```

### Cenário 4.3: Atribuição de protocolos

```gherkin
  Scenario: Atribuir protocolo a um agente
    Given existe um protocolo não atribuído
    And existe um usuário "agente@saude.com" com role AGENT
    When atribuo o protocolo ao agente
    Then no banco de dados:
      | Campo        | Valor              |
      | assignedToId | <id do agente>     |
      | assignedAt   | 2025-10-27T14:30Z  |

  Scenario: Reatribuir protocolo
    Given um protocolo está atribuído ao "agente1@email.com"
    When reatribuo para "agente2@email.com"
    Then o histórico registra:
      | Ação                | Data/Hora | Responsável |
      | Atribuído a agente1 | 14:00     | admin       |
      | Atribuído a agente2 | 15:00     | admin       |
```

---

<a name="feature-5"></a>
## 5. Funcionalidade: Tipagem de Serviços

### Cenário 5.1: Criar serviço tipo REQUEST

```gherkin
Feature: Tipagem de Serviços
  Como admin
  Eu quero classificar os serviços por tipo
  Para definir o comportamento correto

  Scenario: Criar serviço de solicitação (REQUEST)
    When crio um serviço com serviceType = "REQUEST"
    Then o serviço é criado
    And quando um cidadão acessa o catálogo
    Then vejo o botão "Solicitar"
    And ao clicar, sou direcionado para formulário de solicitação
    And um protocolo é criado ao enviar

  Scenario: Criar serviço de cadastro (REGISTRATION)
    When crio um serviço com serviceType = "REGISTRATION"
    Then quando um cidadão acessa o catálogo
    Then vejo o botão "Cadastrar"
    And ao clicar, sou direcionado para formulário de cadastro
    And os dados são salvos SEM criar protocolo
    And vejo a mensagem "Cadastro realizado com sucesso"

  Scenario: Criar serviço de consulta (CONSULTATION)
    When crio um serviço com serviceType = "CONSULTATION"
    Then quando um cidadão acessa o catálogo
    Then vejo o botão "Consultar"
    And ao clicar, vejo informações read-only
    And NÃO há formulário para preencher

  Scenario: Criar serviço híbrido (BOTH)
    When crio um serviço com serviceType = "BOTH"
    Then quando um cidadão acessa o catálogo
    Then vejo DOIS botões: "Solicitar" e "Consultar"
    And posso escolher qual ação tomar
```

### Cenário 5.2: Validação por tipo no backend

```gherkin
  Scenario: Validar que REGISTRATION não cria protocolo
    Given existe um serviço com serviceType = "REGISTRATION"
    When envio POST /citizen/services/:id/request
    Then a API retorna status 400
    And a mensagem é "Serviço de cadastro não gera protocolo. Use /register"

  Scenario: Validar que CONSULTATION não permite POST
    Given existe um serviço com serviceType = "CONSULTATION"
    When envio POST /citizen/services/:id/request
    Then a API retorna status 400
    And a mensagem é "Serviço de consulta é read-only"
```

---

<a name="feature-6"></a>
## 6. Funcionalidade: Numeração de Protocolos

### Cenário 6.1: Geração de número único

```gherkin
Feature: Numeração de Protocolos
  Como sistema
  Eu quero gerar números únicos para protocolos
  Para facilitar rastreamento

  Scenario: Primeiro protocolo do tenant no ano
    Given o tenant "pmsp" não tem protocolos em 2025
    When crio um protocolo
    Then o número gerado é "PMSP-2025-000001"

  Scenario: Segundo protocolo do mesmo tenant no ano
    Given o tenant "pmsp" tem 1 protocolo em 2025: "PMSP-2025-000001"
    When crio outro protocolo
    Then o número gerado é "PMSP-2025-000002"

  Scenario: Protocolos de tenants diferentes (independentes)
    Given o tenant "pmsp" tem protocolo "PMSP-2025-000001"
    And o tenant "pmrj" não tem protocolos
    When crio um protocolo no tenant "pmrj"
    Then o número gerado é "PMRJ-2025-000001"
    # Sequências independentes por tenant

  Scenario: Virada de ano reseta sequencial
    Given o tenant "pmsp" tem protocolo "PMSP-2024-000999" (ano passado)
    And estamos em 2025
    When crio um protocolo
    Then o número gerado é "PMSP-2025-000001"
    # Sequencial reseta a cada ano

  Scenario: Concorrência não causa duplicação
    Given 10 requisições simultâneas tentam criar protocolos
    When todas executam ao mesmo tempo
    Then 10 protocolos são criados
    And todos têm números ÚNICOS:
      | PMSP-2025-000001 |
      | PMSP-2025-000002 |
      | ...              |
      | PMSP-2025-000010 |
    And nenhum número se repete
```

### Cenário 6.2: Função centralizada

```gherkin
  Scenario: Todas rotas usam getNextProtocolNumber()
    Given a função getNextProtocolNumber(tenantId) existe
    When qualquer rota cria um protocolo:
      | Rota                          |
      | POST /protocols               |
      | POST /admin/protocols         |
      | POST /citizen/services/:id    |
      | POST /secretarias/saude       |
      | POST /secretarias/educacao    |
    Then TODAS chamam getNextProtocolNumber(tenantId)
    And nenhuma gera número manualmente
```

---

<a name="security-tests"></a>
## 7. Testes de Segurança

### Cenário 7.1: Isolamento entre tenants

```gherkin
Feature: Segurança Multi-Tenant

  Scenario: Tenant A não acessa dados do Tenant B
    Given estou autenticado no tenant "pmsp"
    And existe um protocolo id=100 no tenant "pmrj"
    When tento acessar GET /protocols/100
    Then a API retorna status 404
    And a mensagem é "Protocolo não encontrado"
    # NÃO revela que o protocolo existe em outro tenant

  Scenario: Header X-Tenant-ID é obrigatório
    When envio uma requisição SEM o header "X-Tenant-ID"
    Then a API retorna status 400
    And a mensagem é "Tenant ID é obrigatório"

  Scenario: X-Tenant-ID do JWT deve corresponder ao header
    Given meu JWT contém tenantId = "pmsp"
    When envio requisição com header "X-Tenant-ID: pmrj"
    Then a API retorna status 403
    And a mensagem é "Tenant ID inválido para este usuário"
```

### Cenário 7.2: Controle de acesso (RBAC)

```gherkin
  Scenario: Cidadão não acessa rotas de admin
    Given estou autenticado como cidadão
    When tento acessar POST /admin/services
    Then a API retorna status 403
    And a mensagem é "Acesso negado: permissão insuficiente"

  Scenario: Admin não acessa dados de outro tenant
    Given sou admin do tenant "pmsp"
    When tento acessar GET /admin/services com header "X-Tenant-ID: pmrj"
    Then a API retorna status 403

  Scenario: Super admin acessa qualquer tenant
    Given estou autenticado como SUPER_ADMIN
    When acesso GET /admin/services com header "X-Tenant-ID: pmrj"
    Then a API retorna status 200
    And vejo os serviços do tenant "pmrj"
```

### Cenário 7.3: Validação de entrada (SQL Injection, XSS)

```gherkin
  Scenario: SQL Injection em filtro de busca
    Given acesso /cidadao/servicos?search=
    When envio o payload: "'; DROP TABLE Service; --"
    Then a API NÃO executa o comando SQL
    And retorna resultados vazios (nenhum serviço com esse nome)
    And a tabela Service continua intacta

  Scenario: XSS em descrição de serviço
    Given crio um serviço com descrição: "<script>alert('XSS')</script>"
    When um cidadão acessa o catálogo
    Then o script NÃO é executado
    And vejo o texto escapado: "&lt;script&gt;alert('XSS')&lt;/script&gt;"

  Scenario: Path traversal em upload de arquivo
    Given estou enviando um anexo
    When envio o filename: "../../etc/passwd"
    Then a API rejeita com status 400
    And a mensagem é "Nome de arquivo inválido"
```

### Cenário 7.4: Rate Limiting

```gherkin
  Scenario: Limitar requisições por IP
    Given o rate limit é 100 req/min por IP
    When envio 101 requisições em 1 minuto
    Then as primeiras 100 retornam status 200
    And a 101ª retorna status 429 (Too Many Requests)
    And o header contém: "Retry-After: 60"

  Scenario: Limitar tentativas de login
    Given o limite é 5 tentativas incorretas por 15 minutos
    When envio 5 logins com senha errada
    Then a 6ª tentativa retorna status 429
    And a mensagem é "Muitas tentativas. Tente novamente em 15 minutos"
```

---

<a name="performance-tests"></a>
## 8. Testes de Performance

### Cenário 8.1: Tempo de resposta

```gherkin
Feature: Performance

  Scenario: Listar serviços em tempo aceitável
    Given existem 100 serviços no tenant
    When acesso GET /citizen/services
    Then a resposta chega em menos de 500ms
    And o payload tem menos de 100KB

  Scenario: Criar protocolo em tempo aceitável
    When envio POST /citizen/services/:id/request com dados válidos
    Then a resposta chega em menos de 2s
    And o protocolo é criado com sucesso

  Scenario: Listar 1000 protocolos com paginação
    Given existem 1000 protocolos no tenant
    When acesso GET /protocols?page=1&limit=20
    Then a resposta chega em menos de 800ms
    And retorna 20 itens
    And inclui metadados de paginação:
      ```json
      {
        "total": 1000,
        "page": 1,
        "totalPages": 50
      }
      ```
```

### Cenário 8.2: Testes de carga

```gherkin
  Scenario: Sistema suporta 100 requisições simultâneas
    When 100 usuários acessam GET /citizen/services simultaneamente
    Then todas requisições retornam status 200
    And o tempo de resposta p95 < 1s
    And nenhuma requisição falha

  Scenario: Criação de protocolos em massa
    When 50 usuários criam protocolos simultaneamente
    Then todos protocolos são criados
    And todos têm números ÚNICOS (sem duplicação)
    And o tempo de resposta médio < 3s

  Scenario: Banco suporta 500 conexões
    When 500 conexões simultâneas são abertas
    Then o Prisma pool gerencia corretamente
    And nenhuma conexão é rejeitada
    And não há deadlocks
```

### Cenário 8.3: Otimização de queries

```gherkin
  Scenario: JOIN com Attendance usa índices
    Given existem 10,000 protocolos com AttendanceHealth
    When busco GET /protocols?include=attendance
    Then o EXPLAIN ANALYZE mostra:
      - Index Scan em Protocol.id
      - Index Scan em AttendanceHealth.protocolId
      - Tempo total < 100ms

  Scenario: Paginação não faz COUNT desnecessário
    When acesso GET /protocols?page=5
    Then a query faz apenas:
      - SELECT com LIMIT/OFFSET (não COUNT(*))
      - Total de protocolos vem do cache (atualizado a cada 5min)
```

---

<a name="edge-cases"></a>
## 9. Casos de Borda e Edge Cases

### Cenário 9.1: Dados extremos

```gherkin
Feature: Edge Cases

  Scenario: Descrição muito longa
    When crio um serviço com descrição de 10,000 caracteres
    Then a API retorna status 400
    And a mensagem é "Descrição excede o limite de 2000 caracteres"

  Scenario: Nome com caracteres especiais
    When crio um serviço com nome: "Serviço <teste> & "especial" 中文"
    Then o serviço é criado
    And o nome é armazenado corretamente (UTF-8)
    And ao listar, vejo o nome sem corrupção

  Scenario: Upload de arquivo vazio
    When envio um arquivo de 0 bytes
    Then a API retorna status 400
    And a mensagem é "Arquivo vazio não é permitido"

  Scenario: Agendamento para data passada
    When tento agendar para "2025-01-01" (passado)
    Then a API retorna status 400
    And a mensagem é "Data deve ser futura"
```

### Cenário 9.2: Estados inconsistentes

```gherkin
  Scenario: Protocolo sem serviceId (protocolo manual)
    Given crio um protocolo diretamente sem serviceId
    When tento visualizar o protocolo
    Then vejo os dados do protocolo
    And o campo "Serviço" exibe "N/A" ou "Atendimento Manual"

  Scenario: Serviço deletado com protocolos vinculados
    Given existe um serviço com 10 protocolos
    When tento deletar o serviço
    Then a API retorna status 400
    And a mensagem é "Não é possível deletar serviço com protocolos vinculados"
    # OU soft delete (isActive = false)

  Scenario: Attendance órfão (sem Protocol)
    Given tento criar AttendanceHealth sem protocolId
    Then o banco rejeita com FK constraint error
```

### Cenário 9.3: Concorrência

```gherkin
  Scenario: Dois admins editam o mesmo protocolo
    Given o protocolo está com status "ABERTO"
    And admin1 carrega o protocolo
    And admin2 carrega o protocolo
    When admin1 altera status para "EM_ANDAMENTO" e salva
    And admin2 altera status para "CANCELADO" e salva
    Then a última atualização vence (admin2)
    And o status final é "CANCELADO"
    # OU implementar optimistic locking com version field

  Scenario: Cidadão solicita mesmo serviço 2 vezes simultaneamente
    When envio 2 POSTs idênticos ao mesmo tempo
    Then 2 protocolos são criados
    And ambos têm números únicos
    # Sistema permite duplicatas (cidadão pode ter múltiplas solicitações)
```

---

## 10. Resumo de Cobertura

### Estatísticas de Testes

| Categoria                  | Cenários | Cobertura Estimada |
|----------------------------|----------|-------------------|
| Criação de Serviços        | 15       | 95%               |
| Solicitação de Serviços    | 18       | 90%               |
| Integração Secretarias     | 12       | 85%               |
| Rastreamento Protocolos    | 8        | 90%               |
| Tipagem de Serviços        | 6        | 100%              |
| Numeração de Protocolos    | 6        | 100%              |
| Segurança                  | 10       | 80%               |
| Performance                | 8        | 70%               |
| Edge Cases                 | 10       | 75%               |
| **TOTAL**                  | **93**   | **87%**           |

### Prioridade de Execução

**P0 - Crítico (executar primeiro):**
- Cenário 1.5: Transação completa
- Cenário 2.2: Solicitação básica
- Cenário 3.1-3.3: Secretarias principais
- Cenário 6.1: Numeração única
- Cenário 7.1: Isolamento de tenants

**P1 - Alto:**
- Cenários com feature flags (2.3, 2.4, 2.5)
- Cenários de segurança (7.2, 7.3)
- Cenários de performance (8.1)

**P2 - Médio:**
- Edge cases (9.1, 9.2)
- Testes de carga (8.2)

---

## 11. Ferramentas Recomendadas

### Testes E2E (Frontend + Backend)
- **Playwright** ou **Cypress**
- Simula jornada completa do usuário
- Exemplo: `npx playwright test tests/e2e/citizen-service-request.spec.ts`

### Testes de Integração (Backend)
- **Jest** com **Supertest**
- Testa endpoints com banco de dados real
- Exemplo: `npm run test:integration`

### Testes de Carga
- **k6** ou **Apache JMeter**
- Simula 1000+ usuários simultâneos
- Exemplo: `k6 run load-test.js`

### Testes de Segurança
- **OWASP ZAP** (automatizado)
- **Burp Suite** (manual)
- `npm audit` para vulnerabilidades de dependências

---

**Aprovação QA:**

- [ ] QA Lead: _________________ Data: ___/___/___
- [ ] Tech Lead: _________________ Data: ___/___/___

---

*Documento atualizado conforme novos cenários são identificados.*
