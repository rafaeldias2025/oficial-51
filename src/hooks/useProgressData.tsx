import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface ProgressData {
  pesagens: any[];
  dadosFisicos: any;
  historicoMedidas: any[];
  metasPeso: any[];
  loading: boolean;
  error: string | null;
}

export const useProgressData = () => {
  const { user } = useAuth();
  const [data, setData] = useState<ProgressData>({
    pesagens: [],
    dadosFisicos: null,
    historicoMedidas: [],
    metasPeso: [],
    loading: true,
    error: null
  });

  const fetchProgressData = React.useCallback(async () => {
    if (!user) {
      console.log('🚫 useProgressData: Usuário não autenticado');
      return;
    }
    
    console.log('🔄 useProgressData: Iniciando busca de dados para usuário:', user.id);
    
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));

      // Buscar profile do usuário
      console.log('👤 useProgressData: Buscando perfil do usuário...');
      let { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!profile) {
        console.warn('⚠️ useProgressData: Profile não encontrado, criando perfil padrão');
        // Criar perfil padrão temporário
        const { data: newProfile } = await supabase
          .from('profiles')
          .insert([{
            user_id: user.id,
            full_name: user.email?.split('@')[0] || 'Usuário',
            email: user.email || ''
          }])
          .select()
          .single();
        
        if (newProfile) {
          profile = newProfile;
          console.log('✅ useProgressData: Perfil criado com sucesso');
        } else {
          throw new Error('Não foi possível criar o perfil');
        }
      } else {
        console.log('✅ useProgressData: Perfil encontrado:', profile.id);
      }

      // Buscar dados físicos atuais
      console.log('📊 useProgressData: Buscando dados físicos...');
      const { data: dadosFisicos } = await supabase
        .from('dados_fisicos_usuario')
        .select('*')
        .eq('user_id', profile.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      console.log('📊 useProgressData: Dados físicos encontrados:', !!dadosFisicos);

      // Buscar histórico de pesagens (mais recentes primeiro)
      console.log('⚖️ useProgressData: Buscando pesagens...');
      const { data: pesagens } = await supabase
        .from('pesagens')
        .select('*')
        .eq('user_id', profile.id)
        .order('data_medicao', { ascending: false });

      console.log('⚖️ useProgressData: Pesagens encontradas:', pesagens?.length || 0);

      // Buscar histórico de medidas
      console.log('📏 useProgressData: Buscando histórico de medidas...');
      const { data: historicoMedidas } = await supabase
        .from('historico_medidas')
        .select('*')
        .eq('user_id', profile.id)
        .order('data_medicao', { ascending: true });

      console.log('📏 useProgressData: Histórico de medidas encontrado:', historicoMedidas?.length || 0);

      // Buscar metas de peso
      console.log('🎯 useProgressData: Buscando metas de peso...');
      const { data: metasPeso } = await supabase
        .from('weight_goals')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      console.log('🎯 useProgressData: Metas de peso encontradas:', metasPeso?.length || 0);

      setData({
        pesagens: pesagens || [],
        dadosFisicos: dadosFisicos || null,
        historicoMedidas: historicoMedidas || [],
        metasPeso: metasPeso || [],
        loading: false,
        error: null
      });

      console.log('✅ useProgressData: Dados de progresso atualizados com sucesso:', { 
        pesagens: pesagens?.length || 0, 
        dadosFisicos: !!dadosFisicos,
        historicoMedidas: historicoMedidas?.length || 0,
        metasPeso: metasPeso?.length || 0
      });

    } catch (error) {
      console.error('❌ useProgressData: Erro ao buscar dados de progresso:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }));
    }
  }, [user]);

  useEffect(() => {
    fetchProgressData();
  }, [user]);

  // Real-time updates para pesagens e dados físicos
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('progress-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pesagens'
        },
        () => {
          console.log('Nova pesagem detectada, atualizando dados de progresso...');
          fetchProgressData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dados_fisicos_usuario'
        },
        () => {
          console.log('Dados físicos atualizados, atualizando dados de progresso...');
          fetchProgressData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'historico_medidas'
        },
        () => {
          console.log('Histórico de medidas atualizado, atualizando dados de progresso...');
          fetchProgressData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'weight_goals'
        },
        () => {
          console.log('Metas de peso atualizadas, atualizando dados de progresso...');
          fetchProgressData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return data;
};