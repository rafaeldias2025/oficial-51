// ====================================================================
// HOOK CONSOLIDADO PARA DADOS DE SAÚDE
// Substitui: useDadosFisicos, useDadosSaudeCore, usePesagemCompleta
// ====================================================================

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { 
  PhysicalData, 
  HealthData, 
  WeightMeasurement, 
  LoadingState, 
  ApiResponse 
} from '@/types';

interface UseHealthDataReturn extends LoadingState {
  // Dados consolidados
  physicalData: PhysicalData | null;
  healthData: HealthData | null;
  latestWeightMeasurement: WeightMeasurement | null;
  weightHistory: WeightMeasurement[];
  
  // Computados
  isDataComplete: boolean;
  bmi: number | null;
  bmiCategory: string | null;
  cardiometabolicRisk: string | null;
  
  // Ações
  savePhysicalData: (data: Omit<PhysicalData, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<ApiResponse>;
  saveHealthData: (data: Omit<HealthData, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<ApiResponse>;
  saveWeightMeasurement: (data: Omit<WeightMeasurement, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<ApiResponse>;
  
  // Utilitários
  calculateBMI: (weight: number, height: number) => number;
  getBMICategory: (bmi: number) => string;
  getCardiometabolicRisk: (waistCircumference: number, gender: string) => string;
  refreshData: () => Promise<void>;
  markAsComplete: () => void;
  clearCache: () => void;
}

export const useHealthData = (): UseHealthDataReturn => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados dos dados
  const [physicalData, setPhysicalData] = useState<PhysicalData | null>(null);
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [latestWeightMeasurement, setLatestWeightMeasurement] = useState<WeightMeasurement | null>(null);
  const [weightHistory, setWeightHistory] = useState<WeightMeasurement[]>([]);

  // Cache keys
  const getCacheKey = (suffix: string) => `health_data_${user?.id}_${suffix}`;

  // Utilitários de cálculo
  const calculateBMI = useCallback((weight: number, height: number): number => {
    if (!weight || !height || height <= 0) return 0;
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(2));
  }, []);

  const getBMICategory = useCallback((bmi: number): string => {
    if (bmi < 18.5) return 'Abaixo do peso';
    if (bmi < 25) return 'Peso normal';
    if (bmi < 30) return 'Sobrepeso';
    if (bmi < 35) return 'Obesidade grau I';
    if (bmi < 40) return 'Obesidade grau II';
    return 'Obesidade grau III';
  }, []);

  const getCardiometabolicRisk = useCallback((waistCircumference: number, gender: string): string => {
    if (!waistCircumference) return 'Não avaliado';
    
    const maleRisk = waistCircumference >= 102;
    const femaleRisk = waistCircumference >= 88;
    
    if (gender === 'masculino' && maleRisk) return 'Alto risco';
    if (gender === 'feminino' && femaleRisk) return 'Alto risco';
    
    return 'Baixo risco';
  }, []);

  // Computados
  const bmi = physicalData?.altura_cm && physicalData?.peso_atual_kg 
    ? calculateBMI(physicalData.peso_atual_kg, physicalData.altura_cm)
    : latestWeightMeasurement?.peso_kg && healthData?.altura_cm
    ? calculateBMI(latestWeightMeasurement.peso_kg, healthData.altura_cm)
    : null;

  const bmiCategory = bmi ? getBMICategory(bmi) : null;
  
  const cardiometabolicRisk = physicalData?.circunferencia_abdominal_cm && physicalData?.sexo
    ? getCardiometabolicRisk(physicalData.circunferencia_abdominal_cm, physicalData.sexo)
    : null;

  const isDataComplete = !!(physicalData?.nome_completo && physicalData?.altura_cm && 
                           physicalData?.peso_atual_kg && physicalData?.circunferencia_abdominal_cm);

  // Buscar profile ID
  const getProfileId = useCallback(async (): Promise<string | null> => {
    if (!user) return null;
    
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return profile?.id || null;
    } catch (error) {
      console.error('Erro ao buscar profile:', error);
      return null;
    }
  }, [user]);

  // Carregar todos os dados
  const fetchAllData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const profileId = await getProfileId();
      if (!profileId) {
        throw new Error('Profile não encontrado');
      }

      // Buscar dados físicos
      const { data: physicalDataResult } = await supabase
        .from('dados_fisicos_usuario')
        .select('*')
        .eq('user_id', profileId)
        .maybeSingle();

      // Buscar dados de saúde
      const { data: healthDataResult } = await supabase
        .from('dados_saude_usuario')
        .select('*')
        .eq('user_id', profileId)
        .order('data_atualizacao', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Buscar última pesagem
      const { data: latestWeight } = await supabase
        .from('pesagens')
        .select('*')
        .eq('user_id', profileId)
        .order('data_medicao', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Buscar histórico de pesagens (últimos 30 registros)
      const { data: weightHistoryResult } = await supabase
        .from('pesagens')
        .select('*')
        .eq('user_id', profileId)
        .order('data_medicao', { ascending: false })
        .limit(30);

      setPhysicalData(physicalDataResult as unknown as PhysicalData | null);
      setHealthData(healthDataResult as unknown as HealthData | null);
      setLatestWeightMeasurement(latestWeight as unknown as WeightMeasurement | null);
      setWeightHistory((weightHistoryResult || []) as unknown as WeightMeasurement[]);

      // Cache os dados se estiverem completos
      if (physicalDataResult) {
        localStorage.setItem(getCacheKey('physical'), JSON.stringify(physicalDataResult));
      }

    } catch (error) {
      console.error('Erro ao carregar dados de saúde:', error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [user, getProfileId, getCacheKey]);

  // Salvar dados físicos
  const savePhysicalData = useCallback(async (
    data: Omit<PhysicalData, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ): Promise<ApiResponse> => {
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    try {
      const profileId = await getProfileId();
      if (!profileId) {
        throw new Error('Profile não encontrado');
      }

      const { error } = await supabase
        .from('dados_fisicos_usuario')
        .upsert([{
          user_id: profileId,
          ...data,
          imc: calculateBMI(data.peso_atual_kg, data.altura_cm),
          categoria_imc: getBMICategory(calculateBMI(data.peso_atual_kg, data.altura_cm)),
          risco_cardiometabolico: getCardiometabolicRisk(data.circunferencia_abdominal_cm, data.sexo)
        }]);

      if (error) throw error;

      await fetchAllData();
      toast.success('Dados físicos salvos com sucesso!');
      
      return { success: true, message: 'Dados salvos com sucesso' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar dados físicos';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [user, getProfileId, fetchAllData, calculateBMI, getBMICategory, getCardiometabolicRisk]);

  // Salvar dados de saúde
  const saveHealthData = useCallback(async (
    data: Omit<HealthData, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ): Promise<ApiResponse> => {
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    try {
      const profileId = await getProfileId();
      if (!profileId) {
        throw new Error('Profile não encontrado');
      }

      const { error } = await supabase
        .from('dados_saude_usuario')
        .upsert([{
          user_id: profileId,
          ...data,
          data_atualizacao: new Date().toISOString()
        }]);

      if (error) throw error;

      await fetchAllData();
      toast.success('Dados de saúde salvos com sucesso!');
      
      return { success: true, message: 'Dados salvos com sucesso' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar dados de saúde';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [user, getProfileId, fetchAllData]);

  // Salvar pesagem
  const saveWeightMeasurement = useCallback(async (
    data: Omit<WeightMeasurement, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ): Promise<ApiResponse> => {
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    try {
      const profileId = await getProfileId();
      if (!profileId) {
        throw new Error('Profile não encontrado');
      }

      // Calcular IMC se temos altura
      let imc = data.imc;
      if (!imc && healthData?.altura_cm) {
        imc = calculateBMI(data.peso_kg, healthData.altura_cm);
      }

      const { error } = await supabase
        .from('pesagens')
        .insert([{
          user_id: profileId,
          ...data,
          imc,
          data_medicao: data.data_medicao || new Date().toISOString()
        }]);

      if (error) throw error;

      // Atualizar dados de saúde com o novo peso
      if (healthData) {
        await supabase
          .from('dados_saude_usuario')
          .update({
            peso_atual_kg: data.peso_kg,
            data_atualizacao: new Date().toISOString()
          })
          .eq('user_id', profileId);
      }

      await fetchAllData();
      toast.success('Pesagem registrada com sucesso!');
      
      return { success: true, message: 'Pesagem registrada com sucesso' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar pesagem';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [user, getProfileId, fetchAllData, healthData, calculateBMI]);

  // Marcar como completo
  const markAsComplete = useCallback(() => {
    if (user && isDataComplete) {
      localStorage.setItem(getCacheKey('complete'), 'true');
    }
  }, [user, isDataComplete, getCacheKey]);

  // Limpar cache
  const clearCache = useCallback(() => {
    if (user) {
      const keys = ['physical', 'health', 'complete'];
      keys.forEach(key => localStorage.removeItem(getCacheKey(key)));
    }
  }, [user, getCacheKey]);

  // Refresh data
  const refreshData = useCallback(async () => {
    await fetchAllData();
  }, [fetchAllData]);

  // Carregar dados na inicialização
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Real-time updates
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('health-data-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'dados_fisicos_usuario'
      }, () => {
        console.log('Dados físicos atualizados, recarregando...');
        fetchAllData();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'dados_saude_usuario'
      }, () => {
        console.log('Dados de saúde atualizados, recarregando...');
        fetchAllData();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'pesagens'
      }, () => {
        console.log('Nova pesagem detectada, recarregando...');
        fetchAllData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchAllData]);

  return {
    // Estado
    loading,
    error,
    
    // Dados
    physicalData,
    healthData,
    latestWeightMeasurement,
    weightHistory,
    
    // Computados
    isDataComplete,
    bmi,
    bmiCategory,
    cardiometabolicRisk,
    
    // Ações
    savePhysicalData,
    saveHealthData,
    saveWeightMeasurement,
    
    // Utilitários
    calculateBMI,
    getBMICategory,
    getCardiometabolicRisk,
    refreshData,
    markAsComplete,
    clearCache
  };
}; 