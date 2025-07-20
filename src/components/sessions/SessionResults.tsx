import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Trophy
} from 'lucide-react';
import type { SessionResult, CoachingSession } from '@/types/sessions';

interface SessionResultsProps {
  session: CoachingSession;
  result: SessionResult;
}

export const SessionResults: React.FC<SessionResultsProps> = ({ 
  session, 
  result 
}) => {
  // Função para obter cor baseada no score
  const getScoreColor = (score: number, maxScore: number = 10) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    if (percentage >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  // Função para obter ícone baseado no score
  const getScoreIcon = (score: number, maxScore: number = 10) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return <Trophy className="h-5 w-5 text-green-600" />;
    if (percentage >= 60) return <TrendingUp className="h-5 w-5 text-yellow-600" />;
    if (percentage >= 40) return <Target className="h-5 w-5 text-orange-600" />;
    return <AlertTriangle className="h-5 w-5 text-red-600" />;
  };

  // Calcular estatísticas gerais
  const totalAreas = Object.keys(result.category_scores).length;
  const excellentAreas = Object.values(result.category_scores).filter(score => score >= 8).length;
  const goodAreas = Object.values(result.category_scores).filter(score => score >= 6 && score < 8).length;
  const attentionAreas = Object.values(result.category_scores).filter(score => score >= 4 && score < 6).length;
  const criticalAreas = Object.values(result.category_scores).filter(score => score < 4).length;

  return (
    <div className="space-y-6">
      {/* Header do resultado */}
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getScoreIcon(result.total_score || 0)}
          </div>
          <CardTitle className="text-2xl">
            Resultado da Avaliação: {session.tool?.name}
          </CardTitle>
          <CardDescription>
            Concluída em {new Date(result.created_at).toLocaleDateString('pt-BR')}
          </CardDescription>
          <div className="mt-4">
            <div className={`text-4xl font-bold ${getScoreColor(result.total_score || 0)}`}>
              {result.total_score?.toFixed(1) || 0}/10
            </div>
            <p className="text-sm text-muted-foreground mt-1">Score Geral</p>
          </div>
        </CardHeader>
      </Card>

      {/* Resumo executivo */}
      {result.summary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Resumo Executivo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {result.summary}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Estatísticas por nível */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{excellentAreas}</div>
            <p className="text-xs text-muted-foreground">Excelentes</p>
            <p className="text-xs text-muted-foreground">(8-10)</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">{goodAreas}</div>
            <p className="text-xs text-muted-foreground">Boas</p>
            <p className="text-xs text-muted-foreground">(6-8)</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">{attentionAreas}</div>
            <p className="text-xs text-muted-foreground">Atenção</p>
            <p className="text-xs text-muted-foreground">(4-6)</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">{criticalAreas}</div>
            <p className="text-xs text-muted-foreground">Críticas</p>
            <p className="text-xs text-muted-foreground">(0-4)</p>
          </CardContent>
        </Card>
      </div>

      {/* Scores por categoria */}
      <Card>
        <CardHeader>
          <CardTitle>Avaliação por Categoria</CardTitle>
          <CardDescription>
            Detalhamento dos scores em cada área avaliada
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(result.category_scores).map(([category, score]) => {
            const percentage = (score / 10) * 100;
            return (
              <div key={category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {getScoreIcon(score)}
                    <span className="font-medium">{category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${getScoreColor(score)}`}>
                      {score.toFixed(1)}
                    </span>
                    <Badge 
                      variant={score >= 8 ? 'default' : score >= 6 ? 'secondary' : score >= 4 ? 'outline' : 'destructive'}
                      className="text-xs"
                    >
                      {score >= 8 ? 'Excelente' : score >= 6 ? 'Bom' : score >= 4 ? 'Atenção' : 'Crítico'}
                    </Badge>
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Insights */}
      {result.insights && result.insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Principais Insights
            </CardTitle>
            <CardDescription>
              Análises baseadas nas suas respostas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recomendações */}
      {result.recommendations && result.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Plano de Ação Recomendado
            </CardTitle>
            <CardDescription>
              Próximos passos para o seu desenvolvimento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-green-800">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informações da sessão */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Informações da Sessão</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ferramenta:</span>
            <span className="font-medium">{session.tool?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Categoria:</span>
            <Badge variant="outline">{session.tool?.category}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total de Perguntas:</span>
            <span className="font-medium">{session.tool?.total_questions}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Data de Conclusão:</span>
            <span className="font-medium">
              {new Date(result.created_at).toLocaleString('pt-BR')}
            </span>
          </div>
          {session.completed_at && session.started_at && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tempo Total:</span>
              <span className="font-medium">
                {Math.round((new Date(session.completed_at).getTime() - new Date(session.started_at).getTime()) / (1000 * 60))} minutos
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 