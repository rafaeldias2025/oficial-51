import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Users, 
  Brain, 
  Heart, 
  TrendingUp, 
  Target,
  Lightbulb,
  Star
} from 'lucide-react';

interface ResponseData {
  id: string;
  userId: string;
  userName: string;
  questionText: string;
  responseValue: number;
  responseText: string;
  category: string;
  questionNumber: number;
}

interface UserProfile {
  name: string;
  email: string;
  averageScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  categoryScores: {
    [key: string]: number;
  };
}

interface ResponseAnalyzerProps {
  responses?: ResponseData[];
}

export const ResponseAnalyzer: React.FC<ResponseAnalyzerProps> = ({ responses = [] }) => {
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [analysisView, setAnalysisView] = useState<'overview' | 'detailed' | 'recommendations'>('overview');

  useEffect(() => {
    if (responses.length > 0) {
      analyzeResponses();
    }
  }, [responses]);

  const analyzeResponses = () => {
    const userGroups = responses.reduce((acc, response) => {
      if (!acc[response.userId]) {
        acc[response.userId] = [];
      }
      acc[response.userId].push(response);
      return acc;
    }, {} as { [key: string]: ResponseData[] });

    const profiles: UserProfile[] = Object.entries(userGroups).map(([userId, userResponses]) => {
      const scores = userResponses.map(r => r.responseValue);
      const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      
      const categoryScores = userResponses.reduce((acc, response) => {
        if (!acc[response.category]) {
          acc[response.category] = [];
        }
        acc[response.category].push(response.responseValue);
        return acc;
      }, {} as { [key: string]: number[] });

      const finalCategoryScores = Object.entries(categoryScores).reduce((acc, [category, scores]) => {
        acc[category] = scores.reduce((a, b) => a + b, 0) / scores.length;
        return acc;
      }, {} as { [key: string]: number });

      const strengths = userResponses
        .filter(r => r.responseValue >= 8)
        .map(r => r.questionText)
        .slice(0, 3);

      const weaknesses = userResponses
        .filter(r => r.responseValue <= 6)
        .map(r => r.questionText)
        .slice(0, 3);

      const recommendations = generateRecommendations(userResponses, finalCategoryScores);

      return {
        name: userResponses[0].userName,
        email: '', // Would come from user data
        averageScore,
        strengths,
        weaknesses,
        recommendations,
        categoryScores: finalCategoryScores
      };
    });

    setUserProfiles(profiles);
    if (profiles.length > 0) {
      setSelectedUser(profiles[0].name);
    }
  };

  const generateRecommendations = (responses: ResponseData[], categoryScores: { [key: string]: number }) => {
    const recommendations: string[] = [];
    
    // Analyze low scores
    const lowScores = responses.filter(r => r.responseValue <= 6);
    if (lowScores.length > 0) {
      const lowestCategory = Object.entries(categoryScores)
        .sort(([,a], [,b]) => a - b)[0];
      recommendations.push(`Desenvolver habilidades em ${lowestCategory[0]}`);
    }

    // Analyze high scores
    const highScores = responses.filter(r => r.responseValue >= 8);
    if (highScores.length > 0) {
      const highestCategory = Object.entries(categoryScores)
        .sort(([,a], [,b]) => b - a)[0];
      recommendations.push(`Aproveitar forças em ${highestCategory[0]}`);
    }

    // General recommendations
    if (responses.length > 0) {
      recommendations.push('Manter práticas de autocuidado');
      recommendations.push('Continuar desenvolvimento pessoal');
    }

    return recommendations;
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

  const selectedProfile = userProfiles.find(p => p.name === selectedUser);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">📊 Análise de Respostas</h2>
        <Badge variant="secondary">
          {responses.length} respostas analisadas
        </Badge>
      </div>

      {userProfiles.length > 0 && (
        <>
          {/* User Selection */}
          <div className="flex gap-2">
            {userProfiles.map((profile) => (
              <button
                key={profile.name}
                onClick={() => setSelectedUser(profile.name)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  selectedUser === profile.name
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {profile.name}
                </div>
              </button>
            ))}
          </div>

          {selectedProfile && (
            <div className="space-y-6">
              {/* Overview Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Perfil: {selectedProfile.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedProfile.averageScore.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600">Pontuação Média</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedProfile.strengths.length}
                      </div>
                      <div className="text-sm text-gray-600">Forças Identificadas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {selectedProfile.weaknesses.length}
                      </div>
                      <div className="text-sm text-gray-600">Áreas de Desenvolvimento</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Analysis Tabs */}
              <Tabs value={analysisView} onValueChange={(value) => setAnalysisView(value as any)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                  <TabsTrigger value="detailed">Análise Detalhada</TabsTrigger>
                  <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Category Scores */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart className="w-5 h-5" />
                          Pontuações por Categoria
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {Object.entries(selectedProfile.categoryScores).map(([category, score]) => (
                            <div key={category}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="capitalize">{category}</span>
                                <span className={getScoreColor(score)}>{score.toFixed(1)}/10</span>
                              </div>
                              <Progress value={score * 10} className="h-2" />
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
                            <h4 className="font-semibold text-green-700 mb-2">💪 Forças</h4>
                            <div className="space-y-1">
                              {selectedProfile.strengths.map((strength, index) => (
                                <div key={index} className="text-sm text-green-600">
                                  • {strength}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-orange-700 mb-2">🎯 Desenvolvimento</h4>
                            <div className="space-y-1">
                              {selectedProfile.weaknesses.map((weakness, index) => (
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
                        {responses
                          .filter(r => r.userName === selectedProfile.name)
                          .map((response, index) => (
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

                <TabsContent value="recommendations" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5" />
                        Recomendações Personalizadas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedProfile.recommendations.map((recommendation, index) => (
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
            </div>
          )}
        </>
      )}

      {userProfiles.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-gray-500">
              Nenhuma resposta disponível para análise
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 