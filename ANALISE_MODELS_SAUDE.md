# ANÁLISE - MODELS DE SAÚDE

**Data:** 29/10/2025

---

## 📋 MODELS DO MODULE_MAPPING (11 módulos)

| # | moduleType | Entidade Esperada | Status no Schema | Linha |
|---|------------|-------------------|------------------|-------|
| 1 | `ATENDIMENTOS_SAUDE` | `HealthAttendance` | ✅ EXISTE | 1403 |
| 2 | `AGENDAMENTOS_MEDICOS` | `HealthAppointment` | ✅ EXISTE | 1701 |
| 3 | `CONTROLE_MEDICAMENTOS` | `MedicationDispense` | ✅ EXISTE | 2186 |
| 4 | `CAMPANHAS_SAUDE` | `HealthCampaign` | ✅ EXISTE | 2208 |
| 5 | `PROGRAMAS_SAUDE` | `HealthProgram` | ❓ VERIFICAR | - |
| 6 | `ENCAMINHAMENTOS_TFD` | `HealthTransport` | ✅ EXISTE | 2166 |
| 7 | `EXAMES` | `HealthExam` | ❓ VERIFICAR | - |
| 8 | `TRANSPORTE_PACIENTES` | `HealthTransportRequest` | ❓ VERIFICAR | - |
| 9 | `VACINACAO` | `Vaccination` | ✅ EXISTE | 1492 |
| 10 | `CADASTRO_PACIENTE` | `Patient` | ❌ NÃO EXISTE | - |
| 11 | `GESTAO_ACS` | `CommunityHealthAgent` | ❓ VERIFICAR | - |

---

## 🔍 ANÁLISE DETALHADA

### ✅ **Models que EXISTEM e precisam adicionar `protocolId`:**

1. **HealthAttendance** (linha 1403)
   - Já tem campo `protocol` (String @unique)
   - ❌ NÃO tem `protocolId` (relação com ProtocolSimplified)

2. **HealthAppointment** (linha 1701)
   - Precisa verificar estrutura completa

3. **MedicationDispense** (linha 2186)
   - Precisa verificar estrutura completa

4. **HealthCampaign** (linha 2208)
   - Precisa verificar estrutura completa

5. **HealthTransport** (linha 2166)
   - Precisa verificar estrutura completa

6. **Vaccination** (linha 1492)
   - Já existe
   - Precisa adicionar `protocolId`

### ❌ **Models que NÃO EXISTEM (precisam ser criados):**

1. **Patient** - Cadastro de pacientes
2. **HealthProgram** - Programas de saúde
3. **HealthExam** - Solicitação de exames
4. **HealthTransportRequest** - Transporte de pacientes
5. **CommunityHealthAgent** - Gestão de ACS

---

## 🎯 PLANO DE AÇÃO

### **OPÇÃO 1: Criar models faltantes**
- Criar os 5 models que não existem
- Adicionar `protocolId` em todos os 11 models
- Migration grande

### **OPÇÃO 2: Usar Citizen como Patient**
- `Patient` pode ser uma view/alias de `Citizen`
- Reduz para 4 models a criar
- Migration menor

### **OPÇÃO 3: Usar models alternativos** (RECOMENDADO)
- Verificar se existem models alternativos que fazem o mesmo papel
- Exemplo: `MedicationDispensing` vs `MedicationDispense`
- Ajustar MODULE_MAPPING se necessário

---

## ✅ RECOMENDAÇÃO

1. **Verificar models completos** de todos os 11 módulos
2. **Identificar aliases/duplicados** (ex: MedicationDispense vs MedicationDispensing)
3. **Criar apenas models realmente faltantes**
4. **Adicionar `protocolId`** em todos os existentes
5. **Atualizar MODULE_MAPPING** se necessário

Aguardando análise completa dos models existentes...
