import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Play, Clock, Calendar, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface UserTool {
  id: string;
  tool_id: number;
  status: 'pending' | 'in_progress' | 'completed';
  scheduled_date: string | null;
  sent_date: string;
  completed_date: string | null;
  custom_message: string | null;
  tool: {
    id: number;
    name: string;
    description: string;
    category: string;
    estimated_time: number;
    total_questions: number;
  };
}

export const UserTools: React.FC = () => {
  const { toast } = useToast();
  const [tools, setTools] = useState<UserTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

  useEffect(() => {
    const fetchUserTools = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (!profile) throw new Error('Perfil não encontrado');

        // Usando any para contornar o problema de tipos do Supabase
        const { data, error } = await supabase
          .from('user_tools' as any)
          .select(`
            id,
            tool_id,
            status,
            scheduled_date,
            sent_date,
            completed_date,
            custom_message,
            tool:coaching_tools(id, name, description, category, estimated_time, total_questions)
          `)
          .eq('user_id', profile.id)
          .order('sent_date', { ascending: false });

        if (error) throw error;
        setTools(data as UserTool[] || []);
      } catch (error) {
        console.error('Erro ao carregar ferramentas:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar suas ferramentas.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUserTools();
  }, [toast]);

  const filteredTools = tools.filter(tool => {
    if (activeTab === 'all') return true;
    return tool.status === activeTab;
  });

  const pendingCount = tools.filter(tool => tool.status === 'pending').length;
  const inProgressCount = tools.filter(tool => tool.status === 'in_progress').length;
  const completedCount = tools.filter(tool => tool.status === 'completed').length;

  const startTool = async (toolId: string) => {
    try {
      const { error } = await supabase
        .from('user_tools' as any)
        .update({ status: 'in_progress' })
        .eq('id', toolId);
      
      if (error) throw error;
      
      // Atualizar o estado local
      setTools(prev => prev.map(tool => 
        tool.id === toolId ? { ...tool, status: 'in_progress' } : tool
      ));
      
      toast({
        title: 'Sucesso',
        description: 'Ferramenta iniciada com sucesso!',
      });
      
      // Aqui você pode redirecionar para a página da ferramenta
      // navigate(`/tools/${toolId}`);
      
    } catch (error) {
      console.error('Erro ao iniciar ferramenta:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível iniciar a ferramenta.',
        variant: 'destructive',
      });
    }
  };

  const continueTool = (toolId: string) => {
    // Implementar navegação para a página da ferramenta
    console.log('Continuar ferramenta:', toolId);
    // navigate(`/tools/${toolId}`);
  };

  const viewResults = (toolId: string) => {
    // Implementar navegação para a página de resultados
    console.log('Ver resultados:', toolId);
    // navigate(`/tools/${toolId}/results`);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return format(new Date(dateString), "dd 'de' MMMM", { locale: ptBR });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-netflix-red"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-netflix-text">Ferramentas Semanais</h2>
          <p className="text-netflix-text-muted">
            Ferramentas de coaching e avaliação compartilhadas com você
          </p>
        </div>
        
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-netflix-card border-netflix-border text-netflix-text">
            {tools.length} Total
          </Badge>
          <Badge variant="outline" className="bg-netflix-card border-netflix-border text-yellow-500">
            {pendingCount} Pendentes
          </Badge>
          <Badge variant="outline" className="bg-netflix-card border-netflix-border text-blue-500">
            {inProgressCount} Em Andamento
          </Badge>
          <Badge variant="outline" className="bg-netflix-card border-netflix-border text-green-500">
            {completedCount} Concluídas
          </Badge>
        </div>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as typeof activeTab)}
        className="w-full"
      >
        <TabsList className="bg-netflix-card border border-netflix-border">
          <TabsTrigger 
            value="all"
            className="data-[state=active]:bg-netflix-red data-[state=active]:text-white"
          >
            Todas
          </TabsTrigger>
          <TabsTrigger 
            value="pending"
            className="data-[state=active]:bg-netflix-red data-[state=active]:text-white"
          >
            Pendentes
          </TabsTrigger>
          <TabsTrigger 
            value="in_progress"
            className="data-[state=active]:bg-netflix-red data-[state=active]:text-white"
          >
            Em Andamento
          </TabsTrigger>
          <TabsTrigger 
            value="completed"
            className="data-[state=active]:bg-netflix-red data-[state=active]:text-white"
          >
            Concluídas
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredTools.length === 0 ? (
            <Card className="bg-netflix-card border-netflix-border">
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <AlertCircle className="h-16 w-16 text-netflix-text-muted mb-4" />
                <h3 className="text-xl font-bold text-netflix-text mb-2">Nenhuma ferramenta encontrada</h3>
                <p className="text-netflix-text-muted">
                  {activeTab === 'all' 
                    ? 'Você ainda não recebeu nenhuma ferramenta.' 
                    : activeTab === 'pending' 
                      ? 'Você não tem ferramentas pendentes.' 
                      : activeTab === 'in_progress' 
                        ? 'Você não tem ferramentas em andamento.' 
                        : 'Você não tem ferramentas concluídas.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTools.map((userTool) => (
                <Card key={userTool.id} className="bg-netflix-card border-netflix-border overflow-hidden">
                  <div className={`h-2 w-full ${
                    userTool.status === 'pending' 
                      ? 'bg-yellow-500' 
                      : userTool.status === 'in_progress' 
                        ? 'bg-blue-500' 
                        : 'bg-green-500'
                  }`} />
                  
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <Badge 
                        className={`${
                          userTool.status === 'pending' 
                            ? 'bg-yellow-500/20 text-yellow-500' 
                            : userTool.status === 'in_progress' 
                              ? 'bg-blue-500/20 text-blue-500' 
                              : 'bg-green-500/20 text-green-500'
                        }`}
                      >
                        {userTool.status === 'pending' 
                          ? 'Pendente' 
                          : userTool.status === 'in_progress' 
                            ? 'Em Andamento' 
                            : 'Concluída'}
                      </Badge>
                      
                      <Badge variant="outline" className="bg-netflix-card/50 border-netflix-border text-netflix-text-muted">
                        {userTool.tool.category}
                      </Badge>
                    </div>
                    
                    <h3 className="text-lg font-bold text-netflix-text mb-2">{userTool.tool.name}</h3>
                    <p className="text-sm text-netflix-text-muted mb-4">{userTool.tool.description}</p>
                    
                    <div className="flex items-center gap-2 text-xs text-netflix-text-muted mb-4">
                      <Clock className="h-3 w-3" />
                      <span>{userTool.tool.estimated_time} min</span>
                      <span className="mx-1">•</span>
                      <FileText className="h-3 w-3" />
                      <span>{userTool.tool.total_questions} questões</span>
                    </div>
                    
                    {userTool.custom_message && (
                      <div className="bg-netflix-card/50 border border-netflix-border rounded p-3 mb-4">
                        <p className="text-xs text-netflix-text-muted mb-1">Mensagem do coach:</p>
                        <p className="text-sm text-netflix-text">{userTool.custom_message}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-xs text-netflix-text-muted mb-4">
                      <Calendar className="h-3 w-3" />
                      <span>Enviada em {formatDate(userTool.sent_date)}</span>
                      
                      {userTool.scheduled_date && (
                        <>
                          <span className="mx-1">•</span>
                          <Calendar className="h-3 w-3" />
                          <span>Agendada para {formatDate(userTool.scheduled_date)}</span>
                        </>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      {userTool.status === 'pending' && (
                        <Button 
                          onClick={() => startTool(userTool.id)}
                          className="w-full bg-netflix-red text-white hover:bg-netflix-red/90"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Iniciar
                        </Button>
                      )}
                      
                      {userTool.status === 'in_progress' && (
                        <Button 
                          onClick={() => continueTool(userTool.id)}
                          className="w-full bg-blue-500 text-white hover:bg-blue-600"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Continuar
                        </Button>
                      )}
                      
                      {userTool.status === 'completed' && (
                        <Button 
                          onClick={() => viewResults(userTool.id)}
                          className="w-full bg-green-500 text-white hover:bg-green-600"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Ver Resultados
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}; 