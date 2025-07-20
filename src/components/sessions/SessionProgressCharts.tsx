import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface SessionData {
  totalSessions: number;
  completedSessions: number;
  missedSessions: number;
  upcomingSessions: number;
  weeklyProgress: number;
  monthlyProgress: number;
  sessionTypes: {
    consultation: number;
    workout: number;
    nutrition: number;
    mindfulness: number;
  };
  weeklyData: {
    week: string;
    completed: number;
    total: number;
  }[];
}

interface SessionProgressChartsProps {
  sessionData?: SessionData;
}

export const SessionProgressCharts: React.FC<SessionProgressChartsProps> = ({ 
  sessionData = {
    totalSessions: 24,
    completedSessions: 18,
    missedSessions: 3,
    upcomingSessions: 3,
    weeklyProgress: 75,
    monthlyProgress: 80,
    sessionTypes: {
      consultation: 8,
      workout: 6,
      nutrition: 3,
      mindfulness: 1
    },
    weeklyData: [
      { week: 'Sem 1', completed: 5, total: 7 },
      { week: 'Sem 2', completed: 4, total: 7 },
      { week: 'Sem 3', completed: 6, total: 7 },
      { week: 'Sem 4', completed: 3, total: 3 }
    ]
  }
}) => {
  const completionRate = (sessionData.completedSessions / sessionData.totalSessions) * 100;
  const missedRate = (sessionData.missedSessions / sessionData.totalSessions) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Progresso das Sessões</h2>
          <p className="text-muted-foreground">Acompanhe sua participação nas sessões</p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Activity className="w-4 h-4 mr-2" />
          Taxa de Participação: {completionRate.toFixed(0)}%
        </Badge>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sessões Completadas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {sessionData.completedSessions}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Próximas Sessões</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {sessionData.upcomingSessions}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 bg-gradient-to-br from-red-50 to-red-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sessões Perdidas</p>
                  <p className="text-2xl font-bold text-red-600">
                    {sessionData.missedSessions}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Progresso Semanal</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {sessionData.weeklyProgress}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Progress Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Completion Rate Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 bg-gradient-to-br from-white to-gray-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Taxa de Conclusão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completadas</span>
                  <span className="font-semibold text-green-600">
                    {completionRate.toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={completionRate} 
                  className="h-3"
                  style={{
                    background: 'linear-gradient(to right, #10b981, #059669)'
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Perdidas</span>
                  <span className="font-semibold text-red-600">
                    {missedRate.toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={missedRate} 
                  className="h-3"
                  style={{
                    background: 'linear-gradient(to right, #ef4444, #dc2626)'
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Session Types Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-0 bg-gradient-to-br from-white to-gray-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Tipos de Sessão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Consultas</p>
                  <p className="text-xl font-bold text-blue-600">
                    {sessionData.sessionTypes.consultation}
                  </p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Treinos</p>
                  <p className="text-xl font-bold text-green-600">
                    {sessionData.sessionTypes.workout}
                  </p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Nutrição</p>
                  <p className="text-xl font-bold text-yellow-600">
                    {sessionData.sessionTypes.nutrition}
                  </p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Mindfulness</p>
                  <p className="text-xl font-bold text-purple-600">
                    {sessionData.sessionTypes.mindfulness}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Weekly Progress Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="border-0 bg-gradient-to-br from-white to-gray-50/50">
          <CardHeader>
            <CardTitle>Progresso Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sessionData.weeklyData.map((week, index) => (
                <div key={week.week} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{week.week}</span>
                    <span className="font-semibold">
                      {week.completed}/{week.total} sessões
                    </span>
                  </div>
                  <Progress 
                    value={(week.completed / week.total) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}; 