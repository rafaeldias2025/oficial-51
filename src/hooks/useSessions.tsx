import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { 
  CoachingTool, 
  CoachingSession, 
  SessionStats, 
  SessionFilters,
  CreateSessionRequest,
  UpdateSessionRequest,
  SubmitResponseRequest,
  SessionResult,
  SessionResponse
} from '@/types/sessions';

export const useSessions = () => {
  const [sessions, setSessions] = useState<CoachingSession[]>([]);
  const [tools, setTools] = useState<CoachingTool[]>([]);
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar ferramentas de coaching
  const loadTools = async () => {
    try {
      const { data, error } = await supabase
        .from('coaching_tools')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setTools(data || []);
    } catch (err) {
      console.error('Erro ao carregar ferramentas:', err);
      setError('Erro ao carregar ferramentas de coaching');
    }
  };

  // Carregar sessões com filtros
  const loadSessions = async (filters?: SessionFilters) => {
    try {
      setLoading(true);
      let query = supabase
        .from('coaching_sessions')
        .select(`
          *,
          tool:coaching_tools(*),
          user:profiles!coaching_sessions_user_id_fkey(id, email, full_name),
          admin:profiles!coaching_sessions_admin_id_fkey(id, email, full_name)
        `)
        .order('created_at', { ascending: false });

      // Aplicar filtros
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.tool_id) {
        query = query.eq('tool_id', filters.tool_id);
      }
      if (filters?.user_id) {
        query = query.eq('user_id', filters.user_id);
      }
      if (filters?.admin_id) {
        query = query.eq('admin_id', filters.admin_id);
      }
      if (filters?.date_from) {
        query = query.gte('scheduled_date', filters.date_from);
      }
      if (filters?.date_to) {
        query = query.lte('scheduled_date', filters.date_to);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSessions(data || []);
    } catch (err) {
      console.error('Erro ao carregar sessões:', err);
      setError('Erro ao carregar sessões');
    } finally {
      setLoading(false);
    }
  };

  // Carregar estatísticas
  const loadStats = async () => {
    try {
      // Total de sessões por status
      const { data: statusCounts } = await supabase
        .from('coaching_sessions')
        .select('status')
        .then(({ data }) => {
          const counts = {
            total_sessions: data?.length || 0,
            pending_sessions: data?.filter(s => s.status === 'pending').length || 0,
            in_progress_sessions: data?.filter(s => s.status === 'in_progress').length || 0,
            completed_sessions: data?.filter(s => s.status === 'completed').length || 0,
            cancelled_sessions: data?.filter(s => s.status === 'cancelled').length || 0
          };
          return { data: counts };
        });

      // Usuários únicos
      const { data: uniqueUsers } = await supabase
        .from('coaching_sessions')
        .select('user_id')
        .then(({ data }) => ({
          data: { total_users: new Set(data?.map(s => s.user_id)).size || 0 }
        }));

      // Ferramentas mais usadas
      const { data: toolUsage } = await supabase
        .from('coaching_sessions')
        .select(`
          tool_id,
          tool:coaching_tools(name)
        `)
        .then(({ data }) => {
          const usage = data?.reduce((acc: Record<string, number>, session) => {
            const toolName = session.tool?.name || 'Desconhecido';
            acc[toolName] = (acc[toolName] || 0) + 1;
            return acc;
          }, {}) || {};

          const most_used_tools = Object.entries(usage)
            .map(([tool_name, usage_count]) => ({ tool_name, usage_count }))
            .sort((a, b) => b.usage_count - a.usage_count)
            .slice(0, 5);

          return { data: { most_used_tools } };
        });

      const statsData: SessionStats = {
        ...statusCounts?.data,
        ...uniqueUsers?.data,
        ...toolUsage?.data,
        completion_rate: statusCounts?.data.total_sessions > 0 
          ? (statusCounts?.data.completed_sessions / statusCounts?.data.total_sessions) * 100 
          : 0,
        average_completion_time: 20 // Mock - seria calculado com base em dados reais
      };

      setStats(statsData);
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    }
  };

  // Criar nova sessão
  const createSession = async (request: CreateSessionRequest): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('coaching_sessions')
        .insert({
          user_id: request.user_id,
          tool_id: request.tool_id,
          admin_id: user.id,
          scheduled_date: request.scheduled_date,
          instructions: request.instructions,
          status: 'pending'
        });

      if (error) throw error;

      // Recarregar sessões
      await loadSessions();
      await loadStats();
      
      return true;
    } catch (err) {
      console.error('Erro ao criar sessão:', err);
      setError('Erro ao criar sessão');
      return false;
    }
  };

  // Atualizar sessão
  const updateSession = async (sessionId: number, updates: UpdateSessionRequest): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('coaching_sessions')
        .update(updates)
        .eq('id', sessionId);

      if (error) throw error;

      // Recarregar sessões
      await loadSessions();
      await loadStats();
      
      return true;
    } catch (err) {
      console.error('Erro ao atualizar sessão:', err);
      setError('Erro ao atualizar sessão');
      return false;
    }
  };

  // Deletar sessão
  const deleteSession = async (sessionId: number): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('coaching_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      // Recarregar sessões
      await loadSessions();
      await loadStats();
      
      return true;
    } catch (err) {
      console.error('Erro ao deletar sessão:', err);
      setError('Erro ao deletar sessão');
      return false;
    }
  };

  // Iniciar sessão (usuário)
  const startSession = async (sessionId: number): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('coaching_sessions')
        .update({
          status: 'in_progress',
          started_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Erro ao iniciar sessão:', err);
      setError('Erro ao iniciar sessão');
      return false;
    }
  };

  // Submeter resposta
  const submitResponse = async (request: SubmitResponseRequest): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('session_responses')
        .insert(request);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Erro ao submeter resposta:', err);
      setError('Erro ao submeter resposta');
      return false;
    }
  };

  // Finalizar sessão e gerar resultado
  const completeSession = async (sessionId: number): Promise<boolean> => {
    try {
      // Buscar todas as respostas da sessão
      const { data: responses, error: responsesError } = await supabase
        .from('session_responses')
        .select('*')
        .eq('session_id', sessionId);

      if (responsesError) throw responsesError;

      // Buscar dados da ferramenta para processamento
      const { data: session, error: sessionError } = await supabase
        .from('coaching_sessions')
        .select(`
          *,
          tool:coaching_tools(*)
        `)
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;

      // Processar resultados
      const result = await processSessionResults(session, responses || []);

      // Salvar resultado
      const { error: resultError } = await supabase
        .from('session_results')
        .insert({
          session_id: sessionId,
          total_score: result.total_score,
          category_scores: result.category_scores,
          insights: result.insights,
          recommendations: result.recommendations,
          summary: result.summary
        });

      if (resultError) throw resultError;

      // Atualizar status da sessão
      const { error: updateError } = await supabase
        .from('coaching_sessions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (updateError) throw updateError;

      return true;
    } catch (err) {
      console.error('Erro ao finalizar sessão:', err);
      setError('Erro ao finalizar sessão');
      return false;
    }
  };

  // Processar resultados da sessão
  const processSessionResults = async (session: any, responses: SessionResponse[]) => {
    const tool = session.tool;
    const scoring = tool.scoring_config;
    
    // Calcular scores por categoria
    const categoryScores: Record<string, number> = {};
    const categoryTotals: Record<string, number> = {};
    
    responses.forEach(response => {
      if (!categoryScores[response.category]) {
        categoryScores[response.category] = 0;
        categoryTotals[response.category] = 0;
      }
      
      let score = 0;
      if (response.response_type === 'scale') {
        score = response.response_value || 0;
      } else if (response.response_type === 'multiple_choice' && scoring.scoring) {
        score = scoring.scoring[response.response] || 0;
      }
      
      categoryScores[response.category] += score;
      categoryTotals[response.category] += 1;
    });

    // Calcular médias por categoria
    Object.keys(categoryScores).forEach(category => {
      if (categoryTotals[category] > 0) {
        categoryScores[category] = categoryScores[category] / categoryTotals[category];
      }
    });

    // Calcular score total
    const totalScore = Object.values(categoryScores).reduce((sum, score) => sum + score, 0) / Object.keys(categoryScores).length;

    // Gerar insights e recomendações baseados no resultado
    const insights = generateInsights(tool.name, categoryScores, scoring);
    const recommendations = generateRecommendations(tool.name, categoryScores, scoring);
    const summary = generateSummary(tool.name, totalScore, categoryScores);

    return {
      total_score: Math.round(totalScore * 100) / 100,
      category_scores: categoryScores,
      insights,
      recommendations,
      summary
    };
  };

  // Gerar insights baseados nos resultados
  const generateInsights = (toolName: string, scores: Record<string, number>, config: any): string[] => {
    const insights: string[] = [];
    
    Object.entries(scores).forEach(([category, score]) => {
      if (score < 4) {
        insights.push(`${category}: Área que necessita atenção especial (${score.toFixed(1)}/10)`);
      } else if (score >= 8) {
        insights.push(`${category}: Área de destaque e fortaleza (${score.toFixed(1)}/10)`);
      }
    });

    return insights;
  };

  // Gerar recomendações baseadas nos resultados
  const generateRecommendations = (toolName: string, scores: Record<string, number>, config: any): string[] => {
    const recommendations: string[] = [];
    
    const lowScoreAreas = Object.entries(scores)
      .filter(([_, score]) => score < 5)
      .map(([category, _]) => category);

    if (lowScoreAreas.length > 0) {
      recommendations.push(`Concentre esforços nas áreas: ${lowScoreAreas.join(', ')}`);
      recommendations.push('Considere criar um plano de ação específico para essas áreas');
    }

    const highScoreAreas = Object.entries(scores)
      .filter(([_, score]) => score >= 8)
      .map(([category, _]) => category);

    if (highScoreAreas.length > 0) {
      recommendations.push(`Mantenha o excelente desempenho em: ${highScoreAreas.join(', ')}`);
    }

    return recommendations;
  };

  // Gerar resumo dos resultados
  const generateSummary = (toolName: string, totalScore: number, scores: Record<string, number>): string => {
    const numAreas = Object.keys(scores).length;
    const excellentAreas = Object.values(scores).filter(score => score >= 8).length;
    const criticalAreas = Object.values(scores).filter(score => score < 4).length;

    return `Avaliação ${toolName} concluída com score geral de ${totalScore.toFixed(1)}/10. 
            De ${numAreas} áreas avaliadas: ${excellentAreas} em excelente estado, 
            ${criticalAreas} necessitam atenção urgente.`;
  };

  // Buscar sessão por ID com todos os relacionamentos
  const getSession = async (sessionId: number): Promise<CoachingSession | null> => {
    try {
      const { data, error } = await supabase
        .from('coaching_sessions')
        .select(`
          *,
          tool:coaching_tools(*),
          user:profiles!coaching_sessions_user_id_fkey(id, email, full_name),
          admin:profiles!coaching_sessions_admin_id_fkey(id, email, full_name),
          responses:session_responses(*),
          result:session_results(*)
        `)
        .eq('id', sessionId)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Erro ao buscar sessão:', err);
      return null;
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([
        loadTools(),
        loadSessions(),
        loadStats()
      ]);
    };

    initializeData();
  }, []);

  return {
    // Estado
    sessions,
    tools,
    stats,
    loading,
    error,
    
    // Ações
    loadSessions,
    loadStats,
    createSession,
    updateSession,
    deleteSession,
    startSession,
    submitResponse,
    completeSession,
    getSession,
    
    // Utilitários
    clearError: () => setError(null)
  };
}; 