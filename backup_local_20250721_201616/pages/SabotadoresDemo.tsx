import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SabotadoresEmagrecimento } from '@/components/assessment/SabotadoresEmagrecimento';
import { RadarChart } from '@/components/charts/RadarChart';
import { BarChart } from '@/components/charts/BarChart';
import { GaugeChart } from '@/components/charts/GaugeChart';
import { 
  Brain, 
  Heart, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  Clock,
  BarChart3,
  PieChart,
  Activity,
  FileText
} from 'lucide-react';

interface Results {
  categories: {
    Emocional: number;
    Autocrítica: number;
    "Comportamento Alimentar": number;
    "Imagem Corporal": number;
  };
  totalScore: number;
  insights: string[];
  recommendations: string[];
}

export const SabotadoresDemo: React.FC = () => {
  const [currentView, setCurrentView] = useState<'assessment' | 'results'>('assessment');
  const [results, setResults] = useState<Results | null>(null);
  const [progress, setProgress] = useState<any>(null);

  const handleComplete = (assessmentResults: Results) => {
    console.log('🔍 handleComplete chamado com:', assessmentResults);
    setResults(assessmentResults);
    setCurrentView('results');
    console.log('🔍 Estado atualizado - currentView definido como "results"');
  };

  const handleSaveProgress = (progressData: any) => {
    setProgress(progressData);
  };

  const handleRestart = () => {
    setResults(null);
    setProgress(null);
    setCurrentView('assessment');
  };

  const handleDownloadReport = (type: 'executive' | 'detailed' | 'action' | 'psychological' | 'progress') => {
    console.log(`Baixando relatório: ${type}`);
    
    // Aqui será implementada a lógica de geração e download
    // Por enquanto, apenas simula o download
    const reportContent = generateReportContent(type, results);
    
    // Criar blob e download
    const blob = new Blob([reportContent], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-sabotadores-${type}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const generateReportContent = (type: string, results: Results | null) => {
    if (!results) return '';
    
    // Template básico do relatório
    const reportTemplates = {
      executive: `
        RELATÓRIO EXECUTIVO - SABOTADORES DO EMAGRECIMENTO
        
        Pontuação Geral: ${Object.values(results.categories).reduce((sum, value) => sum + value, 0)}
        
        Principais Sabotadores Identificados:
        - Emocional: ${results.categories.Emocional}/10
        - Autocrítica: ${results.categories.Autocrítica}/10
        - Comportamento Alimentar: ${results.categories["Comportamento Alimentar"]}/10
        - Imagem Corporal: ${results.categories["Imagem Corporal"]}/10
        
        Recomendações Principais:
        1. Identificar gatilhos emocionais
        2. Trabalhar autocompaixão
        3. Desenvolver hábitos saudáveis
      `,
      detailed: `
        RELATÓRIO DETALHADO - SABOTADORES DO EMAGRECIMENTO
        
        Análise Completa por Categoria:
        
        EMOCIONAL (${results.categories.Emocional}/10)
        Quem é: Padrões de alimentação emocional
        Como atua: Comer por estresse, ansiedade ou tristeza
        Pensamentos gerados: "Preciso comer para me sentir melhor"
        Sentimentos: Ansiedade, vazio emocional
        Mentiras do sabotador: "Comer vai resolver seus problemas"
        
        AUTOCRÍTICA (${results.categories.Autocrítica}/10)
        Quem é: Voz interna negativa e crítica
        Como atua: Auto-sabotagem através de pensamentos limitantes
        Pensamentos gerados: "Você nunca vai conseguir"
        Sentimentos: Frustração, desesperança
        Mentiras do sabotador: "Você não merece ser feliz"
        
        COMPORTAMENTO ALIMENTAR (${results.categories["Comportamento Alimentar"]}/10)
        Quem é: Hábitos alimentares disfuncionais
        Como atua: Comer por impulso ou compensação
        Pensamentos gerados: "Já que falhei, vou comer mesmo"
        Sentimentos: Culpa, arrependimento
        Mentiras do sabotador: "Amanhã você começa de novo"
        
        IMAGEM CORPORAL (${results.categories["Imagem Corporal"]}/10)
        Quem é: Relação negativa com o próprio corpo
        Como atua: Evitar situações que exponham o corpo
        Pensamentos gerados: "Sou feio(a), não mereço ser feliz"
        Sentimentos: Vergonha, rejeição
        Mentiras do sabotador: "Ninguém vai te amar assim"
      `,
      action: `
        PLANO DE AÇÃO - SABOTADORES DO EMAGRECIMENTO
        
        Metas SMART (30 dias):
        
        SEMANA 1: Autoconhecimento
        - Meta: Identificar 3 gatilhos emocionais
        - Ação: Manter diário de emoções
        - Medida: Anotar 5 situações por semana
        
        SEMANA 2: Autocompaixão
        - Meta: Praticar 3 técnicas de autocompaixão
        - Ação: Meditação de 5 minutos diários
        - Medida: 7 dias consecutivos
        
        SEMANA 3: Hábitos Saudáveis
        - Meta: Implementar 2 novos hábitos
        - Ação: Caminhada de 20 min + hidratação
        - Medida: 5 dias por semana
        
        SEMANA 4: Consolidação
        - Meta: Manter 80% dos novos hábitos
        - Ação: Revisar e ajustar plano
        - Medida: Avaliação semanal
      `,
      psychological: `
        ANÁLISE PSICOLÓGICA - SABOTADORES DO EMAGRECIMENTO
        
        Padrões Comportamentais Identificados:
        
        1. PADRÃO EMOCIONAL
        - Gatilho: Estresse e ansiedade
        - Resposta: Comer compulsivamente
        - Consequência: Culpa e arrependimento
        - Ciclo: Repetição do padrão
        
        2. PADRÃO COGNITIVO
        - Pensamentos automáticos negativos
        - Distorções cognitivas
        - Crenças limitantes
        - Viés de confirmação
        
        3. PADRÃO COMPORTAMENTAL
        - Evitação de situações
        - Procrastinação
        - Auto-sabotagem
        - Busca por gratificação imediata
        
        Estratégias de Intervenção:
        
        COGNITIVO-COMPORTAMENTAL:
        - Identificação de pensamentos automáticos
        - Reestruturação cognitiva
        - Exposição gradual
        - Treinamento de habilidades
        
        MINDFULNESS:
        - Atenção plena ao momento presente
        - Aceitação sem julgamento
        - Observação de pensamentos e emoções
        - Respiração consciente
        
        AUTOCUIDADO:
        - Práticas de autocompaixão
        - Atividades prazerosas
        - Conexão social
        - Descanso adequado
      `,
      progress: `
        TEMPLATE DE ACOMPANHAMENTO - SABOTADORES DO EMAGRECIMENTO
        
        SEMANA 1: ${new Date().toLocaleDateString('pt-BR')}
        
        METAS DA SEMANA:
        □ Identificar gatilhos emocionais
        □ Manter diário de emoções
        □ Praticar autocompaixão
        
        CONQUISTAS:
        □ Segunda-feira: ________________
        □ Terça-feira: ________________
        □ Quarta-feira: ________________
        □ Quinta-feira: ________________
        □ Sexta-feira: ________________
        □ Sábado: ________________
        □ Domingo: ________________
        
        DESAFIOS:
        □ Situação: ________________
        □ Como lidou: ________________
        □ Aprendizado: ________________
        
        REFLEXÕES DA SEMANA:
        - O que funcionou bem? ________________
        - O que foi desafiador? ________________
        - Como se sentiu? ________________
        - O que vai fazer diferente? ________________
        
        PRÓXIMA SEMANA:
        - Meta principal: ________________
        - Ação específica: ________________
        - Como medir sucesso: ________________
      `
    };
    
    return reportTemplates[type as keyof typeof reportTemplates] || '';
  };

  const renderResults = () => {
    if (!results) return null;

    const chartData = [
      { category: 'Emocional', value: results.categories.Emocional, color: '#ef4444' },
      { category: 'Autocrítica', value: results.categories.Autocrítica, color: '#f97316' },
      { category: 'Comportamento Alimentar', value: results.categories["Comportamento Alimentar"], color: '#f59e0b' },
      { category: 'Imagem Corporal', value: results.categories["Imagem Corporal"], color: '#8b5cf6' }
    ];

    const barChartData = chartData.map(item => ({
      ...item,
      percentage: (item.value / 10) * 100
    }));

    const totalScore = Object.values(results.categories).reduce((sum, value) => sum + value, 0);
    const averageScore = totalScore / Object.keys(results.categories).length;

    return (
      <div className="space-y-6">
        {/* Header */}
        <Card className="bg-netflix-card border-netflix-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-netflix-red" />
                <CardTitle className="text-netflix-text">
                  Resultados - Sabotadores do Emagrecimento
                </CardTitle>
              </div>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                Concluído
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-netflix-text-muted">
              Análise completa dos seus padrões de comportamento em relação ao emagrecimento.
            </p>
          </CardContent>
        </Card>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <Card className="bg-netflix-card border-netflix-border">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-netflix-red" />
                <CardTitle className="text-netflix-text">Análise por Categoria</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <RadarChart data={chartData} />
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card className="bg-netflix-card border-netflix-border">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-netflix-red" />
                <CardTitle className="text-netflix-text">Comparação Visual</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <BarChart data={barChartData} />
            </CardContent>
          </Card>
        </div>

        {/* Gauge Chart */}
        <Card className="bg-netflix-card border-netflix-border">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-netflix-red" />
              <CardTitle className="text-netflix-text">Pontuação Geral</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex justify-center">
            <GaugeChart value={averageScore} maxValue={10} />
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="bg-netflix-card border-netflix-border">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-netflix-red" />
              <CardTitle className="text-netflix-text">Insights Identificados</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.insights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-netflix-gray rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <p className="text-netflix-text text-sm">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recomendações */}
        <Card className="bg-netflix-card border-netflix-border">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-netflix-red" />
              <CardTitle className="text-netflix-text">Recomendações Personalizadas</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.categories.Emocional > 7 && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <h4 className="font-semibold text-red-400 mb-2">Alta Influência Emocional</h4>
                  <p className="text-netflix-text-muted text-sm">
                    Considere trabalhar com técnicas de mindfulness e identificação de gatilhos emocionais.
                  </p>
                </div>
              )}
              
              {results.categories.Autocrítica > 7 && (
                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <h4 className="font-semibold text-orange-400 mb-2">Autocrítica Elevada</h4>
                  <p className="text-netflix-text-muted text-sm">
                    Pratique autocompaixão e estabeleça metas mais realistas e gentis.
                  </p>
                </div>
              )}
              
              {results.categories["Comportamento Alimentar"] > 7 && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <h4 className="font-semibold text-yellow-400 mb-2">Comportamento Alimentar</h4>
                  <p className="text-netflix-text-muted text-sm">
                    Desenvolva estratégias para lidar com o estresse sem recorrer à comida.
                  </p>
                </div>
              )}
              
              {results.categories["Imagem Corporal"] > 7 && (
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <h4 className="font-semibold text-purple-400 mb-2">Imagem Corporal</h4>
                  <p className="text-netflix-text-muted text-sm">
                    Trabalhe na aceitação corporal e foque em saúde, não apenas em aparência.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Seleção de Relatórios */}
        <Card className="bg-netflix-card border-netflix-border">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-netflix-red" />
              <CardTitle className="text-netflix-text">Escolha seu Relatório</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Relatório Executivo */}
              <div className="p-4 border border-netflix-border rounded-lg hover:border-netflix-red/50 transition-colors cursor-pointer">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="h-4 w-4 text-netflix-red" />
                  <h4 className="font-semibold text-netflix-text">Relatório Executivo</h4>
                </div>
                <p className="text-sm text-netflix-text-muted mb-3">
                  Resumo rápido com principais insights e 3 recomendações essenciais.
                </p>
                <Button 
                  onClick={() => handleDownloadReport('executive')}
                  size="sm"
                  className="w-full bg-netflix-red text-white hover:bg-netflix-red/90"
                >
                  Baixar PDF
                </Button>
              </div>

              {/* Relatório Detalhado */}
              <div className="p-4 border border-netflix-border rounded-lg hover:border-netflix-red/50 transition-colors cursor-pointer">
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="h-4 w-4 text-netflix-red" />
                  <h4 className="font-semibold text-netflix-text">Relatório Detalhado</h4>
                </div>
                <p className="text-sm text-netflix-text-muted mb-3">
                  Análise completa com todos os sabotadores identificados e estratégias específicas.
                </p>
                <Button 
                  onClick={() => handleDownloadReport('detailed')}
                  size="sm"
                  className="w-full bg-netflix-red text-white hover:bg-netflix-red/90"
                >
                  Baixar PDF
                </Button>
              </div>

              {/* Relatório de Ação */}
              <div className="p-4 border border-netflix-border rounded-lg hover:border-netflix-red/50 transition-colors cursor-pointer">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-netflix-red" />
                  <h4 className="font-semibold text-netflix-text">Plano de Ação</h4>
                </div>
                <p className="text-sm text-netflix-text-muted mb-3">
                  Plano personalizado com metas SMART e cronograma de 30 dias.
                </p>
                <Button 
                  onClick={() => handleDownloadReport('action')}
                  size="sm"
                  className="w-full bg-netflix-red text-white hover:bg-netflix-red/90"
                >
                  Baixar PDF
                </Button>
              </div>

              {/* Relatório Psicológico */}
              <div className="p-4 border border-netflix-border rounded-lg hover:border-netflix-red/50 transition-colors cursor-pointer">
                <div className="flex items-center space-x-2 mb-2">
                  <Brain className="h-4 w-4 text-netflix-red" />
                  <h4 className="font-semibold text-netflix-text">Análise Psicológica</h4>
                </div>
                <p className="text-sm text-netflix-text-muted mb-3">
                  Análise profunda dos padrões comportamentais e gatilhos emocionais.
                </p>
                <Button 
                  onClick={() => handleDownloadReport('psychological')}
                  size="sm"
                  className="w-full bg-netflix-red text-white hover:bg-netflix-red/90"
                >
                  Baixar PDF
                </Button>
              </div>

              {/* Relatório de Progresso */}
              <div className="p-4 border border-netflix-border rounded-lg hover:border-netflix-red/50 transition-colors cursor-pointer">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-netflix-red" />
                  <h4 className="font-semibold text-netflix-text">Acompanhamento</h4>
                </div>
                <p className="text-sm text-netflix-text-muted mb-3">
                  Template para acompanhar seu progresso e celebrar conquistas.
                </p>
                <Button 
                  onClick={() => handleDownloadReport('progress')}
                  size="sm"
                  className="w-full bg-netflix-red text-white hover:bg-netflix-red/90"
                >
                  Baixar PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={handleRestart}
            variant="outline"
            className="border-netflix-border text-netflix-text hover:bg-netflix-gray"
          >
            Fazer Nova Avaliação
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-netflix-text mb-2">
            Sabotadores do Emagrecimento
          </h1>
          <p className="text-netflix-text-muted">
            Avaliação completa dos padrões que podem estar impedindo seu processo de emagrecimento
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="assessment" className="text-netflix-text">
              <Brain className="h-4 w-4 mr-2" />
              Avaliação
            </TabsTrigger>
            <TabsTrigger value="results" className="text-netflix-text" disabled={!results}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Resultados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assessment" className="mt-6">
            <SabotadoresEmagrecimento
              onComplete={handleComplete}
              onSaveProgress={handleSaveProgress}
            />
          </TabsContent>

          <TabsContent value="results" className="mt-6">
            {renderResults()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}; 