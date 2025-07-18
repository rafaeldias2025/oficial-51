// ====================================================================
// COMPONENTE EXEMPLO - DASHBOARD OTIMIZADO
// Demonstra o uso dos novos hooks consolidados
// ====================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Target, 
  Activity, 
  Scale, 
  TrendingUp,
  CheckCircle,
  Circle,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import { useHealthData } from '@/hooks/useHealthData';
import { useDailySystem } from '@/hooks/useDailySystem';
import { useBluetoothScale } from '@/hooks/useBluetoothScale';
import { cn } from '@/lib/utils';

// === COMPONENTES INTERNOS ===

const HealthMetricsCard: React.FC = () => {
  const { 
    physicalData, 
    latestWeightMeasurement, 
    bmi, 
    bmiCategory, 
    cardiometabolicRisk,
    loading 
  } = useHealthData();

  if (loading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Métricas de Saúde
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          Métricas de Saúde
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Peso Atual */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Peso Atual</span>
          <span className="font-semibold">
            {latestWeightMeasurement?.peso_kg || physicalData?.peso_atual_kg || '-- '} kg
          </span>
        </div>

        {/* IMC */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">IMC</span>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{bmi?.toFixed(1) || '--'}</span>
            {bmiCategory && (
              <Badge variant={
                bmiCategory === 'Peso normal' ? 'default' : 
                bmiCategory.includes('Obesidade') ? 'destructive' : 'secondary'
              }>
                {bmiCategory}
              </Badge>
            )}
          </div>
        </div>

        {/* Risco Cardiometabólico */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Risco Cardiometabólico</span>
          <Badge variant={cardiometabolicRisk === 'Alto risco' ? 'destructive' : 'default'}>
            {cardiometabolicRisk || 'Não avaliado'}
          </Badge>
        </div>

        {/* Última Pesagem */}
        {latestWeightMeasurement && (
          <div className="pt-2 border-t border-gray-200">
            <span className="text-xs text-gray-500">
              Última pesagem: {new Date(latestWeightMeasurement.data_medicao).toLocaleDateString('pt-BR')}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const DailyTasksCard: React.FC = () => {
  const { 
    todayProgress, 
    availableTasks, 
    updateTaskCompletion,
    loading 
  } = useDailySystem();

  if (loading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            Tarefas Diárias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleTaskToggle = async (taskId: string, completed: boolean) => {
    await updateTaskCompletion(taskId, completed);
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-500" />
          Tarefas Diárias
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progresso */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso do Dia</span>
            <span>{todayProgress.completedTasks}/{todayProgress.totalTasks}</span>
          </div>
          <Progress 
            value={(todayProgress.completedTasks / todayProgress.totalTasks) * 100} 
            className="h-2"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{todayProgress.totalPoints} pontos</span>
            <Badge variant={
              todayProgress.category === 'excelente' ? 'default' :
              todayProgress.category === 'medio' ? 'secondary' : 'outline'
            }>
              {todayProgress.category}
            </Badge>
          </div>
        </div>

        {/* Lista de Tarefas */}
        <div className="space-y-3">
          {availableTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                task.completed 
                  ? "bg-green-50 border-green-200" 
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              )}
            >
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-auto"
                onClick={() => handleTaskToggle(task.id, !task.completed)}
              >
                {task.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
              </Button>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "font-medium",
                    task.completed && "line-through text-gray-500"
                  )}>
                    {task.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    +{task.points} pts
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {task.category}
                  </Badge>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const BluetoothScaleCard: React.FC = () => {
  const { 
    state, 
    connectDevice, 
    disconnectDevice, 
    startReading 
  } = useBluetoothScale();

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-purple-500" />
          Balança Bluetooth
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status</span>
          <Badge variant={state.isConnected ? 'default' : 'outline'}>
            {state.status}
          </Badge>
        </div>

        {/* Última Leitura */}
        {state.lastReading && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Peso:</span>
                <span className="font-semibold ml-2">{state.lastReading.weight} kg</span>
              </div>
              {state.lastReading.bodyFat && (
                <div>
                  <span className="text-gray-600">Gordura:</span>
                  <span className="font-semibold ml-2">{state.lastReading.bodyFat}%</span>
                </div>
              )}
              {state.lastReading.muscleMass && (
                <div>
                  <span className="text-gray-600">Músculo:</span>
                  <span className="font-semibold ml-2">{state.lastReading.muscleMass} kg</span>
                </div>
              )}
              {state.lastReading.bodyWater && (
                <div>
                  <span className="text-gray-600">Água:</span>
                  <span className="font-semibold ml-2">{state.lastReading.bodyWater}%</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Ações */}
        <div className="flex gap-2">
          {!state.isConnected ? (
            <Button 
              onClick={connectDevice}
              disabled={state.isConnecting}
              className="flex-1"
            >
              {state.isConnecting ? 'Conectando...' : 'Conectar'}
            </Button>
          ) : (
            <>
              <Button 
                onClick={() => startReading()}
                disabled={state.isReading}
                className="flex-1"
              >
                {state.isReading ? 'Lendo...' : 'Iniciar Pesagem'}
              </Button>
              <Button 
                variant="outline"
                onClick={disconnectDevice}
              >
                Desconectar
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const ProgressSummaryCard: React.FC = () => {
  const { weightHistory } = useHealthData();
  const { pointsHistory } = useDailySystem();

  // Calcular tendências
  const weightTrend = weightHistory.length >= 2 ? 
    weightHistory[0].peso_kg - weightHistory[1].peso_kg : 0;
  
  const averagePoints = pointsHistory.length > 0 ?
    pointsHistory.reduce((sum, p) => sum + p.total_pontos_dia, 0) / pointsHistory.length : 0;

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          Resumo do Progresso
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tendência de Peso */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Tendência de Peso</span>
          <div className="flex items-center gap-2">
            <span className={cn(
              "font-semibold",
              weightTrend < 0 ? "text-green-600" : 
              weightTrend > 0 ? "text-red-600" : "text-gray-600"
            )}>
              {weightTrend > 0 ? '+' : ''}{weightTrend.toFixed(1)} kg
            </span>
            <TrendingUp className={cn(
              "w-4 h-4",
              weightTrend < 0 ? "text-green-500 rotate-180" : 
              weightTrend > 0 ? "text-red-500" : "text-gray-400"
            )} />
          </div>
        </div>

        {/* Média de Pontos */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Média de Pontos</span>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{averagePoints.toFixed(0)} pts</span>
            <Zap className="w-4 h-4 text-yellow-500" />
          </div>
        </div>

        {/* Pesagens Realizadas */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Pesagens (30 dias)</span>
          <span className="font-semibold">{weightHistory.length}</span>
        </div>

        {/* Dias Ativos */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Dias Ativos (30 dias)</span>
          <span className="font-semibold">{pointsHistory.length}</span>
        </div>
      </CardContent>
    </Card>
  );
};

// === COMPONENTE PRINCIPAL ===
export const OptimizedDashboard: React.FC = () => {
  return (
    <UnifiedLayout 
      variant="health"
      showHealthPanel={true}
      enableQuickAccess={true}
      title="Dashboard Otimizado"
    >
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Otimizado
          </h1>
          <p className="text-gray-600">
            Demonstração dos hooks consolidados e sistema unificado
          </p>
        </motion.div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Métricas de Saúde */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <HealthMetricsCard />
          </motion.div>

          {/* Tarefas Diárias */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <DailyTasksCard />
          </motion.div>

          {/* Balança Bluetooth */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <BluetoothScaleCard />
          </motion.div>

          {/* Resumo do Progresso */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 xl:col-span-3"
          >
            <ProgressSummaryCard />
          </motion.div>
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-gray-500 space-y-2"
        >
          <p>✅ Sistema consolidado com {' '}
            <code className="bg-gray-100 px-2 py-1 rounded text-xs">useHealthData</code>, {' '}
            <code className="bg-gray-100 px-2 py-1 rounded text-xs">useDailySystem</code> e {' '}
            <code className="bg-gray-100 px-2 py-1 rounded text-xs">useBluetoothScale</code>
          </p>
          <p>🚀 Performance otimizada, tipos padronizados e zero duplicação</p>
        </motion.div>
      </div>
    </UnifiedLayout>
  );
}; 