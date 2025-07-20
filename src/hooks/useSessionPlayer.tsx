import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  CoachingSession,
  ToolQuestion,
  SessionResponse,
  SessionResults,
  UseSessionPlayerReturn
} from '@/types/session-system';

export const useSessionPlayer = (sessionId: string): UseSessionPlayerReturn => {
  const [currentQuestion, setCurrentQuestion] = useState<ToolQuestion | null>(null);
  const [progress, setProgress] = useState(0);
  const [responses, setResponses] = useState<SessionResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<ToolQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Carregar perguntas da sessão
  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Primeiro, obter a sessão e a ferramenta
      const { data: sessionData, error: sessionError } = await supabase
        .from('coaching_sessions')
        .select(`
          *,
          coaching_tools (
            id,
            name,
            description,
            category
          )
        `)
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;

      // Depois, carregar as perguntas da ferramenta
      const { data: questionsData, error: questionsError } = await supabase
        .from('tool_questions')
        .select('*')
        .eq('tool_id', sessionData.tool_id)
        .order('question_order');

      if (questionsError) throw questionsError;

      setQuestions(questionsData || []);
      
      // Carregar respostas existentes
      const { data: responsesData, error: responsesError } = await supabase
        .from('session_responses')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at');

      if (responsesError) throw responsesError;

      setResponses(responsesData || []);
      
      // Calcular progresso
      const progressPercent = questionsData ? (responsesData?.length || 0) / questionsData.length * 100 : 0;
      setProgress(progressPercent);
      
      // Definir pergunta atual
      if (questionsData && questionsData.length > 0) {
        const nextQuestionIndex = responsesData?.length || 0;
        if (nextQuestionIndex < questionsData.length) {
          setCurrentQuestion(questionsData[nextQuestionIndex]);
          setCurrentQuestionIndex(nextQuestionIndex);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar perguntas');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  // Submeter resposta
  const submitResponse = useCallback(async (response: SessionResponse) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('session_responses')
        .insert({
          session_id: parseInt(sessionId),
          question_id: response.questionId,
          response_value: response.responseValue,
          response_text: response.responseText,
          category: response.category,
          timestamp: new Date().toISOString()
        });

      if (error) throw error;

      // Adicionar à lista local
      setResponses(prev => [...prev, response]);

      // Atualizar progresso
      const newProgress = ((responses.length + 1) / questions.length) * 100;
      setProgress(newProgress);

      // Ir para próxima pergunta
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < questions.length) {
        setCurrentQuestion(questions[nextIndex]);
        setCurrentQuestionIndex(nextIndex);
      } else {
        // Sessão completa
        setCurrentQuestion(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar resposta');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [sessionId, responses.length, questions.length, currentQuestionIndex, questions]);

  // Salvar progresso
  const saveProgress = useCallback(async () => {
    try {
      // Atualizar status da sessão
      const { error } = await supabase
        .from('coaching_sessions')
        .update({
          status: 'in_progress',
          started_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar progresso');
      throw err;
    }
  }, [sessionId]);

  // Completar sessão
  const completeSession = useCallback(async (): Promise<SessionResults> => {
    setLoading(true);
    setError(null);

    try {
      // Calcular resultados
      const results = calculateResults(responses, questions);
      
      // Salvar resultados
      const { data, error } = await supabase
        .from('session_results')
        .insert({
          session_id: parseInt(sessionId),
          overall_score: results.overallScore,
          category_scores: results.categoryScores,
          insights: results.insights,
          recommendations: results.recommendations,
          radar_data: results.radarData,
          bar_chart_data: results.barChartData,
          gauge_value: results.gaugeValue
        })
        .select()
        .single();

      if (error) throw error;

      // Atualizar status da sessão
      await supabase
        .from('coaching_sessions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao completar sessão');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [sessionId, responses, questions]);

  // Calcular resultados
  const calculateResults = (responses: SessionResponse[], questions: ToolQuestion[]) => {
    // Agrupar respostas por categoria
    const categoryResponses = responses.reduce((acc, response) => {
      if (!acc[response.category]) {
        acc[response.category] = [];
      }
      acc[response.category].push(response);
      return acc;
    }, {} as Record<string, SessionResponse[]>);

    // Calcular pontuações por categoria
    const categoryScores = Object.entries(categoryResponses).map(([category, categoryResponses]) => {
      const totalScore = categoryResponses.reduce((sum, response) => {
        const value = typeof response.responseValue === 'number' ? response.responseValue : 0;
        return sum + value;
      }, 0);
      
      const averageScore = categoryResponses.length > 0 ? totalScore / categoryResponses.length : 0;
      
      return {
        category,
        score: totalScore,
        totalQuestions: categoryResponses.length,
        averageScore,
        color: getCategoryColor(category)
      };
    });

    // Calcular pontuação geral
    const overallScore = categoryScores.length > 0 
      ? categoryScores.reduce((sum, cat) => sum + cat.averageScore, 0) / categoryScores.length
      : 0;

    // Gerar insights
    const insights = generateInsights(categoryScores, responses);

    // Gerar recomendações
    const recommendations = generateRecommendations(categoryScores, insights);

    // Dados para gráficos
    const radarData = categoryScores.map(cat => ({
      category: cat.category,
      value: cat.averageScore,
      color: cat.color
    }));

    const barChartData = categoryScores.map(cat => ({
      category: cat.category,
      value: cat.score,
      color: cat.color,
      percentage: (cat.averageScore / 10) * 100 // Assumindo escala 0-10
    }));

    return {
      id: '',
      sessionId,
      overallScore,
      categoryScores,
      insights,
      recommendations,
      radarData,
      barChartData,
      gaugeValue: overallScore,
      createdAt: new Date()
    };
  };

  // Gerar insights
  const generateInsights = (categoryScores: any[], responses: SessionResponse[]) => {
    const insights = [];
    
    // Encontrar categoria mais forte
    const strongestCategory = categoryScores.reduce((max, cat) => 
      cat.averageScore > max.averageScore ? cat : max
    );
    
    if (strongestCategory) {
      insights.push({
        id: '1',
        type: 'strength',
        title: `${strongestCategory.category} - Ponto Forte`,
        description: `Você demonstrou excelente desenvolvimento na área de ${strongestCategory.category}.`,
        category: strongestCategory.category,
        impact: 'high',
        actionable: true
      });
    }

    // Encontrar categoria mais fraca
    const weakestCategory = categoryScores.reduce((min, cat) => 
      cat.averageScore < min.averageScore ? cat : min
    );
    
    if (weakestCategory) {
      insights.push({
        id: '2',
        type: 'weakness',
        title: `${weakestCategory.category} - Área de Melhoria`,
        description: `Esta área pode ser desenvolvida para alcançar seu potencial máximo.`,
        category: weakestCategory.category,
        impact: 'medium',
        actionable: true
      });
    }

    return insights;
  };

  // Gerar recomendações
  const generateRecommendations = (categoryScores: any[], insights: any[]) => {
    const recommendations = [];
    
    categoryScores.forEach(cat => {
      if (cat.averageScore < 7) {
        recommendations.push(`Foque no desenvolvimento da área de ${cat.category} através de práticas diárias.`);
      }
    });

    if (recommendations.length === 0) {
      recommendations.push('Continue mantendo o excelente trabalho em todas as áreas!');
    }

    return recommendations;
  };

  // Obter cor da categoria
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'mental': return '#3B82F6';
      case 'emocional': return '#10B981';
      case 'relacionamentos': return '#8B5CF6';
      case 'objetivos': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  // Carregar perguntas na inicialização
  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  return {
    currentQuestion,
    progress,
    responses,
    loading,
    error,
    submitResponse,
    saveProgress,
    completeSession
  };
}; 