import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, AlertTriangle, Download, Share2, FileText } from 'lucide-react';
import { ResultsView } from '@/components/assessment/ResultsView';
import { AssessmentTool } from '@/components/assessment/AssessmentEngine';

export const AssessmentResultsPage = () => {
  const { resultId } = useParams<{ resultId: string }>();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [tool, setTool] = useState<AssessmentTool | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Carregar resultados
  useEffect(() => {
    const fetchResults = async () => {
      if (!resultId) {
        setError('ID do resultado não fornecido');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Buscar resultado
        const { data: resultData, error: resultError } = await supabase
          .from('assessment_results')
          .select('*')
          .eq('id', resultId)
          .single();
          
        if (resultError) throw resultError;
        
        if (!resultData) {
          setError('Resultado não encontrado');
          return;
        }
        
        // Verificar se o usuário tem acesso ao resultado
        if (user && resultData.user_id !== user.id) {
          // Verificar se o usuário é admin
          const { data: profileData } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single();
            
          const isAdmin = profileData?.is_admin === true;
          
          if (!isAdmin) {
            setError('Você não tem acesso a este resultado');
            return;
          }
        }
        
        // Buscar detalhes da ferramenta
        const { data: toolData, error: toolError } = await supabase
          .from('coaching_tools')
          .select('*')
          .eq('id', resultData.tool_id)
          .single();
          
        if (toolError) throw toolError;
        
        if (!toolData) {
          setError('Ferramenta não encontrada');
          return;
        }
        
        // Transformar dados da ferramenta
        const sections = [];
        const questionData = toolData.question_data || [];
        
        // Agrupar perguntas por categoria
        const questionsByCategory: Record<string, any[]> = {};
        
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
            options: q.options
          });
        });
        
        // Criar seções
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
          id: toolData.id,
          name: toolData.name,
          description: toolData.description || '',
          sections: sections,
          totalQuestions: toolData.total_questions,
          estimatedTime: toolData.estimated_time || 15
        };
        
        setTool(assessmentTool);
        setResults(resultData.results_data);
      } catch (err) {
        console.error('Erro ao carregar resultados:', err);
        setError('Erro ao carregar os resultados');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [resultId, user]);
  
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
  
  // Voltar para a página anterior
  const handleBack = () => {
    navigate(-1);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-muted-foreground">Carregando resultados...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-background rounded-lg shadow-lg">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-center">{error}</h2>
            <p className="text-center text-muted-foreground">
              Não foi possível carregar os resultados. Por favor, verifique se o link está correto ou entre em contato com o administrador.
            </p>
            <Button onClick={handleBack} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  if (!results || !tool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-background rounded-lg shadow-lg">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
              <FileText className="h-8 w-8 text-yellow-500" />
            </div>
            <h2 className="text-xl font-bold text-center">Resultados não disponíveis</h2>
            <p className="text-center text-muted-foreground">
              Os resultados desta avaliação não estão disponíveis no momento.
            </p>
            <Button onClick={handleBack} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
          <h1 className="text-2xl font-bold">Resultados da Avaliação</h1>
          <div className="w-[100px]"></div>
        </div>
        
        <ResultsView 
          results={results}
          tool={tool}
        />
      </div>
    </div>
  );
};

export default AssessmentResultsPage; 