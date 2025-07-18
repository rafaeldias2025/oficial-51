import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

// ====================================================================
// HOOK UNIFICADO DE DADOS DE SAÚDE
// Este hook substitui:
// - useDadosFisicos.tsx
// - useDadosSaudeCore.tsx
// - usePhysicalDataComplete.tsx
// ====================================================================

export interface DadosSaude {
  id?: string;
  user_id: string;
  peso_atual_kg: number;
  altura_cm: number;
  circunferencia_abdominal_cm: number;
  imc?: number;
  meta_peso_kg?: number;
  categoria_imc?: string;
  risco_cardiometabolico?: string;
  nome_completo?: string;
  sexo?: string;
  data_nascimento?: string;
  nome_usuario?: string;
  progresso_percentual?: number;
  data_atualizacao?: string;
}

export interface MissaoUsuario {
  id?: string;
  user_id: string;
  data: string;
  humor?: string;
  bebeu_agua?: boolean;
  dormiu_bem?: boolean;
  autocuidado?: boolean;
}

export const useDadosSaude = () => {
  const { user } = useAuth();
  const [dadosSaude, setDadosSaude] = useState<DadosSaude | null>(null);
  const [missoesDaSemana, setMissoesDaSemana] = useState<MissaoUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState<boolean | null>(null);

  // Buscar ID do perfil do usuário - memoizado
  const fetchProfileId = useCallback(async () => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();
        
      if (error) throw error;
      return data?.id || null;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
  }, [user]);

  // Verificar se os dados físicos estão completos
  const checkPhysicalDataComplete = useCallback(async () => {
    if (!user) {
      setIsComplete(false);
      return;
    }
    
    try {
      // Verificar se é admin primeiro
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();
      
      // Admins não precisam de dados físicos
      if (profile?.role === 'admin') {
        setIsComplete(true);
        return;
      }
      
      // Verificar dados físicos usando função do banco
      const { data: hasPhysicalData, error } = await supabase
        .rpc('check_physical_data_complete', { user_uuid: user.id });
      
      if (error) {
        console.error('Erro ao verificar dados físicos:', error);
        setIsComplete(false);
      } else {
        setIsComplete(hasPhysicalData);
      }
    } catch (error) {
      console.error('Erro ao verificar dados físicos:', error);
      setIsComplete(false);
    }
  }, [user]);

  // Buscar dados de saúde do usuário
  const fetchDadosSaude = useCallback(async () => {
    if (!profileId) return;
    
    try {
      setLoading(true);
      
      // Buscar dados de saúde
      const { data: saude, error: saudeError } = await supabase
        .from('dados_saude_usuario')
        .select('*')
        .eq('user_id', profileId)
        .order('data_atualizacao', { ascending: false })
        .limit(1)
        .maybeSingle();
        
      if (saudeError) throw saudeError;
      
      // Buscar dados físicos detalhados
      const { data: fisicos, error: fisicosError } = await supabase
        .from('dados_fisicos_usuario')
        .select('*')
        .eq('user_id', profileId)
        .maybeSingle();
        
      if (fisicosError) throw fisicosError;
      
      // Buscar pesagem mais recente
      const { data: pesagem, error: pesagemError } = await supabase
        .from('pesagens')
        .select('*')
        .eq('user_id', profileId)
        .order('data_medicao', { ascending: false })
        .limit(1)
        .maybeSingle();
        
      if (pesagemError) throw pesagemError;
      
      // Combinar os dados de diferentes fontes
      let dadosCombinados: DadosSaude | null = null;
      
      if (fisicos) {
        dadosCombinados = {
          ...fisicos,
          progresso_percentual: saude?.progresso_percentual
        };
      } else if (saude) {
        dadosCombinados = saude;
      }
      
      // Atualizar com dados da pesagem mais recente se disponível
      if (pesagem && dadosCombinados) {
        const alturaMetros = dadosCombinados.altura_cm ? dadosCombinados.altura_cm / 100 : 1.7;
        const imcCalculado = pesagem.peso_kg / (alturaMetros * alturaMetros);
        
        dadosCombinados = {
          ...dadosCombinados,
          peso_atual_kg: pesagem.peso_kg,
          imc: Math.round(imcCalculado * 10) / 10,
          data_atualizacao: pesagem.data_medicao
        };
      }
      
      setDadosSaude(dadosCombinados);
      
      // Verificar se os dados estão completos
      checkPhysicalDataComplete();
    } catch (error) {
      console.error('Erro ao buscar dados de saúde:', error);
    } finally {
      setLoading(false);
    }
  }, [profileId, checkPhysicalDataComplete]);

  // Buscar missões da semana
  const fetchMissoesDaSemana = useCallback(async () => {
    if (!profileId) return;
    
    try {
      // Calcular data de 7 dias atrás
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      
      const { data, error } = await supabase
        .from('missoes_usuario')
        .select('*')
        .eq('user_id', profileId)
        .gte('data', sevenDaysAgo.toISOString().split('T')[0])
        .order('data', { ascending: false });
        
      if (error) throw error;
      
      setMissoesDaSemana(data || []);
    } catch (error) {
      console.error('Erro ao buscar missões da semana:', error);
    }
  }, [profileId]);

  // Salvar dados de saúde
  const salvarDadosSaude = useCallback(async (
    novosDados: Omit<DadosSaude, 'id' | 'user_id' | 'imc' | 'categoria_imc' | 'risco_cardiometabolico' | 'progresso_percentual' | 'data_atualizacao'>
  ) => {
    try {
      if (!user) {
        // Salvar temporariamente no localStorage
        const dadosTemp = {
          ...novosDados,
          user_id: 'temp',
          imc: novosDados.peso_atual_kg / Math.pow(novosDados.altura_cm / 100, 2),
          data_atualizacao: new Date().toISOString()
        };
        localStorage.setItem('dados_saude_temp', JSON.stringify(dadosTemp));
        setDadosSaude(dadosTemp);
        return;
      }

      if (!profileId) {
        throw new Error('Perfil não encontrado');
      }

      // Calcular IMC
      const alturaMetros = novosDados.altura_cm / 100;
      const imc = novosDados.peso_atual_kg / (alturaMetros * alturaMetros);
      
      // Calcular categoria IMC
      const categoriaImc = await calcularCategoriaIMC(imc);
      
      // Calcular risco cardiometabólico
      const riscoCardiometabolico = await calcularRiscoCardiometabolico(
        novosDados.circunferencia_abdominal_cm, 
        novosDados.sexo || 'masculino'
      );

      // Salvar dados físicos completos
      if (novosDados.nome_completo && novosDados.data_nascimento && novosDados.sexo) {
        const { error: fisicosError } = await supabase
          .from('dados_fisicos_usuario')
          .upsert([{
            user_id: profileId,
            nome_completo: novosDados.nome_completo,
            data_nascimento: novosDados.data_nascimento,
            sexo: novosDados.sexo,
            altura_cm: novosDados.altura_cm,
            peso_atual_kg: novosDados.peso_atual_kg,
            circunferencia_abdominal_cm: novosDados.circunferencia_abdominal_cm,
            meta_peso_kg: novosDados.meta_peso_kg,
            imc,
            categoria_imc: categoriaImc,
            risco_cardiometabolico: riscoCardiometabolico
          }]);
          
        if (fisicosError) throw fisicosError;
      }
      
      // Salvar dados de saúde resumidos
      const { error: saudeError } = await supabase
        .from('dados_saude_usuario')
        .upsert([{
          user_id: profileId,
          altura_cm: novosDados.altura_cm,
          peso_atual_kg: novosDados.peso_atual_kg,
          circunferencia_abdominal_cm: novosDados.circunferencia_abdominal_cm,
          meta_peso_kg: novosDados.meta_peso_kg || novosDados.peso_atual_kg * 0.9,
          imc,
          data_atualizacao: new Date().toISOString()
        }]);
        
      if (saudeError) throw saudeError;
      
      // Registrar pesagem
      const { error: pesagemError } = await supabase
        .from('pesagens')
        .insert([{
          user_id: profileId,
          peso_kg: novosDados.peso_atual_kg,
          circunferencia_abdominal_cm: novosDados.circunferencia_abdominal_cm,
          imc,
          data_medicao: new Date().toISOString(),
          origem_medicao: 'manual'
        }]);
        
      if (pesagemError) throw pesagemError;
      
      // Atualizar dados locais
      await fetchDadosSaude();
      
      toast.success('Dados de saúde salvos com sucesso!');
      
      // Marcar dados como completos
      setIsComplete(true);
      
      return true;
    } catch (error) {
      console.error('Erro ao salvar dados de saúde:', error);
      toast.error('Erro ao salvar dados');
      throw error;
    }
  }, [user, profileId, fetchDadosSaude]);

  // Utilitário: Calcular categoria IMC
  const calcularCategoriaIMC = async (imc: number): Promise<string> => {
    try {
      const { data, error } = await supabase
        .rpc('calcular_categoria_imc', { imc_valor: imc });
        
      if (error) throw error;
      return data || 'Normal';
    } catch (error) {
      console.error('Erro ao calcular categoria IMC:', error);
      
      // Fallback se a função RPC falhar
      if (imc < 18.5) return 'Abaixo do peso';
      if (imc < 25) return 'Normal';
      if (imc < 30) return 'Sobrepeso';
      if (imc < 35) return 'Obesidade Grau I';
      if (imc < 40) return 'Obesidade Grau II';
      return 'Obesidade Grau III';
    }
  };

  // Utilitário: Calcular risco cardiometabólico
  const calcularRiscoCardiometabolico = async (circunferencia: number, sexo: string): Promise<string> => {
    try {
      const { data, error } = await supabase
        .rpc('calcular_risco_cardiometabolico', { 
          circunferencia, 
          sexo 
        });
        
      if (error) throw error;
      return data || 'Moderado';
    } catch (error) {
      console.error('Erro ao calcular risco cardiometabólico:', error);
      
      // Fallback se a função RPC falhar
      if (sexo.toLowerCase() === 'masculino') {
        if (circunferencia < 94) return 'Baixo';
        if (circunferencia < 102) return 'Moderado';
        return 'Alto';
      } else {
        if (circunferencia < 80) return 'Baixo';
        if (circunferencia < 88) return 'Moderado';
        return 'Alto';
      }
    }
  };

  // Migrar dados temporários
  const migrarDadosTemporarios = useCallback(async () => {
    if (!user || !profileId) return;

    const dadosTemp = localStorage.getItem('dados_saude_temp');
    if (dadosTemp) {
      try {
        const dados = JSON.parse(dadosTemp);
        await salvarDadosSaude({
          peso_atual_kg: dados.peso_atual_kg,
          altura_cm: dados.altura_cm,
          circunferencia_abdominal_cm: dados.circunferencia_abdominal_cm,
          meta_peso_kg: dados.meta_peso_kg
        });
        localStorage.removeItem('dados_saude_temp');
        toast.success('Dados temporários migrados com sucesso!');
      } catch (error) {
        console.error('Erro ao migrar dados temporários:', error);
      }
    }
  }, [user, profileId, salvarDadosSaude]);

  // Calcular diferença de circunferência
  const calcularDiferencaCircunferencia = useCallback(() => {
    if (!dadosSaude) return null;
    
    // Implementar lógica para comparar com medições anteriores
    const diasDesdeInicio = 15;
    const reducao = 3.4;
    
    return { reducao, dias: diasDesdeInicio };
  }, [dadosSaude]);

  // Inicialização - Buscar profile ID
  useEffect(() => {
    const initializeProfileId = async () => {
      const id = await fetchProfileId();
      if (id) {
        setProfileId(id);
      }
    };
    
    initializeProfileId();
  }, [fetchProfileId]);

  // Carregar dados quando o profileId estiver disponível
  useEffect(() => {
    if (profileId) {
      fetchDadosSaude();
      fetchMissoesDaSemana();
    }
  }, [profileId, fetchDadosSaude, fetchMissoesDaSemana]);

  // Configurar subscription em tempo real
  useEffect(() => {
    if (!profileId) return;
    
    const channel = supabase
      .channel('saude-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'dados_saude_usuario',
          filter: `user_id=eq.${profileId}`
        },
        () => fetchDadosSaude()
      )
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'dados_fisicos_usuario',
          filter: `user_id=eq.${profileId}`
        },
        () => fetchDadosSaude()
      )
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'pesagens',
          filter: `user_id=eq.${profileId}`
        },
        () => fetchDadosSaude()
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [profileId, fetchDadosSaude]);

  // Verificar dados temporários quando o usuário logar
  useEffect(() => {
    if (user && profileId) {
      migrarDadosTemporarios();
    }
  }, [user, profileId, migrarDadosTemporarios]);

  const refetch = useCallback(async () => {
    await Promise.all([fetchDadosSaude(), fetchMissoesDaSemana()]);
  }, [fetchDadosSaude, fetchMissoesDaSemana]);

  return {
    dadosSaude,
    missoesDaSemana,
    loading,
    isComplete,
    salvarDadosSaude,
    calcularDiferencaCircunferencia,
    migrarDadosTemporarios,
    refetch,
    checkPhysicalDataComplete
  };
};