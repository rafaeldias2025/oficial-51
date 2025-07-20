import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight, ChevronLeft, Send, Save, Award, BarChart3 } from 'lucide-react';
import { RadarChart } from './charts/RadarChart';
import { QuestionSection } from './QuestionSection';
import { ResultsView } from './ResultsView';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Question, Section, AssessmentTool } from '@/types/assessment';

interface AssessmentEngineProps {
  toolId: string;
  userId?: string;
  onComplete?: (results: any) => void;
  isPreview?: boolean;
}

export const AssessmentEngine: React.FC<AssessmentEngineProps> = ({
  toolId,
  userId,
  onComplete,
  isPreview = false
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tool, setTool] = useState<AssessmentTool | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState<any>(null);
  
  const { toast } = useToast();

  // Carregar ferramenta de avaliação
  useEffect(() => {
    const loadAssessmentTool = async () => {
      try {
        setLoading(true);
        
        // Buscar ferramenta do banco de dados
        const { data, error } = await supabase
          .from('coaching_tools')
          .select('*')
          .eq('id', toolId)
          .single();
          
        if (error) throw error;
        
        if (!data) {
          setError('Ferramenta não encontrada');
          return;
        }
        
        // Transformar dados do banco no formato esperado
        const sections: Section[] = [];
        const questionData = data.question_data || [];
        
        // Agrupar perguntas por categoria
        const questionsByCategory: Record<string, Question[]> = {};
        
        questionData.forEach((q: any) => {
          if (!questionsByCategory[q.category]) {
            questionsByCategory[q.category] = [];
          }
          
          questionsByCategory[q.category].push({
            id: `q_${q.number}`,
            text: q.text,
            type: q.type,
            category: q.category,
            min: q.min,
            max: q.max,
            options: q.options,
            required: true
          });
        });
        
        // Criar seções a partir das categorias
        Object.keys(questionsByCategory).forEach((category, index) => {
          sections.push({
            id: `section_${index}`,
            title: category,
            description: `Perguntas sobre ${category.toLowerCase()}`,
            icon: getIconForCategory(category),
            questions: questionsByCategory[category],
            color: getColorForIndex(index)
          });
        });
        
        // Criar objeto da ferramenta
        const assessmentTool: AssessmentTool = {
          id: data.id,
          name: data.name,
          description: data.description || '',
          sections: sections,
          totalQuestions: data.total_questions,
          estimatedTime: data.estimated_time || 15,
          instructions: data.instructions || 'Responda todas as perguntas com sinceridade para obter os melhores resultados.'
        };
        
        setTool(assessmentTool);
        
        // Inicializar objeto de respostas
        const initialAnswers: Record<string, any> = {};
        assessmentTool.sections.forEach(section => {
          section.questions.forEach(question => {
            initialAnswers[question.id] = null;
          });
        });
        
        setAnswers(initialAnswers);
      } catch (err) {
        console.error('Erro ao carregar ferramenta:', err);
        setError('Erro ao carregar ferramenta de avaliação');
      } finally {
        setLoading(false);
      }
    };
    
    loadAssessmentTool();
  }, [toolId]);
  
  // Calcular progresso
  useEffect(() => {
    if (!tool) return;
    
    let answeredCount = 0;
    let totalCount = 0;
    
    tool.sections.forEach(section => {
      section.questions.forEach(question => {
        totalCount++;
        if (answers[question.id] !== null && answers[question.id] !== undefined) {
          answeredCount++;
        }
      });
    });
    
    const newProgress = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;
    setProgress(newProgress);
  }, [answers, tool]);
  
  // Função para obter ícone baseado na categoria
  const getIconForCategory = (category: string): string => {
    const lowerCategory = category.toLowerCase();
    
    if (lowerCategory.includes('emocion')) return 'emotions';
    if (lowerCategory.includes('mente') || lowerCategory.includes('cogn')) return 'brain';
    if (lowerCategory.includes('corpo') || lowerCategory.includes('fisio')) return 'body';
    if (lowerCategory.includes('social') || lowerCategory.includes('relac')) return 'people';
    if (lowerCategory.includes('espirit')) return 'spirit';
    if (lowerCategory.includes('financ') || lowerCategory.includes('dinheiro')) return 'money';
    if (lowerCategory.includes('saúde') || lowerCategory.includes('health')) return 'health';
    if (lowerCategory.includes('sono') || lowerCategory.includes('sleep')) return 'sleep';
    if (lowerCategory.includes('coração') || lowerCategory.includes('heart')) return 'heart';
    
    // Ícone padrão
    return 'default';
  };
  
  // Função para obter cor baseada no índice
  const getColorForIndex = (index: number): string => {
    const colors = [
      'hsl(142, 76%, 36%)', // Verde
      'hsl(217, 91%, 60%)', // Azul
      'hsl(41, 96%, 58%)',  // Amarelo
      'hsl(0, 84%, 60%)',   // Vermelho
      'hsl(262, 80%, 58%)', // Roxo
      'hsl(180, 77%, 47%)', // Ciano
      'hsl(24, 90%, 58%)',  // Laranja
      'hsl(316, 73%, 52%)', // Rosa
      'hsl(160, 84%, 39%)', // Verde esmeralda
      'hsl(230, 76%, 59%)'  // Azul royal
    ];
    
    return colors[index % colors.length];
  };
  
  // Manipulador de respostas
  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  // Navegação entre seções
  const goToNextSection = () => {
    if (!tool) return;
    
    if (currentSectionIndex < tool.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      window.scrollTo(0, 0);
    } else {
      // Última seção, mostrar resultados
      calculateResults();
    }
  };
  
  const goToPreviousSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Cálculo de resultados
  const calculateResults = () => {
    if (!tool) return;
    
    setIsSubmitting(true);
    
    try {
      // Agrupar respostas por categoria
      const resultsByCategory: Record<string, { score: number, total: number, average: number }> = {};
      
      tool.sections.forEach(section => {
        const categoryId = section.title;
        resultsByCategory[categoryId] = { score: 0, total: 0, average: 0 };
        
        section.questions.forEach(question => {
          const answer = answers[question.id];
          
          // Só calcular pontuação para perguntas de escala
          if (question.type === 'scale' && typeof answer === 'number') {
            resultsByCategory[categoryId].score += answer;
            resultsByCategory[categoryId].total += 1;
          }
        });
        
        // Calcular média para a categoria
        if (resultsByCategory[categoryId].total > 0) {
          resultsByCategory[categoryId].average = 
            resultsByCategory[categoryId].score / resultsByCategory[categoryId].total;
        }
      });
      
      // Calcular pontuação geral
      let totalScore = 0;
      let totalQuestions = 0;
      
      Object.values(resultsByCategory).forEach(result => {
        totalScore += result.score;
        totalQuestions += result.total;
      });
      
      const overallScore = totalQuestions > 0 ? totalScore / totalQuestions : 0;
      
      // Preparar objeto de resultados
      const results = {
        toolId,
        userId: userId || 'anonymous',
        timestamp: new Date().toISOString(),
        overallScore,
        categories: resultsByCategory,
        answers
      };
      
      setAssessmentResults(results);
      
      // Salvar resultados se não for preview
      if (!isPreview && userId) {
        saveResults(results);
      } else {
        setIsSubmitting(false);
        setShowResults(true);
        
        if (onComplete) {
          onComplete(results);
        }
      }
    } catch (err) {
      console.error('Erro ao calcular resultados:', err);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao calcular os resultados',
        variant: 'destructive'
      });
      setIsSubmitting(false);
    }
  };
  
  // Salvar resultados no banco
  const saveResults = async (results: any) => {
    try {
      const { error } = await supabase
        .from('assessment_results')
        .insert({
          user_id: results.userId,
          tool_id: results.toolId,
          score: results.overallScore,
          results_data: results
        });
        
      if (error) throw error;
      
      toast({
        title: 'Sucesso',
        description: 'Avaliação concluída com sucesso!',
        variant: 'default'
      });
      
      setShowResults(true);
      
      if (onComplete) {
        onComplete(results);
      }
    } catch (err) {
      console.error('Erro ao salvar resultados:', err);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar os resultados',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Verificar se seção atual está completa
  const isCurrentSectionComplete = (): boolean => {
    if (!tool) return false;
    
    const currentSection = tool.sections[currentSectionIndex];
    if (!currentSection) return false;
    
    // Verificar se todas as perguntas obrigatórias foram respondidas
    return currentSection.questions.every(question => {
      if (!question.required) return true;
      return answers[question.id] !== null && answers[question.id] !== undefined;
    });
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-muted-foreground">Carregando avaliação...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-destructive">Erro</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
          <Button 
            className="mt-4" 
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  if (!tool) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Ferramenta não encontrada</CardTitle>
        </CardHeader>
        <CardContent>
          <p>A ferramenta de avaliação solicitada não foi encontrada.</p>
        </CardContent>
      </Card>
    );
  }
  
  if (showResults && assessmentResults) {
    return (
      <ResultsView 
        results={assessmentResults}
        tool={tool}
      />
    );
  }
  
  const currentSection = tool.sections[currentSectionIndex];
  
  return (
    <div className="w-full max-w-5xl mx-auto">
      <Card className="border-none shadow-lg bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">{tool.name}</CardTitle>
              <CardDescription className="text-base mt-1">{tool.description}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">{progress}%</span> concluído
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-2 mt-4" />
        </CardHeader>
        
        <CardContent className="pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <span 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: currentSection.color }}
                  >
                    {currentSectionIndex + 1}
                  </span>
                  {currentSection.title}
                </h3>
                <p className="text-muted-foreground mt-1">{currentSection.description}</p>
              </div>
              
              <ScrollArea className="max-h-[60vh]">
                <div className="space-y-8 pr-4">
                  <QuestionSection
                    section={currentSection}
                    answers={answers}
                    onAnswer={handleAnswer}
                  />
                </div>
              </ScrollArea>
            </motion.div>
          </AnimatePresence>
        </CardContent>
        
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <Button
            variant="outline"
            onClick={goToPreviousSection}
            disabled={currentSectionIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          
          <div className="text-sm text-muted-foreground">
            Seção {currentSectionIndex + 1} de {tool.sections.length}
          </div>
          
          <Button
            onClick={goToNextSection}
            disabled={!isCurrentSectionComplete() || isSubmitting}
          >
            {currentSectionIndex < tool.sections.length - 1 ? (
              <>
                Próximo
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            ) : isSubmitting ? (
              <>
                Processando...
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
              </>
            ) : (
              <>
                Finalizar
                <Send className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}; 