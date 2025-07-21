import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  role: string;
  avatar_url?: string;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
  total_points?: number;
}

export interface AdminStats {
  total_users: number;
  active_users: number;
  total_courses: number;
  active_courses: number;
  total_sessions: number;
  total_files: number;
  storage_used: number;
}

export const useAdminActions = () => {
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar se usuário atual é admin
  const isCurrentUserAdmin = useCallback(async (): Promise<boolean> => {
    if (!currentUser) return false;
    
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', currentUser.id)
        .maybeSingle();
      
      if (error) {
        console.error('Erro ao verificar admin:', error);
        return false;
      }
      
      return profile?.role === 'admin';
    } catch (error) {
      console.error('Erro ao verificar permissões admin:', error);
      return false;
    }
  }, [currentUser]);

  // Buscar estatísticas do dashboard
  const fetchDashboardStats = useCallback(async (): Promise<AdminStats | null> => {
    if (!(await isCurrentUserAdmin())) {
      toast.error('Apenas administradores podem acessar estas informações');
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      // Buscar contadores em paralelo
      const [
        { count: totalUsers },
        { count: totalCourses },
        { count: totalSessions }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('sessions').select('*', { count: 'exact', head: true })
      ]);

      // Buscar usuários ativos (últimos 30 dias)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count: activeUsers } = await supabase
        .from('user_points')
        .select('*', { count: 'exact', head: true })
        .gte('last_activity_date', thirtyDaysAgo.toISOString().split('T')[0]);

      // Buscar cursos ativos
      const { count: activeCourses } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Calcular uso de storage (aproximado)
      let totalFiles = 0;
      let storageUsed = 0;
      
      try {
        const buckets = ['uploads', 'course-images', 'user-content', 'avatars'];
        for (const bucket of buckets) {
          const { data: files } = await supabase.storage
            .from(bucket)
            .list('', { limit: 1000 });
          
          if (files) {
            totalFiles += files.length;
            storageUsed += files.reduce((acc, file) => acc + (file.metadata?.size || 0), 0);
          }
        }
      } catch (storageError) {
        console.warn('Erro ao calcular storage:', storageError);
      }

      const stats: AdminStats = {
        total_users: totalUsers || 0,
        active_users: activeUsers || 0,
        total_courses: totalCourses || 0,
        active_courses: activeCourses || 0,
        total_sessions: totalSessions || 0,
        total_files: totalFiles,
        storage_used: storageUsed
      };

      return stats;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      setError('Erro ao carregar estatísticas do dashboard');
      toast.error('Erro ao carregar estatísticas');
      return null;
    } finally {
      setLoading(false);
    }
  }, [isCurrentUserAdmin]);

  // Buscar todos os usuários
  const fetchAllUsers = useCallback(async (): Promise<AdminUser[]> => {
    if (!(await isCurrentUserAdmin())) {
      toast.error('Apenas administradores podem listar usuários');
      return [];
    }

    try {
      setLoading(true);
      setError(null);

      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Buscar pontos para cada usuário
      const usersWithPoints = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: pointsData } = await supabase
            .from('user_points')
            .select('total_points')
            .eq('user_id', profile.id)
            .maybeSingle();

          return {
            ...profile,
            total_points: pointsData?.total_points || 0
          } as AdminUser;
        })
      );

      return usersWithPoints;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      setError('Erro ao carregar usuários');
      toast.error('Erro ao carregar usuários');
      return [];
    } finally {
      setLoading(false);
    }
  }, [isCurrentUserAdmin]);

  // Criar novo usuário
  const createUser = useCallback(async (userData: {
    email: string;
    password: string;
    full_name: string;
    role: 'admin' | 'client' | 'visitor';
  }): Promise<boolean> => {
    if (!(await isCurrentUserAdmin())) {
      toast.error('Apenas administradores podem criar usuários');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      // Validações
      if (!userData.email || !userData.password || !userData.full_name) {
        throw new Error('Todos os campos são obrigatórios');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        throw new Error('Email inválido');
      }

      if (userData.password.length < 6) {
        throw new Error('Senha deve ter pelo menos 6 caracteres');
      }

      console.log('🚀 Iniciando criação de usuário:', userData.email);

      // Criar usuário no Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.full_name,
            role: userData.role
          }
        }
      });

      if (authError) {
        console.error('❌ Erro ao criar usuário no Auth:', authError);
        throw authError;
      }

      console.log('✅ Usuário criado no Auth:', authData?.user?.id);

      // Aguardar o trigger criar o perfil
      console.log('⏳ Aguardando trigger criar o perfil...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Verificar se o perfil foi criado
      if (authData.user) {
        const { data: profile, error: profileQueryError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', authData.user.id)
          .maybeSingle();

        if (profileQueryError) {
          console.error('❌ Erro ao buscar perfil:', profileQueryError);
          throw profileQueryError;
        }

        if (!profile) {
          console.warn('⚠️ Perfil não encontrado, tentando criar manualmente...');
          
          // Criar perfil manualmente
          const { error: createProfileError } = await supabase
            .from('profiles')
            .insert({
              user_id: authData.user.id,
              email: userData.email,
              full_name: userData.full_name,
              role: userData.role
            });

          if (createProfileError) {
            console.error('❌ Erro ao criar perfil manualmente:', createProfileError);
            throw createProfileError;
          }

          console.log('✅ Perfil criado manualmente');
        } else {
          console.log('✅ Perfil encontrado, atualizando role...');
          
          // Atualizar role do perfil
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              full_name: userData.full_name,
              role: userData.role
            })
            .eq('user_id', authData.user.id);

          if (updateError) {
            console.error('❌ Erro ao atualizar perfil:', updateError);
            throw updateError;
          }

          console.log('✅ Role atualizada com sucesso');
        }
      }

      toast.success(`Usuário ${userData.full_name} criado com sucesso!`);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar usuário';
      console.error('❌ Erro ao criar usuário:', error);
      setError(errorMessage);
      toast.error(`Erro ao criar usuário: ${errorMessage}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isCurrentUserAdmin]);

  // Atualizar usuário
  const updateUser = useCallback(async (
    userId: string, 
    updates: Partial<AdminUser>
  ): Promise<boolean> => {
    if (!(await isCurrentUserAdmin())) {
      toast.error('Apenas administradores podem atualizar usuários');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      // Separar atualizações de perfil e pontos
      const { total_points, ...profileUpdates } = updates;

      // Atualizar perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          ...profileUpdates,
          updated_at: new Date().toISOString()
        } as any)
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

      toast.success('Usuário atualizado com sucesso!');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar usuário';
      console.error('Erro ao atualizar usuário:', error);
      setError(errorMessage);
      toast.error(`Erro ao atualizar usuário: ${errorMessage}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isCurrentUserAdmin]);

  // Deletar usuário
  const deleteUser = useCallback(async (userId: string): Promise<boolean> => {
    if (!(await isCurrentUserAdmin())) {
      toast.error('Apenas administradores podem deletar usuários');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      // Deletar o perfil (o trigger irá deletar dados relacionados)
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast.success('Usuário removido com sucesso!');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao deletar usuário';
      console.error('Erro ao deletar usuário:', error);
      setError(errorMessage);
      toast.error(`Erro ao deletar usuário: ${errorMessage}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isCurrentUserAdmin]);

  // Alterar role de usuário
  const changeUserRole = useCallback(async (
    userId: string, 
    newRole: 'admin' | 'client' | 'visitor'
  ): Promise<boolean> => {
    if (!(await isCurrentUserAdmin())) {
      toast.error('Apenas administradores podem alterar roles');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      toast.success(`Role alterado para ${newRole} com sucesso!`);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao alterar role';
      console.error('Erro ao alterar role:', error);
      setError(errorMessage);
      toast.error(`Erro ao alterar role: ${errorMessage}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isCurrentUserAdmin]);

  // Buscar detalhes de usuário
  const getUserDetails = useCallback(async (userId: string): Promise<AdminUser | null> => {
    if (!(await isCurrentUserAdmin())) {
      toast.error('Apenas administradores podem ver detalhes de usuários');
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      // Buscar perfil
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) throw profileError;

      // Buscar pontos
      const { data: pointsData } = await supabase
        .from('user_points')
        .select('total_points, daily_points, weekly_points, monthly_points, current_streak')
        .eq('user_id', userId)
        .maybeSingle();

      return {
        ...profile,
        total_points: pointsData?.total_points || 0
      } as AdminUser;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar detalhes do usuário';
      console.error('Erro ao buscar detalhes do usuário:', error);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isCurrentUserAdmin]);

  // Limpar erros
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    isCurrentUserAdmin,
    fetchDashboardStats,
    fetchAllUsers,
    createUser,
    updateUser,
    deleteUser,
    changeUserRole,
    getUserDetails,
    clearError
  };
};