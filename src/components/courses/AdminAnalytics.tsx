import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Heart, 
  Star,
  Eye,
  Award,
  Clock,
  DollarSign
} from 'lucide-react';
import { usePremiumCourses } from '@/hooks/usePremiumCourses';
import { Analytics } from '@/types/premium';
import { useAuth } from '@/hooks/useAuth';

interface AdminAnalyticsProps {
  courseId: string;
}

export const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({ courseId }) => {
  const { user } = useAuth();
  const { getAnalytics } = usePremiumCourses();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data para demonstração
  const mockData = {
    totalEnrollments: 1250,
    activeStudents: 892,
    completionRate: 68,
    averageTimeToComplete: '14 dias',
    revenue: 15780.50,
    weeklyEngagement: [85, 92, 78, 95, 88, 90, 94],
    commentsByDay: [12, 8, 15, 22, 18, 25, 19],
    favoritesByDay: [5, 8, 12, 15, 10, 18, 14],
    ratingsByDay: [3, 5, 8, 12, 7, 10, 9],
    topPerformingModules: [
      { name: 'Introdução', completionRate: 95, avgRating: 4.8 },
      { name: 'Fundamentos', completionRate: 88, avgRating: 4.6 },
      { name: 'Prática', completionRate: 72, avgRating: 4.4 },
      { name: 'Avançado', completionRate: 45, avgRating: 4.2 },
    ]
  };

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await getAnalytics(courseId);
        setAnalytics(data);
      } catch (error) {
        console.error('Erro ao carregar analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [courseId, getAnalytics]);

  if (loading) {
    return (
      <div className="grid gap-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="h-32 bg-muted" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cartões de Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inscrições</p>
                <p className="text-2xl font-bold">{mockData.totalEnrollments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa de Conclusão</p>
                <p className="text-2xl font-bold">{mockData.completionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avaliação Média</p>
                <p className="text-2xl font-bold">{analytics?.average_rating?.toFixed(1) || '4.6'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Receita</p>
                <p className="text-2xl font-bold">R$ {mockData.revenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="engagement">Engajamento</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Métricas Gerais</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total de Visualizações</span>
                    <Badge variant="secondary">{analytics?.total_views || 3420}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Estudantes Ativos</span>
                    <Badge variant="secondary">{mockData.activeStudents}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Conclusões</span>
                    <Badge variant="secondary">{analytics?.total_completions || 850}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Tempo Médio de Conclusão</span>
                    <Badge variant="outline">{mockData.averageTimeToComplete}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Performance dos Módulos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockData.topPerformingModules.map((module, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{module.name}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {module.completionRate}%
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            ⭐ {module.avgRating}
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${module.completionRate}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Engajamento Semanal</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-7 gap-2">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
                    <div key={day} className="text-center">
                      <div className="text-xs text-muted-foreground mb-2">{day}</div>
                      <div className="relative h-20 bg-muted rounded">
                        <div 
                          className="absolute bottom-0 w-full bg-primary rounded transition-all"
                          style={{ height: `${mockData.weeklyEngagement[index]}%` }}
                        />
                        <div className="absolute inset-0 flex items-end justify-center pb-1">
                          <span className="text-xs font-medium text-white">
                            {mockData.weeklyEngagement[index]}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Engajamento médio: {(mockData.weeklyEngagement.reduce((a, b) => a + b, 0) / 7).toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>Comentários</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{analytics?.total_comments || 127}</div>
                  <p className="text-sm text-muted-foreground">Total de comentários</p>
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      {mockData.commentsByDay.map((count, index) => (
                        <div 
                          key={index}
                          className="w-2 bg-blue-500 rounded"
                          style={{ height: `${count * 2}px` }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">7 dias</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5" />
                  <span>Favoritos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{analytics?.total_favorites || 89}</div>
                  <p className="text-sm text-muted-foreground">Total de favoritos</p>
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      {mockData.favoritesByDay.map((count, index) => (
                        <div 
                          key={index}
                          className="w-2 bg-red-500 rounded"
                          style={{ height: `${count * 3}px` }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">7 dias</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5" />
                  <span>Avaliações</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{analytics?.average_rating?.toFixed(1) || '4.6'}</div>
                  <p className="text-sm text-muted-foreground">Média de avaliações</p>
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      {mockData.ratingsByDay.map((count, index) => (
                        <div 
                          key={index}
                          className="w-2 bg-yellow-500 rounded"
                          style={{ height: `${count * 4}px` }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">7 dias</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Score de Engajamento</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">
                    {analytics?.engagement_score?.toFixed(1) || '8.7'}
                  </div>
                  <p className="text-sm text-muted-foreground">Score geral (0-10)</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">85%</div>
                    <div className="text-sm text-green-600">Retenção</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">92%</div>
                    <div className="text-sm text-blue-600">Satisfação</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">78%</div>
                    <div className="text-sm text-purple-600">Participação</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 