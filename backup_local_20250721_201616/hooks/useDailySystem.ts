// ====================================================================
// HOOK CONSOLIDADO PARA SISTEMA DIÁRIO
// Substitui: useMissaoDia, usePontuacaoDiaria, useDailyMissions, useEnhancedPoints
// ====================================================================

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { 
  DailyMission, 
  DailyPoints, 
  LoadingState, 
  ApiResponse 
} from '@/types';

// === TIPOS ESPECÍFICOS ===
interface DailyProgress {
  totalPoints: number;
  completedTasks: number;
  totalTasks: number;
  category: 'baixa' | 'medio' | 'excelente';
  streak: number;
}

interface DailyTask {
  id: string;
  name: string;
  points: number;
  completed: boolean;
  category: 'wellness' | 'nutrition' | 'fitness' | 'mindfulness';
}

interface UseDailySystemReturn extends LoadingState {
  // Dados consolidados
  todayMission: DailyMission | null;
  todayPoints: DailyPoints | null;
  todayProgress: DailyProgress;
  availableTasks: DailyTask[];
  
  // Histórico
  missionHistory: DailyMission[];
  pointsHistory: DailyPoints[];
  
  // Ações
  saveTodayMission: (mission: Partial<DailyMission>) => Promise<ApiResponse>;
  updateTaskCompletion: (taskId: string, completed: boolean) => Promise<ApiResponse>;
  calculateTodayPoints: () => Promise<ApiResponse>;
  
  // Utilitários
  getPointsForTask: (taskType: string, value: any) => number;
  getDayCategory: (totalPoints: number) => 'baixa' | 'medio' | 'excelente';
  getCurrentStreak: () => Promise<number>;
  refreshData: () => Promise<void>;
}

// === CONSTANTES ===
const PONTOS_BASE = {
  liquido_manha: { sim: 10, nao: 0 },
  conexao_interna: { sim: 15, nao: 0 },
  energia_acordar: { 
    baixa: 5, 
    media: 10, 
    alta: 15, 
    excelente: 20 
  },
  sono_horas: {
    menos_6: 5,
    entre_6_7: 10,
    entre_7_8: 15,
    mais_8: 20
  },
  agua_litros: {
    menos_1: 5,
    entre_1_2: 10,
    entre_2_3: 15,
    mais_3: 20
  },
  atividade_fisica: { sim: 20, nao: 0 },
  estresse_nivel: {
    baixo: 15,
    medio: 10,
    alto: 5,
    muito_alto: 0
  },
  fome_emocional: { nao: 15, sim: 0 },
  gratidao: { sim: 10, nao: 0 },
  pequena_vitoria: { sim: 10, nao: 0 },
  intencao_amanha: { sim: 10, nao: 0 },
  avaliacao_dia: {
    1: 5, 2: 10, 3: 15, 4: 20, 5: 25,
    6: 30, 7: 35, 8: 40, 9: 45, 10: 50
  }
};

export const useDailySystem = (): UseDailySystemReturn => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados
  const [todayMission, setTodayMission] = useState<DailyMission | null>(null);
  const [todayPoints, setTodayPoints] = useState<DailyPoints | null>(null);
  const [missionHistory, setMissionHistory] = useState<DailyMission[]>([]);
  const [pointsHistory, setPointsHistory] = useState<DailyPoints[]>([]);

  // Data de hoje
  const today = new Date().toISOString().split('T')[0];

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

  // Calcular pontos para uma tarefa
  const getPointsForTask = useCallback((taskType: string, value: any): number => {
    const pontos = PONTOS_BASE[taskType as keyof typeof PONTOS_BASE];
    if (!pontos) return 0;

    if (typeof pontos === 'object' && !Array.isArray(pontos)) {
      return pontos[value as keyof typeof pontos] || 0;
    }

    return 0;
  }, []);

  // Determinar categoria do dia
  const getDayCategory = useCallback((totalPoints: number): 'baixa' | 'medio' | 'excelente' => {
    if (totalPoints >= 200) return 'excelente';
    if (totalPoints >= 120) return 'medio';
    return 'baixa';
  }, []);

  // Tarefas disponíveis do dia
  const availableTasks: DailyTask[] = [
    {
      id: 'liquido_manha',
      name: 'Líquido ao acordar',
      points: 10,
      completed: !!todayMission?.liquido_ao_acordar,
      category: 'wellness'
    },
    {
      id: 'conexao_interna',
      name: 'Prática de conexão interna',
      points: 15,
      completed: !!todayMission?.pratica_conexao,
      category: 'mindfulness'
    },
    {
      id: 'atividade_fisica',
      name: 'Atividade física',
      points: 20,
      completed: !!todayMission?.atividade_fisica,
      category: 'fitness'
    },
    {
      id: 'agua_litros',
      name: 'Consumo de água',
      points: 15,
      completed: !!todayMission?.agua_litros,
      category: 'nutrition'
    },
    {
      id: 'gratidao',
      name: 'Momento de gratidão',
      points: 10,
      completed: !!todayMission?.gratidao,
      category: 'mindfulness'
    }
  ];

  // Progresso do dia
  const todayProgress: DailyProgress = {
    totalPoints: todayPoints?.total_pontos_dia || 0,
    completedTasks: availableTasks.filter(task => task.completed).length,
    totalTasks: availableTasks.length,
    category: todayPoints?.categoria_dia || 'baixa',
    streak: 0 // Será calculado assincronamente
  };

  // Carregar dados do dia
  const fetchTodayData = useCallback(async () => {
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

      // Buscar missão de hoje
      const { data: mission } = await supabase
        .from('missao_dia')
        .select('*')
        .eq('user_id', profileId)
        .eq('data', today)
        .maybeSingle();

      // Buscar pontuação de hoje
      const { data: points } = await supabase
        .from('pontuacao_diaria')
        .select('*')
        .eq('user_id', profileId)
        .eq('data', today)
        .maybeSingle();

      // Buscar histórico de missões (últimos 30 dias)
      const { data: missionHistoryData } = await supabase
        .from('missao_dia')
        .select('*')
        .eq('user_id', profileId)
        .gte('data', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('data', { ascending: false });

      // Buscar histórico de pontos (últimos 30 dias)
      const { data: pointsHistoryData } = await supabase
        .from('pontuacao_diaria')
        .select('*')
        .eq('user_id', profileId)
        .gte('data', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('data', { ascending: false });

      setTodayMission(mission as unknown as DailyMission | null);
      setTodayPoints(points as unknown as DailyPoints | null);
      setMissionHistory((missionHistoryData || []) as unknown as DailyMission[]);
      setPointsHistory((pointsHistoryData || []) as unknown as DailyPoints[]);

    } catch (error) {
      console.error('Erro ao carregar dados diários:', error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [user, getProfileId, today]);

  // Salvar missão do dia
  const saveTodayMission = useCallback(async (
    mission: Partial<DailyMission>
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
        .from('missao_dia')
        .upsert([{
          user_id: profileId,
          data: today,
          ...mission
        }]);

      if (error) throw error;

      await fetchTodayData();
      toast.success('Missão atualizada com sucesso!');
      
      return { success: true, message: 'Missão salva com sucesso' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar missão';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [user, getProfileId, today, fetchTodayData]);

  // Atualizar conclusão de tarefa
  const updateTaskCompletion = useCallback(async (
    taskId: string,
    completed: boolean
  ): Promise<ApiResponse> => {
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    try {
      const profileId = await getProfileId();
      if (!profileId) {
        throw new Error('Profile não encontrado');
      }

      // Mapear taskId para campo da missão
      const fieldMap: Record<string, string> = {
        'liquido_manha': 'liquido_ao_acordar',
        'conexao_interna': 'pratica_conexao',
        'atividade_fisica': 'atividade_fisica',
        'agua_litros': 'agua_litros',
        'gratidao': 'gratidao'
      };

      const field = fieldMap[taskId];
      if (!field) {
        throw new Error('Tarefa não reconhecida');
      }

      const updateData = {
        [field]: completed ? 'sim' : null
      };

      const { error } = await supabase
        .from('missao_dia')
        .upsert([{
          user_id: profileId,
          data: today,
          ...updateData
        }]);

      if (error) throw error;

      await fetchTodayData();
      await calculateTodayPoints();
      
      toast.success(`Tarefa ${completed ? 'concluída' : 'desmarcada'}!`);
      
      return { success: true, message: 'Tarefa atualizada com sucesso' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar tarefa';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [user, getProfileId, today, fetchTodayData]);

  // Calcular pontos do dia
  const calculateTodayPoints = useCallback(async (): Promise<ApiResponse> => {
    if (!todayMission || !user) {
      return { success: false, error: 'Dados insuficientes para cálculo' };
    }

    try {
      const profileId = await getProfileId();
      if (!profileId) {
        throw new Error('Profile não encontrado');
      }

      // Calcular pontos para cada categoria
      const pontos = {
        liquido_manha: getPointsForTask('liquido_manha', todayMission.liquido_ao_acordar ? 'sim' : 'nao'),
        conexao_interna: getPointsForTask('conexao_interna', todayMission.pratica_conexao ? 'sim' : 'nao'),
        energia_acordar: getPointsForTask('energia_acordar', 'media'), // Default se não especificado
        sono: getPointsForTask('sono_horas', todayMission.sono_horas ? 'entre_7_8' : 'menos_6'),
        agua: getPointsForTask('agua_litros', todayMission.agua_litros ? 'entre_2_3' : 'menos_1'),
        atividade_fisica: getPointsForTask('atividade_fisica', todayMission.atividade_fisica ? 'sim' : 'nao'),
        estresse: getPointsForTask('estresse_nivel', 'medio'), // Default
        fome_emocional: getPointsForTask('fome_emocional', todayMission.fome_emocional ? 'sim' : 'nao'),
        gratidao: getPointsForTask('gratidao', todayMission.gratidao ? 'sim' : 'nao'),
        pequena_vitoria: getPointsForTask('pequena_vitoria', todayMission.pequena_vitoria ? 'sim' : 'nao'),
        intencao_amanha: getPointsForTask('intencao_amanha', todayMission.intencao_para_amanha ? 'sim' : 'nao'),
        avaliacao_dia: getPointsForTask('avaliacao_dia', todayMission.nota_dia || 5)
      };

      const totalPoints = Object.values(pontos).reduce((sum, points) => sum + points, 0);
      const category = getDayCategory(totalPoints);

      const { error } = await supabase
        .from('pontuacao_diaria')
        .upsert([{
          user_id: profileId,
          data: today,
          pontos_liquido_manha: pontos.liquido_manha,
          pontos_conexao_interna: pontos.conexao_interna,
          pontos_energia_acordar: pontos.energia_acordar,
          pontos_sono: pontos.sono,
          pontos_agua: pontos.agua,
          pontos_atividade_fisica: pontos.atividade_fisica,
          pontos_estresse: pontos.estresse,
          pontos_fome_emocional: pontos.fome_emocional,
          pontos_gratidao: pontos.gratidao,
          pontos_pequena_vitoria: pontos.pequena_vitoria,
          pontos_intencao_amanha: pontos.intencao_amanha,
          pontos_avaliacao_dia: pontos.avaliacao_dia,
          total_pontos_dia: totalPoints,
          categoria_dia: category
        }]);

      if (error) throw error;

      await fetchTodayData();
      
      return { success: true, message: `Pontos calculados: ${totalPoints}` };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao calcular pontos';
      return { success: false, error: errorMessage };
    }
  }, [todayMission, user, getProfileId, today, getPointsForTask, getDayCategory, fetchTodayData]);

  // Calcular streak atual
  const getCurrentStreak = useCallback(async (): Promise<number> => {
    if (!pointsHistory.length) return 0;

    let streak = 0;
    const sortedHistory = [...pointsHistory].sort((a, b) => 
      new Date(b.data).getTime() - new Date(a.data).getTime()
    );

    for (const dayPoints of sortedHistory) {
      if (dayPoints.categoria_dia === 'baixa') break;
      streak++;
    }

    return streak;
  }, [pointsHistory]);

  // Refresh data
  const refreshData = useCallback(async () => {
    await fetchTodayData();
  }, [fetchTodayData]);

  // Carregar dados na inicialização
  useEffect(() => {
    fetchTodayData();
  }, [fetchTodayData]);

  // Real-time updates
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('daily-system-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'missao_dia'
      }, () => {
        console.log('Missão atualizada, recarregando...');
        fetchTodayData();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'pontuacao_diaria'
      }, () => {
        console.log('Pontuação atualizada, recarregando...');
        fetchTodayData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchTodayData]);

  return {
    // Estado
    loading,
    error,
    
    // Dados
    todayMission,
    todayPoints,
    todayProgress,
    availableTasks,
    missionHistory,
    pointsHistory,
    
    // Ações
    saveTodayMission,
    updateTaskCompletion,
    calculateTodayPoints,
    
    // Utilitários
    getPointsForTask,
    getDayCategory,
    getCurrentStreak,
    refreshData
  };
}; 