import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  Clock, 
  Calendar, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Play,
  Eye
} from 'lucide-react';

interface AssignmentStatus {
  pending: string;
  completed: string;
  expired: string;
  cancelled: string;
}

const STATUS_LABELS: AssignmentStatus = {
  pending: 'Pendente',
  completed: 'Concluído',
  expired: 'Expirado',
  cancelled: 'Cancelado'
};

const STATUS_COLORS: AssignmentStatus = {
  pending: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/50',
  completed: 'bg-green-500/20 text-green-700 border-green-500/50',
  expired: 'bg-red-500/20 text-red-700 border-red-500/50',
  cancelled: 'bg-gray-500/20 text-gray-700 border-gray-500/50'
};

interface Assessment {
  id: string;
  tool_id: string;
  status: keyof AssignmentStatus;
  created_at: string;
  due_date: string | null;
  instructions: string | null;
  tool_name: string;
  total_questions: number;
  estimated_time: number;
  result_id?: string;
  completed_at?: string;
}

export const UserAssessments: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Carregar avaliações do usuário
  useEffect(() => {
    const fetchUserAssessments = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Buscar avaliações do banco de dados
        const { data, error } = await supabase
          .from('assessment_assignments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Erro ao carregar avaliações:', error);
          throw error;
        }
        
        // Buscar ferramentas separadamente
        const toolIds = [...new Set(data?.map(item => item.tool_id) || [])];
        
        const { data: tools, error: toolsError } = await supabase
          .from('coaching_tools')
          .select('id, name, total_questions, estimated_time')
          .in('id', toolIds);
          
        if (toolsError) {
          console.error('Erro ao carregar ferramentas:', toolsError);
        }
        
        // Formatar dados
        const formattedAssessments = data?.map(item => {
          const tool = tools?.find(t => t.id === item.tool_id);
          
          return {
            id: item.id,
            tool_id: item.tool_id,
            status: item.status,
            created_at: item.created_at,
            due_date: item.due_date,
            instructions: item.instructions,
            tool_name: tool?.name,
            total_questions: tool?.total_questions,
            estimated_time: tool?.estimated_time,
            result_id: item.result_id,
            completed_at: item.completed_at
          };
        }) || [];
        
        console.log('Avaliações do usuário carregadas:', formattedAssessments.length);
        setAssessments(formattedAssessments);
      } catch (err) {
        console.error('Erro ao carregar avaliações:', err);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar suas avaliações',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserAssessments();
  }, [user, toast]);
  
  // Filtrar avaliações por status
  const pendingAssessments = assessments.filter(a => a.status === 'pending');
  const completedAssessments = assessments.filter(a => a.status === 'completed');
  const otherAssessments = assessments.filter(a => ['expired', 'cancelled'].includes(a.status));
  
  // Iniciar avaliação
  const handleStartAssessment = (assessment: Assessment) => {
    window.location.href = `/assessment/${assessment.tool_id}?assignment=${assessment.id}`;
  };
  
  // Visualizar resultado
  const handleViewResult = (resultId: string) => {
    window.location.href = `/assessment/results/${resultId}`;
  };
  
  // Verificar se há avaliações vencidas
  const checkExpiredAssessments = () => {
    const now = new Date();
    
    const expiredAssessments = pendingAssessments.filter(assessment => {
      if (!assessment.due_date) return false;
      return new Date(assessment.due_date) < now;
    });
    
    if (expiredAssessments.length > 0) {
      // Atualizar status das avaliações vencidas
      expiredAssessments.forEach(async (assessment) => {
        try {
          const { error } = await supabase
            .from('assessment_assignments')
            .update({ status: 'expired' })
            .eq('id', assessment.id);
            
          if (error) throw error;
          
          // Atualizar estado local
          setAssessments(prev => prev.map(a => 
            a.id === assessment.id ? { ...a, status: 'expired' as keyof AssignmentStatus } : a
          ));
        } catch (err) {
          console.error('Erro ao atualizar status da avaliação:', err);
        }
      });
    }
  };
  
  // Verificar avaliações vencidas ao carregar
  useEffect(() => {
    if (!loading && pendingAssessments.length > 0) {
      checkExpiredAssessments();
    }
  }, [loading, pendingAssessments]);
  
  // Renderizar card de avaliação
  const renderAssessmentCard = (assessment: Assessment) => {
    const isPending = assessment.status === 'pending';
    const isCompleted = assessment.status === 'completed';
    const isExpiredOrCancelled = ['expired', 'cancelled'].includes(assessment.status);
    
    // Verificar se está vencida
    const isDueToday = assessment.due_date && new Date(assessment.due_date).toDateString() === new Date().toDateString();
    const isOverdue = assessment.due_date && new Date(assessment.due_date) < new Date();
    
    return (
      <Card key={assessment.id} className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{assessment.tool_name}</CardTitle>
              <CardDescription className="mt-1">
                {assessment.total_questions} perguntas • {assessment.estimated_time} minutos
              </CardDescription>
            </div>
            <Badge
              className={STATUS_COLORS[assessment.status]}
              variant="outline"
            >
              {STATUS_LABELS[assessment.status]}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pb-3">
          {assessment.instructions && (
            <div className="mb-4 p-3 bg-muted/40 rounded-md">
              <p className="text-sm">{assessment.instructions}</p>
            </div>
          )}
          
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Enviado em {new Date(assessment.created_at).toLocaleDateString('pt-BR')}</span>
            </div>
            
            {assessment.due_date && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className={isOverdue ? 'text-red-500 font-medium' : (isDueToday ? 'text-yellow-500 font-medium' : '')}>
                  {isOverdue ? 'Venceu em ' : isDueToday ? 'Vence hoje ' : 'Vence em '}
                  {new Date(assessment.due_date).toLocaleDateString('pt-BR')}
                </span>
              </div>
            )}
            
            {assessment.completed_at && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Concluído em {new Date(assessment.completed_at).toLocaleDateString('pt-BR')}</span>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="pt-2">
          {isPending && (
            <Button 
              onClick={() => handleStartAssessment(assessment)}
              className="w-full"
            >
              <Play className="h-4 w-4 mr-2" />
              Iniciar Avaliação
            </Button>
          )}
          
          {isCompleted && assessment.result_id && (
            <Button 
              variant="outline"
              onClick={() => handleViewResult(assessment.result_id!)}
              className="w-full"
            >
              <Eye className="h-4 w-4 mr-2" />
              Ver Resultados
            </Button>
          )}
          
          {isExpiredOrCancelled && (
            <div className="w-full flex items-center justify-center p-2 text-sm text-muted-foreground">
              <AlertTriangle className="h-4 w-4 mr-2" />
              {assessment.status === 'expired' ? 'Esta avaliação expirou' : 'Esta avaliação foi cancelada'}
            </div>
          )}
        </CardFooter>
      </Card>
    );
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Minhas Avaliações</h2>
        <p className="text-muted-foreground mt-1">
          Visualize e complete suas avaliações
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="pending" className="relative">
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Pendentes
              {pendingAssessments.length > 0 && (
                <span className="ml-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {pendingAssessments.length}
                </span>
              )}
            </span>
          </TabsTrigger>
          <TabsTrigger value="completed">
            <CheckCircle className="h-4 w-4 mr-2" />
            Concluídas
          </TabsTrigger>
          <TabsTrigger value="other">
            <XCircle className="h-4 w-4 mr-2" />
            Outras
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
              <span>Carregando avaliações...</span>
            </div>
          ) : pendingAssessments.length === 0 ? (
            <div className="text-center p-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
              <h3 className="mt-4 text-lg font-medium">Nenhuma avaliação pendente</h3>
              <p className="text-muted-foreground mt-1">
                Você não tem avaliações pendentes no momento
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {pendingAssessments.map(renderAssessmentCard)}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
              <span>Carregando avaliações...</span>
            </div>
          ) : completedAssessments.length === 0 ? (
            <div className="text-center p-8">
              <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
              <h3 className="mt-4 text-lg font-medium">Nenhuma avaliação concluída</h3>
              <p className="text-muted-foreground mt-1">
                Você ainda não concluiu nenhuma avaliação
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {completedAssessments.map(renderAssessmentCard)}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="other" className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
              <span>Carregando avaliações...</span>
            </div>
          ) : otherAssessments.length === 0 ? (
            <div className="text-center p-8">
              <XCircle className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
              <h3 className="mt-4 text-lg font-medium">Nenhuma avaliação expirada ou cancelada</h3>
              <p className="text-muted-foreground mt-1">
                Você não tem avaliações expiradas ou canceladas
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {otherAssessments.map(renderAssessmentCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}; 