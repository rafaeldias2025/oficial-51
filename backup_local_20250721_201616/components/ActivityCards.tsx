import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  BarChart3, 
  Trophy, 
  BookOpen, 
  Gamepad2, 
  Dumbbell,
  TrendingUp,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

interface ActivityCardsProps {
  userStats?: {
    goalsProgress: number;
    healthScore: number;
    rank: number;
    coursesInProgress: number;
    activeChallenges: number;
    workoutsToday: number;
  };
}

export const ActivityCards: React.FC<ActivityCardsProps> = ({ 
  userStats = {
    goalsProgress: 75,
    healthScore: 85,
    rank: 15,
    coursesInProgress: 2,
    activeChallenges: 3,
    workoutsToday: 1
  }
}) => {
  const navigate = useNavigate();

  const activities = [
    {
      id: 'goals',
      title: 'Minhas Metas',
      description: 'Progresso das metas diárias',
      icon: Target,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      progress: userStats.goalsProgress,
      value: `${userStats.goalsProgress}%`,
      action: () => navigate('/goals'),
      status: userStats.goalsProgress >= 80 ? 'success' : 'progress'
    },
    {
      id: 'health',
      title: 'Dashboard de Saúde',
      description: 'Métricas de saúde e bem-estar',
      icon: BarChart3,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      progress: userStats.healthScore,
      value: `${userStats.healthScore}%`,
      action: () => navigate('/health'),
      status: 'success'
    },
    {
      id: 'ranking',
      title: 'Ranking Pessoal',
      description: 'Sua posição na comunidade',
      icon: Trophy,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      progress: 100 - (userStats.rank / 100) * 100,
      value: `#${userStats.rank}`,
      action: () => navigate('/ranking'),
      status: 'info'
    },
    {
      id: 'courses',
      title: 'Cursos em Andamento',
      description: 'Continue sua jornada de aprendizado',
      icon: BookOpen,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      progress: 60,
      value: `${userStats.coursesInProgress} cursos`,
      action: () => navigate('/courses'),
      status: 'progress'
    },
    {
      id: 'challenges',
      title: 'Desafios Ativos',
      description: 'Desafios e missões disponíveis',
      icon: Gamepad2,
      color: 'from-indigo-500 to-blue-500',
      bgColor: 'bg-indigo-50',
      progress: 40,
      value: `${userStats.activeChallenges} ativos`,
      action: () => navigate('/challenges'),
      status: 'progress'
    },
    {
      id: 'workouts',
      title: 'Treinos do Dia',
      description: 'Seus treinos programados',
      icon: Dumbbell,
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50',
      progress: userStats.workoutsToday > 0 ? 100 : 0,
      value: `${userStats.workoutsToday} treino(s)`,
      action: () => navigate('/workouts'),
      status: userStats.workoutsToday > 0 ? 'success' : 'pending'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'pending':
        return <Star className="w-4 h-4 text-yellow-500" />;
      default:
        return <TrendingUp className="w-4 h-4 text-primary" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'progress':
        return 'text-blue-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-primary';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card 
            className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-white to-gray-50/50"
            onClick={activity.action}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${activity.color}`}>
                  <activity.icon className="w-6 h-6 text-white" />
                </div>
                {getStatusIcon(activity.status)}
              </div>
              <CardTitle className="text-lg font-semibold text-foreground">
                {activity.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {activity.description}
              </p>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-2xl font-bold ${getStatusColor(activity.status)}`}>
                    {activity.value}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {activity.progress}%
                  </Badge>
                </div>
                
                <Progress 
                  value={activity.progress} 
                  className="h-2"
                />
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                >
                  Ver Detalhes
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}; 