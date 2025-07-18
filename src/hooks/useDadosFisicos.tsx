import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface DadosFisicos {
  id?: string;
  user_id: string;
  nome_completo: string;
  sexo: string;
  data_nascimento: string;
  altura_cm: number;
  peso_atual_kg: number;
  circunferencia_abdominal_cm: number;
  imc?: number;
  meta_peso_kg?: number;
  categoria_imc?: string;
  risco_cardiometabolico?: string;
}

export const useDadosFisicos = () => {
  const [dadosFisicos, setDadosFisicos] = useState<DadosFisicos | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchDadosFisicos = async () => {
    try {
      setLoading(true);
      
      if (!user) {
        setDadosFisicos(null);
        return;
      }

      const profile = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profile.error) throw profile.error;

      const { data: fisicos } = await supabase
        .from('dados_fisicos_usuario')
        .select('*')
        .eq('user_id', profile.data.id)
        .single();

      setDadosFisicos(fisicos || null);
    } catch (error) {
      console.error('Erro ao buscar dados físicos:', error);
      setDadosFisicos(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDadosFisicos();
  }, [user]);

  return {
    dadosFisicos,
    loading,
    refetch: fetchDadosFisicos
  };
};