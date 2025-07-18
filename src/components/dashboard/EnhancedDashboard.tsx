import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, ComposedChart, Bar, RadialBarChart, RadialBar, PieChart, Pie, Cell,
  ScatterChart, Scatter, ReferenceLine, Legend
} from 'recharts';
import { 
  Heart, Activity, Droplets, Scale, BarChart3, TrendingUp, TrendingDown,
  Target, Flame, Zap, Calendar, RefreshCw, Eye, EyeOff
} from 'lucide-react';
import { format, parseISO, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProgressData } from '@/hooks/useProgressData';
import { ChartDataPoint, MetricCardData } from '@/types/admin';

// Paleta de cores aprimorada
const COLORS = {
  primary: '#F97316',
  secondary: '#06B6D4', 
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  pink: '#EC4899',
  indigo: '#6366F1',
  emerald: '#10B981',
  rose: '#F43F5E',
  teal: '#14B8A6',
  gradient: ['#F97316', '#FB923C', '#FDBA74', '#FED7AA']
};

interface MetricCardProps extends MetricCardData {
  icon: React.ReactNode;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, value, change, changeType = 'neutral', icon, color, target, progress 
}) => {
  const getTrendIcon = () => {
    switch (changeType) {
      case 'increase': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'decrease': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <Card className="bg-netflix-card border-netflix-border hover:border-instituto-orange/50 transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full bg-${color}-100 text-${color}-600`}>
              {icon}
            </div>
            <div>
              <p className="text-sm text-netflix-text-muted">{title}</p>
              <p className="text-2xl font-bold text-netflix-text">{value}</p>
              {target && (
                <p className="text-xs text-netflix-text-muted">Meta: {target}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            {change && (
              <div className="flex items-center space-x-1">
                {getTrendIcon()}
                <span className="text-sm text-netflix-text-muted">{change}</span>
              </div>
            )}
            {progress && (
              <div className="mt-2 w-16 h-16">
                <RadialBarChart width={64} height={64} cx={32} cy={32} 
                  innerRadius={20} outerRadius={30} data={[{ value: progress }]}>
                  <RadialBar dataKey="value" fill={`var(--${color}-500)`} />
                </RadialBarChart>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Componente de gráfico de composição corporal memoizado
const BodyCompositionChart: React.FC<{ data: ChartDataPoint[] }> = React.memo(({ data }) => {
  return (
    <Card className="bg-netflix-card border-netflix-border">
      <CardHeader>
        <CardTitle className="text-netflix-text flex items-center gap-2">
          <Activity className="h-5 w-5 text-instituto-orange" />
          Evolução de Peso
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--netflix-border))" />
            <XAxis dataKey="data" tick={{ fill: 'hsl(var(--netflix-text))' }} />
            <YAxis tick={{ fill: 'hsl(var(--netflix-text))' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--netflix-card))', 
                border: '1px solid hsl(var(--netflix-border))',
                borderRadius: '8px'
              }}
            />
            <Area
              type="monotone"
              dataKey="peso"
              stroke={COLORS.primary}
              fill={COLORS.primary}
              name="Peso (kg)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});

// Gráfico combinado Peso + IMC
const WeightIMCChart: React.FC<{ data: ChartDataPoint[] }> = ({ data }) => {
  return (
    <Card className="bg-netflix-card border-netflix-border">
      <CardHeader>
        <CardTitle className="text-netflix-text flex items-center gap-2">
          <Scale className="h-5 w-5 text-instituto-orange" />
          Evolução Peso + IMC
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--netflix-border))" />
            <XAxis dataKey="data" tick={{ fill: 'hsl(var(--netflix-text))' }} />
            <YAxis yAxisId="left" tick={{ fill: 'hsl(var(--netflix-text))' }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: 'hsl(var(--netflix-text))' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--netflix-card))', 
                border: '1px solid hsl(var(--netflix-border))',
                borderRadius: '8px'
              }}
            />
            <Bar yAxisId="left" dataKey="peso" fill={COLORS.primary} name="Peso (kg)" />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="imc" 
              stroke={COLORS.secondary} 
              strokeWidth={3}
              name="IMC"
              dot={{ fill: COLORS.secondary }}
            />
            <ReferenceLine yAxisId="right" y={25} stroke={COLORS.warning} strokeDasharray="3 3" />
            <ReferenceLine yAxisId="right" y={30} stroke={COLORS.danger} strokeDasharray="3 3" />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Gráfico de indicadores circulares
const CircularIndicators: React.FC<{ data: any }> = ({ data }) => {
  const indicadores = useMemo(() => [
    { name: 'IMC', value: data.imc || 0, max: 40, color: COLORS.secondary },
    { name: 'Peso', value: data.peso_kg || 0, max: 150, color: COLORS.primary },
    { name: 'Meta', value: data.peso_kg || 0, max: data.meta_peso || 100, color: COLORS.success }
  ], [data]);

  return (
    <Card className="bg-netflix-card border-netflix-border">
      <CardHeader>
        <CardTitle className="text-netflix-text flex items-center gap-2">
          <Target className="h-5 w-5 text-instituto-orange" />
          Indicadores
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {indicadores.map((indicador, index) => (
            <div key={index} className="text-center">
              <div className="w-20 h-20 mx-auto mb-2">
                <RadialBarChart width={80} height={80} cx={40} cy={40} 
                  innerRadius={25} outerRadius={35} 
                  data={[{ value: (indicador.value / indicador.max) * 100 }]}>
                  <RadialBar 
                    dataKey="value" 
                    fill={indicador.color}
                    cornerRadius={5}
                  />
                </RadialBarChart>
              </div>
              <p className="text-sm font-medium text-netflix-text">{indicador.name}</p>
              <p className="text-xs text-netflix-text-muted">
                {indicador.name === 'IMC' ? indicador.value.toFixed(1) : indicador.value.toFixed(0)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Calendário de pesagens
const MonthlyHeatmap: React.FC<{ data: any[] }> = ({ data }) => {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // ✅ PERFORMANCE: Memoize calendar data
  const calendarData = useMemo(() => {
    const pesagemDates = new Set(
      data.map(p => format(new Date(p.data_medicao), 'yyyy-MM-dd'))
    );

    return days.map(day => ({
      date: format(day, 'd'),
      fullDate: format(day, 'yyyy-MM-dd'),
      hasPesagem: pesagemDates.has(format(day, 'yyyy-MM-dd'))
    }));
  }, [data, days]);

  return (
    <Card className="bg-netflix-card border-netflix-border">
      <CardHeader>
        <CardTitle className="text-netflix-text flex items-center gap-2">
          <Calendar className="h-5 w-5 text-instituto-orange" />
          Frequência de Pesagens - {format(today, 'MMMM yyyy', { locale: ptBR })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-netflix-text-muted p-2">
              {day}
            </div>
          ))}
          {calendarData.map((day, index) => (
            <div
              key={index}
              className={`
                text-center p-2 rounded text-sm cursor-pointer transition-colors
                ${day.hasPesagem 
                  ? 'bg-instituto-orange text-white' 
                  : 'bg-netflix-hover text-netflix-text-muted hover:bg-netflix-border'
                }
              `}
            >
              {day.date}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-netflix-text-muted">
          <div className="w-3 h-3 bg-netflix-hover rounded"></div>
          <span>Sem pesagem</span>
          <div className="w-3 h-3 bg-instituto-orange rounded"></div>
          <span>Com pesagem</span>
        </div>
      </CardContent>
    </Card>
  );
};

export const EnhancedDashboard: React.FC = () => {
  const { user } = useAuth();
  const { pesagens, dadosFisicos, loading } = useProgressData();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState(30);

  // ✅ PERFORMANCE: Memoize chart data calculation
  const chartData = useMemo((): ChartDataPoint[] => {
    if (!pesagens?.length || !dadosFisicos?.altura_cm) return [];
    
    return pesagens.slice(0, timeRange).reverse().map(pesagem => {
      const altura = dadosFisicos.altura_cm;
      const imc = altura > 0 ? pesagem.peso_kg / Math.pow(altura / 100, 2) : 0;
      
      return {
        data: format(new Date(pesagem.data_medicao), 'dd/MM'),
        peso: pesagem.peso_kg,
        imc: Math.round(imc * 10) / 10,
        gordura: 0, // Não disponível no schema atual
        musculo: 0, // Não disponível no schema atual
        agua: 0, // Não disponível no schema atual
        data_medicao: pesagem.data_medicao
      };
    });
  }, [pesagens, timeRange, dadosFisicos?.altura_cm]);

  // ✅ PERFORMANCE: Calculate metrics from real data
  const metrics = useMemo(() => {
    const latestData = pesagens?.[0];
    const previousData = pesagens?.[1];
    
    if (!latestData || !dadosFisicos?.altura_cm) {
      return {
        peso: { value: '0.0', change: null, progress: 0 },
        imc: { value: '0.0', change: null, progress: 0 },
        meta: { progress: 0 }
      };
    }

    const currentIMC = latestData.peso_kg / Math.pow(dadosFisicos.altura_cm / 100, 2);
    const weightChange = previousData ? latestData.peso_kg - previousData.peso_kg : 0;
    const imcChange = previousData ? 
      currentIMC - (previousData.peso_kg / Math.pow(dadosFisicos.altura_cm / 100, 2)) : 0;

    const metaPeso = dadosFisicos.meta_peso_kg || latestData.peso_kg;
    const progressToGoal = metaPeso > 0 ? 
      Math.max(0, Math.min(100, ((metaPeso - Math.abs(latestData.peso_kg - metaPeso)) / metaPeso) * 100)) : 0;

    return {
      peso: {
        value: latestData.peso_kg.toFixed(1),
        change: weightChange !== 0 ? `${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)}kg` : null,
        changeType: weightChange > 0 ? 'increase' : weightChange < 0 ? 'decrease' : 'neutral',
        progress: progressToGoal
      },
      imc: {
        value: currentIMC.toFixed(1),
        change: imcChange !== 0 ? `${imcChange > 0 ? '+' : ''}${imcChange.toFixed(1)}` : null,
        changeType: imcChange > 0 ? 'increase' : imcChange < 0 ? 'decrease' : 'neutral',
        progress: Math.max(0, Math.min(100, (25 - currentIMC) / 25 * 100))
      },
      meta: {
        progress: progressToGoal
      }
    };
  }, [pesagens, dadosFisicos]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse bg-netflix-card border-netflix-border">
              <CardContent className="p-4">
                <div className="h-16 bg-netflix-hover rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cartões de métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Peso Atual"
          value={`${metrics.peso.value}kg`}
          change={metrics.peso.change}
          changeType={metrics.peso.changeType as any}
          icon={<Scale className="h-4 w-4" />}
          color="instituto-orange"
          target={dadosFisicos?.meta_peso_kg ? `${dadosFisicos.meta_peso_kg}kg` : undefined}
          progress={metrics.peso.progress}
        />
        <MetricCard
          title="IMC"
          value={metrics.imc.value}
          change={metrics.imc.change}
          changeType={metrics.imc.changeType as any}
          icon={<BarChart3 className="h-4 w-4" />}
          color="secondary"
          target="25.0"
          progress={metrics.imc.progress}
        />
        <MetricCard
          title="Progresso"
          value={`${metrics.meta.progress.toFixed(0)}%`}
          icon={<Target className="h-4 w-4" />}
          color="success"
          progress={metrics.meta.progress}
        />
        <MetricCard
          title="Pesagens"
          value={pesagens?.length.toString() || '0'}
          icon={<Calendar className="h-4 w-4" />}
          color="purple"
        />
      </div>

      {/* Abas de visualizações */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="composition">Evolução</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
          <TabsTrigger value="activity">Atividade</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WeightIMCChart data={chartData} />
            <CircularIndicators data={pesagens?.[0] || {}} />
          </div>
        </TabsContent>

        <TabsContent value="composition" className="space-y-6">
          <BodyCompositionChart data={chartData} />
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-netflix-card border-netflix-border">
              <CardHeader>
                <CardTitle className="text-netflix-text flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-instituto-orange" />
                  Análise de Tendências
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--netflix-border))" />
                    <XAxis dataKey="data" tick={{ fill: 'hsl(var(--netflix-text))' }} />
                    <YAxis tick={{ fill: 'hsl(var(--netflix-text))' }} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="peso" 
                      stroke={COLORS.primary} 
                      strokeWidth={2}
                      name="Peso (kg)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="bg-netflix-card border-netflix-border">
              <CardHeader>
                <CardTitle className="text-netflix-text flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Estatísticas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-netflix-text-muted">Peso Médio</span>
                    <span className="text-netflix-text font-medium">
                      {chartData.length > 0 ? 
                        (chartData.reduce((acc, curr) => acc + curr.peso, 0) / chartData.length).toFixed(1) : '0'
                      }kg
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-netflix-text-muted">IMC Médio</span>
                    <span className="text-netflix-text font-medium">
                      {chartData.length > 0 ? 
                        (chartData.reduce((acc, curr) => acc + curr.imc, 0) / chartData.length).toFixed(1) : '0'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-netflix-text-muted">Total de Pesagens</span>
                    <span className="text-netflix-text font-medium">{pesagens?.length || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <MonthlyHeatmap data={pesagens || []} />
        </TabsContent>
      </Tabs>

      {/* Controles de período */}
      <div className="flex justify-center gap-2">
        {[7, 15, 30, 60].map(days => (
          <Button
            key={days}
            variant={timeRange === days ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange(days)}
          >
            {days} dias
          </Button>
        ))}
      </div>
    </div>
  );
};