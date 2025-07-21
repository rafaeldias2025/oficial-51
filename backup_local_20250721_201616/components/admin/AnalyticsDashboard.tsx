import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Play, Clock, Eye, Star, Target, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalWatchTime: number;
  averageSessionTime: number;
  completionRate: number;
  revenue: number;
  growthRate: number;
  topCourses: CourseStats[];
  topModules: ModuleStats[];
  topLessons: LessonStats[];
}

interface CourseStats {
  id: string;
  title: string;
  views: number;
  watchTime: number;
  completionRate: number;
  revenue: number;
}

interface ModuleStats {
  id: string;
  title: string;
  courseTitle: string;
  views: number;
  watchTime: number;
  completionRate: number;
}

interface LessonStats {
  id: string;
  title: string;
  moduleTitle: string;
  views: number;
  watchTime: number;
  averageWatchPercentage: number;
  dropOffRate: number;
}

export const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalUsers: 15420,
    activeUsers: 3240,
    totalWatchTime: 456780, // em minutos
    averageSessionTime: 28,
    completionRate: 67,
    revenue: 45600,
    growthRate: 23,
    topCourses: [
      {
        id: '1',
        title: '7 CHAVES',
        views: 1250,
        watchTime: 45600,
        completionRate: 78,
        revenue: 12500
      },
      {
        id: '2',
        title: '12 CHÁS',
        views: 890,
        watchTime: 32400,
        completionRate: 65,
        revenue: 8900
      },
      {
        id: '3',
        title: 'PÍLULAS DO BEM',
        views: 450,
        watchTime: 15600,
        completionRate: 45,
        revenue: 4500
      }
    ],
    topModules: [
      {
        id: '1',
        title: 'Fundamentos',
        courseTitle: '7 CHAVES',
        views: 890,
        watchTime: 23400,
        completionRate: 82
      },
      {
        id: '2',
        title: 'Nutrição Básica',
        courseTitle: '12 CHÁS',
        views: 650,
        watchTime: 18900,
        completionRate: 71
      },
      {
        id: '3',
        title: 'Introdução',
        courseTitle: 'PÍLULAS DO BEM',
        views: 320,
        watchTime: 8900,
        completionRate: 58
      }
    ],
    topLessons: [
      {
        id: '1',
        title: 'Aula 1 - Respiração e Ansiedade',
        moduleTitle: 'Fundamentos',
        views: 450,
        watchTime: 15600,
        averageWatchPercentage: 85,
        dropOffRate: 12
      },
      {
        id: '2',
        title: 'Aula 2 - Técnicas de Relaxamento',
        moduleTitle: 'Fundamentos',
        views: 380,
        watchTime: 13400,
        averageWatchPercentage: 78,
        dropOffRate: 18
      },
      {
        id: '3',
        title: 'Aula 1 - Introdução aos Chás',
        moduleTitle: 'Nutrição Básica',
        views: 290,
        watchTime: 9800,
        averageWatchPercentage: 72,
        dropOffRate: 25
      }
    ]
  });

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getGrowthColor = (rate: number) => {
    if (rate > 0) return 'text-green-600';
    if (rate < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Analytics</h1>
          <p className="text-gray-600">Métricas e insights da plataforma</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={(value: '7d' | '30d' | '90d') => setTimeRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalUsers.toLocaleString()}</div>
            <p className={`text-xs ${getGrowthColor(analyticsData.growthRate)}`}>
              +{analyticsData.growthRate}% em relação ao período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((analyticsData.activeUsers / analyticsData.totalUsers) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Total Assistido</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(analyticsData.totalWatchTime)}</div>
            <p className="text-xs text-muted-foreground">
              Média de {analyticsData.averageSessionTime} min por sessão
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.completionRate}%</div>
            <Progress value={analyticsData.completionRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Receita */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Receita</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">
            {formatCurrency(analyticsData.revenue)}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Receita total do período selecionado
          </p>
        </CardContent>
      </Card>

      {/* Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Cursos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Top Cursos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topCourses.map((course, index) => (
                <div key={course.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <div>
                      <p className="font-medium text-sm">{course.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {course.views.toLocaleString()} visualizações
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{course.completionRate}%</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(course.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Módulos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Play className="h-5 w-5" />
              <span>Top Módulos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topModules.map((module, index) => (
                <div key={module.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <div>
                      <p className="font-medium text-sm">{module.title}</p>
                      <p className="text-xs text-muted-foreground">{module.courseTitle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{module.completionRate}%</p>
                    <p className="text-xs text-muted-foreground">
                      {formatTime(module.watchTime)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Aulas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5" />
              <span>Top Aulas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topLessons.map((lesson, index) => (
                <div key={lesson.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <div>
                      <p className="font-medium text-sm">{lesson.title}</p>
                      <p className="text-xs text-muted-foreground">{lesson.moduleTitle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{lesson.averageWatchPercentage}%</p>
                    <p className="text-xs text-muted-foreground">
                      {lesson.views.toLocaleString()} views
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos (Placeholder) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Progresso ao Longo do Tempo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <p className="text-gray-500">Gráfico de linha - Visualizações ao longo do tempo</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Engajamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <p className="text-gray-500">Gráfico de pizza - Distribuição por curso</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 