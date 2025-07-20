import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import {
  CoachingSession,
  SessionResponse,
  SessionResults,
  UserSession,
  UseSessionManagementReturn
} from '@/types/session-system';

export const useSessionManagement = (): UseSessionManagementReturn => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<CoachingSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar sessões do usuário
  const loadUserSessions = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('coaching_sessions')
        .select(`
          *,
          coaching_tools (
            id,
            name,
            description,
            category,
            estimated_time
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSessions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar sessões');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Agendar nova sessão
  const scheduleSession = useCallback(async (session: Partial<CoachingSession>) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('coaching_sessions')
        .insert({
          user_id: user.id,
          tool_id: session.toolId,
          status: 'pending',
          scheduled_date: session.scheduledDate,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Recarregar sessões
      await loadUserSessions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao agendar sessão');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, loadUserSessions]);

  // Atualizar sessão
  const updateSession = useCallback(async (id: string, session: Partial<CoachingSession>) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('coaching_sessions')
        .update({
          status: session.status,
          started_at: session.startedAt,
          completed_at: session.completedAt
        })
        .eq('id', id);

      if (error) throw error;

      // Recarregar sessões
      await loadUserSessions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar sessão');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadUserSessions]);

  // Obter sessão específica
  const getSession = useCallback((id: string): CoachingSession | null => {
    return sessions.find(session => session.id === id) || null;
  }, [sessions]);

  // Obter sessões do usuário
  const getUserSessions = useCallback((userId: string): CoachingSession[] => {
    return sessions.filter(session => session.userId === userId);
  }, [sessions]);

  // Carregar sessões na inicialização
  useState(() => {
    loadUserSessions();
  });

  return {
    sessions,
    loading,
    error,
    scheduleSession,
    updateSession,
    getSession,
    getUserSessions
  };
}; 