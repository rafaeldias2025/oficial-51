# Sistema de Gráficos e Pesagem - Descrição Completa

## 📊 Visão Geral do Sistema

O sistema de gráficos e pesagem funciona como um ecossistema integrado que captura, processa e visualiza dados de saúde do usuário de forma automática e inteligente.

## 🔄 Fluxo Completo de Dados

### 1. **Cadastro Inicial do Usuário**
Quando o usuário se cadastra no sistema, são coletados e salvos os seguintes dados:

```sql
-- Tabela: profiles
- user_id (UUID único)
- full_name (nome completo)
- email (email do usuário)
- celular (telefone)
- data_nascimento (data de nascimento)
- sexo (Masculino/Feminino/Outro)
- altura_cm (altura em centímetros)
```

```sql
-- Tabela: dados_fisicos_usuario
- user_id (vinculado ao profile)
- nome_completo
- data_nascimento
- sexo
- altura_cm
- peso_atual_kg (valor inicial)
- circunferencia_abdominal_cm (valor inicial)
- meta_peso_kg (meta de peso)
- imc (calculado automaticamente)
- categoria_imc (calculada automaticamente)
- risco_cardiometabolico (calculado automaticamente)
```

### 2. **Processo de Pesagem**
Quando o usuário sobe na balança:

#### **Identificação Automática**
- O sistema identifica o usuário pelo `user_id` único
- Busca automaticamente os dados salvos: nome, email, altura, idade, sexo
- Vincula a pesagem ao perfil correto

#### **Captura de Dados da Balança**
```typescript
// Dados capturados da balança
{
  peso_kg: number,           // Peso em kg
  gordura_corporal_pct: number,  // % de gordura corporal
  massa_muscular_kg: number,     // Massa muscular em kg
  agua_corporal_pct: number,     // % de água corporal
  taxa_metabolica_basal: number, // Taxa metabólica basal
  gordura_visceral: number,      // Gordura visceral
  circunferencia_abdominal_cm: number, // Perímetro abdominal
  data_medicao: string          // Data/hora da medição
}
```

#### **Cálculos Automáticos**
O sistema calcula automaticamente:

```typescript
// Cálculo do IMC
const imc = peso_kg / Math.pow(altura_cm / 100, 2);

// Categorização do IMC
const categoriaImc = {
  imc < 18.5: 'Abaixo do peso',
  imc < 25: 'Peso normal', 
  imc < 30: 'Sobrepeso',
  imc < 35: 'Obesidade grau I',
  imc < 40: 'Obesidade grau II',
  imc >= 40: 'Obesidade grau III'
};

// Risco cardiometabólico baseado no sexo e circunferência
const riscoCardiometabolico = {
  masculino: {
    circunferencia >= 102: 'Alto',
    circunferencia >= 94: 'Moderado',
    default: 'Baixo'
  },
  feminino: {
    circunferencia >= 88: 'Alto', 
    circunferencia >= 80: 'Moderado',
    default: 'Baixo'
  }
};
```

### 3. **Salvamento dos Dados**
Os dados são salvos em múltiplas tabelas para diferentes propósitos:

```sql
-- Tabela: pesagens (histórico completo)
INSERT INTO pesagens (
  user_id, peso_kg, gordura_corporal_pct, massa_muscular_kg,
  agua_corporal_pct, taxa_metabolica_basal, gordura_visceral,
  circunferencia_abdominal_cm, imc, data_medicao, origem_medicao
)

-- Tabela: dados_saude_usuario (dados atuais)
UPDATE dados_saude_usuario SET
  peso_atual_kg = novo_peso,
  circunferencia_abdominal_cm = nova_circunferencia,
  data_atualizacao = NOW()
```

## 📈 Sistema de Gráficos

### 1. **Tipos de Gráficos Disponíveis**

#### **Dashboard Moderno**
- Gráfico de evolução do peso ao longo do tempo
- Gráfico de IMC com linhas de referência (25 e 30)
- Gráfico de composição corporal (gordura, músculo, água)
- Gráfico de idade metabólica
- Gráfico de taxa metabólica basal

#### **Visão Geral**
- Gráfico de área para evolução do peso
- Gráfico de linha para IMC
- Métricas principais com indicadores de mudança

#### **Composição Corporal**
- Gráfico de área para gordura corporal
- Gráfico de linha para massa muscular
- Gráfico de água corporal
- Gráfico de gordura visceral

#### **Tendências**
- Análise de tendências de longo prazo
- Comparação com metas estabelecidas
- Projeções baseadas no histórico

### 2. **Cálculos para Gráficos**

```typescript
// Dados processados para gráficos
const chartData = pesagens.map(pesagem => ({
  data: format(new Date(pesagem.data_medicao), 'dd/MM'),
  peso: pesagem.peso_kg,
  imc: pesagem.imc || (pesagem.peso_kg / Math.pow(altura_cm / 100, 2)),
  gordura: pesagem.gordura_corporal_pct,
  musculo: pesagem.massa_muscular_kg,
  agua: pesagem.agua_corporal_pct,
  idade_metabolica: pesagem.idade_metabolica,
  taxa_metabolica: pesagem.taxa_metabolica_basal,
  circunferencia: pesagem.circunferencia_abdominal_cm
}));
```

### 3. **Métricas Calculadas**

#### **Evolução do Peso**
```typescript
const evolucaoPeso = ultimaPesagem.peso_kg - primeiraPesagem.peso_kg;
const porcentagemPeso = (evolucaoPeso / primeiraPesagem.peso_kg) * 100;
```

#### **Evolução do IMC**
```typescript
const evolucaoIMC = ultimaPesagem.imc - primeiraPesagem.imc;
const porcentagemIMC = (evolucaoIMC / primeiraPesagem.imc) * 100;
```

#### **Progresso para Meta**
```typescript
const progressToGoal = metaPeso > 0 ? 
  Math.max(0, Math.min(100, ((metaPeso - Math.abs(pesoAtual - metaPeso)) / metaPeso) * 100)) : 0;
```

### 4. **Componentes de Gráficos**

#### **ProgressCharts.tsx**
- Dashboard principal com múltiplas abas
- Gráficos responsivos e interativos
- Métricas em tempo real
- Comparações automáticas

#### **EnhancedDashboard.tsx**
- Gráficos de composição corporal
- Análise de tendências
- Indicadores de performance
- Visualizações avançadas

#### **EvolucaoSemanal.tsx**
- Gráfico de linha para evolução semanal
- Comparação peso vs IMC
- Linha de referência para meta
- Estatísticas de progresso

#### **WeightHistoryChart.tsx**
- Histórico completo de pesagens
- Gráfico combinado peso + IMC
- Análise de composição corporal
- Tendências de longo prazo

## 🎯 Benefícios do Sistema

### 1. **Automatização Completa**
- Identificação automática do usuário
- Cálculos automáticos de IMC e riscos
- Salvamento automático dos dados
- Atualização em tempo real dos gráficos

### 2. **Dados Persistentes**
- Altura, idade e sexo ficam salvos permanentemente
- Histórico completo de todas as pesagens
- Metas e objetivos salvos
- Dados de composição corporal preservados

### 3. **Visualizações Inteligentes**
- Gráficos adaptados ao perfil do usuário
- Comparações automáticas com metas
- Análise de tendências
- Alertas de progresso

### 4. **Integração Completa**
- Dados do cadastro vinculados às pesagens
- Gráficos atualizados automaticamente
- Sistema de notificações
- Relatórios personalizados

## 🔧 Tecnologias Utilizadas

- **Frontend**: React + TypeScript + Recharts
- **Backend**: Supabase (PostgreSQL)
- **Gráficos**: Recharts (LineChart, AreaChart, BarChart)
- **Estados**: React Hooks + Context API
- **Tempo Real**: Supabase Realtime
- **Cálculos**: JavaScript nativo + SQL

## 📱 Fluxo do Usuário

1. **Cadastro** → Dados básicos salvos (altura, idade, sexo)
2. **Primeira Pesagem** → Sistema identifica usuário automaticamente
3. **Pesagens Regulares** → Dados acumulados no histórico
4. **Visualização** → Gráficos atualizados automaticamente
5. **Análise** → Tendências e progresso calculados
6. **Ajustes** → Metas e objetivos atualizados

Este sistema garante que cada pesagem seja automaticamente processada, calculada e visualizada, proporcionando uma experiência completa e integrada para o acompanhamento da saúde do usuário. 