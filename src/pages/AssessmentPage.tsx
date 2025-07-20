import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AssessmentEngine } from '@/components/assessment/AssessmentEngine';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export const AssessmentPage = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const [searchParams] = useSearchParams();
  const assignmentId = searchParams.get('assignment');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toolName, setToolName] = useState<string>('');
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Verificar se o usuário tem acesso à avaliação
  useEffect(() => {
    const checkAccess = async () => {
      if (!toolId) {
        setError('ID da ferramenta não fornecido');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Verificar se a ferramenta existe
        const { data: toolData, error: toolError } = await supabase
          .from('coaching_tools')
          .select('name')
          .eq('id', toolId)
          .single();
          
        if (toolError) throw toolError;
        
        if (!toolData) {
          setError('Ferramenta não encontrada');
          return;
        }
        
        setToolName(toolData.name);
        
        // Se tem ID de assignment, verificar se pertence ao usuário
        if (assignmentId && user) {
          const { data: assignmentData, error: assignmentError } = await supabase
            .from('assessment_assignments')
            .select('*')
            .eq('id', assignmentId)
            .eq('user_id', user.id)
            .single();
            
          if (assignmentError) {
            console.error('Erro ao verificar assignment:', assignmentError);
          }
          
          if (!assignmentData) {
            setError('Você não tem acesso a esta avaliação');
            return;
          }
          
          // Verificar se a avaliação não está expirada ou cancelada
          if (['expired', 'cancelled'].includes(assignmentData.status)) {
            setError(`Esta avaliação está ${assignmentData.status === 'expired' ? 'expirada' : 'cancelada'}`);
            return;
          }
          
          // Verificar se a avaliação já foi concluída
          if (assignmentData.status === 'completed') {
            if (assignmentData.result_id) {
              navigate(`/assessment/results/${assignmentData.result_id}`);
            } else {
              setError('Esta avaliação já foi concluída');
            }
            return;
          }
        }
      } catch (err) {
        console.error('Erro ao verificar acesso:', err);
        setError('Erro ao carregar a avaliação');
      } finally {
        setLoading(false);
      }
    };
    
    checkAccess();
  }, [toolId, assignmentId, user, navigate]);
  
  // Manipulador para conclusão da avaliação
  const handleComplete = async (results: any) => {
    if (!user || !toolId) return;
    
    try {
      // Salvar resultado no banco
      const { data: resultData, error: resultError } = await supabase
        .from('assessment_results')
        .insert({
          user_id: user.id,
          tool_id: toolId,
          score: results.overallScore,
          results_data: results
        })
        .select('id')
        .single();
        
      if (resultError) throw resultError;
      
      // Se tem assignment, atualizar status
      if (assignmentId) {
        const { error: updateError } = await supabase
          .from('assessment_assignments')
          .update({
            status: 'completed',
            result_id: resultData.id,
            completed_at: new Date().toISOString()
          })
          .eq('id', assignmentId);
          
        if (updateError) throw updateError;
      }
      
      toast({
        title: 'Sucesso',
        description: 'Avaliação concluída com sucesso!',
        variant: 'default'
      });
      
      // Redirecionar para resultados
      navigate(`/assessment/results/${resultData.id}`);
    } catch (err) {
      console.error('Erro ao salvar resultado:', err);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar os resultados',
        variant: 'destructive'
      });
    }
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
          <p className="text-lg font-medium text-muted-foreground">Carregando avaliação...</p>
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
              Não foi possível carregar esta avaliação. Por favor, verifique se o link está correto ou entre em contato com o administrador.
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
          <h1 className="text-2xl font-bold">{toolName}</h1>
          <div className="w-[100px]"></div>
        </div>
        
        <AssessmentEngine 
          toolId={toolId!}
          userId={user?.id}
          onComplete={handleComplete}
        />
      </div>
    </div>
  );
};

export default AssessmentPage; 