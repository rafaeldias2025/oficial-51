import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Share2, BarChart3, PieChart, Activity } from 'lucide-react';
import { AssessmentTool } from './AssessmentEngine';
import { RadarChart } from './charts/RadarChart';
import { BarChart } from './charts/BarChart';
import { CategoryScoreCard } from './CategoryScoreCard';

interface ResultsViewProps {
  results: any;
  tool: AssessmentTool;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ results, tool }) => {
  const downloadRef = useRef<HTMLAnchorElement>(null);
  
  // Preparar dados para o gráfico de radar
  const radarData = {
    labels: Object.keys(results.categories),
    datasets: [
      {
        label: 'Pontuação',
        data: Object.values(results.categories).map((cat: any) => cat.average),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
    ],
  };
  
  // Preparar dados para o gráfico de barras
  const barData = {
    labels: Object.keys(results.categories),
    datasets: [
      {
        label: 'Pontuação',
        data: Object.values(results.categories).map((cat: any) => cat.average),
        backgroundColor: Object.keys(results.categories).map((_, i) => getColorForIndex(i, 0.7)),
        borderColor: Object.keys(results.categories).map((_, i) => getColorForIndex(i, 1)),
        borderWidth: 1,
      },
    ],
  };
  
  // Função para obter cor baseada no índice
  const getColorForIndex = (index: number, alpha: number = 1): string => {
    const colors = [
      `rgba(22, 163, 74, ${alpha})`,  // Verde
      `rgba(37, 99, 235, ${alpha})`,  // Azul
      `rgba(234, 179, 8, ${alpha})`,  // Amarelo
      `rgba(220, 38, 38, ${alpha})`,  // Vermelho
      `rgba(124, 58, 237, ${alpha})`, // Roxo
      `rgba(8, 145, 178, ${alpha})`,  // Ciano
      `rgba(234, 88, 12, ${alpha})`,  // Laranja
      `rgba(190, 24, 93, ${alpha})`,  // Rosa
      `rgba(5, 150, 105, ${alpha})`,  // Verde esmeralda
      `rgba(79, 70, 229, ${alpha})`,  // Azul royal
    ];
    
    return colors[index % colors.length];
  };
  
  // Exportar resultados como JSON
  const handleExportResults = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    if (downloadRef.current) {
      downloadRef.current.setAttribute('href', dataUri);
      downloadRef.current.setAttribute('download', `${tool.name.replace(/\s+/g, '_')}_resultados_${new Date().toISOString().split('T')[0]}.json`);
      downloadRef.current.click();
    }
  };
  
  // Compartilhar resultados
  const handleShareResults = () => {
    if (navigator.share) {
      navigator.share({
        title: `Resultados da avaliação: ${tool.name}`,
        text: `Minha pontuação geral: ${results.overallScore.toFixed(1)}/10`,
        url: window.location.href,
      }).catch((error) => console.log('Erro ao compartilhar', error));
    } else {
      alert('Compartilhamento não suportado neste navegador');
    }
  };
  
  return (
    <div className="w-full max-w-5xl mx-auto">
      <a ref={downloadRef} className="hidden"></a>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-none shadow-lg bg-gradient-to-br from-background to-background/80 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Resultados da Avaliação</CardTitle>
            <CardDescription className="text-base">{tool.name}</CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
              <div className="text-center md:text-left">
                <h3 className="text-lg font-medium text-muted-foreground">Pontuação Geral</h3>
                <div className="mt-2 flex items-baseline">
                  <span className="text-5xl font-bold tracking-tight">
                    {results.overallScore.toFixed(1)}
                  </span>
                  <span className="ml-1 text-2xl text-muted-foreground">/10</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Avaliação concluída em {new Date(results.timestamp).toLocaleDateString('pt-BR')}
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleExportResults}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Button variant="outline" onClick={handleShareResults}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="radar" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="radar">
                  <PieChart className="h-4 w-4 mr-2" />
                  Radar
                </TabsTrigger>
                <TabsTrigger value="bars">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Barras
                </TabsTrigger>
                <TabsTrigger value="scores">
                  <Activity className="h-4 w-4 mr-2" />
                  Detalhes
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="radar" className="py-4">
                <div className="aspect-square max-h-[500px] mx-auto">
                  <RadarChart data={radarData} />
                </div>
              </TabsContent>
              
              <TabsContent value="bars" className="py-4">
                <div className="h-[400px] mx-auto">
                  <BarChart data={barData} />
                </div>
              </TabsContent>
              
              <TabsContent value="scores" className="py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(results.categories).map(([category, data]: [string, any], index) => (
                    <CategoryScoreCard 
                      key={category}
                      category={category}
                      score={data.average}
                      color={getColorForIndex(index)}
                      maxScore={10}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="flex justify-center mt-6">
          <Button onClick={() => window.location.reload()}>
            Realizar nova avaliação
          </Button>
        </div>
      </motion.div>
    </div>
  );
}; 