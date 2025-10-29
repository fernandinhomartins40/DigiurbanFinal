# VISÃO UNIFICADA DO SISTEMA

## O Motor de Protocolos é o CENTRO

Todo o sistema gira em torno do **MOTOR DE PROTOCOLOS**. Ele é o núcleo que gerencia todas as transações.

---

## Estrutura Simplificada

```
                    ┌──────────────────────┐
                    │  MOTOR DE PROTOCOLOS │
                    │     (NÚCLEO)         │
                    └──────────┬───────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ↓              ↓              ↓
         ┌───────────┐  ┌───────────┐  ┌───────────┐
         │ SERVIÇOS  │  │ PROTOCOLOS│  │  MÓDULOS  │
         │ (Catálogo)│  │  (Fluxo)  │  │ (Gestão)  │
         └───────────┘  └───────────┘  └───────────┘
              │              │              │
              └──────────────┼──────────────┘
                             ↓
                    SISTEMA COMPLETO
```

---

## 3 Formas de Criar Protocolo

```
PROTOCOLO PODE SER CRIADO POR:

1. CIDADÃO
   ↓
   Portal do Cidadão → Catálogo → Seleciona Serviço → PROTOCOLO CRIADO

2. PREFEITO (Chamado)
   ↓
   Painel Admin → Cria Chamado → Vincula Cidadão + Serviço → Envia para Setor → PROTOCOLO CRIADO

3. SERVIDOR (Manual)
   ↓
   Painel do Setor → Seleciona Cidadão → Seleciona Serviço → PROTOCOLO CRIADO
```

---

## 2 Tipos de Serviços

```
SERVIÇOS PODEM SER:

┌────────────────────────────────────────────────────────────┐
│  1. SERVIÇOS INFORMATIVOS                                  │
│                                                            │
│  Cidadão apenas SOLICITA e ACOMPANHA                       │
│  Servidor apenas ATUALIZA STATUS e ENVIA NOTIFICAÇÕES      │
│                                                            │
│  Exemplos:                                                 │
│  - Troca de lâmpada de poste                               │
│  - Tapa-buraco                                             │
│  - Limpeza de vias                                         │
│  - Poda de árvore                                          │
│                                                            │
│  Fluxo:                                                    │
│  Protocolo → VINCULADO → PROGRESSO → CONCLUÍDO             │
│  Cidadão recebe: notificações de texto + arquivos          │
│                                                            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  2. SERVIÇOS COM CAPTURA DE DADOS                          │
│                                                            │
│  Cidadão ENVIA DADOS (formulários, localização, etc)       │
│  Servidor GERENCIA DADOS via MÓDULO DA SECRETARIA          │
│                                                            │
│  Exemplos:                                                 │
│  - Matrícula escolar                                       │
│  - Consulta médica                                         │
│  - MCMV (habitação)                                        │
│  - Boletim de ocorrência                                   │
│  - Alvará de construção                                    │
│                                                            │
│  Fluxo:                                                    │
│  Protocolo + DADOS → Módulo da Secretaria → Gestão         │
│  Cidadão recebe: status + resultado da análise             │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## Fluxo Completo Unificado

```
ORIGEM DA SOLICITAÇÃO
   │
   ├── Cidadão (Portal)
   ├── Prefeito (Chamado)
   └── Servidor (Manual)
   │
   ↓
SERVIÇO SELECIONADO
   │
   ├── Informativo (só acompanhamento)
   └── Com Captura de Dados (formulário)
   │
   ↓
PROTOCOLO CRIADO
(número único, status VINCULADO)
   │
   ↓
   ┌─────────────────┴──────────────────┐
   │                                    │
   ↓                                    ↓
INFORMATIVO                      COM DADOS
   │                                    │
   ↓                                    ↓
Servidor atualiza status         Módulo da Secretaria
Envia notificações               Gerencia dados capturados
   │                                    │
   └─────────────────┬──────────────────┘
                     ↓
            STATUS ATUALIZADO
                     │
        ┌────────────┼────────────┐
        ↓            ↓            ↓
   VINCULADO   →  PROGRESSO  →  CONCLUÍDO
        ↑            ↑            ↑
        │            │            │
    PENDENCIA   ATUALIZAÇÃO   NOTIFICAÇÃO
        │            │            │
        └────────────┴────────────┘
                     ↓
            CIDADÃO NOTIFICADO
```

---

## Exemplo: Secretaria de Educação

```
MÓDULO PADRÃO DA SECRETARIA DE EDUCAÇÃO

┌─────────────────────────────────────────────────────────┐
│  CADASTROS BASE (Módulos Padrões)                       │
│                                                         │
│  - Escolas                                              │
│  - Professores                                          │
│  - Períodos/Turnos                                      │
│  - Turmas                                               │
│  - Alunos                                               │
│                                                         │
│  (Relacionamentos entre entidades)                      │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  SERVIÇO: Matrícula de Aluno                            │
│                                                         │
│  Tipo: SERVIÇO COM CAPTURA DE DADOS                     │
│  Formulário: nome, data nascimento, responsável, etc    │
└─────────────────────────────────────────────────────────┘
                         ↓
                 CIDADÃO SOLICITA
                         ↓
              PROTOCOLO CRIADO + DADOS
                         ↓
┌─────────────────────────────────────────────────────────┐
│  SERVIDOR ACESSA MÓDULO DE MATRÍCULAS                   │
│                                                         │
│  Vê solicitação com dados do formulário:                │
│  - Nome do Aluno: João Silva                            │
│  - Data Nascimento: 10/05/2015                          │
│  - Responsável: Maria Silva                             │
│  - Série Desejada: 1º Ano                               │
│  - Turno: Manhã                                         │
│                                                         │
│  AÇÕES:                                                 │
│  ✓ Aprovar → Vincula a Escola + Turma + Período         │
│  ✓ Negar → Informa motivo                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
                         ↓
              STATUS ATUALIZADO NO PROTOCOL
                         ↓
              CIDADÃO RECEBE NOTIFICAÇÃO
              "Matrícula aceita - Escola EMEF Central"
              ou
              "Matrícula negada - Sem vagas disponíveis"
```

---

## Página da Secretaria (Padrão Visual)

```
┌───────────────────────────────────────────────────────────────┐
│  🌾 SECRETARIA MUNICIPAL DE AGRICULTURA                       │
│  Desenvolvimento rural e agricultura familiar                 │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ESTATÍSTICAS GERAIS                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ Produtores  │  │Propriedades │  │Assistências │            │
│  │ Ativos: 125 │  │ Total: 89   │  │ Ativas: 42  │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                               │
│  AÇÕES RÁPIDAS                                                │
│  ┌─────────────────┐  ┌─────────────────────┐                 │
│  │ Novo Protocolo  │  │ Protocolos Pendentes│                 │
│  └─────────────────┘  └─────────────────────┘                 │
│                                                               │
│  MÓDULOS PADRÕES (Base de Dados)                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐               │
│  │ Produtores │  │Propriedades│  │  Programas │               │
│  │   125 ▸    │  │    89 ▸    │  │    12 ▸    │               │
│  └────────────┘  └────────────┘  └────────────┘               │
│                                                               │
│  SERVIÇOS DISPONÍVEIS (Protocolos que podem ser criados)      │
│  ┌────────────────────────────┐                               │
│  │ Assistência Técnica (ATER) │ → Cria Protocolo + Dados      │
│  │ Status: Ativo              │                               │
│  └────────────────────────────┘                               │
│  ┌────────────────────────────┐                               │
│  │ Distribuição de Sementes   │ → Cria Protocolo + Dados      │
│  │ Status: Ativo              │                               │
│  └────────────────────────────┘                               │
│  ┌────────────────────────────┐                               │
│  │ Análise de Solo            │ → Cria Protocolo + Dados      │
│  │ Status: Ativo              │                               │
│  └────────────────────────────┘                               │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

## Redução de Complexidade

### ANTES (Complexo):
```
- ModuleHandler roteia automaticamente
- 13+ módulos diferentes
- Handlers especializados
- Entidades vinculadas via protocol.number
- Feature flags (hasCustomForm, hasLocation, etc)
- ServiceScheduling, ServiceForm, ServiceLocation...
```

### DEPOIS (Simplificado):
```
┌─────────────────────────────────────────────────────────────┐
│  PROTOCOLO (Centro do Sistema)                              │
│                                                             │
│  - Número único (PMSP-2025-000123)                          │
│  - Cidadão                                                  │
│  - Serviço                                                  │
│  - Departamento/Setor                                       │
│  - Status (VINCULADO → PROGRESSO → CONCLUÍDO)               │
│  - Dados (JSON) - se o serviço captura dados                │
│  - Histórico de ações                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                         │
                         ↓
         ┌───────────────┴───────────────┐
         │                               │
         ↓                               ↓
  SERVIÇO INFORMATIVO            SERVIÇO COM DADOS
         │                               │
         ↓                               ↓
  Apenas Status                  Status + Módulo da Secretaria
  + Notificações                 (gerencia dados capturados)
```

---

## Módulos Padrões por Secretaria

```
Cada Secretaria tem:

1. MÓDULOS PADRÕES (Base de Dados)
   → Cadastros estruturados
   → Ex: Escolas, Alunos, Professores (Educação)
   → Ex: Produtores, Propriedades (Agricultura)
   → Ex: Unidades de Saúde, Médicos (Saúde)

2. SERVIÇOS DISPONÍVEIS
   → Catálogo de serviços que geram protocolos
   → Podem ser:
     - Informativos (só acompanhamento)
     - Com Captura de Dados (vai para módulo)

3. MÓDULOS CUSTOMIZÁVEIS (Opcional)
   → Para eventos temporários
   → Para ações específicas
   → Criados sob demanda
```

---

## Exemplo: Todas as Secretarias

```
🎓 EDUCAÇÃO
   Módulos Padrões: Escolas, Alunos, Professores, Turmas
   Serviços: Matrícula, Transporte Escolar, Transferência

🏥 SAÚDE
   Módulos Padrões: Unidades, Médicos, Especialidades, Pacientes
   Serviços: Consulta, Exame, Medicamento, Vacinação

🏠 HABITAÇÃO
   Módulos Padrões: Imóveis, Famílias Cadastradas, Programas
   Serviços: MCMV, Regularização, Aluguel Social

🚔 SEGURANÇA
   Módulos Padrões: Ocorrências, Viaturas, Agentes
   Serviços: Boletim de Ocorrência, Ronda, Câmeras

🏗️ PLANEJAMENTO URBANO
   Módulos Padrões: Lotes, Projetos, Processos
   Serviços: Alvará, Certidão, Numeração

🌾 AGRICULTURA
   Módulos Padrões: Produtores, Propriedades, Programas
   Serviços: ATER, Sementes, Análise de Solo

🚧 OBRAS PÚBLICAS
   Módulos Padrões: Logradouros, Equipes, Materiais
   Serviços: Buraco, Iluminação, Pavimentação (informativos)

🧹 SERVIÇOS PÚBLICOS
   Módulos Padrões: Rotas, Equipes, Equipamentos
   Serviços: Poda, Entulho, Limpeza (informativos)

🎭 CULTURA
   Módulos Padrões: Espaços Culturais, Eventos, Artistas
   Serviços: Reserva de Espaço, Inscrição em Oficina

⚽ ESPORTE
   Módulos Padrões: Equipamentos Esportivos, Escolinhas, Atletas
   Serviços: Inscrição em Escolinha, Reserva de Quadra

🗺️ TURISMO
   Módulos Padrões: Atrativos, Comércios, Eventos
   Serviços: Cadastro de Pousada, Guia Turístico

👨‍👩‍👧‍👦 ASSISTÊNCIA SOCIAL
   Módulos Padrões: Famílias, Benefícios, Programas
   Serviços: Cesta Básica, Cadastro Único, Bolsa
```

---

## Visão Final Simplificada

```
                    MOTOR DE PROTOCOLOS
                           │
                           │ (centro de tudo)
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ↓                  ↓                  ↓
   CIDADÃO            PREFEITO            SERVIDOR
  (Portal)           (Chamado)            (Manual)
        │                  │                  │
        └──────────────────┼──────────────────┘
                           ↓
                    PROTOCOLO CRIADO
                           │
                ┌──────────┴──────────┐
                │                     │
                ↓                     ↓
         INFORMATIVO            COM DADOS
                │                     │
                ↓                     ↓
         Status Simples         Módulo da
         + Notificações         Secretaria
                │                     │
                └──────────┬──────────┘
                           ↓
                  CIDADÃO NOTIFICADO
```

---

## Conclusão

O sistema se resume em:

1. **PROTOCOLO** = Núcleo (sempre existe)
2. **SERVIÇO** = Tipo de solicitação (informativo ou com dados)
3. **MÓDULO** = Gestão de dados (quando o serviço captura dados)

**Simplificação:**
- Protocolo sempre existe
- Serviço define SE vai para módulo ou não
- Módulo só existe SE o serviço capturar dados
- Serviços informativos = apenas status + notificações

---

**Documento:** Visão Unificada do Sistema - DigiUrban
**Objetivo:** Simplificar e clarear o entendimento
**Data:** 28/10/2025
