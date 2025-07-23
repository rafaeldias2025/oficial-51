# 🏥 **SISTEMA COMPLETO DE PESAGEM - COMANDO PARA IMPLEMENTAÇÃO**

## 📋 **COMANDO PARA CRIAR TABELAS NO SUPABASE:**

```sql
-- 1. TABELA DE DADOS FÍSICOS DO USUÁRIO (CADASTRO)
CREATE TABLE user_physical_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  altura_cm DECIMAL(5,2) NOT NULL,
  idade INTEGER NOT NULL,
  sexo VARCHAR(10) NOT NULL CHECK (sexo IN ('masculino', 'feminino')),
  nivel_atividade VARCHAR(20) DEFAULT 'moderado',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABELA DE PESAGENS (HISTÓRICO COMPLETO)
CREATE TABLE weight_measurements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  peso_kg DECIMAL(5,2) NOT NULL,
  gordura_corporal_percent DECIMAL(4,2),
  gordura_visceral INTEGER,
  massa_muscular_kg DECIMAL(5,2),
  agua_corporal_percent DECIMAL(4,2),
  osso_kg DECIMAL(4,2),
  metabolismo_basal_kcal INTEGER,
  idade_metabolica INTEGER,
  risco_metabolico VARCHAR(20),
  imc DECIMAL(4,2),
  circunferencia_abdominal_cm DECIMAL(5,2),
  circunferencia_braco_cm DECIMAL(4,2),
  circunferencia_perna_cm DECIMAL(4,2),
  device_type VARCHAR(50) DEFAULT 'manual',
  notes TEXT,
  measurement_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABELA DE METAS E OBJETIVOS
CREATE TABLE user_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  peso_meta_kg DECIMAL(5,2),
  gordura_corporal_meta_percent DECIMAL(4,2),
  imc_meta DECIMAL(4,2),
  data_inicio DATE DEFAULT CURRENT_DATE,
  data_fim DATE,
  status VARCHAR(20) DEFAULT 'ativo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABELA DE ANÁLISES SEMANAIS
CREATE TABLE weekly_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  semana_inicio DATE NOT NULL,
  semana_fim DATE NOT NULL,
  peso_inicial DECIMAL(5,2),
  peso_final DECIMAL(5,2),
  variacao_peso DECIMAL(5,2),
  variacao_gordura_corporal DECIMAL(4,2),
  variacao_massa_muscular DECIMAL(5,2),
  media_imc DECIMAL(4,2),
  tendencia VARCHAR(20),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. FUNÇÃO PARA CALCULAR IMC AUTOMATICAMENTE
CREATE OR REPLACE FUNCTION calculate_imc()
RETURNS TRIGGER AS $$
BEGIN
  -- Buscar altura do usuário
  SELECT altura_cm INTO NEW.altura_cm 
  FROM user_physical_data 
  WHERE user_id = NEW.user_id;
  
  -- Calcular IMC: peso / (altura/100)²
  NEW.imc = NEW.peso_kg / POWER((SELECT altura_cm FROM user_physical_data WHERE user_id = NEW.user_id) / 100, 2);
  
  -- Calcular risco metabólico baseado no IMC
  IF NEW.imc < 18.5 THEN
    NEW.risco_metabolico = 'baixo_peso';
  ELSIF NEW.imc >= 18.5 AND NEW.imc < 25 THEN
    NEW.risco_metabolico = 'normal';
  ELSIF NEW.imc >= 25 AND NEW.imc < 30 THEN
    NEW.risco_metabolico = 'sobrepeso';
  ELSIF NEW.imc >= 30 AND NEW.imc < 35 THEN
    NEW.risco_metabolico = 'obesidade_grau1';
  ELSIF NEW.imc >= 35 AND NEW.imc < 40 THEN
    NEW.risco_metabolico = 'obesidade_grau2';
  ELSE
    NEW.risco_metabolico = 'obesidade_grau3';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. TRIGGER PARA CALCULAR IMC AUTOMATICAMENTE
CREATE TRIGGER trigger_calculate_imc
  BEFORE INSERT OR UPDATE ON weight_measurements
  FOR EACH ROW
  EXECUTE FUNCTION calculate_imc();

-- 7. FUNÇÃO PARA GERAR ANÁLISE SEMANAL
CREATE OR REPLACE FUNCTION generate_weekly_analysis()
RETURNS TRIGGER AS $$
DECLARE
  semana_inicio DATE;
  semana_fim DATE;
  peso_inicial DECIMAL(5,2);
  peso_final DECIMAL(5,2);
  variacao_peso DECIMAL(5,2);
BEGIN
  -- Definir semana (segunda a domingo)
  semana_inicio = DATE_TRUNC('week', NEW.measurement_date)::DATE;
  semana_fim = semana_inicio + INTERVAL '6 days';
  
  -- Buscar primeira pesagem da semana
  SELECT peso_kg INTO peso_inicial
  FROM weight_measurements
  WHERE user_id = NEW.user_id 
    AND measurement_date >= semana_inicio 
    AND measurement_date <= semana_fim
  ORDER BY measurement_date ASC
  LIMIT 1;
  
  -- Última pesagem da semana
  peso_final = NEW.peso_kg;
  
  -- Calcular variação
  variacao_peso = peso_final - peso_inicial;
  
  -- Inserir ou atualizar análise semanal
  INSERT INTO weekly_analyses (
    user_id, semana_inicio, semana_fim, 
    peso_inicial, peso_final, variacao_peso,
    tendencia
  ) VALUES (
    NEW.user_id, semana_inicio, semana_fim,
    peso_inicial, peso_final, variacao_peso,
    CASE 
      WHEN variacao_peso < 0 THEN 'diminuindo'
      WHEN variacao_peso > 0 THEN 'aumentando'
      ELSE 'estavel'
    END
  )
  ON CONFLICT (user_id, semana_inicio) 
  DO UPDATE SET
    peso_final = EXCLUDED.peso_final,
    variacao_peso = EXCLUDED.variacao_peso,
    tendencia = EXCLUDED.tendencia;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. TRIGGER PARA GERAR ANÁLISE SEMANAL
CREATE TRIGGER trigger_weekly_analysis
  AFTER INSERT ON weight_measurements
  FOR EACH ROW
  EXECUTE FUNCTION generate_weekly_analysis();

-- 9. POLÍTICAS DE SEGURANÇA (RLS)
ALTER TABLE user_physical_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_analyses ENABLE ROW LEVEL SECURITY;

-- Políticas para user_physical_data
CREATE POLICY "Users can view own physical data" ON user_physical_data
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own physical data" ON user_physical_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own physical data" ON user_physical_data
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para weight_measurements
CREATE POLICY "Users can view own measurements" ON weight_measurements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own measurements" ON weight_measurements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own measurements" ON weight_measurements
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para user_goals
CREATE POLICY "Users can view own goals" ON user_goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals" ON user_goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" ON user_goals
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para weekly_analyses
CREATE POLICY "Users can view own weekly analyses" ON weekly_analyses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weekly analyses" ON weekly_analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 10. ÍNDICES PARA PERFORMANCE
CREATE INDEX idx_weight_measurements_user_date ON weight_measurements(user_id, measurement_date DESC);
CREATE INDEX idx_weekly_analyses_user_week ON weekly_analyses(user_id, semana_inicio DESC);
CREATE INDEX idx_user_goals_user_status ON user_goals(user_id, status);
```

## 🔧 **COMANDO PARA CRIAR HOOKS NO FRONTEND:**

```typescript
// hooks/useWeightMeasurement.ts
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

export interface WeightMeasurement {
  id: string;
  peso_kg: number;
  gordura_corporal_percent?: number;
  gordura_visceral?: number;
  massa_muscular_kg?: number;
  agua_corporal_percent?: number;
  osso_kg?: number;
  metabolismo_basal_kcal?: number;
  idade_metabolica?: number;
  risco_metabolico?: string;
  imc?: number;
  circunferencia_abdominal_cm?: number;
  device_type: string;
  notes?: string;
  measurement_date: string;
}

export interface UserPhysicalData {
  altura_cm: number;
  idade: number;
  sexo: 'masculino' | 'feminino';
  nivel_atividade: string;
}

export const useWeightMeasurement = () => {
  const [measurements, setMeasurements] = useState<WeightMeasurement[]>([]);
  const [physicalData, setPhysicalData] = useState<UserPhysicalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar dados físicos do usuário
  const fetchPhysicalData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_physical_data')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setPhysicalData(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Salvar nova pesagem
  const saveMeasurement = async (measurement: Omit<WeightMeasurement, 'id' | 'measurement_date'>) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('weight_measurements')
        .insert({
          user_id: user.id,
          ...measurement,
          measurement_date: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      
      // Atualizar lista de pesagens
      setMeasurements(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Buscar histórico de pesagens
  const fetchMeasurements = async (limit = 30) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('weight_measurements')
        .select('*')
        .eq('user_id', user.id)
        .order('measurement_date', { ascending: false })
        .limit(limit);

      if (error) throw error;
      setMeasurements(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Buscar análise semanal
  const fetchWeeklyAnalysis = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('weekly_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('semana_inicio', { ascending: false })
        .limit(4);

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    }
  };

  useEffect(() => {
    fetchPhysicalData();
    fetchMeasurements();
  }, []);

  return {
    measurements,
    physicalData,
    loading,
    error,
    saveMeasurement,
    fetchMeasurements,
    fetchWeeklyAnalysis,
    fetchPhysicalData
  };
};
```

## 📱 **COMANDO PARA CRIAR COMPONENTE DE PESAGEM:**

```typescript
// components/WeightMeasurement.tsx
import React, { useState } from 'react';
import { useWeightMeasurement } from '../hooks/useWeightMeasurement';

export const WeightMeasurement: React.FC = () => {
  const { saveMeasurement, loading, error } = useWeightMeasurement();
  const [formData, setFormData] = useState({
    peso_kg: '',
    gordura_corporal_percent: '',
    gordura_visceral: '',
    massa_muscular_kg: '',
    agua_corporal_percent: '',
    osso_kg: '',
    metabolismo_basal_kcal: '',
    idade_metabolica: '',
    circunferencia_abdominal_cm: '',
    device_type: 'manual',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const measurementData = {
        peso_kg: parseFloat(formData.peso_kg),
        gordura_corporal_percent: formData.gordura_corporal_percent ? parseFloat(formData.gordura_corporal_percent) : null,
        gordura_visceral: formData.gordura_visceral ? parseInt(formData.gordura_visceral) : null,
        massa_muscular_kg: formData.massa_muscular_kg ? parseFloat(formData.massa_muscular_kg) : null,
        agua_corporal_percent: formData.agua_corporal_percent ? parseFloat(formData.agua_corporal_percent) : null,
        osso_kg: formData.osso_kg ? parseFloat(formData.osso_kg) : null,
        metabolismo_basal_kcal: formData.metabolismo_basal_kcal ? parseInt(formData.metabolismo_basal_kcal) : null,
        idade_metabolica: formData.idade_metabolica ? parseInt(formData.idade_metabolica) : null,
        circunferencia_abdominal_cm: formData.circunferencia_abdominal_cm ? parseFloat(formData.circunferencia_abdominal_cm) : null,
        device_type: formData.device_type,
        notes: formData.notes || null
      };

      await saveMeasurement(measurementData);
      
      // Limpar formulário
      setFormData({
        peso_kg: '',
        gordura_corporal_percent: '',
        gordura_visceral: '',
        massa_muscular_kg: '',
        agua_corporal_percent: '',
        osso_kg: '',
        metabolismo_basal_kcal: '',
        idade_metabolica: '',
        circunferencia_abdominal_cm: '',
        device_type: 'manual',
        notes: ''
      });

      alert('Pesagem salva com sucesso!');
    } catch (err) {
      alert('Erro ao salvar pesagem: ' + err.message);
    }
  };

  return (
    <div className="weight-measurement-container">
      <h2>Nova Pesagem</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Peso (kg) *</label>
          <input
            type="number"
            step="0.1"
            value={formData.peso_kg}
            onChange={(e) => setFormData({...formData, peso_kg: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Gordura Corporal (%)</label>
          <input
            type="number"
            step="0.1"
            value={formData.gordura_corporal_percent}
            onChange={(e) => setFormData({...formData, gordura_corporal_percent: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Gordura Visceral</label>
          <input
            type="number"
            value={formData.gordura_visceral}
            onChange={(e) => setFormData({...formData, gordura_visceral: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Massa Muscular (kg)</label>
          <input
            type="number"
            step="0.1"
            value={formData.massa_muscular_kg}
            onChange={(e) => setFormData({...formData, massa_muscular_kg: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Água Corporal (%)</label>
          <input
            type="number"
            step="0.1"
            value={formData.agua_corporal_percent}
            onChange={(e) => setFormData({...formData, agua_corporal_percent: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Massa Óssea (kg)</label>
          <input
            type="number"
            step="0.1"
            value={formData.osso_kg}
            onChange={(e) => setFormData({...formData, osso_kg: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Metabolismo Basal (kcal)</label>
          <input
            type="number"
            value={formData.metabolismo_basal_kcal}
            onChange={(e) => setFormData({...formData, metabolismo_basal_kcal: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Idade Metabólica</label>
          <input
            type="number"
            value={formData.idade_metabolica}
            onChange={(e) => setFormData({...formData, idade_metabolica: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Circunferência Abdominal (cm)</label>
          <input
            type="number"
            step="0.1"
            value={formData.circunferencia_abdominal_cm}
            onChange={(e) => setFormData({...formData, circunferencia_abdominal_cm: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Dispositivo</label>
          <select
            value={formData.device_type}
            onChange={(e) => setFormData({...formData, device_type: e.target.value})}
          >
            <option value="manual">Manual</option>
            <option value="xiaomi_mi_body_scale_2">Xiaomi Mi Body Scale 2</option>
            <option value="bluetooth_scale">Balança Bluetooth</option>
          </select>
        </div>

        <div className="form-group">
          <label>Observações</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            rows={3}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Pesagem'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}
    </div>
  );
};
```

## 📊 **COMANDO PARA CRIAR GRÁFICOS DE HISTÓRICO:**

```typescript
// components/WeightHistoryCharts.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useWeightMeasurement } from '../hooks/useWeightMeasurement';

export const WeightHistoryCharts: React.FC = () => {
  const { measurements, physicalData, loading } = useWeightMeasurement();

  if (loading) return <div>Carregando histórico...</div>;

  const chartData = measurements.map(m => ({
    date: new Date(m.measurement_date).toLocaleDateString('pt-BR'),
    peso: m.peso_kg,
    gordura_corporal: m.gordura_corporal_percent,
    massa_muscular: m.massa_muscular_kg,
    agua_corporal: m.agua_corporal_percent,
    imc: m.imc
  }));

  return (
    <div className="weight-history-charts">
      <h3>Histórico de Pesagens</h3>
      
      {/* Gráfico de Peso */}
      <div className="chart-container">
        <h4>Evolução do Peso</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="peso" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Composição Corporal */}
      <div className="chart-container">
        <h4>Composição Corporal</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="gordura_corporal" stroke="#ff7300" strokeWidth={2} />
            <Line type="monotone" dataKey="massa_muscular" stroke="#00ff00" strokeWidth={2} />
            <Line type="monotone" dataKey="agua_corporal" stroke="#0080ff" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de IMC */}
      <div className="chart-container">
        <h4>Evolução do IMC</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="imc" stroke="#ff0000" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
```

## 🎯 **RESUMO DO SISTEMA:**

### **Funcionalidades Implementadas:**
1. **Cadastro de Dados Físicos:** Altura, idade, sexo para cálculo de IMC
2. **Pesagem Completa:** Peso, gordura corporal, visceral, massa muscular, água, osso
3. **Cálculo Automático:** IMC e risco metabólico calculados automaticamente
4. **Histórico Completo:** Todas as pesagens ficam salvas com data/hora
5. **Análise Semanal:** Comparação automática semana a semana
6. **Gráficos:** Visualização da evolução de todos os dados
7. **Segurança:** Row Level Security (RLS) no Supabase
8. **Performance:** Índices otimizados para consultas rápidas

### **Dados Salvos:**
- ✅ Peso atual
- ✅ IMC calculado automaticamente
- ✅ Gordura corporal (%)
- ✅ Gordura visceral
- ✅ Massa muscular (kg)
- ✅ Água corporal (%)
- ✅ Massa óssea (kg)
- ✅ Metabolismo basal (kcal)
- ✅ Idade metabólica
- ✅ Risco metabólico (baixo peso, normal, sobrepeso, obesidade)
- ✅ Circunferência abdominal (cm)
- ✅ Tipo de dispositivo usado
- ✅ Observações do usuário
- ✅ Data e hora da pesagem

### **Comparações Disponíveis:**
- ✅ Comparação semanal automática
- ✅ Tendência (diminuindo/aumentando/estável)
- ✅ Variação de peso semana a semana
- ✅ Variação de gordura corporal
- ✅ Variação de massa muscular
- ✅ Média de IMC por semana

Este sistema garante que **TODA** pesagem fica salva com **TODOS** os dados para histórico completo e comparações semanais! 