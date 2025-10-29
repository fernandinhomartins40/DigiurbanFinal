# SERVIÇOS COMPLETOS - TODAS AS SECRETARIAS

Análise completa de TODOS os serviços listados, organizados por secretaria.

---

## 🩺 SECRETARIA DE SAÚDE

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ UNIDADES DE SAÚDE                               │
│ - UBS Centro, UBS Bairro Alto                   │
│ - Hospital Municipal, Pronto Socorro            │
│ - Endereço, Capacidade, Especialidades          │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PROFISSIONAIS DE SAÚDE                          │
│ - Médicos, Enfermeiros, Técnicos                │
│ - Especialidade, CRM/COREN                      │
│ - Unidade de Lotação                            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PACIENTES                                       │
│ - Cadastro completo                             │
│ - Cartão SUS                                    │
│ - Histórico de atendimentos                     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ESPECIALIDADES MÉDICAS                          │
│ - Cardiologia, Ortopedia, etc                   │
│ - Médicos disponíveis                           │
│ - Unidades que oferecem                         │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ MEDICAMENTOS (ESTOQUE)                          │
│ - Farmácia básica                               │
│ - Estoque por unidade                           │
│ - Validade, nível mínimo                        │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PROGRAMAS DE SAÚDE                              │
│ - Vacinação COVID-19                            │
│ - Hipertensos, Diabetes                         │
│ - Saúde da Mulher, Puericultura                 │
│ - Gestantes, Idosos                             │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ AGENTES COMUNITÁRIOS (ACS)                      │
│ - Cadastro de agentes                           │
│ - Territórios e rotas                           │
│ - Famílias acompanhadas                         │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ FROTA DE AMBULÂNCIAS                            │
│ - Veículos disponíveis                          │
│ - Tipo (suporte básico/avançado)                │
│ - Equipe, status                                │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ LABORATÓRIOS CONVENIADOS                        │
│ - Nome, CNPJ                                    │
│ - Tipos de exames                               │
│ - Integração para laudos                        │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS DISPONÍVEIS

**1. Dashboard Saúde** (Informativo - Painel Admin)
```
- Consultas hoje
- Pacientes cadastrados
- Taxa de ocupação
- Emergências
- Cobertura de vacinação
```

**2. Atendimentos** (COM DADOS → Módulo Atendimentos)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
Formulário:
- Tipo de atendimento (consulta, emergência, retorno)
- Paciente (busca por CPF/Cartão SUS)
- Unidade de atendimento
- Profissional responsável
- Queixa/Sintomas
- Classificação de risco (triagem)
- Prontuário eletrônico

Vai para: Sistema PDV de Atendimentos
```

**3. Agendamentos Médicos** (COM DADOS → Módulo Agendamentos)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
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

Vai para: Módulo de Agendamentos
```

**4. Controle de Medicamentos** (COM DADOS → Módulo Farmácia)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
Formulário:
- Paciente (CPF/Cartão SUS)
- Medicamento solicitado
- Receita médica (anexo)
- Quantidade
- Unidade de retirada

Funcionalidades:
- Controle de estoque
- Dispensação controlada
- Alertas de vencimento/ruptura
- Solicitações de reposição

Vai para: Módulo de Farmácia Básica
```

**5. Campanhas de Saúde** (COM DADOS → Módulo Campanhas)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
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

Vai para: Módulo de Campanhas
```

**6. Programas de Saúde** (COM DADOS → Módulo Programas)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
Formulário de Inscrição:
- Paciente (CPF/Cartão SUS)
- Programa (Hipertensão, Diabetes, Gestantes, Idosos)
- Dados específicos do programa
- Profissional responsável

Funcionalidades:
- Cadastro de beneficiários
- Metas e indicadores
- Acompanhamento longitudinal

Vai para: Módulo de Programas de Saúde
```

**7. Encaminhamentos TFD** (COM DADOS → Módulo TFD)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
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

Vai para: Módulo TFD (Tratamento Fora do Domicílio)
```

**8. Exames** (COM DADOS → Módulo Exames)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
Formulário:
- Paciente (CPF/Cartão SUS)
- Tipo de exame (laboratorial, imagem)
- Pedido médico (anexo)
- Urgência
- Unidade/Laboratório
- Data preferencial

Funcionalidades:
- Agendamento de exames
- Resultados online
- Controle de laudos
- Integração com laboratórios

Vai para: Módulo de Exames
```

**9. ACS - Agentes Comunitários** (Gestão Interna)
```
Tipo: MÓDULO PADRÃO (não gera protocolo cidadão)
Funcionalidades:
- Cadastro de agentes
- Definição de rotas e territórios
- Registro de visitas domiciliares
- Indicadores por agente
```

**10. Transporte de Pacientes** (COM DADOS → Módulo Transporte)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
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

Vai para: Módulo de Transporte de Pacientes
```

---

## 📚 SECRETARIA DE EDUCAÇÃO

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ ESCOLAS                                         │
│ - 4 unidades ativas                             │
│ - Código INEP, endereço                         │
│ - Infraestrutura (salas, labs, bibliotecas)     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PROFESSORES                                     │
│ - Cadastro completo                             │
│ - Disciplinas, carga horária                    │
│ - Escola de lotação                             │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ALUNOS                                          │
│ - 1.375 matriculados                            │
│ - Dados pessoais e responsáveis                 │
│ - Escola, série, turma, turno                   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ TURMAS                                          │
│ - Série, turno, escola                          │
│ - Professor regente                             │
│ - Alunos matriculados                           │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PERÍODOS/TURNOS                                 │
│ - Manhã, Tarde, Noite, Integral                 │
│ - Horários                                      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ TRANSPORTE ESCOLAR                              │
│ - 72 estudantes transportados                   │
│ - Rotas, veículos, motoristas                   │
│ - Monitoramento GPS                             │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ MERENDA ESCOLAR                                 │
│ - Cardápios nutricionais                        │
│ - Estoque por escola                            │
│ - Fornecedores                                  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ CALENDÁRIO ESCOLAR                              │
│ - Ano letivo, períodos                          │
│ - Feriados, recessos                            │
│ - Eventos pedagógicos                           │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS DISPONÍVEIS

**1. Dashboard Educação** (Informativo - Painel Admin)
```
Indicadores:
- Alunos: 1.375 matriculados
- Escolas: 4 unidades ativas
- Frequência: 94.3% média
- Transporte: 72 estudantes

Gráficos:
- Distribuição por escola
- Evolução de frequência
- Matrículas por nível

Qualidade:
- Taxa de aprovação
- Taxa de evasão
- Alunos por turma

Infraestrutura:
- Salas de aula
- Laboratórios
- Bibliotecas
- Quadras esportivas

Merenda:
- Refeições/dia
- Cardápios
- Taxa de aceitação
```

**2. Atendimentos** (COM DADOS → Módulo Atendimentos)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
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

Vai para: Módulo de Atendimentos Escolares
```

**3. Matrícula de Alunos** (COM DADOS → Módulo Matrículas)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
Formulário:
- Dados do Aluno (nome, data nascimento, CPF)
- Dados do Responsável (nome, CPF, telefone)
- Endereço completo
- Série/Ano desejado
- Turno preferencial (manhã/tarde/integral)
- Escola de preferência (1ª, 2ª, 3ª opção)
- Necessidades especiais (se houver)
- Documentos: RG/Certidão, Comprovante residência, Histórico (se transferência)

Funcionalidades:
- Sistema online de matrículas novas
- Rematrículas automáticas (alunos já cadastrados)
- Transferências entre escolas
- Geração de histórico escolar

Vai para: Módulo de Matrículas
```

**4. Gestão Escolar** (Gestão Interna - não gera protocolo cidadão)
```
Funcionalidades:
- Administração de unidades escolares
- Gestão de diretores e coordenadores
- Controle de infraestrutura
- Recursos humanos por escola
```

**5. Transporte Escolar** (COM DADOS → Módulo Transporte)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
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

Vai para: Módulo de Transporte Escolar
```

**6. Merenda Escolar** (Gestão Interna)
```
Funcionalidades:
- Planejamento de cardápios nutricionais
- Controle de estoque de alimentos
- Gestão de fornecedores
- Relatórios de consumo por escola
```

**7. Registro de Ocorrências** (COM DADOS → Módulo Ocorrências)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
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

Vai para: Módulo de Ocorrências Escolares
```

**8. Calendário Escolar** (Informativo)
```
Tipo: SERVIÇO INFORMATIVO
- Consulta de calendário anual letivo
- Feriados e eventos escolares
- Períodos de férias e recesso
- Reuniões pedagógicas e conselhos de classe
```

---

## 🤝 SECRETARIA DE ASSISTÊNCIA SOCIAL

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ FAMÍLIAS CADASTRADAS                            │
│ - NIS, responsável familiar                     │
│ - Composição, renda                             │
│ - Índice de vulnerabilidade                     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ EQUIPAMENTOS SOCIAIS                            │
│ - CRAS Centro, CRAS Bairro Alto                 │
│ - CREAS Municipal, Casa de Passagem             │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PROGRAMAS SOCIAIS                               │
│ - Auxílio Brasil, BPC                           │
│ - Tarifa Social, Casa da Família                │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ASSISTENTES SOCIAIS                             │
│ - CRESS, equipamento                            │
│ - Famílias acompanhadas                         │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ BENEFÍCIOS CONCEDIDOS                           │
│ - Tipo, família, vigência                       │
│ - Condicionalidades                             │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ESTOQUE EMERGENCIAL                             │
│ - Cestas básicas, kits higiene                  │
│ - Cobertores, colchões                          │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS DISPONÍVEIS

**1. Dashboard Assistência Social** (Informativo - Painel Admin)
```
Indicadores:
- Atendimentos hoje
- Famílias cadastradas
- Benefícios ativos
- Entregas emergenciais

Equipamentos:
- CRAS Centro
- CRAS Bairro Alto
- CREAS Municipal
- Casa de Passagem

Programas:
- Auxílio Brasil
- BPC
- Tarifa Social
- Casa da Família
```

**2. Atendimentos** (COM DADOS → Módulo Atendimentos)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
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

Vai para: Módulo de Atendimentos Sociais
```

**3. Famílias Vulneráveis** (COM DADOS → Módulo Cadastro Único)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
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

Vai para: Módulo Cadastro Único
```

**4. CRAS e CREAS** (Gestão Interna + Serviços)
```
Funcionalidades:
- Gestão de equipamentos sociais
- Controle de capacidade
- Agendamento de serviços especializados
- Grupos e oficinas
```

**5. Programas Sociais** (COM DADOS → Módulo Programas)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
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

Vai para: Módulo de Programas Sociais
```

**6. Gerenciamento de Benefícios** (COM DADOS → Módulo Benefícios)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
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

Vai para: Módulo de Benefícios
```

**7. Entregas Emergenciais** (COM DADOS → Módulo Entregas)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
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

Vai para: Módulo de Entregas Emergenciais
```

**8. Registro de Visitas** (COM DADOS → Módulo Visitas)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS (uso interno)
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

Vai para: Módulo de Visitas Domiciliares
```

---

## 🌾 SECRETARIA DE AGRICULTURA

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ PRODUTORES RURAIS                               │
│ - CPF, telefone, email, endereço                │
│ - DAP (PRONAF)                                  │
│ - Status: Ativo/Inativo/Pendente                │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PROPRIEDADES RURAIS                             │
│ - Nome, área (hectares)                         │
│ - Localização GPS                               │
│ - Produtor responsável                          │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PRODUÇÕES AGRÍCOLAS                             │
│ - Milho, Soja, Feijão, Arroz, Trigo             │
│ - Café, Cana, Hortaliças, Frutas                │
│ - Pecuária, Avicultura, Suinocultura            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ TÉCNICOS AGRÍCOLAS                              │
│ - Nome, CREA                                    │
│ - Especialização                                │
│ - Produtores atendidos                          │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PROGRAMAS RURAIS                                │
│ - Sustentabilidade, Tecnologia                  │
│ - Capacitação, Crédito                          │
│ - Pecuária, Agricultura Familiar                │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ CURSOS E CAPACITAÇÕES                           │
│ - Presencial, Online, Híbrido                   │
│ - Instrutor, vagas, certificação                │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS DISPONÍVEIS

**1. Dashboard Agricultura** (Informativo - Painel Admin)
```
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
```

**2. Cadastro de Produtores** (COM DADOS → Módulo Produtores)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
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
- Café, Cana-de-açúcar
- Hortaliças, Frutas
- Pecuária, Avicultura, Suinocultura

DAP:
- Declaração de Aptidão ao PRONAF
- Número da DAP
- Validade

Histórico:
- Atendimentos anteriores
- Observações

Vai para: Módulo de Produtores Rurais
```

**3. Assistência Técnica** (COM DADOS → Módulo ATER)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
Formulário:
- Produtor (busca por CPF)
- Propriedade
- Tipo de assistência:
  * Manejo de Pragas
  * Irrigação
  * Adubação
  * Fitossanidade
  * Manejo de Solo
  * Melhoramento Genético
  * Mecanização
  * Pós-Colheita

- Cultura/Atividade afetada
- Descrição do problema
- Data preferencial para visita
- Urgência (Baixa, Média, Alta, Urgente)

Funcionalidades:
- Categorias: Fitossanidade, Manejo Solo, Irrigação, etc
- Planejamento de visitas
- Técnico responsável
- Custo estimado
- Status: Planejada, Em Execução, Concluída, Suspensa, Cancelada
- Avaliação do produtor (feedback)

Vai para: Módulo ATER (Assistência Técnica Rural)
```

**4. Atendimentos** (COM DADOS → Módulo Atendimentos)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
Formulário:
- Produtor (CPF)
- Categoria:
  * Assistência Técnica
  * Crédito Rural
  * Capacitação
  * Inspeção
  * Outros

- Propriedade relacionada
- Área afetada (hectares)
- Cultura/Produção
- Descrição do problema/solicitação
- Localização GPS (se aplicável)
- Anexos: Fotos e documentos
- Prioridade (Baixa, Média, Alta, Urgente)

Funcionalidades:
- Sistema PDV para atendimento completo
- Protocolo automático: AGR-2025-XXXX
- Dados técnicos detalhados

Vai para: Módulo de Atendimentos Agricultura
```

**5. Cursos e Capacitações** (COM DADOS → Módulo Cursos)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
Formulário de Inscrição:
- Produtor (nome, CPF)
- Curso desejado
- Modalidade preferencial (Presencial/Online/Híbrido)
- Disponibilidade de horário

Categorias de Cursos:
- Sustentabilidade
- Tecnologia Agrícola
- Gestão Rural
- Produção
- Qualidade

Funcionalidades:
- Instrutor, datas, carga horária
- Controle de vagas (total, ocupadas, percentual)
- Certificação (emissão de certificados)
- Status: Planejado, Inscrições Abertas, Em Andamento, Finalizado

Vai para: Módulo de Cursos e Capacitações
```

**6. Programas Rurais** (COM DADOS → Módulo Programas)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
Formulário de Inscrição:
- Produtor (CPF)
- Programa desejado
- Dados da propriedade
- Documentação comprobatória

Tipos de Programas:
- Sustentabilidade
- Tecnologia
- Capacitação
- Crédito Rural
- Pecuária
- Agricultura Familiar

Funcionalidades:
- Coordenador responsável
- Público-alvo e requisitos
- Cronograma
- Orçamento e controle financeiro
- Participantes (inscritos e ativos)
- Status: Planejamento, Inscrições, Execução, Concluído

Vai para: Módulo de Programas Rurais
```

---

## 🎨 SECRETARIA DE CULTURA

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ ESPAÇOS CULTURAIS                               │
│ - Teatros, centros culturais, bibliotecas       │
│ - Capacidade, infraestrutura                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ GRUPOS ARTÍSTICOS                               │
│ - Nome, tipo (teatro, dança, música)            │
│ - Representante, histórico                      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ EVENTOS CULTURAIS                               │
│ - Shows, apresentações, exposições              │
│ - Data, local, público esperado                 │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ OFICINAS E CURSOS                               │
│ - Oficinas de arte e cultura                    │
│ - Instrutor, vagas, certificação                │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PROJETOS CULTURAIS                              │
│ - Editais e leis de incentivo                   │
│ - Proponente, orçamento                         │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PATRIMÔNIO CULTURAL                             │
│ - Manifestações culturais                       │
│ - Festas tradicionais                           │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS DISPONÍVEIS

**1. Dashboard Cultura** (Informativo - Painel Admin)
```
- Indicadores culturais
- Eventos e projetos ativos
- Espaços culturais disponíveis
```

**2. Atendimentos** (COM DADOS → Módulo Atendimentos)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
Formulário:
- Nome do cidadão/artista
- Tipo de solicitação cultural
- Descrição detalhada
- Apoio necessário

Funcionalidades:
- Solicitações culturais
- Apoio a artistas e grupos
- Protocolo de demandas

Vai para: Módulo de Atendimentos Culturais
```

**3. Espaços Culturais** (COM DADOS → Módulo Espaços)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
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
- Controle de disponibilidade
- Manutenção de equipamentos

Vai para: Módulo de Espaços Culturais
```

**4. Eventos** (Informativo + Gestão Interna)
```
Funcionalidades:
- Calendário cultural
- Shows, apresentações, exposições
- Controle de ingressos
- Controle de público

Pode gerar protocolo se cidadão solicitar participar/apresentar
```

**5. Grupos Artísticos** (COM DADOS → Módulo Grupos)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
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
- Agendamento de apresentações em espaços públicos

Vai para: Módulo de Grupos Artísticos
```

**6. Oficinas e Cursos** (COM DADOS → Módulo Oficinas)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
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
- Lista de presença
- Certificação

Vai para: Módulo de Oficinas Culturais
```

**7. Manifestações Culturais** (Informativo + Registro)
```
Funcionalidades:
- Patrimônio imaterial
- Festas tradicionais
- Registro de manifestações
- Calendário de eventos tradicionais
```

**8. Projetos Culturais** (COM DADOS → Módulo Projetos)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
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
- Editais e leis de incentivo à cultura
- Acompanhamento de projetos aprovados
- Prestação de contas
- Relatórios de execução

Vai para: Módulo de Projetos Culturais
```

---

## 🏆 SECRETARIA DE ESPORTES

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ EQUIPAMENTOS ESPORTIVOS                         │
│ - Quadras, campos, ginásios, piscinas           │
│ - Capacidade, status                            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ESCOLINHAS ESPORTIVAS                           │
│ - Modalidade, professor/treinador               │
│ - Horários, vagas                               │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ATLETAS FEDERADOS                               │
│ - Nome, CPF, modalidade                         │
│ - Carteira de atleta, desempenho                │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ EQUIPES MUNICIPAIS                              │
│ - Nome, modalidade, categoria                   │
│ - Técnico, lista de atletas                     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ COMPETIÇÕES E TORNEIOS                          │
│ - Nome, modalidade, data                        │
│ - Local, participantes, classificação           │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PROFESSORES/TREINADORES                         │
│ - Nome, CREF, modalidades                       │
│ - Escolinhas que coordena                       │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS DISPONÍVEIS

**1. Dashboard Esportes** (Informativo - Painel Admin)
```
- Indicadores esportivos
- Eventos e competições
- Atletas e equipes cadastradas
```

**2. Atendimentos** (COM DADOS → Módulo Atendimentos)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
Formulário:
- Nome do cidadão/atleta
- Tipo de solicitação esportiva
- Descrição
- Apoio necessário

Funcionalidades:
- Solicitações esportivas
- Apoio a atletas
- Protocolo de demandas

Vai para: Módulo de Atendimentos Esportivos
```

**3. Equipes Esportivas** (Gestão Interna)
```
Funcionalidades:
- Cadastro de equipes municipais
- Modalidades esportivas
- Histórico de resultados
- Gestão de atletas por equipe
```

**4. Competições e Torneios** (COM DADOS → Módulo Competições)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS (para inscrições)
Formulário:
- Nome da equipe/atleta
- Modalidade
- Categoria
- Representante responsável
- Lista de atletas (se equipe)
- Documentação (fichas médicas, autorizações)

Funcionalidades:
- Calendário esportivo
- Organização de eventos
- Inscrições de equipes/atletas
- Classificações e resultados
- Tabelas de jogos

Vai para: Módulo de Competições
```

**5. Atletas Federados** (COM DADOS → Módulo Atletas)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
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
- Cadastro de atletas no município
- Emissão de carteira de atleta
- Acompanhamento de desempenho
- Histórico de competições

Vai para: Módulo de Atletas Federados
```

**6. Escolinhas Esportivas** (COM DADOS → Módulo Escolinhas)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
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
- Programas de iniciação esportiva
- Inscrições e controle de vagas
- Horários e locais de treino
- Listas de presença
- Avaliações de desenvolvimento

Vai para: Módulo de Escolinhas Esportivas
```

**7. Eventos Esportivos** (Informativo + Gestão)
```
Funcionalidades:
- Jogos, campeonatos, festivais
- Apoio logístico
- Controle de público
- Divulgação

Pode gerar protocolo se cidadão solicitar organizar evento
```

**8. Infraestrutura Esportiva** (COM DADOS → Módulo Reservas)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
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
- Controle de disponibilidade

Vai para: Módulo de Reservas de Espaços Esportivos
```

---

## 🏠 SECRETARIA DE HABITAÇÃO

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ PROGRAMAS HABITACIONAIS                         │
│ - MCMV, programas municipais                    │
│ - Requisitos, fila de espera                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ UNIDADES HABITACIONAIS                          │
│ - Endereço, tipo, metragem                      │
│ - Status (disponível/ocupado)                   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ FAMÍLIAS INSCRITAS                              │
│ - Responsável, composição                       │
│ - Renda, pontuação, posição na fila             │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PROCESSOS DE REGULARIZAÇÃO                      │
│ - Endereço, proprietário                        │
│ - Documentação, status                          │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ASSISTENTES SOCIAIS                             │
│ - Nome, CRESS                                   │
│ - Famílias acompanhadas, visitas                │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS DISPONÍVEIS

**1. Dashboard Habitação** (Informativo - Painel Admin)
```
- Indicadores habitacionais
- Programas ativos
- Unidades disponíveis
```

**2. Atendimentos** (COM DADOS → Módulo Atendimentos)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
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

Vai para: Módulo de Atendimentos Habitação
```

**3. Inscrições** (COM DADOS → Módulo Inscrições)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
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
- Critérios especiais:
  * Pessoa com deficiência na família?
  * Idoso na família?
  * Gestante?
  * Família monoparental?
- Documentos anexos (RG, CPF, Comprovante residência, Comprovante renda)

Funcionalidades:
- Cadastro em programas habitacionais
- Análise de documentação
- Cálculo de pontuação
- Inclusão em fila de espera
- Posição na fila

Vai para: Módulo de Inscrições Habitacionais
```

**4. Programas Habitacionais** (Informativo + Inscrições)
```
Programas:
- Minha Casa Minha Vida (MCMV)
- Programas municipais
- Parcerias estaduais/federais

Cada programa gera inscrição específica
```

**5. Unidades Habitacionais** (Gestão Interna)
```
Funcionalidades:
- Gestão do estoque de imóveis
- Alocação de beneficiários
- Controle de ocupação
- Vistorias
```

**6. Regularização Fundiária** (COM DADOS → Módulo Regularização)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
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
- Processos de regularização fundiária
- Análise de documentação de imóveis
- Emissão de títulos de propriedade
- Acompanhamento do processo

Vai para: Módulo de Regularização Fundiária
```

---

## 🌳 SECRETARIA DE MEIO AMBIENTE

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ ÁREAS PROTEGIDAS                                │
│ - APPs, reservas, localização GPS               │
│ - Plano de manejo                               │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ LICENÇAS AMBIENTAIS                             │
│ - Processo, requerente, tipo (LP/LI/LO)         │
│ - Status, validade                              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ DENÚNCIAS AMBIENTAIS                            │
│ - Registro, tipo, localização                   │
│ - Fiscal responsável, status                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ FISCAIS AMBIENTAIS                              │
│ - Nome, matrícula, área de atuação              │
│ - Processos designados                          │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PROGRAMAS AMBIENTAIS                            │
│ - Coleta Seletiva, Reflorestamento              │
│ - Educação Ambiental                            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ AUTOS DE INFRAÇÃO                               │
│ - Número, infrator, tipo                        │
│ - Multa, status                                 │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS DISPONÍVEIS

**1. Dashboard Meio Ambiente** (Informativo - Painel Admin)
```
- Indicadores ambientais
- Licenças emitidas
- Áreas protegidas
- Denúncias registradas
```

**2. Atendimentos** (COM DADOS → Módulo Atendimentos)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
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

Vai para: Módulo de Atendimentos Ambientais
```

**3. Licenças Ambientais** (COM DADOS → Módulo Licenças)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
Formulário:
- Dados do Requerente (nome, CPF/CNPJ)
- Tipo de Licença:
  * LP - Licença Prévia
  * LI - Licença de Instalação
  * LO - Licença de Operação
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
- Controle de validade
- Vistorias técnicas

Vai para: Módulo de Licenciamento Ambiental
```

**4. Registro de Denúncias** (COM DADOS → Módulo Denúncias)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
Formulário:
- Tipo de Denúncia:
  * Poluição (ar, água, solo, sonora)
  * Desmatamento
  * Queimada
  * Maus tratos a animais
  * Descarte irregular de lixo/entulho
  * Construção em APP
  * Outros

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
- Acompanhamento do processo

Vai para: Módulo de Denúncias Ambientais
```

**5. Áreas Protegidas** (Informativo + Gestão)
```
Funcionalidades:
- Gestão de APPs e reservas
- Monitoramento
- Planos de manejo
- Educação ambiental
```

**6. Programas Ambientais** (COM DADOS → Módulo Programas)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS (para inscrições)
Formulário de Inscrição:
- Nome do participante/instituição
- CPF/CNPJ
- Programa desejado:
  * Educação Ambiental
  * Reflorestamento
  * Coleta Seletiva
  * Projetos de Sustentabilidade

- Descrição do interesse/projeto
- Público-alvo (se aplicável)

Funcionalidades:
- Educação ambiental
- Reflorestamento
- Coleta seletiva
- Projetos de sustentabilidade
- Oficinas e cursos

Vai para: Módulo de Programas Ambientais
```

---

## 🏗️ SECRETARIA DE OBRAS PÚBLICAS

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ OBRAS E INTERVENÇÕES                            │
│ - Nome, tipo, localização                       │
│ - Orçamento, empresa, percentual execução       │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ EQUIPES DE OBRAS                                │
│ - Nome, responsável técnico                     │
│ - Funcionários, equipamentos                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ EQUIPAMENTOS E MÁQUINAS                         │
│ - Tipo, placa, status                           │
│ - Equipe responsável                            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ CONTRATOS E LICITAÇÕES                          │
│ - Número, empresa, objeto, valor, vigência      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ LOGRADOUROS MUNICIPAIS                          │
│ - Nome, bairro, tipo pavimento                  │
│ - Estado de conservação                         │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS DISPONÍVEIS

**1. Dashboard Obras** (Informativo - Painel Admin)
```
- Obras em andamento
- Percentual de execução
- Orçamento utilizado
- Mapa de obras por região
```

**2. Atendimentos** (COM DADOS → Módulo Atendimentos)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
Formulário:
- Nome do cidadão
- Tipo de solicitação:
  * Buraco na via
  * Problema de drenagem
  * Iluminação pública
  * Calçada irregular
  * Outros

- Endereço completo
- Ponto de referência
- Descrição do problema
- Fotos (anexos)
- Urgência

Funcionalidades:
- Solicitações de obras
- Reclamações
- Protocolo de demandas

Vai para: Módulo de Atendimentos Obras
```

**3. Obras e Intervenções** (Gestão Interna)
```
Funcionalidades:
- Cadastro de obras
- Cronograma e etapas
- Licitações e contratos
- Controle de execução
```

**4. Progresso de Obras** (Informativo - Transparência)
```
Funcionalidades:
- Acompanhamento percentual de execução
- Medições e pagamentos
- Fotos de evolução
- Cronograma vs realizado
```

**5. Mapa de Obras** (Informativo)
```
Funcionalidades:
- Visualização geoespacial
- Obras por região
- Status em tempo real
- Filtros por tipo de obra
```

---

## 🏙️ SECRETARIA DE PLANEJAMENTO URBANO

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ PROJETOS ARQUITETÔNICOS                         │
│ - Processo, proprietário, endereço              │
│ - Tipo, área, status                            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ALVARÁS EMITIDOS                                │
│ - Número, tipo, beneficiário                    │
│ - Endereço, validade                            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ LOTEAMENTOS                                     │
│ - Nome, área, quantidade lotes                  │
│ - Status de regularização                       │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ZONEAMENTO URBANO                               │
│ - Zona (residencial, comercial, industrial)     │
│ - Restrições e parâmetros                       │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ FISCAIS DE OBRAS                                │
│ - Nome, matrícula, área de atuação              │
│ - Processos designados                          │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ CERTIDÕES EMITIDAS                              │
│ - Tipo, número, requerente, data                │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS DISPONÍVEIS

**1. Dashboard Planejamento** (Informativo - Painel Admin)
```
- Indicadores urbanísticos
- Projetos em análise
- Alvarás emitidos
- Processos por status
```

**2. Atendimentos** (COM DADOS → Módulo Atendimentos)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
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

Vai para: Módulo de Atendimentos Planejamento
```

**3. Aprovação de Projetos** (COM DADOS → Módulo Projetos)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
Formulário:
- Dados do Proprietário/Requerente
- CPF/CNPJ
- Endereço do imóvel
- Tipo de Projeto:
  * Construção nova
  * Ampliação
  * Reforma
  * Demolição
  * Regularização

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
- Conformidade com legislação urbanística
- Aprovação e ressalvas
- Notificações de pendências

Vai para: Módulo de Aprovação de Projetos
```

**4. Emissão de Alvarás** (COM DADOS → Módulo Alvarás)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS

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
- Renovações
- Certidões diversas

Vai para: Módulo de Alvarás
```

**5. Reclamações e Denúncias** (COM DADOS → Módulo Denúncias)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
Formulário:
- Tipo de Denúncia:
  * Construção irregular
  * Obra sem alvará
  * Uso inadequado do solo
  * Invasão de área pública
  * Poluição visual
  * Outros

- Endereço do local denunciado
- Descrição detalhada
- Fotos (anexos)
- Denunciante (opcional - pode ser anônimo)

Funcionalidades:
- Construções irregulares
- Uso inadequado do solo
- Fiscalização
- Autos de notificação/infração

Vai para: Módulo de Fiscalização Urbanística
```

**6. Consultas Públicas** (Informativo + Participação)
```
Funcionalidades:
- Audiências públicas
- Revisão de plano diretor
- Participação popular
- Sugestões da comunidade
```

**7. Mapa Urbano** (Informativo)
```
Funcionalidades:
- Visualização de zoneamento
- Loteamentos aprovados
- Uso do solo
- Equipamentos públicos
```

---

## 🚨 SECRETARIA DE SEGURANÇA PÚBLICA

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ OCORRÊNCIAS REGISTRADAS                         │
│ - Boletim, tipo, localização                    │
│ - Vítimas, envolvidos, status                   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ GUARDA MUNICIPAL                                │
│ - Nome, matrícula, posto/graduação              │
│ - Escala, base de lotação                       │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ VIATURAS                                        │
│ - Placa, modelo, tipo                           │
│ - Status, guarnição atual                       │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ BASES E POSTOS                                  │
│ - Nome, endereço, área de cobertura             │
│ - Efetivo, equipamentos                         │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ CÂMERAS DE VIGILÂNCIA                           │
│ - Identificação, localização                    │
│ - Status, central de monitoramento              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PONTOS CRÍTICOS                                 │
│ - Localização, tipo de ocorrência frequente     │
│ - Nível de risco, ações preventivas             │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS DISPONÍVEIS

**1. Dashboard Segurança** (Informativo - Painel Admin)
```
- Indicadores de segurança
- Ocorrências registradas (últimas 24h)
- Pontos críticos
- Viaturas em patrulha
- Mapas de calor
```

**2. Atendimentos** (COM DADOS → Módulo Atendimentos)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
Formulário:
- Nome do solicitante
- Telefone de contato
- Tipo de solicitação:
  * Apoio da Guarda Municipal
  * Ronda solicitada
  * Informações sobre ocorrência
  * Outros

- Localização
- Descrição
- Urgência

Funcionalidades:
- Solicitações de apoio
- Rondas solicitadas
- Protocolo de demandas

Vai para: Módulo de Atendimentos Segurança
```

**3. Registro de Ocorrências** (COM DADOS → Módulo Ocorrências)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
Formulário de Boletim de Ocorrência:
- Tipo de Ocorrência:
  * Furto
  * Roubo
  * Dano ao patrimônio
  * Ameaça
  * Perturbação do sossego
  * Violência doméstica
  * Acidente de trânsito
  * Outros

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
- Boletins de ocorrência online
- Tipificação de crimes/infrações
- Estatísticas por tipo e região
- Acompanhamento do B.O.

Vai para: Módulo de Ocorrências
```

**4. Apoio da Guarda Municipal** (Gestão Interna)
```
Funcionalidades:
- Escala de serviço
- Viaturas disponíveis
- Atendimentos realizados
- Relatórios de atividades
```

**5. Mapa de Pontos Críticos** (Informativo + Planejamento)
```
Funcionalidades:
- Heatmap de ocorrências
- Identificação de áreas de risco
- Planejamento de rondas preventivas
- Histórico de ocorrências por região
```

**6. Alertas de Segurança** (Informativo)
```
Funcionalidades:
- Notificações à população
- Comunicação com Polícia Militar
- Situações de emergência
- Avisos preventivos
```

**7. Estatísticas Regionais** (Informativo - Painel)
```
Funcionalidades:
- Ocorrências por bairro
- Tendências e análises
- Relatórios gerenciais
- Comparativos temporais
```

**8. Vigilância Integrada** (Gestão Interna)
```
Funcionalidades:
- Câmeras de monitoramento (visualização)
- Central de operações
- Integração com outros órgãos (PM, Corpo de Bombeiros)
- Despacho de viaturas
```

---

## 🔧 SECRETARIA DE SERVIÇOS PÚBLICOS

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ EQUIPES DE SERVIÇO                              │
│ - Nome, tipo, responsável                       │
│ - Funcionários, equipamentos                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ROTAS DE COLETA                                 │
│ - Identificação, bairros atendidos              │
│ - Dias da semana, horários                      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ VEÍCULOS DE SERVIÇO                             │
│ - Placa, tipo, serviço                          │
│ - Status, equipe designada                      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PONTOS DE ILUMINAÇÃO                            │
│ - Localização, tipo de lâmpada                  │
│ - Status, última manutenção                     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ CRONOGRAMA DE SERVIÇOS                          │
│ - Data, equipe, rota/local                      │
│ - Tipo de serviço                               │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS DISPONÍVEIS

**1. Dashboard Serviços** (Informativo - Painel Admin)
```
- Solicitações abertas
- Tempo médio de atendimento
- Equipes em campo
- Serviços concluídos (dia/semana/mês)
```

**2. Atendimentos** (COM DADOS → Módulo Atendimentos)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
Formulário:
- Nome do solicitante
- Telefone, email
- Tipo de Solicitação:
  * Iluminação pública
  * Limpeza urbana
  * Coleta de lixo
  * Poda de árvore
  * Retirada de entulho
  * Capina
  * Desobstrução de boca de lobo
  * Outros

- Endereço completo
- Ponto de referência
- Descrição do problema
- Fotos (anexos)
- Urgência

Funcionalidades:
- Registro de solicitações
- Protocolo de demandas
- Acompanhamento de status

Vai para: Módulo de Atendimentos Serviços Públicos
```

**3. Iluminação Pública** (COM DADOS → Módulo Iluminação)
```
Tipo: SERVIÇO INFORMATIVO
Formulário:
- Endereço do poste
- Número do poste (se houver)
- Problema:
  * Lâmpada queimada
  * Lâmpada acesa durante o dia
  * Poste inclinado/danificado
  * Fiação exposta
  * Outros

- Ponto de referência
- Foto (anexo)

Funcionalidades:
- Solicitações de reparo
- Expansão de rede
- Mapa de pontos de iluminação
- Controle de manutenção

Vai para: Módulo de Iluminação Pública
```

**4. Limpeza Urbana** (COM DADOS → Módulo Limpeza)
```
Tipo: SERVIÇO INFORMATIVO
Formulário:
- Tipo de Serviço:
  * Varrição
  * Capina
  * Limpeza de área pública
  * Desobstrução de boca de lobo

- Endereço/localização
- Descrição
- Foto (anexo)

Funcionalidades:
- Coleta de lixo (rotas e horários)
- Varrição de vias
- Capina de terrenos públicos
- Cronograma por bairro

Vai para: Módulo de Limpeza Urbana
```

**5. Coleta Especial** (COM DADOS → Módulo Coleta Especial)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
Formulário:
- Nome do solicitante
- Endereço de coleta
- Telefone para agendamento
- Tipo de material:
  * Entulho
  * Poda de árvore
  * Móveis velhos
  * Eletrodomésticos
  * Outros

- Quantidade estimada
- Fotos do material
- Disponibilidade para coleta

Funcionalidades:
- Entulho, poda, móveis
- Agendamento de coleta
- Rotas especiais
- Controle de volume coletado

Vai para: Módulo de Coleta Especial
```

**6. Problemas com Foto** (Funcionalidade Transversal)
```
Tipo: Melhoria na solicitação
Funcionalidades:
- Registro fotográfico obrigatório
- Geolocalização automática (GPS)
- Foto antes e depois (quando concluído)
- Validação da execução
```

**7. Programação de Equipes** (Gestão Interna)
```
Funcionalidades:
- Escala de trabalho das equipes
- Rotas diárias por equipe
- Controle de produtividade
- Relatórios de serviços executados
```

---

## 🗺️ SECRETARIA DE TURISMO

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ ATRATIVOS TURÍSTICOS                            │
│ - Nome, tipo, localização GPS                   │
│ - Descrição, infraestrutura                     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ESTABELECIMENTOS TURÍSTICOS                     │
│ - Nome, tipo, CNPJ                              │
│ - Capacidade, classificação                     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ROTEIROS TURÍSTICOS                             │
│ - Nome, duração, atrativos inclusos             │
│ - Descrição                                     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ EVENTOS TURÍSTICOS                              │
│ - Nome, data, local                             │
│ - Público esperado, organizador                 │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ GUIAS TURÍSTICOS                                │
│ - Nome, CADASTUR, idiomas                       │
│ - Especializações, contato                      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PROGRAMAS DE FOMENTO                            │
│ - Nome, objetivo, beneficiários                 │
│ - Orçamento                                     │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS DISPONÍVEIS

**1. Dashboard Turismo** (Informativo - Painel Admin)
```
- Indicadores turísticos
- Eventos programados
- Estabelecimentos cadastrados
- Visitantes (estimativa)
```

**2. Atendimentos** (COM DADOS → Módulo Atendimentos)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
Formulário:
- Nome do solicitante
- Tipo:
  * Informações turísticas
  * Apoio a empreendedores
  * Outros

- Descrição da solicitação
- Contato

Funcionalidades:
- Informações turísticas
- Apoio a empreendedores
- Protocolo de demandas

Vai para: Módulo de Atendimentos Turismo
```

**3. Pontos Turísticos** (Informativo + Cadastro)
```
Funcionalidades:
- Cadastro de atrativos turísticos
- Descrições e fotos
- Roteiros sugeridos
- Horários de visitação
```

**4. Estabelecimentos Locais** (COM DADOS → Módulo Estabelecimentos)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
Formulário de Cadastro:
- Tipo de Estabelecimento:
  * Hotel
  * Pousada
  * Restaurante
  * Lanchonete
  * Agência de turismo
  * Outros

- Dados da Empresa (nome, CNPJ)
- Responsável legal
- Endereço completo
- Telefone, email, site
- Capacidade (quartos/mesas)
- Classificação (estrelas)
- Serviços oferecidos
- Fotos do estabelecimento
- Documentação:
  * Alvará de funcionamento
  * CADASTUR (se aplicável)
  * Vigilância Sanitária (se alimentação)

Funcionalidades:
- Hotéis, pousadas, restaurantes
- Cadastro e classificação
- Fiscalização
- Guia turístico oficial

Vai para: Módulo de Estabelecimentos Turísticos
```

**5. Programas Turísticos** (COM DADOS → Módulo Programas)
```
Tipo: SERVIÇO COM CAPTURA DE DADOS
Formulário de Inscrição:
- Nome do interessado/empresa
- CPF/CNPJ
- Programa desejado:
  * Qualificação profissional
  * Fomento ao turismo
  * Marketing turístico
  * Outros

- Descrição do interesse
- Projeto (se aplicável)

Funcionalidades:
- Fomento ao turismo
- Qualificação profissional
- Marketing turístico
- Eventos promocionais

Vai para: Módulo de Programas de Turismo
```

**6. Mapa Turístico** (Informativo)
```
Funcionalidades:
- Visualização de atrativos turísticos
- Rotas turísticas sugeridas
- Infraestrutura (hotéis, restaurantes)
- Pontos de apoio ao turista
```

**7. Informações Turísticas** (Informativo)
```
Tipo: SERVIÇO INFORMATIVO
Conteúdo:
- Guia da cidade
- Principais atrativos
- Eventos e festas tradicionais
- Calendário de eventos
- Contatos úteis (hotéis, restaurantes, táxis)
- Como chegar
- Dicas de segurança
```

---

## RESUMO GERAL

```
TOTAL DE SERVIÇOS ANALISADOS: 100+

DISTRIBUIÇÃO:
- Saúde: 10 serviços
- Educação: 8 serviços
- Assistência Social: 8 serviços
- Agricultura: 6 serviços
- Cultura: 8 serviços
- Esportes: 8 serviços
- Habitação: 6 serviços
- Meio Ambiente: 6 serviços
- Obras Públicas: 5 serviços
- Planejamento Urbano: 7 serviços
- Segurança Pública: 8 serviços
- Serviços Públicos: 7 serviços
- Turismo: 7 serviços

TIPOS:
- Serviços COM CAPTURA DE DADOS: ~60%
  → Vão para módulos especializados
  → Servidor gerencia no painel

- Serviços INFORMATIVOS: ~25%
  → Apenas acompanhamento de status
  → Notificações ao cidadão

- Gestão Interna: ~15%
  → Não geram protocolo de cidadão
  → Uso administrativo interno
```

---

**Documento:** Serviços Completos - Todas as Secretarias
**Total de Serviços:** 100+ serviços detalhados
**Data:** 28/10/2025
