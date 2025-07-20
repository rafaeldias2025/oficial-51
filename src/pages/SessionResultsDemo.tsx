import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  BarChart3,
  Target,
  TrendingUp,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { RadarChart } from '@/components/charts/RadarChart';
import { BarChart } from '@/components/charts/BarChart';
import { GaugeChart } from '@/components/charts/GaugeChart';
import { SessionInsights } from '@/components/results/SessionInsights';
import { RadarDataPoint, BarChartDataPoint, SessionInsight } from '@/types/session-system';

export const SessionResultsDemo: React.FC = () => {
  // Dados de exemplo
  const radarData: RadarDataPoint[] = [
    { category: 'Mental', value: 8, color: '#3b82f6' },
    { category: 'Emocional', value: 7, color: '#10b981' },
    { category: 'Relacionamentos', value: 6, color: '#8b5cf6' },
    { category: 'Objetivos', value: 9, color: '#f59e0b' },
    { category: 'Físico', value: 8, color: '#ef4444' },
    { category: 'Espiritual', value: 7, color: '#06b6d4' }
  ];

  const barChartData: BarChartDataPoint[] = [
    { category: 'Mental', value: 8, color: '#3b82f6', percentage: 80 },
    { category: 'Emocional', value: 7, color: '#10b981', percentage: 70 },
    { category: 'Relacionamentos', value: 6, color: '#8b5cf6', percentage: 60 },
    { category: 'Objetivos', value: 9, color: '#f59e0b', percentage: 90 },
    { category: 'Físico', value: 8, color: '#ef4444', percentage: 80 },
    { category: 'Espiritual', value: 7, color: '#06b6d4', percentage: 70 }
  ];

  const insights: SessionInsight[] = [
    {
      id: '1',
      type: 'strength',
      title: 'Excelente Desenvolvimento Mental',
      description: 'Você demonstrou excelente capacidade de foco e clareza mental. Sua pontuação de 8/10 indica um forte desenvolvimento nesta área.',
      category: 'Mental',
      impact: 'high',
      actionable: true
    },
    {
      id: '2',
      type: 'weakness',
      title: 'Relacionamentos Precisam de Atenção',
      description: 'Sua pontuação de 6/10 em relacionamentos indica uma área que pode ser desenvolvida. Considere investir mais tempo em conexões sociais.',
      category: 'Relacionamentos',
      impact: 'medium',
      actionable: true
    },
    {
      id: '3',
      type: 'trend',
      title: 'Tendência Positiva em Objetivos',
      description: 'Sua pontuação de 9/10 em objetivos mostra uma excelente capacidade de planejamento e execução. Continue mantendo esse foco!',
      category: 'Objetivos',
      impact: 'high',
      actionable: false
    },
    {
      id: '4',
      type: 'pattern',
      title: 'Padrão de Equilíbrio',
      description: 'Você mantém um bom equilíbrio entre as diferentes áreas da vida, com pontuações consistentes entre 6-9.',
      category: 'Geral',
      impact: 'low',
      actionable: false
    }
  ];

  const recommendations = [
    'Foque no desenvolvimento de relacionamentos através de atividades sociais',
    'Mantenha o excelente trabalho em objetivos e planejamento',
    'Continue investindo no desenvolvimento mental e emocional',
    'Considere práticas de mindfulness para melhorar o equilíbrio geral'
  ];

  const handleBack = () => {
    // Navegação de volta
    console.log('Voltando...');
  };

  const handleDownload = () => {
    // Download dos resultados
    console.log('Baixando resultados...');
  };

  const handleShare = () => {
    // Compartilhar resultados
    console.log('Compartilhando...');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Resultados da Sessão</h1>
                <p className="text-sm text-gray-600">Sabotadores do Emagrecimento</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleDownload} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Baixar
              </Button>
              <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Compartilhar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Resumo Geral */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pontuação Geral</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7.5</div>
              <p className="text-xs text-muted-foreground">+0.5 vs sessão anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categorias Avaliadas</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-muted-foreground">Áreas diferentes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Insights Gerados</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">Análises inteligentes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data da Sessão</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">19/01</div>
              <p className="text-xs text-muted-foreground">Hoje</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Radar Chart */}
          <RadarChart 
            data={radarData} 
            title="Roda da Vida" 
            size={350}
          />
          
          {/* Gauge Chart */}
          <GaugeChart 
            value={75} 
            title="Pontuação Geral" 
            size={350}
          />
        </div>

        {/* Bar Chart */}
        <div className="mb-8">
          <BarChart 
            data={barChartData} 
            title="Análise por Categoria" 
            height={300}
          />
        </div>

        {/* Insights e Recomendações */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Insights */}
          <SessionInsights insights={insights} />
          
          {/* Recomendações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Recomendações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <p className="text-sm text-gray-700">
                      {recommendation}
                    </p>
                  </div>
                ))}
              </div>
              
              {/* Ações Sugeridas */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Próximas Ações Sugeridas</h4>
                <div className="space-y-2 text-sm text-green-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Agende uma sessão de follow-up em 2 semanas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Implemente as recomendações nas próximas semanas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Monitore seu progresso regularmente</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 