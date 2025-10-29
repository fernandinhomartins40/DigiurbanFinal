# MÓDULOS PADRÕES POR SECRETARIA

Análise baseada na lista de serviços fornecida e na Visão Unificada do sistema.

---

## 🩺 SECRETARIA DE SAÚDE

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ UNIDADES DE SAÚDE                               │
│ - Nome, Tipo (UBS, Hospital, Pronto Socorro)    │
│ - Endereço, Telefone                            │
│ - Horário de Funcionamento                      │
│ - Capacidade, Taxa de Ocupação                  │
│ - Especialidades Disponíveis                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PROFISSIONAIS DE SAÚDE                          │
│ - Nome, CPF, CRM/COREN                          │
│ - Especialidade                                 │
│ - Unidade de Lotação                            │
│ - Escala de Trabalho                            │
│ - Status (Ativo/Licença)                        │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PACIENTES                                       │
│ - Nome, CPF, Data Nascimento                    │
│ - Cartão SUS                                    │
│ - Endereço, Telefone                            │
│ - Histórico de Consultas                        │
│ - Condições Crônicas                            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ESPECIALIDADES MÉDICAS                          │
│ - Nome da Especialidade                         │
│ - Médicos Disponíveis                           │
│ - Unidades que Atendem                          │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ MEDICAMENTOS                                    │
│ - Nome, Princípio Ativo                         │
│ - Estoque por Unidade                           │
│ - Data de Validade                              │
│ - Nível Mínimo de Estoque                       │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PROGRAMAS DE SAÚDE                              │
│ - Nome (Hipertensão, Diabetes, Gestantes)       │
│ - Coordenador Responsável                       │
│ - Metas e Indicadores                           │
│ - Beneficiários Cadastrados                     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ AGENTES COMUNITÁRIOS (ACS)                      │
│ - Nome, CPF                                     │
│ - Território/Rota Atribuída                     │
│ - Famílias Sob Responsabilidade                 │
│ - Indicadores de Desempenho                     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ FROTA AMBULÂNCIAS                               │
│ - Placa, Modelo, Ano                            │
│ - Tipo (Suporte Básico/Avançado)                │
│ - Status (Disponível/Em Uso/Manutenção)         │
│ - Equipe Designada                              │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS (Geram Protocolos)

**COM CAPTURA DE DADOS:**
- Agendamento de Consulta → vai para Módulo de Consultas
- Solicitação de Medicamento → vai para Módulo de Farmácia
- Solicitação de Exame → vai para Módulo de Exames
- TFD (Tratamento Fora do Domicílio) → vai para Módulo TFD
- Transporte de Paciente → vai para Módulo de Ambulâncias
- Inscrição em Programa de Saúde → vai para Módulo de Programas

**INFORMATIVOS:**
- Consulta de Resultados de Exames
- Informações sobre Campanhas de Vacinação

---

## 📚 SECRETARIA DE EDUCAÇÃO

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ ESCOLAS                                         │
│ - Nome, Código INEP                             │
│ - Endereço, Telefone                            │
│ - Tipo (Creche, Pré, Fundamental, Médio)        │
│ - Capacidade, Infraestrutura                    │
│ - Diretor Responsável                           │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PROFESSORES                                     │
│ - Nome, CPF, Matrícula                          │
│ - Disciplinas que Leciona                       │
│ - Escola de Lotação                             │
│ - Carga Horária                                 │
│ - Status (Ativo/Licença)                        │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ALUNOS                                          │
│ - Nome, Data Nascimento                         │
│ - Responsável Legal                             │
│ - Escola, Série, Turma, Turno                   │
│ - Histórico Escolar                             │
│ - Necessidades Especiais                        │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ TURMAS                                          │
│ - Escola, Série, Turno                          │
│ - Professor Regente                             │
│ - Quantidade de Alunos                          │
│ - Sala de Aula                                  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PERÍODOS/TURNOS                                 │
│ - Manhã, Tarde, Noite, Integral                 │
│ - Horário de Início e Término                   │
│ - Escolas que Oferecem                          │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ TRANSPORTE ESCOLAR                              │
│ - Rotas Definidas                               │
│ - Veículos (Placa, Capacidade)                  │
│ - Motoristas e Monitores                        │
│ - Alunos por Rota                               │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ MERENDA ESCOLAR                                 │
│ - Cardápios Nutricionais                        │
│ - Estoque de Alimentos por Escola               │
│ - Fornecedores                                  │
│ - Controle de Consumo Diário                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ CALENDÁRIO ESCOLAR                              │
│ - Ano Letivo                                    │
│ - Períodos de Aula                              │
│ - Feriados e Recessos                           │
│ - Eventos e Reuniões                            │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS (Geram Protocolos)

**COM CAPTURA DE DADOS:**
- Matrícula de Aluno → vai para Módulo de Matrículas
- Transferência Escolar → vai para Módulo de Matrículas
- Solicitação de Transporte Escolar → vai para Módulo de Transporte
- Solicitação de Documento Escolar → vai para Módulo de Documentos
- Registro de Ocorrência → vai para Módulo de Ocorrências

**INFORMATIVOS:**
- Consulta de Frequência
- Consulta de Notas

---

## 🤝 SECRETARIA DE ASSISTÊNCIA SOCIAL

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ FAMÍLIAS CADASTRADAS                            │
│ - NIS (Número de Identificação Social)          │
│ - Responsável Familiar                          │
│ - Composição Familiar                           │
│ - Renda Per Capita                              │
│ - Índice de Vulnerabilidade                     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ EQUIPAMENTOS SOCIAIS                            │
│ - CRAS (Centro de Referência Assistência)       │
│ - CREAS (Centro Especializado)                  │
│ - Casa de Passagem                              │
│ - Endereço, Capacidade                          │
│ - Equipe Técnica                                │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PROGRAMAS SOCIAIS                               │
│ - Nome (Auxílio Brasil, BPC, Tarifa Social)     │
│ - Requisitos de Elegibilidade                   │
│ - Beneficiários Ativos                          │
│ - Orçamento e Recursos                          │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ASSISTENTES SOCIAIS                             │
│ - Nome, CRESS                                   │
│ - Equipamento de Lotação                        │
│ - Famílias Acompanhadas                         │
│ - Especialização                                │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ BENEFÍCIOS CONCEDIDOS                           │
│ - Tipo de Benefício                             │
│ - Família Beneficiária                          │
│ - Data de Concessão                             │
│ - Vigência e Renovação                          │
│ - Condicionalidades                             │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ESTOQUE DE ITENS EMERGENCIAIS                   │
│ - Cestas Básicas                                │
│ - Kits Higiene                                  │
│ - Cobertores, Colchões                          │
│ - Quantidade Disponível                         │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS (Geram Protocolos)

**COM CAPTURA DE DADOS:**
- Inscrição no Cadastro Único → vai para Módulo de Famílias
- Solicitação de Benefício → vai para Módulo de Benefícios
- Solicitação de Cesta Básica → vai para Módulo de Entregas Emergenciais
- Agendamento de Atendimento Social → vai para Módulo de Atendimentos
- Inscrição em Grupo/Oficina → vai para Módulo de Grupos

**INFORMATIVOS:**
- Consulta de Status de Benefício
- Orientações sobre Programas Sociais

---

## 🌾 SECRETARIA DE AGRICULTURA

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ PRODUTORES RURAIS                               │
│ - Nome, CPF, Telefone                           │
│ - Endereço                                      │
│ - DAP (Declaração de Aptidão PRONAF)            │
│ - Status (Ativo/Inativo)                        │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PROPRIEDADES RURAIS                             │
│ - Nome da Propriedade                           │
│ - Área (hectares)                               │
│ - Localização (GPS)                             │
│ - Produtor Responsável                          │
│ - Tipo de Produção                              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PRODUÇÕES AGRÍCOLAS                             │
│ - Cultura (Milho, Soja, Feijão, etc)            │
│ - Propriedade                                   │
│ - Área Plantada                                 │
│ - Safra                                         │
│ - Produtividade                                 │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ TÉCNICOS AGRÍCOLAS                              │
│ - Nome, CREA                                    │
│ - Especialização                                │
│ - Produtores Atendidos                          │
│ - Área de Atuação                               │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PROGRAMAS RURAIS                                │
│ - Nome do Programa                              │
│ - Tipo (Crédito, Capacitação, Tecnologia)       │
│ - Coordenador                                   │
│ - Participantes                                 │
│ - Orçamento                                     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ CURSOS E CAPACITAÇÕES                           │
│ - Nome do Curso                                 │
│ - Modalidade (Presencial/Online)                │
│ - Instrutor                                     │
│ - Vagas Totais/Ocupadas                         │
│ - Datas e Carga Horária                         │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ESTOQUE DE INSUMOS                              │
│ - Sementes (tipos e variedades)                 │
│ - Fertilizantes                                 │
│ - Defensivos Agrícolas                          │
│ - Quantidade Disponível                         │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS (Geram Protocolos)

**COM CAPTURA DE DADOS:**
- Solicitação de Assistência Técnica (ATER) → vai para Módulo ATER
- Solicitação de Sementes → vai para Módulo de Distribuição
- Solicitação de Análise de Solo → vai para Módulo de Análises
- Inscrição em Curso/Capacitação → vai para Módulo de Cursos
- Inscrição em Programa Rural → vai para Módulo de Programas
- Cadastro de Produtor → vai para Módulo de Produtores

**INFORMATIVOS:**
- Consulta de Calendário Agrícola
- Orientações Técnicas

---

## 🎨 SECRETARIA DE CULTURA

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ ESPAÇOS CULTURAIS                               │
│ - Nome (Teatro, Centro Cultural, Biblioteca)    │
│ - Endereço, Capacidade                          │
│ - Infraestrutura Disponível                     │
│ - Horários de Funcionamento                     │
│ - Responsável                                   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ GRUPOS ARTÍSTICOS                               │
│ - Nome do Grupo                                 │
│ - Tipo (Teatro, Dança, Música)                  │
│ - Representante Legal                           │
│ - Contato                                       │
│ - Histórico de Apresentações                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ EVENTOS CULTURAIS                               │
│ - Nome do Evento                                │
│ - Data e Horário                                │
│ - Local                                         │
│ - Público Esperado                              │
│ - Organizador                                   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ OFICINAS E CURSOS                               │
│ - Nome da Oficina                               │
│ - Instrutor                                     │
│ - Vagas Totais/Ocupadas                         │
│ - Datas e Horários                              │
│ - Local                                         │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PROJETOS CULTURAIS                              │
│ - Nome do Projeto                               │
│ - Proponente                                    │
│ - Edital/Lei de Incentivo                       │
│ - Orçamento Aprovado                            │
│ - Status de Execução                            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PATRIMÔNIO CULTURAL                             │
│ - Nome do Bem/Manifestação                      │
│ - Tipo (Material/Imaterial)                     │
│ - Localização                                   │
│ - Estado de Conservação                         │
│ - Tombamento                                    │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS (Geram Protocolos)

**COM CAPTURA DE DADOS:**
- Reserva de Espaço Cultural → vai para Módulo de Espaços
- Inscrição em Oficina → vai para Módulo de Oficinas
- Submissão de Projeto Cultural → vai para Módulo de Projetos
- Cadastro de Grupo Artístico → vai para Módulo de Grupos

**INFORMATIVOS:**
- Agenda Cultural
- Informações sobre Eventos

---

## 🏆 SECRETARIA DE ESPORTES

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ EQUIPAMENTOS ESPORTIVOS                         │
│ - Nome (Ginásio, Campo, Quadra, Piscina)        │
│ - Endereço                                      │
│ - Capacidade                                    │
│ - Modalidades Suportadas                        │
│ - Status (Disponível/Manutenção)                │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ESCOLINHAS ESPORTIVAS                           │
│ - Modalidade                                    │
│ - Professor/Treinador                           │
│ - Local de Treinamento                          │
│ - Horários                                      │
│ - Vagas Totais/Ocupadas                         │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ATLETAS FEDERADOS                               │
│ - Nome, CPF, Data Nascimento                    │
│ - Modalidade                                    │
│ - Equipe/Escolinha                              │
│ - Carteira de Atleta                            │
│ - Histórico de Desempenho                       │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ EQUIPES MUNICIPAIS                              │
│ - Nome da Equipe                                │
│ - Modalidade                                    │
│ - Categoria (Sub-15, Adulto, etc)               │
│ - Técnico Responsável                           │
│ - Lista de Atletas                              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ COMPETIÇÕES E TORNEIOS                          │
│ - Nome da Competição                            │
│ - Modalidade                                    │
│ - Data de Realização                            │
│ - Local                                         │
│ - Equipes Participantes                         │
│ - Classificações                                │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PROFESSORES/TREINADORES                         │
│ - Nome, CREF                                    │
│ - Modalidades                                   │
│ - Escolinhas que Coordena                       │
│ - Carga Horária                                 │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS (Geram Protocolos)

**COM CAPTURA DE DADOS:**
- Inscrição em Escolinha → vai para Módulo de Escolinhas
- Cadastro de Atleta → vai para Módulo de Atletas
- Reserva de Espaço Esportivo → vai para Módulo de Equipamentos
- Inscrição em Competição → vai para Módulo de Competições

**INFORMATIVOS:**
- Calendário Esportivo
- Resultados de Jogos

---

## 🏠 SECRETARIA DE HABITAÇÃO

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ PROGRAMAS HABITACIONAIS                         │
│ - Nome (MCMV, Municipal, Estadual)              │
│ - Requisitos de Elegibilidade                   │
│ - Unidades Disponíveis                          │
│ - Fila de Espera                                │
│ - Coordenador                                   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ UNIDADES HABITACIONAIS                          │
│ - Endereço                                      │
│ - Tipo (Casa/Apartamento)                       │
│ - Metragem                                      │
│ - Programa Vinculado                            │
│ - Status (Disponível/Ocupado)                   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ FAMÍLIAS INSCRITAS                              │
│ - Responsável                                   │
│ - Composição Familiar                           │
│ - Renda Familiar                                │
│ - Pontuação (critérios)                         │
│ - Programa Inscrito                             │
│ - Posição na Fila                               │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PROCESSOS DE REGULARIZAÇÃO                      │
│ - Endereço do Imóvel                            │
│ - Proprietário                                  │
│ - Área do Terreno                               │
│ - Documentação                                  │
│ - Status do Processo                            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ASSISTENTES SOCIAIS HABITAÇÃO                   │
│ - Nome, CRESS                                   │
│ - Famílias Acompanhadas                         │
│ - Visitas Realizadas                            │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS (Geram Protocolos)

**COM CAPTURA DE DADOS:**
- Inscrição em Programa Habitacional → vai para Módulo de Inscrições
- Solicitação de Regularização Fundiária → vai para Módulo de Regularização
- Solicitação de Auxílio Aluguel → vai para Módulo de Benefícios

**INFORMATIVOS:**
- Consulta de Posição na Fila
- Orientações sobre Programas

---

## 🌳 SECRETARIA DE MEIO AMBIENTE

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ ÁREAS PROTEGIDAS                                │
│ - Nome da Área (APP, Reserva)                   │
│ - Localização (GPS)                             │
│ - Área Total (hectares)                         │
│ - Tipo de Proteção                              │
│ - Plano de Manejo                               │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ LICENÇAS AMBIENTAIS                             │
│ - Número do Processo                            │
│ - Requerente                                    │
│ - Tipo de Licença (LP, LI, LO)                  │
│ - Empreendimento                                │
│ - Status (Em Análise/Aprovado/Negado)           │
│ - Validade                                      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ DENÚNCIAS AMBIENTAIS                            │
│ - Número do Registro                            │
│ - Tipo de Denúncia                              │
│ - Localização                                   │
│ - Denunciante (opcional)                        │
│ - Fiscal Responsável                            │
│ - Status                                        │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ FISCAIS AMBIENTAIS                              │
│ - Nome, Matrícula                               │
│ - Área de Atuação                               │
│ - Processos Designados                          │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PROGRAMAS AMBIENTAIS                            │
│ - Nome (Coleta Seletiva, Reflorestamento)       │
│ - Coordenador                                   │
│ - Metas e Indicadores                           │
│ - Participantes                                 │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ AUTOS DE INFRAÇÃO                               │
│ - Número do Auto                                │
│ - Infrator                                      │
│ - Tipo de Infração                              │
│ - Valor da Multa                                │
│ - Status (Aberto/Pago/Recorrido)                │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS (Geram Protocolos)

**COM CAPTURA DE DADOS:**
- Solicitação de Licença Ambiental → vai para Módulo de Licenças
- Registro de Denúncia Ambiental → vai para Módulo de Denúncias
- Autorização para Poda/Corte de Árvore → vai para Módulo de Autorizações
- Solicitação de Vistoria Ambiental → vai para Módulo de Vistorias

**INFORMATIVOS:**
- Consulta de Status de Licença
- Orientações Ambientais

---

## 🏗️ SECRETARIA DE OBRAS PÚBLICAS

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ OBRAS E INTERVENÇÕES                            │
│ - Nome da Obra                                  │
│ - Tipo (Pavimentação, Drenagem, Construção)     │
│ - Localização                                   │
│ - Orçamento                                     │
│ - Empresa Contratada                            │
│ - Percentual de Execução                        │
│ - Prazo                                         │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ EQUIPES DE OBRAS                                │
│ - Nome da Equipe                                │
│ - Responsável Técnico                           │
│ - Funcionários                                  │
│ - Equipamentos Disponíveis                      │
│ - Obras Designadas                              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ EQUIPAMENTOS E MÁQUINAS                         │
│ - Tipo (Retroescavadeira, Caminhão, etc)        │
│ - Placa/Identificação                           │
│ - Status (Disponível/Em Uso/Manutenção)         │
│ - Equipe Responsável                            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ CONTRATOS E LICITAÇÕES                          │
│ - Número do Contrato                            │
│ - Empresa Contratada                            │
│ - Objeto                                        │
│ - Valor                                         │
│ - Vigência                                      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ LOGRADOUROS MUNICIPAIS                          │
│ - Nome da Rua/Avenida                           │
│ - Bairro                                        │
│ - Tipo de Pavimento                             │
│ - Estado de Conservação                         │
│ - Última Manutenção                             │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS (Geram Protocolos)

**INFORMATIVOS (maioria):**
- Solicitação de Reparo de Via (buraco)
- Solicitação de Iluminação Pública
- Solicitação de Limpeza de Boca de Lobo
- Solicitação de Capina
- Reclamação sobre Obra Pública

**COM CAPTURA DE DADOS:**
- Vistoria Técnica → vai para Módulo de Vistorias

---

## 🏙️ SECRETARIA DE PLANEJAMENTO URBANO

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ PROJETOS ARQUITETÔNICOS                         │
│ - Número do Processo                            │
│ - Proprietário                                  │
│ - Endereço do Imóvel                            │
│ - Tipo de Projeto                               │
│ - Área Total                                    │
│ - Status (Em Análise/Aprovado/Reprovado)        │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ALVARÁS EMITIDOS                                │
│ - Número do Alvará                              │
│ - Tipo (Construção/Funcionamento)               │
│ - Beneficiário                                  │
│ - Endereço                                      │
│ - Data de Emissão                               │
│ - Validade                                      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ LOTEAMENTOS                                     │
│ - Nome do Loteamento                            │
│ - Responsável Técnico                           │
│ - Área Total                                    │
│ - Quantidade de Lotes                           │
│ - Status de Regularização                       │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ZONEAMENTO URBANO                               │
│ - Zona (Residencial, Comercial, Industrial)     │
│ - Área Abrangida                                │
│ - Restrições e Parâmetros                       │
│ - Lei que Institui                              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ FISCAIS DE OBRAS                                │
│ - Nome, Matrícula                               │
│ - Área de Atuação                               │
│ - Processos Designados                          │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ CERTIDÕES EMITIDAS                              │
│ - Tipo de Certidão                              │
│ - Número                                        │
│ - Requerente                                    │
│ - Data de Emissão                               │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS (Geram Protocolos)

**COM CAPTURA DE DADOS:**
- Aprovação de Projeto Arquitetônico → vai para Módulo de Projetos
- Solicitação de Alvará de Construção → vai para Módulo de Alvarás
- Solicitação de Alvará de Funcionamento → vai para Módulo de Alvarás
- Solicitação de Certidão → vai para Módulo de Certidões
- Denúncia de Construção Irregular → vai para Módulo de Denúncias

**INFORMATIVOS:**
- Consulta de Zoneamento
- Consulta de Status de Alvará

---

## 🚨 SECRETARIA DE SEGURANÇA PÚBLICA

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ OCORRÊNCIAS REGISTRADAS                         │
│ - Número do Boletim                             │
│ - Tipo de Ocorrência                            │
│ - Localização                                   │
│ - Data e Hora                                   │
│ - Vítimas e Envolvidos                          │
│ - Status                                        │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ GUARDA MUNICIPAL                                │
│ - Nome, Matrícula                               │
│ - Posto/Graduação                               │
│ - Escala de Serviço                             │
│ - Base de Lotação                               │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ VIATURAS                                        │
│ - Placa, Modelo                                 │
│ - Tipo (Ronda, Apoio)                           │
│ - Base                                          │
│ - Status (Disponível/Em Patrulha/Manutenção)    │
│ - Guarnição Atual                               │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ BASES E POSTOS                                  │
│ - Nome da Base                                  │
│ - Endereço                                      │
│ - Área de Cobertura                             │
│ - Efetivo                                       │
│ - Equipamentos                                  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ CÂMERAS DE VIGILÂNCIA                           │
│ - Identificação                                 │
│ - Localização                                   │
│ - Status (Ativa/Inativa)                        │
│ - Central de Monitoramento                      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PONTOS CRÍTICOS                                 │
│ - Localização                                   │
│ - Tipo de Ocorrência Frequente                  │
│ - Nível de Risco                                │
│ - Ações Preventivas                             │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS (Geram Protocolos)

**COM CAPTURA DE DADOS:**
- Registro de Boletim de Ocorrência → vai para Módulo de Ocorrências
- Solicitação de Ronda → vai para Módulo de Rondas
- Solicitação de Câmera de Segurança → vai para Módulo de Câmeras
- Denúncia Anônima → vai para Módulo de Denúncias

**INFORMATIVOS:**
- Consulta de Status de Ocorrência
- Alertas de Segurança

---

## 🔧 SECRETARIA DE SERVIÇOS PÚBLICOS

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ EQUIPES DE SERVIÇO                              │
│ - Nome da Equipe                                │
│ - Tipo (Limpeza, Iluminação, Coleta)            │
│ - Responsável                                   │
│ - Funcionários                                  │
│ - Equipamentos                                  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ROTAS DE COLETA                                 │
│ - Identificação da Rota                         │
│ - Bairros Atendidos                             │
│ - Dias da Semana                                │
│ - Horários                                      │
│ - Equipe Responsável                            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ VEÍCULOS DE SERVIÇO                             │
│ - Placa, Tipo (Caminhão, Trator)                │
│ - Serviço (Coleta, Varrição, Poda)              │
│ - Status (Disponível/Em Uso/Manutenção)         │
│ - Equipe Designada                              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PONTOS DE ILUMINAÇÃO                            │
│ - Localização (Rua, Número)                     │
│ - Tipo de Lâmpada                               │
│ - Status (Funcionando/Queimada)                 │
│ - Última Manutenção                             │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ CRONOGRAMA DE SERVIÇOS                          │
│ - Data                                          │
│ - Equipe                                        │
│ - Rota/Local                                    │
│ - Tipo de Serviço                               │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS (Geram Protocolos)

**INFORMATIVOS (maioria):**
- Solicitação de Reparo de Iluminação
- Solicitação de Limpeza de Terreno
- Solicitação de Capina
- Solicitação de Retirada de Entulho
- Solicitação de Poda de Árvore
- Reclamação de Coleta de Lixo

---

## 🗺️ SECRETARIA DE TURISMO

### MÓDULOS PADRÕES (Base de Dados)

```
┌─────────────────────────────────────────────────┐
│ ATRATIVOS TURÍSTICOS                            │
│ - Nome do Atrativo                              │
│ - Tipo (Natural, Cultural, Histórico)           │
│ - Localização (GPS)                             │
│ - Descrição                                     │
│ - Infraestrutura                                │
│ - Horários de Visitação                         │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ESTABELECIMENTOS TURÍSTICOS                     │
│ - Nome do Estabelecimento                       │
│ - Tipo (Hotel, Pousada, Restaurante)            │
│ - CNPJ                                          │
│ - Endereço, Telefone                            │
│ - Capacidade                                    │
│ - Classificação                                 │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ROTEIROS TURÍSTICOS                             │
│ - Nome do Roteiro                               │
│ - Duração                                       │
│ - Atrativos Inclusos                            │
│ - Descrição                                     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ EVENTOS TURÍSTICOS                              │
│ - Nome do Evento                                │
│ - Data                                          │
│ - Local                                         │
│ - Público Esperado                              │
│ - Organizador                                   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ GUIAS TURÍSTICOS                                │
│ - Nome, CPF                                     │
│ - CADASTUR                                      │
│ - Idiomas                                       │
│ - Especializações                               │
│ - Contato                                       │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PROGRAMAS DE FOMENTO                            │
│ - Nome do Programa                              │
│ - Objetivo                                      │
│ - Beneficiários                                 │
│ - Orçamento                                     │
└─────────────────────────────────────────────────┘
```

### SERVIÇOS (Geram Protocolos)

**COM CAPTURA DE DADOS:**
- Cadastro de Estabelecimento Turístico → vai para Módulo de Estabelecimentos
- Cadastro de Guia Turístico → vai para Módulo de Guias
- Inscrição em Programa de Qualificação → vai para Módulo de Programas
- Registro de Atrativo Turístico → vai para Módulo de Atrativos

**INFORMATIVOS:**
- Consulta de Roteiros Turísticos
- Agenda de Eventos Turísticos

---

## RESUMO: ESTRUTURA GERAL DOS MÓDULOS

```
TODA SECRETARIA POSSUI:

1. MÓDULOS PADRÕES (Base de Dados)
   ↓
   Cadastros estruturados da secretaria
   Relacionamentos entre entidades
   Gestão interna dos dados

2. SERVIÇOS INFORMATIVOS
   ↓
   Geram protocolos simples
   Apenas acompanhamento de status
   Notificações ao cidadão

3. SERVIÇOS COM CAPTURA DE DADOS
   ↓
   Geram protocolos + dados
   Vão para o Módulo Padrão correspondente
   Servidor gerencia no painel especializado
```

---

**Documento:** Módulos Padrões por Secretaria
**Objetivo:** Definir base de dados estruturada de cada secretaria
**Baseado em:** Lista de serviços fornecida + Visão Unificada
**Data:** 28/10/2025
