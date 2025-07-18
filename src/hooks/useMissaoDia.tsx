import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";
import { UserProfile } from "@/types/admin";

// Interface para os dados de missão - alinhada com o schema da base de dados
export interface MissaoDia {
  id?: string;
  user_id: string;
  data: string;
  inspira?: string;
  humor?: string;
  prioridades?: string[] | any[];
  mensagem_dia?: string;
  momento_feliz?: string;
  tarefa_bem_feita?: string;
  habito_saudavel?: string;
  gratidao?: string;
  concluido?: boolean;
  liquido_ao_acordar?: string;
  pratica_conexao?: string;
  energia_ao_acordar?: number;
  sono_horas?: number;
  agua_litros?: string;
  atividade_fisica?: boolean;
  estresse_nivel?: number;
  fome_emocional?: boolean;
  pequena_vitoria?: string;
  intencao_para_amanha?: string;
  nota_dia?: number;
  created_at?: string;
  updated_at?: string;
}

export const useMissaoDia = (isVisitor = false) => {
  const [missao, setMissao] = useState<MissaoDia | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const today = new Date().toISOString().split('T')[0];

  // ✅ PERFORMANCE: Memoized function to fetch user profile
  const fetchProfile = useCallback(async (): Promise<UserProfile | null> => {
    if (!user?.id) return null;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_id, email, role, full_name, avatar_url, created_at, updated_at')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      setUserProfile(data);
      return data;
    } catch (error: any) {
      if (import.meta.env.VITE_DEBUG_MODE === 'true') {
        console.error('Erro ao buscar perfil:', error);
      }
      return null;
    }
  }, [user?.id]);

  // ✅ ENHANCED: Safe JSON parsing for visitor data
  const parseLocalStorageData = useCallback((data: string): MissaoDia | null => {
    try {
      const parsed = JSON.parse(data);
      // Validate that the parsed data has required fields
      if (parsed && typeof parsed.user_id === 'string' && typeof parsed.data === 'string') {
        return {
          ...parsed,
          prioridades: Array.isArray(parsed.prioridades) ? parsed.prioridades : []
        };
      }
      return null;
    } catch (error) {
      if (import.meta.env.VITE_DEBUG_MODE === 'true') {
        console.error('Erro ao fazer parse dos dados locais:', error);
      }
      return null;
    }
  }, []);

  // ✅ PERFORMANCE: Memoized fetch mission function
  const fetchMissaoDodia = useCallback(async () => {
    try {
      setLoading(true);
      
      // Para visitantes, usar localStorage
      if (isVisitor || !user) {
        const localMissao = localStorage.getItem(`missao_dia_${today}`);
        if (localMissao) {
          const parsedMissao = parseLocalStorageData(localMissao);
          setMissao(parsedMissao);
        } else {
          // Criar nova missão local para visitante
          const novaMissao: MissaoDia = {
            user_id: 'visitor',
            data: today,
            prioridades: [],
            concluido: false
          };
          setMissao(novaMissao);
        }
        return;
      }

      if (!userProfile?.id) return;

      const { data, error } = await supabase
        .from('missao_dia')
        .select(`
          id,
          user_id,
          data,
          inspira,
          humor,
          prioridades,
          mensagem_dia,
          momento_feliz,
          tarefa_bem_feita,
          habito_saudavel,
          gratidao,
          concluido,
          liquido_ao_acordar,
          pratica_conexao,
          energia_ao_acordar,
          sono_horas,
          agua_litros,
          atividade_fisica,
          estresse_nivel,
          fome_emocional,
          pequena_vitoria,
          intencao_para_amanha,
          nota_dia,
          created_at,
          updated_at
        `)
        .eq('user_id', userProfile.id)
        .eq('data', today)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setMissao({
          ...data,
          prioridades: Array.isArray(data.prioridades) ? 
            data.prioridades.map(p => String(p)) : []
        });
      } else {
        // Criar nova missão para hoje
        const novaMissao: MissaoDia = {
          user_id: userProfile.id,
          data: today,
          prioridades: [],
          concluido: false
        };
        setMissao(novaMissao);
      }
    } catch (error: any) {
      if (import.meta.env.VITE_DEBUG_MODE === 'true') {
        console.error('Erro ao buscar missão do dia:', error);
      }
      toast({
        title: "Erro",
        description: "Não foi possível carregar sua missão do dia.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [isVisitor, user, userProfile?.id, today, toast, parseLocalStorageData]);

  // ✅ ENHANCED: Safe update mission function
  const updateMissao = useCallback(async (updates: Partial<MissaoDia>) => {
    if (!missao) return;

    const updatedMissao = { ...missao, ...updates };
    setMissao(updatedMissao);

    // Para visitantes, salvar no localStorage
    if (isVisitor || !user) {
      try {
        localStorage.setItem(`missao_dia_${today}`, JSON.stringify(updatedMissao));
      } catch (error) {
        if (import.meta.env.VITE_DEBUG_MODE === 'true') {
          console.error('Erro ao salvar missão local:', error);
        }
      }
      return;
    }

    if (!userProfile?.id) {
      if (import.meta.env.VITE_DEBUG_MODE === 'true') {
        console.error('UserProfile não encontrado');
      }
      return;
    }

    try {
      if (missao.id) {
        // Atualizar existente
        const { error } = await supabase
          .from('missao_dia')
          .update(updates)
          .eq('id', missao.id);

        if (error) {
          if (import.meta.env.VITE_DEBUG_MODE === 'true') {
            console.error('Erro ao atualizar missão existente:', error);
          }
          throw error;
        }
      } else {
        // Criar nova
        const { data, error } = await supabase
          .from('missao_dia')
          .insert([{
            user_id: userProfile.id,
            data: today,
            ...updates
          }])
          .select()
          .single();

        if (error) {
          if (import.meta.env.VITE_DEBUG_MODE === 'true') {
            console.error('Erro ao criar nova missão:', error);
          }
          throw error;
        }
        
        if (data) {
          setMissao({
            ...updatedMissao,
            id: data.id
          });
        }
      }
    } catch (error: any) {
      if (import.meta.env.VITE_DEBUG_MODE === 'true') {
        console.error('Erro ao atualizar missão:', error);
      }
      toast({
        title: "Erro",
        description: "Não foi possível salvar suas informações.",
        variant: "destructive",
      });
    }
  }, [missao, isVisitor, user, userProfile?.id, today, toast]);

  // ✅ ENHANCED: Complete mission function
  const concluirMissao = useCallback(async () => {
    if (!missao) return;
    await updateMissao({ concluido: true });
  }, [missao, updateMissao]);

  // ✅ EFFECT: Load profile when user changes
  useEffect(() => {
    if (!isVisitor && user) {
      fetchProfile();
    }
  }, [user, isVisitor, fetchProfile]);

  // ✅ EFFECT: Load mission when profile is available or for visitors
  useEffect(() => {
    if (isVisitor || userProfile) {
      fetchMissaoDodia();
    }
  }, [isVisitor, userProfile, fetchMissaoDodia]);

  // ✅ PERFORMANCE: Optimized subscription setup
  useEffect(() => {
    if (isVisitor || !userProfile?.id || !missao?.id) return;
    
    const channel = supabase
      .channel(`missao-${missao.id}`)
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'missao_dia',
          filter: `id=eq.${missao.id}`
        },
        (payload) => {
          if (import.meta.env.VITE_DEBUG_MODE === 'true') {
            console.log('Missão atualizada via subscription:', payload);
          }
          fetchMissaoDodia();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isVisitor, userProfile?.id, missao?.id, fetchMissaoDodia]);

  return {
    missao,
    loading,
    userProfile,
    updateMissao,
    concluirMissao,
    refetch: fetchMissaoDodia
  };
};