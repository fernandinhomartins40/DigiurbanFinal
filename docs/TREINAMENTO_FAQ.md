# 🎓 Roteiros de Treinamento e FAQ - DigiUrban

## Índice
1. [Roteiros de Treinamento](#roteiros-de-treinamento)
2. [FAQ - Perguntas Frequentes](#faq---perguntas-frequentes)
3. [Troubleshooting](#troubleshooting)
4. [Glossário](#glossário)

---

# Roteiros de Treinamento

## 🎬 Vídeo 1: Overview do Sistema (10min)

### Objetivos
- Compreender a arquitetura geral do DigiUrban
- Entender o fluxo cidadão → protocolo → atendimento
- Conhecer os principais módulos

### Roteiro

**[00:00 - 01:00] Introdução**
- O que é o DigiUrban?
- Benefícios para o município
- Benefícios para o cidadão

**[01:00 - 03:00] Arquitetura do Sistema**
- Módulo do Cidadão
- Módulo Administrativo
- Módulos por Secretaria
- Sistema de Templates
- Módulos Customizados

**[03:00 - 05:00] Fluxo de Atendimento**
1. Cidadão acessa portal
2. Escolhe serviço
3. Preenche formulário
4. Anexa documentos
5. Recebe número de protocolo
6. Acompanha status
7. Recebe notificações
8. Secretaria analisa
9. Aprova/rejeita
10. Cidadão recebe retorno

**[05:00 - 07:00] Conceitos-Chave**
- **Serviço**: Tipo de atendimento oferecido
- **Protocolo**: Solicitação específica de um cidadão
- **Template**: Modelo pré-configurado de serviço
- **Módulo Customizado**: Serviço específico do município
- **Handler**: Lógica de processamento de cada tipo

**[07:00 - 09:00] Demonstração Prática**
- Criar um serviço
- Receber uma solicitação
- Processar e aprovar
- Visualizar no lado do cidadão

**[09:00 - 10:00] Próximos Passos**
- Configuração inicial
- Ativação de serviços
- Treinamento de equipe

---

## 🎬 Vídeo 2: Ativando Serviços Padrões (5min)

### Objetivos
- Aprender a ativar serviços de templates
- Customizar serviços para sua realidade
- Publicar serviços para cidadãos

### Roteiro

**[00:00 - 01:00] Acessando Templates**
- Login como administrador
- Navegar: Admin > Serviços > Templates
- Visualizar catálogo de templates

**[01:00 - 02:30] Escolhendo um Template**
- Filtrar por categoria (Saúde, Educação, etc)
- Visualizar detalhes do template
- Ver formulário de exemplo
- Verificar documentos necessários

**[02:30 - 04:00] Ativando o Serviço**
- Clicar em "Usar Template"
- Customizar nome (opcional)
- Ajustar campos do formulário
- Definir responsáveis
- Configurar SLA (prazo)
- Escolher se requer aprovação

**[04:00 - 05:00] Publicando**
- Revisar configurações
- Ativar serviço
- Visualizar no portal do cidadão
- Testar criação de protocolo

---

## 🎬 Vídeo 3: Gerenciando Solicitações (10min)

### Objetivos
- Acessar fila de solicitações
- Analisar protocolos
- Aprovar e rejeitar solicitações
- Comunicar-se com cidadãos

### Roteiro

**[00:00 - 02:00] Acessando Protocolos**
- Login na secretaria
- Dashboard inicial
- Navegar para lista de protocolos
- Entender métricas do dashboard

**[02:00 - 04:00] Filtrando e Buscando**
- Filtrar por status
- Filtrar por serviço
- Buscar por protocolo
- Buscar por CPF do cidadão
- Ordenar por data/prioridade

**[04:00 - 06:00] Analisando uma Solicitação**
- Clicar em um protocolo
- Ver dados do cidadão
- Ver dados da solicitação
- Visualizar documentos anexados
- Ver histórico de status

**[06:00 - 08:00] Processando**
- Atribuir a um responsável
- Atualizar status
- Adicionar notas internas
- Solicitar documentos adicionais
- Agendar atendimento

**[08:00 - 09:30] Aprovando**
- Clicar em "Aprovar"
- Preencher dados da aprovação
  - Data agendada
  - Local
  - Horário
  - Observações
- Confirmar aprovação
- Cidadão recebe notificação automática

**[09:30 - 10:00] Rejeitando**
- Clicar em "Rejeitar"
- Informar motivo detalhado
- Orientar sobre como proceder
- Confirmar rejeição

---

## 🎬 Vídeo 4: Criando Módulos Customizados (8min)

### Objetivos
- Criar serviços específicos do município
- Usar o construtor de formulários
- Configurar fluxo de aprovação
- Testar módulo customizado

### Roteiro

**[00:00 - 01:00] Quando Usar**
- Serviço único do município
- Template padrão não atende
- Processo específico

**[01:00 - 03:00] Criando o Módulo**
- Navegar: Admin > Módulos Customizados > Novo
- Definir nome e descrição
- Escolher categoria
- Selecionar departamento

**[03:00 - 05:30] Construindo o Formulário**
- Usar construtor visual
- Arrastar campos da paleta
  - Texto, número, data
  - Seleção, múltipla escolha
  - Upload de arquivo
  - Localização no mapa
- Configurar cada campo:
  - Nome e label
  - Obrigatório ou opcional
  - Validações
  - Texto de ajuda

**[05:30 - 07:00] Configurando Fluxo**
- Definir etapas de aprovação
- Configurar prazos
- Atribuir responsáveis
- Configurar notificações

**[07:00 - 08:00] Testando**
- Salvar módulo
- Ativar
- Testar preenchimento
- Verificar validações
- Processar teste

---

## 🎬 Vídeos por Secretaria (5min cada)

### Estrutura Padrão

Cada vídeo de secretaria segue este formato:

**[00:00 - 01:00] Serviços Disponíveis**
- Lista de templates da secretaria
- Tipos de atendimento

**[01:00 - 02:30] Ativando Serviços**
- Escolher template principal
- Customizar para a realidade
- Ativar

**[02:30 - 04:00] Fluxo de Trabalho**
- Receber solicitação
- Analisar documentos
- Processar
- Aprovar/Rejeitar
- Acompanhar

**[04:00 - 05:00] Relatórios e Métricas**
- Dashboard da secretaria
- Principais indicadores
- Exportar relatórios

### 📹 Secretarias Cobertas

1. **Saúde** - Consultas, exames, medicamentos
2. **Educação** - Matrículas, transporte
3. **Assistência Social** - Benefícios, visitas
4. **Obras Públicas** - Infraestrutura, manutenção
5. **Serviços Públicos** - Limpeza, poda
6. **Habitação** - MCMV, regularização
7. **Cultura** - Eventos, espaços
8. **Esportes** - Escolinhas, reservas
9. **Turismo** - Atrativos, eventos
10. **Meio Ambiente** - Licenças, denúncias
11. **Agricultura** - Produtores, insumos
12. **Planejamento Urbano** - Alvarás, certidões
13. **Segurança Pública** - Ocorrências, rondas

---

# FAQ - Perguntas Frequentes

## 📋 Geral

### O que é o DigiUrban?

O DigiUrban é uma plataforma completa de gestão municipal que conecta cidadãos às secretarias, permitindo solicitação de serviços online, acompanhamento de protocolos e gestão eficiente do atendimento.

### Quem pode usar o sistema?

- **Cidadãos**: Qualquer pessoa pode se cadastrar e solicitar serviços
- **Administradores**: Gestores das secretarias
- **Atendentes**: Funcionários que processam solicitações
- **Super Admin**: Administração geral do município

### Preciso de internet para usar?

Sim, o DigiUrban é uma plataforma web que requer conexão à internet. Em breve teremos aplicativo mobile com funcionalidades offline.

### O sistema é pago?

Consulte os planos disponíveis em [www.digiurban.com.br](https://www.digiurban.com.br). Há planos para diferentes portes de municípios.

---

## 🔐 Acesso e Autenticação

### Como faço login?

**Cidadão:**
- Acesse o portal do município
- Use CPF e senha cadastrados

**Administrador:**
- Acesse o painel admin
- Use email e senha fornecidos

### Esqueci minha senha

**Cidadão:**
1. Clique em "Esqueci minha senha"
2. Informe CPF e email cadastrados
3. Receberá link de redefinição por email

**Administrador:**
1. Entre em contato com super admin
2. Solicite redefinição de senha

### Posso ter mais de um usuário na secretaria?

Sim! O super admin pode criar múltiplos usuários para cada secretaria, com diferentes níveis de permissão:
- **Visualizador**: Apenas consulta
- **Atendente**: Pode processar protocolos
- **Gestor**: Pode configurar serviços e aprovar
- **Administrador**: Acesso completo

### Como adicionar novos usuários?

1. Login como super admin ou administrador
2. Navegar: Admin > Usuários > Novo Usuário
3. Preencher dados: nome, email, departamento, cargo
4. Definir permissões
5. Enviar convite

---

## 🛠️ Serviços e Templates

### Qual a diferença entre Template e Módulo Customizado?

**Template:**
- Criado pela equipe DigiUrban
- Disponível para todos os municípios
- Otimizado e testado
- Recebe atualizações automáticas
- Exemplos: Consultas médicas, matrículas

**Módulo Customizado:**
- Criado pelo próprio município
- Específico para suas necessidades
- Totalmente customizável
- Você mantém e atualiza
- Exemplos: Processos únicos da cidade

### Posso modificar um template?

Não diretamente, mas você pode:
1. Criar um serviço baseado no template
2. Customizar campos, validações e fluxo
3. O serviço criado fica independente do template

Ou:

1. Duplicar template como módulo customizado
2. Modificar livremente

### Como ativo um serviço?

1. Admin > Serviços > Novo Serviço
2. Escolha um template OU crie módulo customizado
3. Configure campos e fluxo
4. Teste
5. Ative para publicação

### Posso desativar um serviço?

Sim:
1. Admin > Serviços
2. Clique no serviço
3. Desativar

**Importante:** Protocolos existentes continuam sendo processados, mas novos não podem ser criados.

### Quantos serviços posso ter?

Não há limite! Você pode ter quantos serviços precisar.

---

## 📝 Protocolos

### O que é um protocolo?

É o número único que identifica cada solicitação de serviço. Exemplo: 2025010001

Formato: AAAAMMNNNN
- AAAA = Ano
- MM = Mês
- NNNN = Número sequencial

### Como rastreio um protocolo?

**Cidadão:**
1. Login no portal
2. Meus Protocolos
3. Ver detalhes

Ou:

1. Consulta pública (sem login)
2. Informar número do protocolo + CPF

**Administrador:**
1. Dashboard da secretaria
2. Buscar por número

### Posso cancelar um protocolo?

**Cidadão:** Sim, enquanto estiver "Pendente" ou "Em Análise"

**Administrador:** Sim, a qualquer momento com justificativa

### Quanto tempo demora um protocolo?

Cada serviço tem um SLA (prazo estimado). Exemplos:
- Consultas médicas: 7 dias
- Matrículas: 5 dias
- Benefícios sociais: 15 dias
- Alvarás: 30 dias

O prazo específico é informado ao criar a solicitação.

### O que significam os status?

- **PENDENTE**: Aguardando análise
- **EM_ANALISE**: Sendo processado
- **AGUARDANDO_DOCUMENTOS**: Falta documentação
- **AGUARDANDO_APROVACAO**: Aguarda decisão superior
- **APROVADO**: Aprovado
- **REJEITADO**: Não aprovado
- **CANCELADO**: Cancelado pelo cidadão ou admin
- **CONCLUIDO**: Atendimento finalizado

---

## 📄 Documentos

### Que documentos posso anexar?

- PDF
- Imagens (JPG, PNG)
- Documentos Office (DOC, XLS) - se permitido

Tamanho máximo: 5MB por arquivo

### Como anexo documentos?

**Na criação do protocolo:**
1. Seção "Documentação"
2. Clique em "Anexar"
3. Selecione arquivo
4. Upload automático

**Após criar protocolo:**
1. Acesse o protocolo
2. Clique em "Adicionar Documento"
3. Faça upload

### Posso remover um documento?

Não. Por auditoria, documentos não podem ser removidos. Se anexou errado, adicione o correto e informe nos comentários.

### Os documentos são seguros?

Sim! Utilizamos:
- Criptografia SSL/TLS
- Armazenamento seguro em cloud
- Backup diário
- Acesso restrito por permissões
- Logs de auditoria

---

## 🔔 Notificações

### Como recebo notificações?

- **Email**: Automático
- **SMS**: Se configurado
- **Push**: No aplicativo mobile (em breve)
- **No sistema**: Sino no menu superior

### Posso desativar notificações?

Sim, no seu perfil você pode escolher:
- Receber todas
- Apenas importantes
- Desativar emails (manterá notificações no sistema)

### Que eventos geram notificações?

**Para cidadãos:**
- Protocolo criado
- Status atualizado
- Aprovado/Rejeitado
- Documentos solicitados
- Agendamento marcado
- Lembretes (24h antes)

**Para administradores:**
- Nova solicitação
- Protocolo atribuído
- Prazo vencendo
- Mensagem do cidadão
- Documentos anexados

---

## 📊 Relatórios

### Que relatórios posso gerar?

**Por secretaria:**
- Atendimentos por período
- Por tipo de serviço
- Por status
- Tempo médio de atendimento
- Taxa de aprovação/rejeição
- Performance de atendentes

**Geral do município:**
- Total de atendimentos
- Atendimentos por secretaria
- Serviços mais demandados
- Satisfação do cidadão
- Economia gerada

### Como exporto relatórios?

1. Acesse a seção de relatórios
2. Selecione filtros (período, tipo, etc)
3. Clique em "Exportar"
4. Escolha formato: PDF, Excel ou CSV

### Posso agendar relatórios automáticos?

Sim! Configure no painel admin:
1. Admin > Relatórios > Agendar
2. Escolha relatório
3. Defina periodicidade (diária, semanal, mensal)
4. Informe emails destinatários
5. Ativar

---

## 🎨 Personalização

### Posso personalizar o visual?

Sim! O super admin pode:
- Alterar logo da prefeitura
- Escolher cores do tema
- Customizar banner da home
- Adicionar informações de contato

### Posso customizar emails?

Sim! Configure templates de email:
1. Admin > Configurações > Email
2. Edite templates
3. Use variáveis dinâmicas: {nome}, {protocolo}, etc
4. Visualize prévia
5. Salvar

### Posso ter domínio próprio?

Sim! Ao invés de `municipio.digiurban.com.br`, você pode usar `servicos.prefeitura.gov.br` (requer configuração de DNS).

---

## 🔧 Técnico

### Qual navegador devo usar?

Recomendamos:
- Google Chrome (versão 90+)
- Mozilla Firefox (versão 88+)
- Microsoft Edge (versão 90+)
- Safari (versão 14+)

### Funciona em celular?

Sim! O sistema é responsivo e funciona em qualquer dispositivo. Em breve teremos aplicativos nativos.

### Posso integrar com outros sistemas?

Sim! O DigiUrban possui API REST completa. Consulte [API.md](./API.md) para documentação.

### Há limite de usuários?

Depende do plano contratado. Entre em contato para mais informações.

### Onde os dados são armazenados?

Em servidores seguros na nuvem (AWS ou Azure), com datacenter no Brasil, em conformidade com LGPD.

### Fazem backup?

Sim! Backups automáticos:
- Diários: últimos 7 dias
- Semanais: último mês
- Mensais: último ano

---

# Troubleshooting

## ❌ Problemas Comuns

### Não consigo fazer login

**Possíveis causas:**
1. **Senha incorreta**
   - Solução: Use "Esqueci minha senha"

2. **Conta não ativada**
   - Solução: Verifique email de ativação

3. **Usuário bloqueado**
   - Solução: Contate o administrador

4. **CPF/Email incorreto**
   - Solução: Verifique os dados

### Não recebo emails

**Verificações:**
1. Confira caixa de SPAM
2. Confirme email cadastrado está correto
3. Adicione `noreply@digiurban.com.br` aos contatos
4. Contate suporte se persistir

### Upload de arquivo falha

**Possíveis causas:**
1. **Arquivo muito grande**
   - Solução: Máximo 5MB, reduza o arquivo

2. **Formato não suportado**
   - Solução: Use PDF, JPG ou PNG

3. **Conexão instável**
   - Solução: Tente novamente com conexão melhor

### Protocolo não aparece

**Verificações:**
1. Aguarde alguns segundos (atualização)
2. Verifique se está na secretaria correta
3. Verifique filtros aplicados
4. Limpe cache do navegador

### Não consigo aprovar protocolo

**Possíveis causas:**
1. **Sem permissão**
   - Solução: Solicite permissão ao administrador

2. **Campos obrigatórios**
   - Solução: Preencha todos os campos necessários

3. **Protocolo já processado**
   - Solução: Verifique status atual

### Página não carrega

**Soluções:**
1. Limpe cache do navegador:
   - Chrome: Ctrl+Shift+Del
   - Firefox: Ctrl+Shift+Del
   - Safari: Cmd+Option+E

2. Atualize a página: F5 ou Ctrl+R

3. Tente navegação anônima

4. Teste outro navegador

5. Verifique conexão com internet

### Erro "Sessão expirou"

**Solução:**
1. Faça login novamente
2. Por segurança, sessões expiram após 2h de inatividade

### Relatório não gera

**Verificações:**
1. Verifique período selecionado (não pode ser muito amplo)
2. Verifique se há dados no período
3. Tente formato diferente (PDF vs Excel)
4. Aguarde alguns segundos em caso de muitos dados

---

## 🆘 Quando Contatar Suporte

Entre em contato se:
- Erro persiste após troubleshooting
- Dados incorretos no sistema
- Problemas de integração
- Dúvidas sobre funcionalidades
- Sugestões de melhorias
- Reportar bugs

**Canais:**
- Email: suporte@digiurban.com.br
- WhatsApp: (11) 99999-9999
- Chat: Disponível no sistema
- Telefone: 0800-XXX-XXXX

**Ao contatar, informe:**
- Município
- Usuário (nome/email)
- Descrição do problema
- Quando ocorreu
- Mensagens de erro
- Prints (se possível)

---

# Glossário

## A

**API**: Interface de programação que permite integração com outros sistemas

**Aprovação**: Ação de aceitar uma solicitação

**Atendente**: Usuário que processa protocolos

**Atribuir**: Designar protocolo para um responsável

## C

**Cidadão**: Usuário que solicita serviços

**CPF**: Documento usado para identificação

**Customização**: Personalização de serviços

## D

**Dashboard**: Painel com métricas e indicadores

**Departamento**: Secretaria municipal

**Documentação**: Arquivos anexados ao protocolo

## E

**Endpoint**: URL da API para realizar operações

## F

**Fluxo**: Sequência de etapas de processamento

**Formulário**: Campos que o cidadão preenche

**FormSchema**: Estrutura JSON do formulário

## H

**Handler**: Código que processa tipo específico de serviço

## I

**Integração**: Conexão com sistemas externos

## L

**LGPD**: Lei Geral de Proteção de Dados

**Login**: Acesso ao sistema

## M

**Módulo**: Tipo de serviço com lógica específica

**Módulo Customizado**: Serviço criado pelo município

## N

**Notificação**: Aviso enviado ao usuário

## P

**Permissão**: Autorização para realizar ações

**Protocolo**: Número que identifica solicitação

**Prazo**: Tempo estimado para atendimento

## R

**Rejeição**: Ação de negar uma solicitação

**Relatório**: Documento com dados consolidados

**Role**: Papel/função do usuário

## S

**Secretaria**: Departamento municipal

**Serviço**: Tipo de atendimento oferecido

**SLA**: Service Level Agreement - prazo de atendimento

**Status**: Situação atual do protocolo

## T

**Template**: Modelo pré-configurado de serviço

**Token**: Código de autenticação da API

## U

**Upload**: Envio de arquivo

**UBS**: Unidade Básica de Saúde

## V

**Validação**: Verificação de dados

**Vistoria**: Inspeção técnica in loco

## W

**Webhook**: Notificação automática de eventos

**Workflow**: Fluxo de trabalho

---

## 📞 Contatos e Suporte

### Suporte Técnico
- **Email**: suporte@digiurban.com.br
- **Telefone**: 0800-XXX-XXXX
- **WhatsApp**: (11) 99999-9999
- **Horário**: Segunda a Sexta, 8h às 18h

### Documentação
- **Técnica**: [MODULE_HANDLERS.md](./MODULE_HANDLERS.md)
- **Templates**: [TEMPLATES.md](./TEMPLATES.md)
- **Módulos**: [CUSTOM_MODULES.md](./CUSTOM_MODULES.md)
- **API**: [API.md](./API.md)
- **Secretarias**: [GUIAS_SECRETARIAS.md](./GUIAS_SECRETARIAS.md)

### Treinamento
- **Vídeos**: [Canal YouTube DigiUrban](#)
- **Webinars**: Mensal - Cadastre-se no site
- **Presencial**: Consulte disponibilidade

### Comunidade
- **Fórum**: forum.digiurban.com.br
- **Grupo WhatsApp**: Solicite convite
- **Newsletter**: cadastro@digiurban.com.br

---

## 📚 Materiais Complementares

### Para Gestores
- Guia de Implantação
- Boas Práticas de Gestão
- Cases de Sucesso

### Para Desenvolvedores
- Documentação API
- SDK JavaScript/Python
- Webhooks e Integrações

### Para Cidadãos
- Como Usar o Portal
- Serviços Disponíveis
- Perguntas Frequentes

---

**Última atualização**: Janeiro 2025
**Versão**: 1.0

Para sugestões de melhoria nesta documentação, envie para: docs@digiurban.com.br
