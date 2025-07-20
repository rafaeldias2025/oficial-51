import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  SessionFeedback,
  SessionAnalysis,
  ResponseData,
  CategoryScore,
  FeedbackInsight,
  FeedbackRecommendation,
  TrendData,
  InsightType,
  TrendDirection,
  PriorityLevel,
  ImpactLevel
} from '@/types/feedback';

export const useSessionFeedback = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Analisar respostas e gerar feedback
  const analyzeResponses = useCallback((responses: ResponseData[]): SessionAnalysis => {
    if (!responses.length) {
      return {
        overallScore: 0,
        categoryScores: [],
        strengths: [],
        weaknesses: [],
        recommendations: [],
        trends: [],
        insights: []
      };
    }

    // Calcular pontuação geral
    const totalScore = responses.reduce((sum, response) => sum + response.responseValue, 0);
    const overallScore = totalScore / responses.length;

    // Agrupar por categoria
    const categoryGroups = responses.reduce((acc, response) => {
      if (!acc[response.category]) {
        acc[response.category] = [];
      }
      acc[response.category].push(response);
      return acc;
    }, {} as { [key: string]: ResponseData[] });

    // Calcular pontuações por categoria
    const categoryScores: CategoryScore[] = Object.entries(categoryGroups).map(([category, responses]) => {
      const totalScore = responses.reduce((sum, response) => sum + response.responseValue, 0);
      const averageScore = totalScore / responses.length;
      
      return {
        category,
        score: totalScore,
        totalQuestions: responses.length,
        averageScore
      };
    });

    // Identificar forças (pontuação >= 8)
    const strengths = responses
      .filter(response => response.responseValue >= 8)
      .map(response => response.questionText)
      .slice(0, 5); // Top 5 forças

    // Identificar fraquezas (pontuação <= 6)
    const weaknesses = responses
      .filter(response => response.responseValue <= 6)
      .map(response => response.questionText)
      .slice(0, 5); // Top 5 áreas de desenvolvimento

    // Gerar recomendações baseadas nas fraquezas
    const recommendations = generateRecommendations(responses, categoryScores);

    // Gerar insights
    const insights = generateInsights(responses, categoryScores, overallScore);

    return {
      overallScore,
      categoryScores,
      strengths,
      weaknesses,
      recommendations,
      trends: [], // Será preenchido quando houver dados históricos
      insights
    };
  }, []);

  // Gerar insights baseados nos dados
  const generateInsights = useCallback((
    responses: ResponseData[], 
    categoryScores: CategoryScore[], 
    overallScore: number
  ): FeedbackInsight[] => {
    const insights: FeedbackInsight[] = [];

    // Insight sobre pontuação geral
    if (overallScore >= 8) {
      insights.push({
        id: 'overall-excellent',
        type: 'strength',
        title: 'Excelente Desempenho Geral',
        description: `Sua pontuação média de ${overallScore.toFixed(1)}/10 demonstra um excelente equilíbrio em todas as áreas avaliadas.`,
        data: { overallScore },
        confidence: 0.9,
        actionable: false
      });
    } else if (overallScore <= 6) {
      insights.push({
        id: 'overall-needs-attention',
        type: 'weakness',
        title: 'Área de Desenvolvimento Identificada',
        description: `Sua pontuação média de ${overallScore.toFixed(1)}/10 indica oportunidades de melhoria em algumas áreas.`,
        data: { overallScore },
        confidence: 0.8,
        actionable: true
      });
    }

    // Insight sobre categoria com melhor desempenho
    const bestCategory = categoryScores.reduce((best, current) => 
      current.averageScore > best.averageScore ? current : best
    );
    
    if (bestCategory.averageScore >= 8) {
      insights.push({
        id: 'best-category-strength',
        type: 'strength',
        title: `Força em ${bestCategory.category}`,
        description: `Você se destaca na categoria ${bestCategory.category} com uma pontuação de ${bestCategory.averageScore.toFixed(1)}/10.`,
        data: { category: bestCategory.category, score: bestCategory.averageScore },
        confidence: 0.85,
        actionable: false
      });
    }

    // Insight sobre categoria que precisa de atenção
    const worstCategory = categoryScores.reduce((worst, current) => 
      current.averageScore < worst.averageScore ? current : worst
    );
    
    if (worstCategory.averageScore <= 6) {
      insights.push({
        id: 'worst-category-weakness',
        type: 'weakness',
        title: `Oportunidade em ${worstCategory.category}`,
        description: `A categoria ${worstCategory.category} apresenta pontuação de ${worstCategory.averageScore.toFixed(1)}/10, indicando área de desenvolvimento.`,
        data: { category: worstCategory.category, score: worstCategory.averageScore },
        confidence: 0.8,
        actionable: true
      });
    }

    // Insight sobre consistência
    const scoreVariance = Math.sqrt(
      responses.reduce((sum, response) => sum + Math.pow(response.responseValue - overallScore, 2), 0) / responses.length
    );
    
    if (scoreVariance < 1.5) {
      insights.push({
        id: 'consistent-performance',
        type: 'pattern',
        title: 'Desempenho Consistente',
        description: 'Suas respostas demonstram consistência entre as diferentes áreas avaliadas.',
        data: { variance: scoreVariance },
        confidence: 0.75,
        actionable: false
      });
    } else {
      insights.push({
        id: 'variable-performance',
        type: 'pattern',
        title: 'Desempenho Variável',
        description: 'Suas respostas mostram variação significativa entre as áreas, indicando forças específicas e oportunidades de desenvolvimento.',
        data: { variance: scoreVariance },
        confidence: 0.7,
        actionable: true
      });
    }

    return insights;
  }, []);

  // Gerar recomendações personalizadas
  const generateRecommendations = useCallback((
    responses: ResponseData[], 
    categoryScores: CategoryScore[]
  ): string[] => {
    const recommendations: string[] = [];

    // Recomendações baseadas em pontuações baixas
    const lowScores = responses.filter(r => r.responseValue <= 6);
    if (lowScores.length > 0) {
      const categories = [...new Set(lowScores.map(r => r.category))];
      recommendations.push(`Focar no desenvolvimento das habilidades em ${categories.join(', ')}`);
    }

    // Recomendações baseadas em pontuações altas
    const highScores = responses.filter(r => r.responseValue >= 8);
    if (highScores.length > 0) {
      const categories = [...new Set(highScores.map(r => r.category))];
      recommendations.push(`Aproveitar e aplicar suas forças em ${categories.join(', ')}`);
    }

    // Recomendações gerais
    recommendations.push('Manter práticas de autocuidado e bem-estar');
    recommendations.push('Continuar o desenvolvimento pessoal através de novas experiências');
    recommendations.push('Refletir regularmente sobre seus progressos e conquistas');

    return recommendations.slice(0, 5); // Máximo 5 recomendações
  }, []);

  // Salvar feedback no banco de dados
  const saveFeedback = useCallback(async (feedback: SessionFeedback): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('session_feedback')
        .insert({
          session_id: feedback.sessionId,
          user_id: feedback.userId,
          feedback_data: feedback,
          analysis_summary: JSON.stringify(feedback.analysis)
        });

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar feedback');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar feedback do banco de dados
  const loadFeedback = useCallback(async (sessionId: string): Promise<SessionFeedback | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('session_feedback')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      if (error) throw error;
      
      return data ? data.feedback_data : null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar feedback');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Gerar feedback completo
  const generateFeedback = useCallback(async (responses: ResponseData[]): Promise<SessionFeedback> => {
    const analysis = analyzeResponses(responses);
    
    const feedback: SessionFeedback = {
      id: crypto.randomUUID(),
      sessionId: '', // Será definido pelo componente
      userId: '', // Será definido pelo componente
      responses,
      analysis,
      metadata: {
        sessionType: 'Avaliação',
        duration: '45 minutos',
        completionRate: 100,
        totalQuestions: responses.length,
        completedQuestions: responses.length
      },
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return feedback;
  }, [analyzeResponses]);

  return {
    loading,
    error,
    analyzeResponses,
    generateFeedback,
    saveFeedback,
    loadFeedback,
    generateInsights,
    generateRecommendations
  };
}; 