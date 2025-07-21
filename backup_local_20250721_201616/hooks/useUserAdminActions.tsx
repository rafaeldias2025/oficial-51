import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  role: 'admin' | 'client' | 'visitor';
  is_active?: boolean;
  total_points?: number;
  created_at: string;
  updated_at: string;
}

export const useUserAdminActions = () => {
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  // Verificar se usuário atual é admin
  const isCurrentUserAdmin = useCallback(async () => {
    if (!currentUser) return false;
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', currentUser.id)
      .single();
    
    return profile?.role === 'admin';
  }, [currentUser]);

  // Buscar todos os usuários (apenas admins)
  const fetchAllUsers = useCallback(async () => {
    if (!(await isCurrentUserAdmin())) {
      throw new Error('Apenas administradores podem listar usuários');
    }

    setLoading(true);
         try {
       const { data, error } = await supabase
         .from('profiles')
         .select('*')
         .order('created_at', { ascending: false });

       if (error) throw error;

       // Buscar pontos separadamente para cada usuário
       const usersWithPoints = await Promise.all(
         data.map(async (user) => {
           const { data: pointsData } = await supabase
             .from('user_points')
             .select('total_points')
             .eq('user_id', user.id)
             .single();

           return {
             ...user,
             total_points: pointsData?.total_points || 0
           };
         })
       );

       return usersWithPoints;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [isCurrentUserAdmin]);

  // Atualizar perfil de usuário
  const updateUserProfile = useCallback(async (
    userId: string, 
    updates: Partial<UserProfile>
  ) => {
    if (!(await isCurrentUserAdmin())) {
      throw new Error('Apenas administradores podem atualizar perfis');
    }

    setLoading(true);
    try {
      // Separar atualizações de perfil e pontos
      const { total_points, ...profileUpdates } = updates;

      // Atualizar perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', userId);

      if (profileError) throw profileError;

      // Atualizar pontos se fornecido
      if (total_points !== undefined) {
        const { error: pointsError } = await supabase
          .from('user_points')
          .upsert({
            user_id: userId,
            total_points,
            updated_at: new Date().toISOString()
          });

        if (pointsError) {
          console.warn('Erro ao atualizar pontos:', pointsError);
        }
      }

      toast.success('Perfil atualizado com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error('Erro ao atualizar perfil');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [isCurrentUserAdmin]);

  // Alterar role de usuário
  const changeUserRole = useCallback(async (
    userId: string, 
    newRole: 'admin' | 'client' | 'visitor'
  ) => {
    if (!(await isCurrentUserAdmin())) {
      throw new Error('Apenas administradores podem alterar roles');
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      toast.success(`Role alterado para ${newRole}`);
      return true;
    } catch (error) {
      console.error('Erro ao alterar role:', error);
      toast.error('Erro ao alterar role');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [isCurrentUserAdmin]);

  // Atualizar avatar de usuário
  const updateUserAvatar = useCallback(async (
    userId: string, 
    avatarUrl: string
  ) => {
    if (!(await isCurrentUserAdmin())) {
      throw new Error('Apenas administradores podem atualizar avatares');
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', userId);

      if (error) throw error;

      toast.success('Avatar atualizado com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao atualizar avatar:', error);
      toast.error('Erro ao atualizar avatar');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [isCurrentUserAdmin]);

  // Buscar detalhes de um usuário específico
  const getUserDetails = useCallback(async (userId: string) => {
    if (!(await isCurrentUserAdmin())) {
      throw new Error('Apenas administradores podem ver detalhes de usuários');
    }

    setLoading(true);
         try {
       // Buscar perfil
       const { data: profile, error: profileError } = await supabase
         .from('profiles')
         .select('*')
         .eq('id', userId)
         .single();

       if (profileError) throw profileError;

       // Buscar pontos
       const { data: pointsData } = await supabase
         .from('user_points')
         .select('total_points, daily_points, weekly_points, monthly_points, current_streak')
         .eq('user_id', userId)
         .single();

       // Buscar missões
       const { data: missionsData } = await supabase
         .from('missao_dia')
         .select('data, humor, concluido')
         .eq('user_id', userId);

       // Buscar dados físicos
       const { data: physicalData } = await supabase
         .from('dados_fisicos_usuario')
         .select('peso_atual_kg, altura_cm, imc, meta_peso_kg')
         .eq('user_id', userId)
         .single();

       return {
         ...profile,
         total_points: pointsData?.total_points || 0,
         daily_points: pointsData?.daily_points || 0,
         weekly_points: pointsData?.weekly_points || 0,
         monthly_points: pointsData?.monthly_points || 0,
         current_streak: pointsData?.current_streak || 0,
         mission_count: missionsData?.length || 0,
         completed_missions: missionsData?.filter(m => m.concluido).length || 0,
         physical_data: physicalData || null
       };
    } catch (error) {
      console.error('Erro ao buscar detalhes do usuário:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [isCurrentUserAdmin]);

  // Buscar estatísticas dos usuários
  const getUserStats = useCallback(async () => {
    if (!(await isCurrentUserAdmin())) {
      throw new Error('Apenas administradores podem ver estatísticas');
    }

    setLoading(true);
    try {
      // Contar usuários por role
      const { data: roleStats, error: roleError } = await supabase
        .from('profiles')
        .select('role')
        .order('role');

      if (roleError) throw roleError;

      // Calcular estatísticas
      const stats = {
        total_users: roleStats.length,
        admins: roleStats.filter(u => u.role === 'admin').length,
        clients: roleStats.filter(u => u.role === 'client').length,
        visitors: roleStats.filter(u => u.role === 'visitor').length,
        active_users: 0, // TODO: Implementar quando is_active for adicionado
        inactive_users: 0 // TODO: Implementar quando is_active for adicionado
      };

      return stats;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [isCurrentUserAdmin]);

  return {
    loading,
    isCurrentUserAdmin,
    fetchAllUsers,
    updateUserProfile,
    changeUserRole,
    updateUserAvatar,
    getUserDetails,
    getUserStats
  };
}; 