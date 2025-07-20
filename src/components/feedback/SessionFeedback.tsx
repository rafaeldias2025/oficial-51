import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Lightbulb,
  Star,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  Brain,
  Heart,
  Zap
} from 'lucide-react';
import { useSessionFeedback } from '@/hooks/useSessionFeedback';
import { 
  SessionFeedback as SessionFeedbackType,
  ResponseData,
  FeedbackChartData,
  FeedbackInsight
} from '@/types/feedback';

interface SessionFeedbackProps {
  sessionId: string;
  userId: string;
  responses: ResponseData[];
  onComplete?: (feedback: SessionFeedbackType) => void;
  onClose?: () => void;
}

export const SessionFeedback: React.FC<SessionFeedbackProps> = ({
  sessionId,
  userId,
  responses,
  onComplete,
  onClose
}) => {
  const [feedback, setFeedback] = useState<SessionFeedbackType | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    loading,
    error,
    generateFeedback,
    saveFeedback
  } = useSessionFeedback();

  useEffect(() => {
    if (responses.length > 0 && !feedback) {
      generateFeedbackData();
    }
  }, [responses, feedback]);

  const generateFeedbackData = async () => {
    setIsGenerating(true);
    try {
      const generatedFeedback = await generateFeedback(responses);
      generatedFeedback.sessionId = sessionId;
      generatedFeedback.userId = userId;
      setFeedback(generatedFeedback);
    } catch (err) {
      console.error('Erro ao gerar feedback:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveFeedback = async () => {
    if (!feedback) return;
    
    try {
      await saveFeedback(feedback);
      onComplete?.(feedback);
    } catch (err) {
      console.error('Erro ao salvar feedback:', err);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 8) return 'bg-green-100 text-green-800';
    if (score >= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'relacionamentos':
        return <Users className="w-4 h-4" />;
      case 'emocional':
        return <Heart className="w-4 h-4" />;
      case 'mental':
        return <Brain className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  if (isGenerating) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Gerando análise de feedback...</p>
        </div>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">Nenhum feedback disponível</p>
      </div>
    );
  }

  const chartData: FeedbackChartData[] = feedback.analysis.categoryScores.map(score => ({
    category: score.category,
    score: score.averageScore,
    color: score.averageScore >= 8 ? '#10b981' : score.averageScore >= 6 ? '#f59e0b' : '#ef4444',
    percentage: (score.averageScore / 10) * 100
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">📊 Feedback da Sessão</h2>
          <p className="text-gray-600">Análise completa dos seus resultados</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">
            {feedback.responses.length} respostas
          </Badge>
          <Badge className={getScoreBadge(feedback.analysis.overallScore)}>
            {feedback.analysis.overallScore.toFixed(1)}/10
          </Badge>
        </div>
      </div>

      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Resumo da Sessão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {feedback.analysis.overallScore.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Pontuação Geral</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {feedback.analysis.strengths.length}
              </div>
              <div className="text-sm text-gray-600">Forças Identificadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {feedback.analysis.weaknesses.length}
              </div>
              <div className="text-sm text-gray-600">Áreas de Desenvolvimento</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {feedback.analysis.categoryScores.length}
              </div>
              <div className="text-sm text-gray-600">Categorias Avaliadas</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="detailed">Análise Detalhada</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Scores */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Pontuações por Categoria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {feedback.analysis.categoryScores.map((score) => (
                    <div key={score.category}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(score.category)}
                          <span className="capitalize">{score.category}</span>
                        </div>
                        <span className={getScoreColor(score.averageScore)}>
                          {score.averageScore.toFixed(1)}/10
                        </span>
                      </div>
                      <Progress value={score.averageScore * 10} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Strengths & Weaknesses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Forças e Desenvolvimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      💪 Forças
                    </h4>
                    <div className="space-y-1">
                      {feedback.analysis.strengths.map((strength, index) => (
                        <div key={index} className="text-sm text-green-600">
                          • {strength}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-700 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      🎯 Desenvolvimento
                    </h4>
                    <div className="space-y-1">
                      {feedback.analysis.weaknesses.map((weakness, index) => (
                        <div key={index} className="text-sm text-orange-600">
                          • {weakness}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Respostas Detalhadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedback.responses.map((response, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{response.questionText}</h4>
                      <Badge className={getScoreBadge(response.responseValue)}>
                        {response.responseValue}/10
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {response.responseText}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {response.category}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Questão #{response.questionNumber}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Insights Inteligentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedback.analysis.insights.map((insight, index) => (
                  <div key={index} className={`p-4 rounded-lg border-l-4 ${
                    insight.type === 'strength' ? 'bg-green-50 border-green-500' :
                    insight.type === 'weakness' ? 'bg-orange-50 border-orange-500' :
                    'bg-blue-50 border-blue-500'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        insight.type === 'strength' ? 'bg-green-500' :
                        insight.type === 'weakness' ? 'bg-orange-500' :
                        'bg-blue-500'
                      }`}></div>
                      <div>
                        <h4 className="font-semibold mb-1">{insight.title}</h4>
                        <p className="text-sm text-gray-600">{insight.description}</p>
                        {insight.actionable && (
                          <Badge variant="outline" className="mt-2 text-xs">
                            Ação Recomendada
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Recomendações Personalizadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedback.analysis.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        )}
        <Button onClick={handleSaveFeedback} disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Feedback'}
        </Button>
      </div>
    </div>
  );
}; 