# FLUXOS COMPLETOS - MOTOR DE PROTOCOLOS + TODOS OS SERVIÇOS

Análise COMPLETA de TODOS os serviços listados organizados pelo Motor de Protocolos.

---

## 🩺 SECRETARIA DE SAÚDE

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ UNIDADES DE SAÚDE                               │
│ - UBS Centro, UBS Bairro Alto                   │
│ - Hospital Municipal, Pronto Socorro            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PACIENTES                                       │
│ - Cadastro completo + Cartão SUS                │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PROFISSIONAIS DE SAÚDE                          │
│ - Médicos, Enfermeiros, Especialidades          │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ MEDICAMENTOS (FARMÁCIA BÁSICA)                  │
│ - Estoque, Validade, Dispensação                │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PROGRAMAS DE SAÚDE                              │
│ - Vacinação, Hipertensos, Gestantes, etc        │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ AGENTES COMUNITÁRIOS (ACS)                      │
│ - Territórios, Rotas, Visitas                   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ AMBULÂNCIAS                                     │
│ - Frota, Equipes, Status                        │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ LABORATÓRIOS CONVENIADOS                        │
│ - Integração para Exames                        │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS DISPONÍVEIS

#### 1. Dashboard Saúde
**Tipo:** INFORMATIVO (Painel Admin)

Indicadores:
- Consultas hoje
- Pacientes cadastrados
- Taxa de ocupação
- Emergências ativas

Unidades:
- UBS Centro
- UBS Bairro Alto
- Hospital Municipal
- Pronto Socorro

Programas:
- Vacinação COVID-19
- Hipertensos
- Saúde da Mulher
- Puericultura

Cobertura:
- Percentuais de vacinação por programa

---

#### 2. Atendimentos
**Tipo:** COM DADOS → Módulo Atendimentos

Sistema PDV para registro de consultas.

Formulário:
- Tipo de atendimento (consulta, emergência, retorno)
- Paciente (busca por CPF/Cartão SUS)
- Unidade de atendimento
- Profissional responsável
- Queixa/Sintomas
- Classificação de risco (triagem)
- Prontuário eletrônico

Funcionalidades:
- Triagem e classificação de risco
- Histórico completo do paciente
- Integração com prontuário

**Vai para:** Módulo Atendimentos de Saúde

---

#### 3. Agendamentos Médicos
**Tipo:** COM DADOS → Módulo Agendamentos

Agendamento online por especialidade.

Formulário:
- Paciente (CPF/Cartão SUS)
- Especialidade desejada
- Unidade de preferência
- Data/horário disponível
- Motivo da consulta

Funcionalidades:
- Controle de vagas disponíveis por médico/horário
- Confirmações automáticas
- Remarcações
- Integração com prontuário eletrônico

**Vai para:** Módulo de Agendamentos Médicos

---

#### 4. Controle de Medicamentos
**Tipo:** COM DADOS → Módulo Farmácia

Estoque de farmácia básica.

Formulário:
- Paciente (CPF/Cartão SUS)
- Medicamento solicitado
- Receita médica (anexo)
- Quantidade
- Unidade de retirada

Funcionalidades:
- Estoque de farmácia básica
- Dispensação controlada
- Alertas de vencimento e ruptura
- Solicitações de reposição

**Vai para:** Módulo Farmácia Básica

---

#### 5. Campanhas de Saúde
**Tipo:** COM DADOS → Módulo Campanhas

Vacinação em massa e campanhas.

Formulário (Vacinação):
- Paciente (CPF/Cartão SUS)
- Tipo de vacina
- Dose (1ª, 2ª, reforço)
- Unidade de aplicação
- Data de aplicação
- Lote da vacina

Funcionalidades:
- Planejamento de campanhas
- Vacinação em massa
- Controle de doses aplicadas
- Relatórios epidemiológicos

**Vai para:** Módulo de Campanhas de Saúde

---

#### 6. Programas de Saúde
**Tipo:** COM DADOS → Módulo Programas

Hipertensão, Diabetes, Gestantes, Idosos.

Formulário de Inscrição:
- Paciente (CPF/Cartão SUS)
- Programa (Hipertensão, Diabetes, Gestantes, Idosos)
- Dados específicos do programa
- Profissional responsável

Funcionalidades:
- Cadastro de beneficiários
- Metas e indicadores de saúde
- Acompanhamento longitudinal

**Vai para:** Módulo Programas de Saúde

---

#### 7. Encaminhamentos TFD
**Tipo:** COM DADOS → Módulo TFD

Solicitações de Tratamento Fora do Domicílio.

Formulário:
- Paciente (CPF/Cartão SUS)
- Tratamento solicitado
- Especialidade/Procedimento
- Cidade de destino
- Justificativa médica
- Documentação anexa
- Necessidade de transporte
- Necessidade de acompanhante

Funcionalidades:
- Autorização de procedimentos
- Controle de transporte
- Acompanhamento de tratamentos

**Vai para:** Módulo TFD (Tratamento Fora do Domicílio)

---

#### 8. Exames
**Tipo:** COM DADOS → Módulo Exames

Agendamento de exames laboratoriais e imagem.

Formulário:
- Paciente (CPF/Cartão SUS)
- Tipo de exame (laboratorial, imagem)
- Pedido médico (anexo)
- Urgência
- Unidade/Laboratório
- Data preferencial

Funcionalidades:
- Agendamento de exames laboratoriais e imagem
- Resultados online
- Controle de laudos
- Integração com laboratórios

**Vai para:** Módulo de Exames

---

#### 9. ACS (Agentes Comunitários)
**Tipo:** GESTÃO INTERNA (não gera protocolo cidadão)

Funcionalidades:
- Cadastro de agentes
- Definição de rotas e territórios
- Registro de visitas domiciliares
- Indicadores por agente

---

#### 10. Transporte de Pacientes
**Tipo:** COM DADOS → Módulo Transporte

Agendamento de ambulâncias.

Formulário:
- Paciente (CPF/Cartão SUS)
- Origem (endereço completo)
- Destino (unidade de saúde/hospital)
- Data e horário solicitado
- Motivo (consulta, exame, tratamento)
- Necessita maca/cadeira de rodas

Funcionalidades:
- Agendamento de ambulâncias
- Rotas otimizadas
- Controle de frota
- Relatórios de deslocamento

**Vai para:** Módulo Transporte de Pacientes

---

## 📚 SECRETARIA DE EDUCAÇÃO

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ ESCOLAS                                         │
│ - 4 unidades ativas                             │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ALUNOS                                          │
│ - 1.375 matriculados                            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PROFESSORES                                     │
│ - Disciplinas, carga horária                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ TURMAS                                          │
│ - Série, turno, escola                          │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ TRANSPORTE ESCOLAR                              │
│ - 72 estudantes transportados                   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ MERENDA ESCOLAR                                 │
│ - Cardápios, Estoque, Fornecedores              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ CALENDÁRIO ESCOLAR                              │
│ - Ano letivo, Eventos pedagógicos               │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS DISPONÍVEIS

#### 1. Dashboard Educação
**Tipo:** INFORMATIVO (Painel Admin)

Alunos:
- 1.375 matriculados

Escolas:
- 4 unidades ativas

Frequência:
- 94.3% média

Transporte:
- 72 estudantes

Gráficos:
- Distribuição por escola
- Evolução frequência
- Matrículas por nível

Qualidade:
- Taxa aprovação
- Evasão
- Alunos/turma

Infraestrutura:
- Salas
- Laboratórios
- Bibliotecas
- Quadras

Merenda:
- Refeições/dia
- Cardápios
- Aceitação

---

#### 2. Atendimentos
**Tipo:** COM DADOS → Módulo Atendimentos

Atendimento a pais e responsáveis.

Formulário:
- Responsável/Pai/Mãe
- Aluno (se aplicável)
- Tipo de solicitação
- Descrição detalhada
- Documentos anexos

Funcionalidades:
- Atendimento a pais e responsáveis
- Solicitações de documentos
- Protocolo de demandas escolares

**Vai para:** Módulo Atendimentos Escolares

---

#### 3. Matrícula de Alunos
**Tipo:** COM DADOS → Módulo Matrículas

Sistema online de matrículas novas.

Formulário:
- Dados do Aluno (nome, data nascimento, CPF)
- Dados do Responsável (nome, CPF, telefone)
- Endereço completo
- Série/Ano desejado
- Turno preferencial (manhã/tarde/integral)
- Escola de preferência (1ª, 2ª, 3ª opção)
- Necessidades especiais (se houver)
- Documentos: RG/Certidão, Comprovante residência, Histórico

Funcionalidades:
- Sistema online de matrículas novas
- Rematrículas automáticas
- Transferências entre escolas
- Geração de histórico escolar

**Vai para:** Módulo de Matrículas

---

#### 4. Gestão Escolar
**Tipo:** GESTÃO INTERNA (não gera protocolo cidadão)

Funcionalidades:
- Administração de unidades escolares
- Gestão de diretores e coordenadores
- Controle de infraestrutura
- Recursos humanos por escola

---

#### 5. Transporte Escolar
**Tipo:** COM DADOS → Módulo Transporte

Definição de rotas e horários.

Formulário:
- Aluno (nome, matrícula)
- Responsável (nome, telefone)
- Endereço de embarque
- Escola de destino
- Turno
- Observações especiais

Funcionalidades:
- Definição de rotas e horários
- Controle de veículos e motoristas
- Monitoramento GPS em tempo real
- Relatórios de deslocamento

**Vai para:** Módulo Transporte Escolar

---

#### 6. Merenda Escolar
**Tipo:** GESTÃO INTERNA

Funcionalidades:
- Planejamento de cardápios nutricionais
- Controle de estoque de alimentos
- Gestão de fornecedores
- Relatórios de consumo

---

#### 7. Registro de Ocorrências
**Tipo:** COM DADOS → Módulo Ocorrências

Registro disciplinar de alunos.

Formulário:
- Aluno envolvido
- Tipo de ocorrência (disciplinar, acidente, incidente)
- Data e hora
- Local (sala, pátio, etc)
- Descrição detalhada
- Testemunhas
- Professor/Funcionário que registrou
- Providências tomadas

Funcionalidades:
- Registro disciplinar de alunos
- Acidentes e incidentes
- Acompanhamento psicopedagógico
- Notificações aos responsáveis

**Vai para:** Módulo Ocorrências Escolares

---

#### 8. Calendário Escolar
**Tipo:** INFORMATIVO

Funcionalidades:
- Planejamento anual letivo
- Feriados e eventos escolares
- Períodos de férias e recesso
- Reuniões pedagógicas e conselhos

---

## 🤝 SECRETARIA DE ASSISTÊNCIA SOCIAL

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ FAMÍLIAS CADASTRADAS                            │
│ - NIS, Composição, Vulnerabilidade              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ EQUIPAMENTOS SOCIAIS                            │
│ - CRAS Centro, CRAS Bairro Alto                 │
│ - CREAS Municipal, Casa de Passagem             │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PROGRAMAS SOCIAIS                               │
│ - Auxílio Brasil, BPC, Tarifa Social            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ASSISTENTES SOCIAIS                             │
│ - CRESS, Equipamento, Famílias                  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ BENEFÍCIOS CONCEDIDOS                           │
│ - Tipo, Família, Vigência                       │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ESTOQUE EMERGENCIAL                             │
│ - Cestas básicas, Kits higiene                  │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS DISPONÍVEIS

#### 1. Dashboard Assistência Social
**Tipo:** INFORMATIVO (Painel Admin)

Indicadores:
- Atendimentos hoje
- Famílias cadastradas
- Benefícios ativos
- Entregas emergenciais

CRAS/CREAS:
- CRAS Centro
- CRAS Bairro Alto
- CREAS Municipal
- Casa de Passagem

Programas:
- Auxílio Brasil
- BPC
- Tarifa Social
- Casa da Família

---

#### 2. Atendimentos
**Tipo:** COM DADOS → Módulo Atendimentos

Registro de atendimentos sociais.

Formulário:
- Nome do cidadão
- CPF, telefone
- NIS (se houver)
- Tipo de demanda
- Situação de vulnerabilidade
- Composição familiar
- Renda familiar
- Encaminhamento necessário

Funcionalidades:
- Registro de atendimentos sociais
- Triagem e análise de vulnerabilidade
- Encaminhamentos para serviços

**Vai para:** Módulo Atendimentos Sociais

---

#### 3. Famílias Vulneráveis
**Tipo:** COM DADOS → Módulo Cadastro Único

Cadastro Único para Programas Sociais.

Formulário:
- Dados do Responsável Familiar
- Composição familiar completa
- Renda per capita
- Condições de moradia
- Acesso a serviços básicos
- Situações de vulnerabilidade

Funcionalidades:
- Cadastro Único para Programas Sociais
- Análise de vulnerabilidade social
- Planos de acompanhamento familiar
- Condicionalidades de programas

**Vai para:** Módulo Cadastro Único

---

#### 4. CRAS e CREAS
**Tipo:** GESTÃO INTERNA + Serviços

Funcionalidades:
- Gestão de equipamentos sociais
- Controle de capacidade
- Agendamento de serviços especializados
- Grupos e oficinas

---

#### 5. Programas Sociais
**Tipo:** COM DADOS → Módulo Programas

Gestão de programas municipais.

Formulário de Inscrição:
- Dados do cidadão/família
- NIS
- Programa desejado
- Documentação comprobatória
- Análise de elegibilidade

Funcionalidades:
- Gestão de programas municipais
- Inscrições e processo seletivo
- Relatórios de impacto social
- Acompanhamento de beneficiários

**Vai para:** Módulo Programas Sociais

---

#### 6. Gerenciamento de Benefícios
**Tipo:** COM DADOS → Módulo Benefícios

Cadastro em programas federais/municipais.

Formulário:
- Tipo de benefício solicitado
- Dados da família
- NIS
- Documentação
- Justificativa

Funcionalidades:
- Cadastro em programas federais/municipais
- Renovações e concessões
- Suspensões e cancelamentos
- Controle de condicionalidades

**Vai para:** Módulo de Benefícios

---

#### 7. Entregas Emergenciais
**Tipo:** COM DADOS → Módulo Entregas

Registro de entregas (cestas básicas, kits).

Formulário:
- Nome do solicitante
- CPF, NIS
- Endereço de entrega
- Tipo de necessidade (cesta básica, kit higiene, etc)
- Composição familiar
- Justificativa da emergência
- Última entrega recebida (controle)

Funcionalidades:
- Registro de entregas (cestas básicas, kits)
- Controle de estoque
- Beneficiários atendidos
- Relatórios de distribuição

**Vai para:** Módulo Entregas Emergenciais

---

#### 8. Registro de Visitas
**Tipo:** COM DADOS → Módulo Visitas (uso interno)

Agendamento de visitas domiciliares.

Formulário:
- Família a ser visitada
- Data e horário agendado
- Assistente social responsável
- Motivo da visita
- Observações

Funcionalidades:
- Agendamento de visitas domiciliares
- Relatórios técnicos de assistentes sociais
- Acompanhamento familiar
- Histórico de intervenções

**Vai para:** Módulo Visitas Domiciliares

---

## 🌾 SECRETARIA DE AGRICULTURA

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ PRODUTORES RURAIS                               │
│ - CPF, DAP, Status                              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PROPRIEDADES RURAIS                             │
│ - Nome, Área, GPS                               │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PRODUÇÕES AGRÍCOLAS                             │
│ - Milho, Soja, Pecuária, etc                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ TÉCNICOS AGRÍCOLAS                              │
│ - Nome, CREA, Especialização                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PROGRAMAS RURAIS                                │
│ - Sustentabilidade, Tecnologia, Crédito         │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ CURSOS E CAPACITAÇÕES                           │
│ - Presencial, Online, Híbrido                   │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS DISPONÍVEIS

#### 1. Dashboard Agricultura
**Tipo:** INFORMATIVO (Painel Admin)

Indicadores:
- Produtores cadastrados
- Programas ativos
- Área total (hectares)
- Beneficiários

Gestão:
- Produtores
- Programas rurais

Relatórios:
- Estatísticas agregadas

---

#### 2. Cadastro de Produtores
**Tipo:** COM DADOS → Módulo Produtores

Cadastro completo de produtores rurais.

Formulário:

Dados Pessoais:
- Nome completo
- CPF, RG
- Telefone, Email
- Endereço residencial

Propriedade:
- Nome da propriedade
- Área (hectares)
- Localização GPS
- Endereço da propriedade

Produções:
- Milho, Soja, Feijão, Arroz, Trigo
- Café, Cana
- Hortaliças, Frutas
- Pecuária, Avicultura, Suinocultura

DAP:
- Declaração de Aptidão ao PRONAF
- Número da DAP
- Validade

Status:
- Ativo, Inativo, Pendente

Histórico:
- Atendimentos
- Observações

**Vai para:** Módulo Produtores Rurais

---

#### 3. Assistência Técnica
**Tipo:** COM DADOS → Módulo ATER

Assistência técnica e extensão rural.

Formulário:
- Produtor (busca por CPF)
- Propriedade

Categorias:
- Fitossanidade
- Manejo Solo
- Irrigação
- Melhoramento Genético
- Mecanização
- Pós-Colheita

Tipos:
- Manejo de Pragas
- Irrigação
- Adubação

Planejamento:
- Cultura/Atividade afetada
- Descrição do problema
- Data preferencial para visita
- Datas, técnico responsável
- Custo

Status:
- Planejada
- Em Execução
- Concluída
- Suspensa
- Cancelada

Avaliação:
- Feedback do produtor

**Vai para:** Módulo ATER (Assistência Técnica Rural)

---

#### 4. Atendimentos
**Tipo:** COM DADOS → Módulo Atendimentos

Sistema PDV para registro.

Formulário:
- Produtor (CPF)

Categorias:
- Assistência Técnica
- Crédito Rural
- Capacitação
- Inspeção
- Outros

Dados Técnicos:
- Propriedade
- Área afetada (hectares)
- Cultura/Produção
- Descrição problema

Localização:
- Endereço
- Coordenadas GPS

Anexos:
- Fotos e documentos

Prioridade:
- Baixa, Média, Alta, Urgente

Protocolo:
- Geração automática AGR-2025-XXXX

**Vai para:** Módulo Atendimentos Agricultura

---

#### 5. Cursos e Capacitações
**Tipo:** COM DADOS → Módulo Cursos

Inscrições em cursos.

Formulário de Inscrição:
- Produtor (nome, CPF)
- Curso desejado
- Modalidade preferencial (Presencial/Online/Híbrido)
- Disponibilidade de horário

Modalidades:
- Presencial
- Online
- Híbrido

Categorias:
- Sustentabilidade
- Tecnologia
- Gestão
- Produção
- Qualidade

Controle:
- Instrutor, datas
- Carga horária

Vagas:
- Total, ocupadas
- Percentual

Certificação:
- Emissão de certificados

Status:
- Planejado
- Inscrições Abertas
- Em Andamento
- Finalizado

**Vai para:** Módulo Cursos e Capacitações

---

#### 6. Programas Rurais
**Tipo:** COM DADOS → Módulo Programas

Inscrição em programas.

Formulário de Inscrição:
- Produtor (CPF)
- Programa desejado
- Dados da propriedade
- Documentação comprobatória

Tipos:
- Sustentabilidade
- Tecnologia
- Capacitação
- Crédito
- Pecuária
- Agricultura Familiar

Gestão:
- Coordenador
- Público-alvo
- Cronograma

Orçamento:
- Controle financeiro

Participantes:
- Inscritos e ativos

Status:
- Planejamento
- Inscrições
- Execução
- Concluído

**Vai para:** Módulo Programas Rurais

---

## 🎨 SECRETARIA DE CULTURA

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ ESPAÇOS CULTURAIS                               │
│ - Teatros, Centros, Bibliotecas                 │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ GRUPOS ARTÍSTICOS                               │
│ - Teatro, Dança, Música                         │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ EVENTOS CULTURAIS                               │
│ - Shows, Apresentações, Exposições              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ OFICINAS E CURSOS                               │
│ - Arte, Cultura, Certificação                   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PROJETOS CULTURAIS                              │
│ - Editais, Leis de Incentivo                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PATRIMÔNIO CULTURAL                             │
│ - Manifestações, Festas Tradicionais            │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS DISPONÍVEIS

#### 1. Dashboard Cultura
**Tipo:** INFORMATIVO (Painel Admin)

- Indicadores culturais
- Eventos e projetos ativos
- Espaços culturais disponíveis

---

#### 2. Atendimentos
**Tipo:** COM DADOS → Módulo Atendimentos

Solicitações culturais.

Formulário:
- Nome do cidadão/artista
- Tipo de solicitação cultural
- Descrição detalhada
- Apoio necessário

Funcionalidades:
- Solicitações culturais
- Apoio a artistas e grupos
- Protocolo de demandas

**Vai para:** Módulo Atendimentos Culturais

---

#### 3. Espaços Culturais
**Tipo:** COM DADOS → Módulo Espaços

Agendamento de espaços.

Formulário de Reserva:
- Nome do solicitante/grupo
- Espaço desejado (teatro, centro cultural, biblioteca)
- Data e horário
- Tipo de evento/atividade
- Público esperado
- Necessidades técnicas (som, luz, etc)
- Contrapartida (se aplicável)

Funcionalidades:
- Gestão de teatros, centros culturais, bibliotecas
- Agendamento de espaços
- Manutenção de equipamentos

**Vai para:** Módulo Espaços Culturais

---

#### 4. Eventos
**Tipo:** INFORMATIVO + Gestão Interna

Calendário cultural.

Funcionalidades:
- Calendário cultural
- Shows, apresentações, exposições
- Ingressos e controle de público

---

#### 5. Grupos Artísticos
**Tipo:** COM DADOS → Módulo Grupos

Cadastro de grupos locais.

Formulário de Cadastro:
- Nome do grupo
- Tipo (teatro, dança, música, artes visuais, etc)
- Representante legal (nome, CPF, telefone)
- Integrantes
- Tempo de atuação
- Portfólio/histórico de apresentações
- Necessidades de apoio

Funcionalidades:
- Cadastro de grupos locais
- Apoio e fomento
- Histórico de apresentações

**Vai para:** Módulo Grupos Artísticos

---

#### 6. Oficinas e Cursos
**Tipo:** COM DADOS → Módulo Oficinas

Inscrições em oficinas.

Formulário de Inscrição:
- Nome do participante
- CPF, data nascimento
- Telefone, email
- Oficina desejada (teatro, dança, música, artes plásticas, etc)
- Experiência anterior
- Disponibilidade de horário

Funcionalidades:
- Oficinas de arte e cultura
- Inscrições e controle de vagas
- Certificação

**Vai para:** Módulo Oficinas Culturais

---

#### 7. Manifestações Culturais
**Tipo:** INFORMATIVO + Registro

Funcionalidades:
- Patrimônio imaterial
- Festas tradicionais
- Registro de manifestações

---

#### 8. Projetos Culturais
**Tipo:** COM DADOS → Módulo Projetos

Submissão de projetos.

Formulário de Submissão:
- Proponente (nome, CPF/CNPJ)
- Nome do projeto
- Descrição detalhada
- Objetivos e justificativa
- Público-alvo
- Contrapartida social
- Orçamento detalhado
- Cronograma de execução
- Portfólio do proponente
- Edital/Lei de Incentivo aplicável

Funcionalidades:
- Editais e leis de incentivo
- Acompanhamento de projetos aprovados
- Prestação de contas

**Vai para:** Módulo Projetos Culturais

---

## 🏆 SECRETARIA DE ESPORTES

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ EQUIPAMENTOS ESPORTIVOS                         │
│ - Quadras, Campos, Ginásios, Piscinas           │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ESCOLINHAS ESPORTIVAS                           │
│ - Modalidade, Professor/Treinador               │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ATLETAS FEDERADOS                               │
│ - Nome, CPF, Modalidade, Carteira               │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ EQUIPES MUNICIPAIS                              │
│ - Nome, Modalidade, Técnico                     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ COMPETIÇÕES E TORNEIOS                          │
│ - Nome, Modalidade, Data, Classificação         │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PROFESSORES/TREINADORES                         │
│ - Nome, CREF, Modalidades                       │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS DISPONÍVEIS

#### 1. Dashboard Esportes
**Tipo:** INFORMATIVO (Painel Admin)

- Indicadores esportivos
- Eventos e competições
- Atletas e equipes

---

#### 2. Atendimentos
**Tipo:** COM DADOS → Módulo Atendimentos

Solicitações esportivas.

Formulário:
- Nome do cidadão/atleta
- Tipo de solicitação esportiva
- Descrição
- Apoio necessário

Funcionalidades:
- Solicitações esportivas
- Apoio a atletas
- Protocolo de demandas

**Vai para:** Módulo Atendimentos Esportivos

---

#### 3. Equipes Esportivas
**Tipo:** GESTÃO INTERNA

Funcionalidades:
- Cadastro de equipes municipais
- Modalidades esportivas
- Histórico de resultados

---

#### 4. Competições e Torneios
**Tipo:** COM DADOS → Módulo Competições

Organização de eventos.

Formulário de Inscrição:
- Nome da equipe/atleta
- Modalidade
- Categoria
- Representante responsável
- Lista de atletas (se equipe)
- Documentação (fichas médicas, autorizações)

Funcionalidades:
- Calendário esportivo
- Organização de eventos
- Classificações e resultados

**Vai para:** Módulo Competições

---

#### 5. Atletas Federados
**Tipo:** COM DADOS → Módulo Atletas

Cadastro de atletas.

Formulário de Cadastro:
- Nome completo
- CPF, RG, data nascimento
- Endereço, telefone, email
- Modalidade esportiva
- Categoria (idade/nível)
- Atestado médico (anexo)
- Foto 3x4
- Responsável legal (se menor)
- Histórico esportivo

Funcionalidades:
- Cadastro de atletas
- Carteira de atleta
- Acompanhamento de desempenho

**Vai para:** Módulo Atletas Federados

---

#### 6. Escolinhas Esportivas
**Tipo:** COM DADOS → Módulo Escolinhas

Inscrições em escolinhas.

Formulário de Inscrição:
- Nome do participante
- Data de nascimento
- CPF do participante
- Nome do responsável (se menor)
- CPF do responsável
- Telefone, email
- Endereço completo
- Modalidade desejada (futebol, vôlei, basquete, natação, etc)
- Experiência anterior
- Possui alguma restrição médica?
- Atestado médico (anexo)
- Turno preferencial

Funcionalidades:
- Programas de iniciação
- Inscrições e controle de vagas
- Horários e locais

**Vai para:** Módulo Escolinhas Esportivas

---

#### 7. Eventos Esportivos
**Tipo:** INFORMATIVO + Gestão

Funcionalidades:
- Jogos, campeonatos, festivais
- Apoio logístico
- Controle de público

---

#### 8. Infraestrutura Esportiva
**Tipo:** COM DADOS → Módulo Reservas

Reserva de espaços.

Formulário de Reserva:
- Nome do solicitante/grupo
- CPF/CNPJ
- Equipamento desejado (quadra, campo, ginásio, piscina)
- Data e horário
- Finalidade (treino, evento, competição)
- Quantidade esperada de pessoas
- Necessidades adicionais

Funcionalidades:
- Gestão de quadras, campos, ginásios
- Manutenção de equipamentos
- Agendamento de espaços

**Vai para:** Módulo Reservas de Espaços Esportivos

---

## 🏠 SECRETARIA DE HABITAÇÃO

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ PROGRAMAS HABITACIONAIS                         │
│ - MCMV, Programas municipais                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ UNIDADES HABITACIONAIS                          │
│ - Endereço, Tipo, Status                        │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ FAMÍLIAS INSCRITAS                              │
│ - Responsável, Composição, Fila                 │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PROCESSOS DE REGULARIZAÇÃO                      │
│ - Endereço, Proprietário, Status                │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ASSISTENTES SOCIAIS                             │
│ - Nome, CRESS, Famílias                         │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS DISPONÍVEIS

#### 1. Dashboard Habitação
**Tipo:** INFORMATIVO (Painel Admin)

- Indicadores habitacionais
- Programas ativos
- Unidades disponíveis

---

#### 2. Atendimentos
**Tipo:** COM DADOS → Módulo Atendimentos

Solicitações habitacionais.

Formulário:
- Nome do cidadão
- CPF, telefone
- Tipo de solicitação habitacional
- Descrição da necessidade
- Situação atual de moradia

Funcionalidades:
- Solicitações habitacionais
- Orientação sobre programas
- Protocolo de demandas

**Vai para:** Módulo Atendimentos Habitação

---

#### 3. Inscrições
**Tipo:** COM DADOS → Módulo Inscrições

Cadastro em programas habitacionais.

Formulário de Inscrição:
- Dados do Responsável Familiar
- CPF, RG, Estado Civil
- Telefone, Email
- Endereço atual
- Composição familiar completa
- Renda familiar comprovada
- Situação atual de moradia (aluguel, cedido, próprio irregular)
- Possui imóvel em seu nome? (em qualquer lugar)
- Tempo de residência no município

Critérios especiais:
- Pessoa com deficiência na família?
- Idoso na família?
- Gestante?
- Família monoparental?

Documentos:
- RG, CPF, Comprovante residência, Comprovante renda

Funcionalidades:
- Cadastro em programas habitacionais
- Análise de documentação
- Fila de espera

**Vai para:** Módulo Inscrições Habitacionais

---

#### 4. Programas Habitacionais
**Tipo:** INFORMATIVO + Inscrições

Programas:
- Minha Casa Minha Vida
- Programas municipais
- Parcerias estaduais/federais

---

#### 5. Unidades Habitacionais
**Tipo:** GESTÃO INTERNA

Funcionalidades:
- Gestão do estoque
- Alocação de beneficiários
- Controle de ocupação

---

#### 6. Regularização Fundiária
**Tipo:** COM DADOS → Módulo Regularização

Processos de regularização.

Formulário:
- Dados do Proprietário/Possuidor
- CPF, RG
- Endereço do imóvel a regularizar
- Tempo de ocupação
- Área do terreno (m²)
- Tipo de construção
- Documentos que possui (escritura, recibos, etc)
- Situação legal atual
- Vizinhos/confrontantes
- Croqui ou planta (anexo)
- Fotos do imóvel

Funcionalidades:
- Processos de regularização
- Documentação de imóveis
- Títulos de propriedade

**Vai para:** Módulo Regularização Fundiária

---

## 🌳 SECRETARIA DE MEIO AMBIENTE

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ ÁREAS PROTEGIDAS                                │
│ - APPs, Reservas, GPS                           │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ LICENÇAS AMBIENTAIS                             │
│ - Processo, Requerente, Tipo (LP/LI/LO)         │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ DENÚNCIAS AMBIENTAIS                            │
│ - Registro, Tipo, Localização                   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ FISCAIS AMBIENTAIS                              │
│ - Nome, Matrícula, Área                         │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PROGRAMAS AMBIENTAIS                            │
│ - Coleta Seletiva, Reflorestamento              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ AUTOS DE INFRAÇÃO                               │
│ - Número, Infrator, Multa                       │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS DISPONÍVEIS

#### 1. Dashboard Meio Ambiente
**Tipo:** INFORMATIVO (Painel Admin)

- Indicadores ambientais
- Licenças emitidas
- Áreas protegidas

---

#### 2. Atendimentos
**Tipo:** COM DADOS → Módulo Atendimentos

Solicitações ambientais.

Formulário:
- Nome do cidadão/empresa
- CPF/CNPJ
- Tipo de solicitação ambiental
- Descrição
- Localização (se aplicável)

Funcionalidades:
- Solicitações ambientais
- Orientações técnicas
- Protocolo de demandas

**Vai para:** Módulo Atendimentos Ambientais

---

#### 3. Licenças Ambientais
**Tipo:** COM DADOS → Módulo Licenças

Análise de processos.

Formulário:
- Dados do Requerente (nome, CPF/CNPJ)

Tipo de Licença:
- LP - Licença Prévia
- LI - Licença de Instalação
- LO - Licença de Operação

Dados do projeto:
- Tipo de Empreendimento/Atividade
- Localização (endereço + GPS)
- Área total (m²/hectares)
- Descrição do projeto
- Impactos ambientais previstos
- Medidas mitigadoras
- Documentação técnica (estudos, projetos)
- ART do responsável técnico

Funcionalidades:
- Análise de processos
- Emissão de licenças
- Renovações e cancelamentos

**Vai para:** Módulo Licenciamento Ambiental

---

#### 4. Registro de Denúncias
**Tipo:** COM DADOS → Módulo Denúncias

Denúncias ambientais.

Formulário:

Tipo de Denúncia:
- Poluição (ar, água, solo, sonora)
- Desmatamento
- Queimada
- Maus tratos a animais
- Descarte irregular de lixo/entulho
- Construção em APP
- Outros

Dados:
- Localização (endereço + GPS se possível)
- Descrição detalhada
- Fotos/vídeos (anexos)
- Data e hora da ocorrência
- Denunciante (opcional - pode ser anônimo)
- Contato (opcional)

Funcionalidades:
- Denúncias ambientais
- Fiscalização
- Autos de infração

**Vai para:** Módulo Denúncias Ambientais

---

#### 5. Áreas Protegidas
**Tipo:** INFORMATIVO + Gestão

Funcionalidades:
- Gestão de APPs e reservas
- Monitoramento
- Planos de manejo

---

#### 6. Programas Ambientais
**Tipo:** COM DADOS → Módulo Programas

Inscrições em programas.

Formulário de Inscrição:
- Nome do participante/instituição
- CPF/CNPJ

Programa desejado:
- Educação Ambiental
- Reflorestamento
- Coleta Seletiva
- Projetos de Sustentabilidade

Dados:
- Descrição do interesse/projeto
- Público-alvo (se aplicável)

Funcionalidades:
- Educação ambiental
- Reflorestamento
- Coleta seletiva
- Projetos de sustentabilidade

**Vai para:** Módulo Programas Ambientais

---

## 🏗️ SECRETARIA DE OBRAS PÚBLICAS

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ OBRAS E INTERVENÇÕES                            │
│ - Nome, Tipo, Localização, Orçamento            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ EQUIPES DE OBRAS                                │
│ - Nome, Responsável Técnico                     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ EQUIPAMENTOS E MÁQUINAS                         │
│ - Tipo, Placa, Status                           │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ CONTRATOS E LICITAÇÕES                          │
│ - Número, Empresa, Objeto, Valor                │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ LOGRADOUROS MUNICIPAIS                          │
│ - Nome, Bairro, Tipo Pavimento                  │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS DISPONÍVEIS

#### 1. Dashboard Obras
**Tipo:** INFORMATIVO (Painel Admin)

- Obras em andamento
- Percentual de execução
- Orçamento utilizado

---

#### 2. Atendimentos
**Tipo:** COM DADOS → Módulo Atendimentos

Solicitações de obras.

Formulário:
- Nome do cidadão

Tipo de solicitação:
- Buraco na via
- Problema de drenagem
- Iluminação pública
- Calçada irregular
- Outros

Dados:
- Endereço completo
- Ponto de referência
- Descrição do problema
- Fotos (anexos)
- Urgência

Funcionalidades:
- Solicitações de obras
- Reclamações
- Protocolo de demandas

**Vai para:** Módulo Atendimentos Obras

---

#### 3. Obras e Intervenções
**Tipo:** GESTÃO INTERNA

Funcionalidades:
- Cadastro de obras
- Cronograma e etapas
- Licitações e contratos

---

#### 4. Progresso de Obras
**Tipo:** INFORMATIVO (Transparência)

Funcionalidades:
- Acompanhamento percentual
- Medições e pagamentos
- Fotos de evolução

---

#### 5. Mapa de Obras
**Tipo:** INFORMATIVO

Funcionalidades:
- Visualização geoespacial
- Obras por região
- Status em tempo real

---

## 🏙️ SECRETARIA DE PLANEJAMENTO URBANO

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ PROJETOS ARQUITETÔNICOS                         │
│ - Processo, Proprietário, Endereço              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ALVARÁS EMITIDOS                                │
│ - Número, Tipo, Beneficiário                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ LOTEAMENTOS                                     │
│ - Nome, Área, Quantidade Lotes                  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ZONEAMENTO URBANO                               │
│ - Zona (residencial, comercial, industrial)     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ FISCAIS DE OBRAS                                │
│ - Nome, Matrícula, Área                         │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ CERTIDÕES EMITIDAS                              │
│ - Tipo, Número, Requerente                      │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS DISPONÍVEIS

#### 1. Dashboard Planejamento
**Tipo:** INFORMATIVO (Painel Admin)

- Indicadores urbanísticos
- Projetos em análise
- Alvarás emitidos

---

#### 2. Atendimentos
**Tipo:** COM DADOS → Módulo Atendimentos

Consultas técnicas.

Formulário:
- Nome do cidadão/empresa
- CPF/CNPJ
- Tipo de solicitação
- Endereço do imóvel (se aplicável)
- Descrição da consulta

Funcionalidades:
- Consultas técnicas
- Orientações urbanísticas
- Protocolo de projetos

**Vai para:** Módulo Atendimentos Planejamento

---

#### 3. Aprovação de Projetos
**Tipo:** COM DADOS → Módulo Projetos

Análise de projetos arquitetônicos.

Formulário:
- Dados do Proprietário/Requerente
- CPF/CNPJ
- Endereço do imóvel

Tipo de Projeto:
- Construção nova
- Ampliação
- Reforma
- Demolição
- Regularização

Dados técnicos:
- Área total do terreno (m²)
- Área a construir (m²)
- Número de pavimentos
- Uso pretendido (residencial, comercial, misto)
- Profissional responsável (arquiteto/engenheiro)
- ART/RRT
- Projeto arquitetônico completo (anexo)
- Memorial descritivo
- Documentação do imóvel (matrícula)

Funcionalidades:
- Análise de projetos arquitetônicos
- Conformidade com legislação
- Aprovação e ressalvas

**Vai para:** Módulo Aprovação de Projetos

---

#### 4. Emissão de Alvarás
**Tipo:** COM DADOS → Módulo Alvarás

A) ALVARÁ DE CONSTRUÇÃO:

Formulário:
- Projeto aprovado (número do processo)
- Dados do proprietário
- Endereço da obra
- Responsável técnico pela execução
- ART de execução
- Prazo estimado de obra

B) ALVARÁ DE FUNCIONAMENTO:

Formulário:
- Dados da empresa (nome, CNPJ)
- Responsável legal
- Endereço do estabelecimento
- Atividade econômica (CNAE)
- Área total (m²)
- Número de funcionários
- Horário de funcionamento
- Documentos: Contrato social, IPTU, Corpo de Bombeiros, Vigilância Sanitária (se aplicável)

Funcionalidades:
- Alvará de construção
- Alvará de funcionamento
- Certidões diversas

**Vai para:** Módulo de Alvarás

---

#### 5. Reclamações e Denúncias
**Tipo:** COM DADOS → Módulo Denúncias

Construções irregulares.

Formulário:

Tipo de Denúncia:
- Construção irregular
- Obra sem alvará
- Uso inadequado do solo
- Invasão de área pública
- Poluição visual
- Outros

Dados:
- Endereço do local denunciado
- Descrição detalhada
- Fotos (anexos)
- Denunciante (opcional - pode ser anônimo)

Funcionalidades:
- Construções irregulares
- Uso inadequado do solo
- Fiscalização

**Vai para:** Módulo Fiscalização Urbanística

---

#### 6. Consultas Públicas
**Tipo:** INFORMATIVO + Participação

Funcionalidades:
- Audiências públicas
- Plano diretor
- Participação popular

---

#### 7. Mapa Urbano
**Tipo:** INFORMATIVO

Funcionalidades:
- Zoneamento
- Loteamentos
- Uso do solo

---

## 🚨 SECRETARIA DE SEGURANÇA PÚBLICA

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ OCORRÊNCIAS REGISTRADAS                         │
│ - Boletim, Tipo, Localização                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ GUARDA MUNICIPAL                                │
│ - Nome, Matrícula, Posto/Graduação              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ VIATURAS                                        │
│ - Placa, Modelo, Tipo, Status                   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ BASES E POSTOS                                  │
│ - Nome, Endereço, Área de Cobertura             │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ CÂMERAS DE VIGILÂNCIA                           │
│ - Identificação, Localização                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PONTOS CRÍTICOS                                 │
│ - Localização, Tipo de Ocorrência               │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS DISPONÍVEIS

#### 1. Dashboard Segurança
**Tipo:** INFORMATIVO (Painel Admin)

- Indicadores de segurança
- Ocorrências registradas
- Pontos críticos

---

#### 2. Atendimentos
**Tipo:** COM DADOS → Módulo Atendimentos

Solicitações de apoio.

Formulário:
- Nome do solicitante
- Telefone de contato

Tipo de solicitação:
- Apoio da Guarda Municipal
- Ronda solicitada
- Informações sobre ocorrência
- Outros

Dados:
- Localização
- Descrição
- Urgência

Funcionalidades:
- Solicitações de apoio
- Rondas solicitadas
- Protocolo de demandas

**Vai para:** Módulo Atendimentos Segurança

---

#### 3. Registro de Ocorrências
**Tipo:** COM DADOS → Módulo Ocorrências

Boletins de ocorrência.

Formulário de Boletim de Ocorrência:

Tipo de Ocorrência:
- Furto
- Roubo
- Dano ao patrimônio
- Ameaça
- Perturbação do sossego
- Violência doméstica
- Acidente de trânsito
- Outros

Dados:
- Data e hora do fato
- Localização (endereço + GPS)
- Descrição detalhada dos fatos
- Vítima(s) - dados pessoais
- Autor(es) - se identificado
- Testemunhas - nome e contato
- Objetos envolvidos (se furto/roubo)
- Fotos/vídeos (anexos)
- Solicitante (nome, CPF, telefone)

Funcionalidades:
- Boletins de ocorrência
- Tipificação de crimes
- Estatísticas

**Vai para:** Módulo de Ocorrências

---

#### 4. Apoio da Guarda Municipal
**Tipo:** GESTÃO INTERNA

Funcionalidades:
- Escala de serviço
- Viaturas disponíveis
- Atendimentos realizados

---

#### 5. Mapa de Pontos Críticos
**Tipo:** INFORMATIVO + Planejamento

Funcionalidades:
- Heatmap de ocorrências
- Áreas de risco
- Planejamento de rondas

---

#### 6. Alertas de Segurança
**Tipo:** INFORMATIVO

Funcionalidades:
- Notificações à população
- Comunicação com PM
- Situações de emergência

---

#### 7. Estatísticas Regionais
**Tipo:** INFORMATIVO (Painel)

Funcionalidades:
- Ocorrências por bairro
- Tendências e análises
- Relatórios gerenciais

---

#### 8. Vigilância Integrada
**Tipo:** GESTÃO INTERNA

Funcionalidades:
- Câmeras de monitoramento
- Central de operações
- Integração com outros órgãos

---

## 🔧 SECRETARIA DE SERVIÇOS PÚBLICOS

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ EQUIPES DE SERVIÇO                              │
│ - Nome, Tipo, Responsável                       │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ROTAS DE COLETA                                 │
│ - Identificação, Bairros, Dias                  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ VEÍCULOS DE SERVIÇO                             │
│ - Placa, Tipo, Serviço, Status                  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PONTOS DE ILUMINAÇÃO                            │
│ - Localização, Tipo de Lâmpada                  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ CRONOGRAMA DE SERVIÇOS                          │
│ - Data, Equipe, Rota/Local                      │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS DISPONÍVEIS

#### 1. Dashboard Serviços
**Tipo:** INFORMATIVO (Painel Admin)

- Solicitações abertas
- Tempo médio de atendimento
- Equipes em campo

---

#### 2. Atendimentos
**Tipo:** COM DADOS → Módulo Atendimentos

Registro de solicitações.

Formulário:
- Nome do solicitante
- Telefone, email

Tipo de Solicitação:
- Iluminação pública
- Limpeza urbana
- Coleta de lixo
- Poda de árvore
- Retirada de entulho
- Capina
- Desobstrução de boca de lobo
- Outros

Dados:
- Endereço completo
- Ponto de referência
- Descrição do problema
- Fotos (anexos)
- Urgência

Funcionalidades:
- Registro de solicitações
- Protocolo de demandas
- Acompanhamento

**Vai para:** Módulo Atendimentos Serviços Públicos

---

#### 3. Iluminação Pública
**Tipo:** COM DADOS → Módulo Iluminação

Solicitações de reparo.

Formulário:
- Endereço do poste
- Número do poste (se houver)

Problema:
- Lâmpada queimada
- Lâmpada acesa durante o dia
- Poste inclinado/danificado
- Fiação exposta
- Outros

Dados:
- Ponto de referência
- Foto (anexo)

Funcionalidades:
- Solicitações de reparo
- Expansão de rede
- Mapa de pontos

**Vai para:** Módulo Iluminação Pública

---

#### 4. Limpeza Urbana
**Tipo:** COM DADOS → Módulo Limpeza

Coleta de lixo.

Formulário:

Tipo de Serviço:
- Varrição
- Capina
- Limpeza de área pública
- Desobstrução de boca de lobo

Dados:
- Endereço/localização
- Descrição
- Foto (anexo)

Funcionalidades:
- Coleta de lixo
- Varrição
- Capina

**Vai para:** Módulo Limpeza Urbana

---

#### 5. Coleta Especial
**Tipo:** COM DADOS → Módulo Coleta Especial

Entulho, poda, móveis.

Formulário:
- Nome do solicitante
- Endereço de coleta
- Telefone para agendamento

Tipo de material:
- Entulho
- Poda de árvore
- Móveis velhos
- Eletrodomésticos
- Outros

Dados:
- Quantidade estimada
- Fotos do material
- Disponibilidade para coleta

Funcionalidades:
- Entulho, poda, móveis
- Agendamento
- Rotas especiais

**Vai para:** Módulo Coleta Especial

---

#### 6. Problemas com Foto
**Tipo:** Funcionalidade Transversal

Funcionalidades:
- Registro fotográfico
- Geolocalização
- Antes e depois

---

#### 7. Programação de Equipes
**Tipo:** GESTÃO INTERNA

Funcionalidades:
- Escala de trabalho
- Rotas diárias
- Controle de produtividade

---

## 🗺️ SECRETARIA DE TURISMO

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ ATRATIVOS TURÍSTICOS                            │
│ - Nome, Tipo, Localização GPS                   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ESTABELECIMENTOS TURÍSTICOS                     │
│ - Nome, Tipo, CNPJ, Capacidade                  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ROTEIROS TURÍSTICOS                             │
│ - Nome, Duração, Atrativos                      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ EVENTOS TURÍSTICOS                              │
│ - Nome, Data, Local                             │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ GUIAS TURÍSTICOS                                │
│ - Nome, CADASTUR, Idiomas                       │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PROGRAMAS DE FOMENTO                            │
│ - Nome, Objetivo, Beneficiários                 │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS DISPONÍVEIS

#### 1. Dashboard Turismo
**Tipo:** INFORMATIVO (Painel Admin)

- Indicadores turísticos
- Eventos programados
- Estabelecimentos cadastrados

---

#### 2. Atendimentos
**Tipo:** COM DADOS → Módulo Atendimentos

Informações turísticas.

Formulário:
- Nome do solicitante

Tipo:
- Informações turísticas
- Apoio a empreendedores
- Outros

Dados:
- Descrição da solicitação
- Contato

Funcionalidades:
- Informações turísticas
- Apoio a empreendedores
- Protocolo de demandas

**Vai para:** Módulo Atendimentos Turismo

---

#### 3. Pontos Turísticos
**Tipo:** INFORMATIVO + Cadastro

Funcionalidades:
- Cadastro de atrativos
- Descrições e fotos
- Roteiros sugeridos

---

#### 4. Estabelecimentos Locais
**Tipo:** COM DADOS → Módulo Estabelecimentos

Hotéis, pousadas, restaurantes.

Formulário de Cadastro:

Tipo de Estabelecimento:
- Hotel
- Pousada
- Restaurante
- Lanchonete
- Agência de turismo
- Outros

Dados:
- Dados da Empresa (nome, CNPJ)
- Responsável legal
- Endereço completo
- Telefone, email, site
- Capacidade (quartos/mesas)
- Classificação (estrelas)
- Serviços oferecidos
- Fotos do estabelecimento

Documentação:
- Alvará de funcionamento
- CADASTUR (se aplicável)
- Vigilância Sanitária (se alimentação)

Funcionalidades:
- Hotéis, pousadas, restaurantes
- Cadastro e classificação
- Fiscalização

**Vai para:** Módulo Estabelecimentos Turísticos

---

#### 5. Programas Turísticos
**Tipo:** COM DADOS → Módulo Programas

Fomento ao turismo.

Formulário de Inscrição:
- Nome do interessado/empresa
- CPF/CNPJ

Programa desejado:
- Qualificação profissional
- Fomento ao turismo
- Marketing turístico
- Outros

Dados:
- Descrição do interesse
- Projeto (se aplicável)

Funcionalidades:
- Fomento ao turismo
- Qualificação profissional
- Marketing turístico

**Vai para:** Módulo Programas de Turismo

---

#### 6. Mapa Turístico
**Tipo:** INFORMATIVO

Funcionalidades:
- Visualização de atrativos
- Rotas turísticas
- Infraestrutura

---

#### 7. Informações Turísticas
**Tipo:** INFORMATIVO

Conteúdo:
- Guia da cidade
- Eventos e festas
- Contatos úteis

---

## 📊 RESUMO GERAL

```
═══════════════════════════════════════════════════
TOTAL DE SERVIÇOS DOCUMENTADOS: 100+
═══════════════════════════════════════════════════

DISTRIBUIÇÃO POR SECRETARIA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🩺 Saúde                          10 serviços
📚 Educação                        8 serviços
🤝 Assistência Social              8 serviços
🌾 Agricultura                     6 serviços
🎨 Cultura                         8 serviços
🏆 Esportes                        8 serviços
🏠 Habitação                       6 serviços
🌳 Meio Ambiente                   6 serviços
🏗️ Obras Públicas                  5 serviços
🏙️ Planejamento Urbano             7 serviços
🚨 Segurança Pública               8 serviços
🔧 Serviços Públicos               7 serviços
🗺️ Turismo                         7 serviços
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLASSIFICAÇÃO POR TIPO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 COM CAPTURA DE DADOS: ~60%
   → Geram protocolo
   → Vão para módulos especializados
   → Servidor gerencia no painel

📊 INFORMATIVOS: ~25%
   → Apenas acompanhamento
   → Notificações ao cidadão
   → Dashboards e relatórios

⚙️ GESTÃO INTERNA: ~15%
   → Não geram protocolo cidadão
   → Uso administrativo interno
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MOTOR DE PROTOCOLOS - NÚCLEO CENTRAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3 FORMAS DE CRIAÇÃO:
1. CIDADÃO → Portal (self-service)
2. PREFEITO → Chamado (criar para cidadão)
3. SERVIDOR → Manual (vincular a cidadão)

FLUXO DE STATUS:
VINCULADO → PROGRESSO → ATUALIZAÇÃO → CONCLUÍDO
                ↓
            PENDENCIA (alternativa)

2 TIPOS DE SERVIÇOS:
1. INFORMATIVOS
   - Apenas acompanhamento
   - Notificações de status

2. COM CAPTURA DE DADOS
   - Formulários completos
   - Vão para módulos especializados
   - Gestão por servidor da secretaria
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

**Documento Completo:** Fluxos Motor de Protocolos + Todos os Serviços
**Total de Serviços Documentados:** 100+ serviços detalhados
**15 Secretarias:** Análise completa
**Data:** 28/10/2025
